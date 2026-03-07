export default function TripListSkeleton({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: 'white',
            borderRadius: 16,
            padding: '12px 14px',
            border: '1px solid #eef0f3',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: 'linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s linear infinite',
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 13,
                width: '40%',
                borderRadius: 999,
                background: 'linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s linear infinite',
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 10,
                width: '65%',
                borderRadius: 999,
                background: 'linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s linear infinite',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
