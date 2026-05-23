"""
Model A: Quarterly GDP Forecaster
LSTM vs ARIMA on World Bank interpolated quarterly series.
Target: GDP level (gdp_per_capita_usd proxy) — smoother, more learnable than growth rate.
Non-linear signal: Brent crude price as exogenous feature.
"""

import logging
import warnings
import os
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
from statsmodels.tsa.arima.model import ARIMA

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
warnings.filterwarnings("ignore")

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dropout, Dense
from tensorflow.keras.callbacks import EarlyStopping

np.random.seed(42)
tf.random.set_seed(42)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATA_PATH = Path("data/processed/quarterly_panel.csv")
RESULTS_PATH = Path("data/processed/lstm_results.csv")
SEQ_LENGTH = 4  # 1 year lookback — minimum meaningful context for quarterly macro


def load_and_validate():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Run preprocessor.py first: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH).dropna(subset=["gdp_growth_pct"]).reset_index(drop=True)
    logger.info(f"Quarterly panel loaded: {df.shape} | {df['period'].iloc[0]} to {df['period'].iloc[-1]}")

    if len(df) < 40:
        raise ValueError(f"Only {len(df)} observations. Minimum 40 required for LSTM. Check preprocessor.")

    # Reconstruct GDP index level from cumulative growth rates
    # Base = 100 at first observation; compound forward
    df = df.sort_values("period").reset_index(drop=True)
    df["gdp_index"] = 100.0
    for i in range(1, len(df)):
        g = df.loc[i, "gdp_growth_pct"] / 100.0
        df.loc[i, "gdp_index"] = df.loc[i - 1, "gdp_index"] * (1 + g / 4)

    return df


def build_feature_matrix(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray, pd.Series]:
    """
    Feature set:
    - gdp_index (target + autoregressive feature)
    - brent_usd_bbl (oil price — primary non-linear driver)
    - industry_va_pct_gdp (oil sector weight)
    - services_va_pct_gdp (diversification proxy)
    - gross_capital_formation_pct (investment cycle)
    """
    feature_cols = ["gdp_index", "brent_usd_bbl"]
    optional = ["industry_va_pct_gdp", "services_va_pct_gdp", "gross_capital_formation_pct"]
    for col in optional:
        if col in df.columns:
            feature_cols.append(col)

    df_feat = df[feature_cols].interpolate("linear").bfill()
    X = df_feat.values
    y = df["gdp_index"].values
    return X, y, df["period"]


def create_sequences(X: np.ndarray, y: np.ndarray, seq_len: int):
    Xs, ys = [], []
    for i in range(len(X) - seq_len):
        Xs.append(X[i:i + seq_len])
        ys.append(y[i + seq_len])
    return np.array(Xs), np.array(ys)


def run_arima_baseline(y_train: np.ndarray, y_test: np.ndarray) -> tuple[list, float, float]:
    logger.info("Running ARIMA(2,1,0) baseline...")
    history = list(y_train)
    preds = []
    for t in range(len(y_test)):
        fit = ARIMA(history, order=(2, 1, 0)).fit()
        preds.append(fit.forecast()[0])
        history.append(y_test[t])
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    mape = mean_absolute_percentage_error(y_test, preds) * 100
    return preds, rmse, mape


def run_lstm(X_train, y_train, X_test, input_shape) -> np.ndarray:
    logger.info("Training LSTM...")
    model = Sequential([
        LSTM(32, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(16),
        Dropout(0.2),
        Dense(8, activation="relu"),
        Dense(1),
    ])
    model.compile(optimizer=tf.keras.optimizers.Adam(0.005), loss="mse")
    model.fit(
        X_train, y_train,
        epochs=200,
        batch_size=8,
        validation_split=0.1,
        callbacks=[EarlyStopping(monitor="val_loss", patience=25, restore_best_weights=True)],
        verbose=0,
    )
    return model.predict(X_test, verbose=0).flatten()


def run():
    df = load_and_validate()
    X_raw, y_raw, periods = build_feature_matrix(df)

    n = len(X_raw)
    split = int(n * 0.80)  # 80/20 — more training data on small set

    # Fit scalers on train only — no leakage
    scaler_X = StandardScaler().fit(X_raw[:split])
    scaler_y = StandardScaler().fit(y_raw[:split].reshape(-1, 1))

    X_sc = scaler_X.transform(X_raw)
    y_sc = scaler_y.transform(y_raw.reshape(-1, 1)).flatten()

    X_seq, y_seq = create_sequences(X_sc, y_sc, SEQ_LENGTH)
    seq_split = split - SEQ_LENGTH

    X_tr, X_te = X_seq[:seq_split], X_seq[seq_split:]
    y_tr_sc, y_te_sc = y_seq[:seq_split], y_seq[seq_split:]

    y_raw_seq = y_raw[SEQ_LENGTH:]
    y_tr_raw, y_te_raw = y_raw_seq[:seq_split], y_raw_seq[seq_split:]

    logger.info(f"Train: {len(X_tr)} | Test: {len(X_te)} sequences")

    arima_preds, arima_rmse, arima_mape = run_arima_baseline(y_tr_raw, y_te_raw)

    lstm_sc = run_lstm(X_tr, y_tr_sc, X_te, (SEQ_LENGTH, X_tr.shape[2]))
    lstm_preds = scaler_y.inverse_transform(lstm_sc.reshape(-1, 1)).flatten()
    lstm_rmse = np.sqrt(mean_squared_error(y_te_raw, lstm_preds))
    lstm_mape = mean_absolute_percentage_error(y_te_raw, lstm_preds) * 100

    # Save results for frontend
    test_periods = periods.iloc[SEQ_LENGTH + seq_split:].reset_index(drop=True)
    results_df = pd.DataFrame({
        "period": test_periods,
        "actual": y_te_raw,
        "lstm_pred": lstm_preds,
        "arima_pred": arima_preds,
    })
    results_df.to_csv(RESULTS_PATH, index=False)

    logger.info("\n" + "=" * 60)
    logger.info("FORECAST SHOWDOWN — Out-of-Sample Test Set")
    logger.info(f"Target: GDP Index | Horizon: {len(y_te_raw)} quarters")
    logger.info("=" * 60)
    logger.info(f"ARIMA(2,1,0)  -> MAPE: {arima_mape:.2f}% | RMSE: {arima_rmse:.4f}")
    logger.info(f"LSTM          -> MAPE: {lstm_mape:.2f}%  | RMSE: {lstm_rmse:.4f}")
    logger.info("-" * 60)

    if lstm_mape < arima_mape:
        delta = ((arima_mape - lstm_mape) / arima_mape) * 100
        logger.info(f"LSTM wins by {delta:.1f}% on MAPE")
    else:
        delta = ((lstm_mape - arima_mape) / lstm_mape) * 100
        logger.info(f"ARIMA holds. LSTM underperforms by {delta:.1f}%")
        logger.info("Expected on smooth interpolated data — will reverse once CBAR monthly series feeds in.")
    logger.info("=" * 60)
    logger.info(f"Results saved -> {RESULTS_PATH}")


if __name__ == "__main__":
    run()