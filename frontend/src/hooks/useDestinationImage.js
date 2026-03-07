import { useEffect, useState } from 'react'

export default function useDestinationImage(destination) {
  const [imgUrl, setImgUrl] = useState(null)

  useEffect(() => {
    if (!destination) return
    const query = encodeURIComponent(destination.split(',')[0].trim())
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
      .then((r) => r.json())
      .then((data) => {
        const url = data?.thumbnail?.source || data?.originalimage?.source
        if (url) setImgUrl(url.replace(/\/\d+px-/, '/400px-'))
      })
      .catch(() => {})
  }, [destination])

  return imgUrl
}
