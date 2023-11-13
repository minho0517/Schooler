import { useEffect } from 'react'

export default function useObserver({
    target, 
    onIntersect,
    root = null,
    rootMargin = "100px", 
    threshold = 1.0,
}) {
    useEffect(() => {
        let observer

        if (target && target.current) {
            observer = new IntersectionObserver(onIntersect, { root, rootMargin, threshold })
            observer.observe(target.current);
        }

        return () => observer && observer.disconnect()
    }, [target, rootMargin, threshold])
}