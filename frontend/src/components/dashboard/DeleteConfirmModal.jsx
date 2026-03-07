export default function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.45)',
          zIndex: 1100,
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 1101,
          width: 'min(92vw,380px)',
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 18px 50px rgba(2,6,23,0.24)',
          padding: 20,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Xóa chuyến đi?</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 16 }}>
          Thao tác này sẽ xóa lịch trình khỏi danh sách của bạn.
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#475569',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{
              border: 'none',
              background: '#ef4444',
              color: 'white',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </>
  )
}
