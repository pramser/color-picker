"use client"

import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"

// components
import ColorSwash from "@/components/ColorSwash"

// utils
import { isColorLight } from "@/types/_utils"

export default function Home() {
  // general info
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [colors, setColors] = useState<Color[]>([])
  const [searchText, setSearchText] = useState("")
  const [selColor, setSelColor] = useState<Color | null>(null)

  const filterByProps = (color: Color) => {
    const { id, name, hex } = color
    if (searchText.includes(":")) {
      const [key, value] = searchText.split(":")

      switch (key) {
        case "id":
          return id.includes(value)
        case "ids":
          return value.split(",").includes(id)
        case "name":
          return name.toLowerCase().includes(value.toLowerCase())
        case "hex":
          return hex.includes(value)
      }
    }

    return name.toLowerCase().includes(searchText.toLowerCase())
  }

  const getRelatedColors = (color: Color) => {
    setSearchText(`ids:${color.id},${color.similarColors.join(",")}`)
  }

  useEffect(() => {
    fetch("/api/colors")
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        setColors(json)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.log(err)
        setIsError(true)
      })
  }, [])

  if (isError) {
    return <main className="flex min-h-screen flex-col items-center justify-between p-24">Error occurred...</main>
  }

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <PulseLoader color="#36d7b7" />
      </main>
    )
  }

  let selColorText = "#fff"
  if (selColor) {
    selColorText = isColorLight(selColor.hex) ? "#000" : "#fff"
  }

  return (
    <main className="flex flex-row flex-wrap items-start content-start min-h-screen">
      <input
        type="text"
        className="p-4 h-12 w-screen"
        placeholder="Search colors"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {colors
        .filter((color) => filterByProps(color))
        .map((color) => (
          <ColorSwash key={color.id} color={color} setSelColor={setSelColor} getRelatedColors={() => getRelatedColors(color)} />
        ))}
      <div
        onClick={() => setSelColor(null)}
        className={`fixed top-0 h-full w-full z-10 ${selColor ? "visible" : "hidden"}`}
        style={{ backgroundColor: selColor?.hex }}
      >
        <div className="flex flex-col items-center justify-center h-full w-full" style={{ color: selColorText }}>
          <p className="text-4xl">{selColor?.name}</p>
          <p className="text-2xl">{selColor?.hex}</p>
        </div>
      </div>
    </main>
  )
}
