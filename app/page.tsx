"use client"

import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function isColorLight(color: string) {
  let rgb = hexToRgb(color)
  if (!rgb) {
    rgb = { r: 0, g: 0, b: 0 }
  }

  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [colors, setColors] = useState([])
  const [selColors, setSelColors] = useState([])

  useEffect(() => {
    fetch("/api/colors")
      .then((res) => res.json())
      .then((json) => {
        setColors(json)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.log(err)
        setIsError(true)
      })
  }, [])

  if (isError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Error occurred...
      </main>
    )
  }

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <PulseLoader color="#36d7b7" />
      </main>
    )
  }

  return (
    <main className="flex flex-row flex-wrap items-center min-h-screen">
      {colors.map(({ name, hex }) => (
        <div
          key={name}
          className="border-r border-t flex h-48 items-start justify-end p-2 w-1/6"
          style={{ backgroundColor: hex }}
        >
          <p
            className="text-xs"
            style={{ color: isColorLight(hex) ? "#000" : "#fff" }}
          >
            {name}
          </p>
        </div>
      ))}
    </main>
  )
}
