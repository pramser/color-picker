"use client"

// react
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"

// next
import { Roboto } from "next/font/google"

// components
import ColorSwash from "@/components/ColorSwash"

// utils
import { isColorLight } from "@/types/_utils"
import InfoSwash from "@/components/InfoSwash"

// fonts
const roboto = Roboto({ subsets: ["latin"], weight: ["100", "400"] })

export default function Home() {
  // general info
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [colors, setColors] = useState<Color[]>([])
  const [searchText, setSearchText] = useState("")
  const [selColor, setSelColor] = useState<Color | null>(null)
  const [isHowToVisible, setVisibility] = useState(false)

  const filterByProps = (color: Color) => {
    const { id, name, hex, red, green, blue, colorFamilyNames } = color
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
        case "red":
          return red.toString() === value
        case "green":
          return green.toString() === value
        case "blue":
          return blue.toString() === value
        case "colorFamily":
          return colorFamilyNames.includes(value)
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
      <InfoSwash onClick={() => setVisibility(true)} />
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
      <div
        onClick={() => setVisibility(false)}
        className={`fixed top-0 h-full w-full z-20 ${isHowToVisible ? "visible" : "hidden"}`}
        style={{ backgroundColor: "#000", ...roboto.style }}
      >
        <div className="flex flex-col items-center justify-center h-full w-full" style={{ color: "#fff" }}>
          <div className="flex flex-col p-8 md:p-0 w-full md:w-1/2">
            <span className="text-3xl">How to use this tool</span>
            <span className="font-bold mt-4 text-2xl">Generic Search</span>
            <p className="text-wrap">
              Type your search term into the search bar. This will filter all of the color names by whatever you type in.
            </p>
            <span className="font-bold mt-4 text-2xl">Advanced Search</span>
            <p className="text-wrap">Hello, world!</p>
            <span className="font-semibold mt-4 text-lg">Search terms</span>
            <ol className="list-disc list-inside">
              <li>
                <span className="bg-white font-mono p-0.5 text-black">name:</span> Filters by name of color (omit this term to
                use it by default)
              </li>
              <li>
                <span className="bg-white font-mono p-0.5 text-black">colorFamily:</span> Filters by simple color family. Think
                "Red", "Blue", etc. Sherwin stores these capilatized.
              </li>
              <li>
                <span className="bg-white font-mono p-0.5 text-black">hex:</span> Filters by hex value of color. You can use #
                or not; doesn't matter.
              </li>
              <li>
                <span className="bg-white font-mono p-0.5 text-black">red:</span> Filters by red value of color
              </li>
              <li>
                <span className="bg-white font-mono p-0.5 text-black">green:</span> Filters by green value of color
              </li>
              <li>
                <span className="bg-white font-mono p-0.5 text-black">blue:</span> Filters by blue value of color
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
