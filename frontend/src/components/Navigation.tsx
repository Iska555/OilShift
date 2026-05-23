export default function Navigation() {
  return (
    <nav className="border-b border-[#E5E5E5] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1A1A] tracking-tight">
          OilShift 
        </span>
        <div className="flex items-center gap-8 text-sm text-[#6B6B6B]">
          <a href="/divergence" className="hover:text-[#1A1A1A]">Divergence</a>
          <a href="/forecast" className="hover:text-[#1A1A1A]">Forecast</a>
          <a href="/sectors" className="hover:text-[#1A1A1A]">Sectors</a>
          <a href="/anomalies" className="hover:text-[#1A1A1A]">Anomalies</a>
        </div>
      </div>
    </nav>
  )
}
