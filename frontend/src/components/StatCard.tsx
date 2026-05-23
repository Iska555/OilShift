interface StatCardProps {
  value: string
  label: string
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="px-8 py-6">
      <p className="text-3xl font-semibold text-[#1A1A1A] mb-1">{value}</p>
      <p className="text-xs text-[#6B6B6B] uppercase tracking-[0.1em]">{label}</p>
    </div>
  )
}
