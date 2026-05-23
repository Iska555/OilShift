"""
FastAPI backend — Azerbaijan Economic Divergence Intelligence Platform.
Serves pre-computed ML results to the Next.js frontend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import forecast, divergence, anomalies, sectors

app = FastAPI(
    title="Azerbaijan Economic Divergence API",
    description="ML-powered oil/non-oil GDP divergence intelligence",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict to vercel domain in production
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(forecast.router,   prefix="/api/forecast",   tags=["forecast"])
app.include_router(divergence.router, prefix="/api/divergence", tags=["divergence"])
app.include_router(anomalies.router,  prefix="/api/anomalies",  tags=["anomalies"])
app.include_router(sectors.router,    prefix="/api/sectors",    tags=["sectors"])


@app.get("/api/health")
def health():
    return {"status": "ok", "platform": "Azerbaijan Economic Divergence Intelligence"}