export default function SkeletonCard() {
  return (
    <div 
      className="w-full max-w-sm animate-pulse rounded-xl border p-6 shadow-md professional-card"
      style={{
        borderColor: 'var(--neutral-300)',
        backgroundColor: 'var(--background-secondary)'
      }}
    >
      <div 
        className="h-4 w-32 rounded mb-4" 
        style={{ backgroundColor: 'var(--neutral-300)' }}
      />
      <div 
        className="h-4 w-20 rounded mb-2" 
        style={{ backgroundColor: 'var(--neutral-300)' }}
      />
      <div 
        className="h-3 w-16 rounded mb-6" 
        style={{ backgroundColor: 'var(--neutral-200)' }}
      />
      <div 
        className="h-8 w-full rounded" 
        style={{ backgroundColor: 'var(--neutral-300)' }}
      />
    </div>
  )
}
