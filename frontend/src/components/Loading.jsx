export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-text-secondary">
      <div className="h-5 w-5 rounded-full border-2 border-cyan-ai border-t-transparent animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
