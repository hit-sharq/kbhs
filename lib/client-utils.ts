"use client"

import { useEffect, useState } from "react"

export function useClientOnly<T>(serverValue: T, clientFn: () => T): T {
  const [value, setValue] = useState<T>(serverValue)

  useEffect(() => {
    setValue(clientFn())
  }, [clientFn])

  return value
}

export function useCurrentYear(): string {
  return useClientOnly("", () => new Date().getFullYear().toString())
}

