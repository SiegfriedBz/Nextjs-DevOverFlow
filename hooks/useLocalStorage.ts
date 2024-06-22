import { useEffect, useState } from "react"

const useLocalStorage = <T>({
  key,
  initialValue,
}: {
  key: string
  initialValue: T
}) => {
  const [isClient, setIsClient] = useState(false)
  const [value, setValue] = useState(() => {
    if (!isClient) return initialValue

    const jsonItem = window.localStorage.getItem(key)
    return jsonItem ? JSON.parse(jsonItem) : initialValue
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (!value) {
      window.localStorage.removeItem(key)
      return
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value, isClient])

  return [value, setValue]
}

export default useLocalStorage
