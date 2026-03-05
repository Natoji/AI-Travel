// src/pages/Home.jsx
import { useAuth } from '../context/AuthContext'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import HowItWorks from '../components/home/HowItWorks'
import ComparisonSection from '../components/home/ComparisonSection'
import TechStackSection from '../components/home/TechStackSection'
import DestinationsSection from '../components/home/DestinationsSection'
import FAQSection from '../components/home/FAQSection'
import CTASection from '../components/home/CTASection'

export default function Home() {
  const { user } = useAuth()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: '#0f172a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');
        .hero-bg { min-height: 95vh; position: relative; overflow: hidden; display: flex; align-items: center; }
        .hero-bg-pattern { position: absolute; inset: 0; background-image: radial-gradient(circle at 1px 1px, rgba(99,102,241,0.08) 1px, transparent 0); background-size: 32px 32px; z-index: 1; pointer-events: none; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: white; color: #4f46e5; padding: 8px 16px; border-radius: 999px; font-size: 14px; font-weight: 600; border: 2px solid #e0e7ff; box-shadow: 0 4px 12px rgba(99,102,241,0.05); margin-bottom: 24px; }
        .hero-title { font-family: 'Fraunces', serif; font-size: clamp(36px, 5.5vw, 72px); font-weight: 300; line-height: 1.05; margin-bottom: 24px; letter-spacing: -1.5px; }
        .hero-title em { font-style: italic; background: linear-gradient(90deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 600; }
        .btn-primary { background: #0f172a; color: white; padding: 16px 36px; border-radius: 14px; font-size: 16px; font-weight: 600; text-decoration: none; transition: all 0.3s; box-shadow: 0 10px 25px rgba(15,23,42,0.15); display: inline-block; }
        .btn-primary:hover { transform: translateY(-3px); background: #1e293b; box-shadow: 0 15px 35px rgba(15,23,42,0.25); }
        .preview-card { background: white; border-radius: 28px; box-shadow: 0 40px 100px rgba(0,0,0,0.1); padding: 12px; border: 1px solid rgba(0,0,0,0.03); transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .preview-card:hover { transform: translateY(-10px) rotate(1deg); }
        .floating-label { position: absolute; background: white; padding: 12px 20px; border-radius: 18px; border: 2px solid #f1f5f9; box-shadow: 0 15px 35px rgba(0,0,0,0.1); font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 10px; z-index: 10; animation: float 5s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .hero-stat { background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); border: 2px solid #e2e8f0; padding: 20px; border-radius: 20px; transition: all 0.3s; }
        .hero-stat:hover { border-color: #6366f1; box-shadow: 0 10px 20px rgba(99,102,241,0.05); }
        .feature-card { background: white; border-radius: 24px; padding: 32px; border: 2px solid #e2e8f0; transition: all 0.4s; }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.04); border-color: #6366f1; }
        .dest-card { display: flex; align-items: center; gap: 16px; background: white; padding: 16px; border-radius: 20px; border: 2px solid #e2e8f0; transition: all 0.3s; cursor: pointer; }
        .dest-card:hover { transform: scale(1.03); border-color: #6366f1; }
        .section-divider { border: 0; height: 1px; background: #e2e8f0; margin: 0 auto; max-width: 1280px; }
        .step-card { border-radius: 24px; padding: 36px 28px; transition: all 0.3s; }
        .step-card:hover { transform: translateY(-6px); }
        .tech-card { border-radius: 20px; padding: 24px 20px; text-align: center; transition: all 0.3s; cursor: default; }
        .tech-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
        .compare-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; }

        @media (max-width: 768px) {
          .hero-bg { min-height: auto !important; padding: 60px 0 !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .preview-card-container { display: none !important; }
          .hero-stats { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
          .hero-stat { padding: 12px 8px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-arrow { display: none !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .tech-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .dest-grid { grid-template-columns: 1fr !important; }
          .cta-box { padding: 40px 20px !important; border-radius: 24px !important; }
          .cta-box h2 { font-size: 28px !important; }
          .btn-group { flex-direction: column !important; }
          .btn-primary { text-align: center !important; }
          section { padding: 60px 16px !important; }
        }
      `}</style>

      <HeroSection user={user} />
      <hr className="section-divider" />
      <FeaturesSection />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <ComparisonSection />
      <hr className="section-divider" />
      <TechStackSection />
      <hr className="section-divider" />
      <DestinationsSection />
      <hr className="section-divider" />
      <FAQSection />
      <hr className="section-divider" />
      <CTASection user={user} />

      <footer style={{ padding: '40px 32px', textAlign: 'center', borderTop: '2px solid #e2e8f0', color: '#94a3b8', fontSize: 14 }}>
        © 2026 AI Travel. Đồ án tốt nghiệp ngành CNTT.
      </footer>
    </div>
  )
}