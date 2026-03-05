// src/components/home/TechStackSection.jsx

const techStack = [
  { name: 'Gemini AI', desc: 'Trí tuệ nhân tạo', icon: '🤖', color: '#fef9c3', border: '#fde68a', tag: 'Google' },
  { name: 'React', desc: 'Giao diện người dùng', icon: '⚛️', color: '#e0f2fe', border: '#bae6fd', tag: 'Meta' },
  { name: 'FastAPI', desc: 'Backend API', icon: '⚡', color: '#dcfce7', border: '#bbf7d0', tag: 'Python' },
  { name: 'SQLite', desc: 'Cơ sở dữ liệu', icon: '🗄️', color: '#f0f4ff', border: '#c7d2fe', tag: 'Database' },
  { name: 'Tailwind CSS', desc: 'Giao diện hiện đại', icon: '🎨', color: '#f0fdfa', border: '#99f6e4', tag: 'CSS' },
  { name: 'JWT Auth', desc: 'Bảo mật xác thực', icon: '🔐', color: '#fdf2f8', border: '#f0abfc', tag: 'Security' },
]

export default function TechStackSection() {
  return (
    <section style={{ padding: '80px 32px', background: 'white' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 13, fontWeight: 700, color: '#6366f1' }}>Công nghệ sử dụng</span>
          <h2 style={{ fontFamily: 'Fraunces', fontSize: 40, fontWeight: 300, marginTop: 12, color: '#0f172a' }}>
            Được xây dựng bằng công nghệ hiện đại
          </h2>
        </div>
        <div className="tech-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
          {techStack.map((tech, i) => (
            <div key={i} className="tech-card" style={{ background: tech.color, border: '2px solid ' + tech.border }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{tech.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{tech.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{tech.desc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6366f1', background: 'white', padding: '3px 10px', borderRadius: 999, display: 'inline-block' }}>
                {tech.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}