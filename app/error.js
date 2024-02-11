'use client' 
 
import { useEffect } from 'react'
 
export default function Error({ error, reset }) {
  useEffect(() => {
    alert(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}