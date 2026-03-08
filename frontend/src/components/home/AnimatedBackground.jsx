const cloudAssetModules = import.meta.glob('../../assets/hero-onboarding/*.{png,webp,svg}', { eager: true, import: 'default' })
const cloudAssetEntries = Object.entries(cloudAssetModules).map(([path, src]) => ({ path: path.toLowerCase(), src }))
const cloudImageSrc = cloudAssetEntries.find((asset) => asset.path.includes('cloud'))?.src

export default function AnimatedBackground() {
  return (
    <div
      className="sky-bg"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background:
          "radial-gradient(120% 75% at 50% -10%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 64%), linear-gradient(180deg, var(--home-sky-top, #8ed1ff) 0%, var(--home-sky-mid, #b8e4ff) 34%, var(--home-sky-bottom, #e7f5ff) 100%)",
      }}
    >
      {cloudImageSrc ? (
        <img
          className="cloud-image-top"
          src={cloudImageSrc}
          alt=""
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          style={{
            position: "absolute",
            top: "11%",
            left: "50%",
            width: "min(1180px, 118%)",
            transform: "translateX(-50%)",
            opacity: 0.92,
            objectFit: "contain",
            filter: "drop-shadow(0 18px 28px rgba(24,84,120,0.22))",
          }}
        />
      ) : (
        <div
          className="cloud-fallback"
          style={{
            position: "absolute",
            left: "-8%",
            right: "-8%",
            top: "22%",
            height: "36%",
            background:
              "radial-gradient(14% 22% at 10% 42%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.12) 100%), radial-gradient(18% 24% at 22% 56%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.1) 100%), radial-gradient(16% 20% at 36% 44%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.1) 100%), radial-gradient(19% 24% at 52% 58%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.1) 100%), radial-gradient(18% 22% at 68% 48%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.1) 100%), radial-gradient(16% 20% at 82% 56%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.1) 100%), radial-gradient(13% 18% at 94% 44%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.06) 100%)",
            filter: "blur(3px)",
            opacity: 0.98,
          }}
        />
      )}
    </div>
  )
}
