import { useEffect, useState, useRef } from 'react'

export default function useLoadOnViewport(rootMargin = '0px') {
  const ref = useRef()
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(!isLoaded && entry.isIntersecting) {
          setLoaded(entry.isIntersecting)
        }
      },
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (observer && ref && ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isLoaded]
}
