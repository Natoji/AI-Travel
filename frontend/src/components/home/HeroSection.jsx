import { Link } from 'react-router-dom'
import AnimatedBackground from './AnimatedBackground'
import heroPhotoLeft from '../../assets/hero-onboarding/photo-left.jpg'
import heroPhotoRight from '../../assets/hero-onboarding/photo-right.jpg'

const heroAssetModules = import.meta.glob('../../assets/hero-onboarding/*.{png,webp,svg}', { eager: true, import: 'default' })
const heroAssetEntries = Object.entries(heroAssetModules).map(([path, src]) => ({ path: path.toLowerCase(), src }))

function pickAsset(keywords) {
  const match = heroAssetEntries.find((asset) => keywords.every((k) => asset.path.includes(k)))
  return match?.src
}

const heroAssets = {
  logo: pickAsset(['logo']),
  cloud: pickAsset(['cloud']),
  pin: pickAsset(['pin']),
  plane: pickAsset(['plane']),
  magnifier: pickAsset(['magnifier']) || pickAsset(['ring']),
  paperclip: pickAsset(['paperclip']) || pickAsset(['clip']),
  dashPath: pickAsset(['dash']) || pickAsset(['path']),
}

export default function HeroSection({ user }) {
  const firstImage = heroPhotoLeft
  const secondImage = heroPhotoRight

  return (
    <section className="hero-bg hero-onboarding">
      <div className="hero-bg-pattern" />
      <AnimatedBackground />
      <div className="hero-shell">
        <div className="hero-grid hero-onboarding-grid">
          <div>
            <div className="badge"><span>☁️</span> Trải nghiệm du lịch kỷ nguyên AI</div>
            <h1 className="hero-title">
              {'Khám phá hành\u00A0trình'}<br />
              với <em>AI Travel</em><br />
              theo phong cách của bạn
            </h1>
            <p className="hero-lead">
              Nhập điểm đến và ngân sách, nhận lịch trình gọn đẹp chỉ trong vài giây.
              Mọi thứ được tối ưu để bạn chỉ cần xách balo lên và đi.
            </p>

            <div className="hero-chips">
              {['Điểm đến theo sở thích', 'Không cần thẻ tín dụng', 'Xem trước lộ trình ngay'].map((item, idx) => (
                <span key={idx} className="hero-chip">
                  {item}
                </span>
              ))}
            </div>

            <div className="btn-group hero-actions">
              <Link to={user ? '/dashboard' : '/register'} className="btn-primary">
                Bắt đầu ngay →
              </Link>
              <a href="#how-it-works" className="hero-link hero-cta-link">
                Xem cách hoạt động
              </a>
            </div>

            <div className="hero-stats">
              {[
                { value: '30s', label: 'Có lịch trình đầu tiên' },
                { value: '100%', label: 'Miễn phí khi bắt đầu' },
                { value: 'AI', label: 'Gợi ý theo nhu cầu' },
              ].map((s, i) => (
                <div key={i} className="hero-stat">
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-scene">
            {heroAssets.logo ? <img className="scene-logo" src={heroAssets.logo} alt="" aria-hidden="true" loading="eager" fetchPriority="high" decoding="async" /> : <div className="scene-logo-text">AI Travel</div>}
            {heroAssets.dashPath && <img className="scene-dash" src={heroAssets.dashPath} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
            {heroAssets.cloud && <img className="scene-cloud-overlay" src={heroAssets.cloud} alt="" aria-hidden="true" loading="lazy" decoding="async" />}

            <div className="scene-stamp stamp-a">
              {firstImage ? <img src={firstImage} alt="" aria-hidden="true" loading="eager" fetchPriority="high" decoding="async" /> : <span aria-hidden="true">🏕️</span>}
            </div>
            <div className="scene-stamp stamp-b">
              {secondImage ? <img src={secondImage} alt="" aria-hidden="true" loading="eager" fetchPriority="high" decoding="async" /> : <span aria-hidden="true">🌊</span>}
            </div>

            {heroAssets.pin ? <img className="scene-pin-img" src={heroAssets.pin} alt="" aria-hidden="true" loading="lazy" decoding="async" /> : <div className="scene-pin" aria-hidden="true">📍</div>}
            {heroAssets.plane ? <img className="scene-plane-img" src={heroAssets.plane} alt="" aria-hidden="true" loading="lazy" decoding="async" /> : <div className="scene-plane" aria-hidden="true">✈️</div>}
            {heroAssets.magnifier ? <img className="scene-ring-img" src={heroAssets.magnifier} alt="" aria-hidden="true" loading="lazy" decoding="async" /> : <div className="scene-ring" aria-hidden="true">🔎</div>}
            {heroAssets.paperclip && <img className="scene-paperclip-img" src={heroAssets.paperclip} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
          </div>
        </div>
      </div>
    </section>
  )
}
