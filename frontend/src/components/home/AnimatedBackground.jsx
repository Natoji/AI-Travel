const cloudAssetModules = import.meta.glob('../../assets/hero-onboarding/*.{png,webp,svg}', { eager: true, import: 'default' })
const cloudAssetEntries = Object.entries(cloudAssetModules).map(([path, src]) => ({ path: path.toLowerCase(), src }))
const cloudImageSrc = cloudAssetEntries.find((asset) => asset.path.includes('cloud'))?.src

export default function AnimatedBackground() {
  return (
    <div className="sky-bg" aria-hidden="true">
      {cloudImageSrc ? (
        <img className="cloud-image-top" src={cloudImageSrc} alt="" loading="lazy" fetchPriority="low" decoding="async" />
      ) : (
        <div className="cloud-fallback" />
      )}
    </div>
  )
}
