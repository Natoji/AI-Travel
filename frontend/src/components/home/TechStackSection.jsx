const techStack = [
  { name: 'Gemini AI', desc: 'Trí tuệ nhân tạo', icon: '🤖', tag: 'Google' },
  { name: 'React', desc: 'Giao diện người dùng', icon: '⚛️', tag: 'Meta' },
  { name: 'FastAPI', desc: 'Backend API', icon: '⚡', tag: 'Python' },
  { name: 'SQLite', desc: 'Cơ sở dữ liệu', icon: '🗄️', tag: 'Database' },
  { name: 'Tailwind CSS', desc: 'Giao diện hiện đại', icon: '🎨', tag: 'CSS' },
  { name: 'JWT Auth', desc: 'Bảo mật xác thực', icon: '🔐', tag: 'Security' },
]

export default function TechStackSection() {
  return (
    <section className="home-section compact-y">
      <div className="home-inner">
        <div className="section-head tight">
          <span className="section-eyebrow">Công nghệ sử dụng</span>
          <h2 className="section-title sm">Được xây dựng bằng công nghệ hiện đại</h2>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <div key={i} className="tech-card tech-card-toned">
              <div className="tech-icon">{tech.icon}</div>
              <div className="tech-name">{tech.name}</div>
              <div className="tech-desc">{tech.desc}</div>
              <div className="tech-tag">{tech.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
