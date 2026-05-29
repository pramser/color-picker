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
    <main className="min-h-screen" style={roboto.style}>
      <input
        type="text"
        className="search-input"
        placeholder="Search colors"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <section className="swatch-grid">
        <InfoSwash onClick={() => setVisibility(true)} />
        {colors
          .filter((color) => filterByProps(color))
          .map((color) => (
            <ColorSwash
              key={color.id}
              color={color}
              setSelColor={setSelColor}
              getRelatedColors={() => getRelatedColors(color)}
            />
          ))}
      </section>
      <div
        onClick={() => setSelColor(null)}
        className={`app-overlay color-overlay ${selColor ? "app-overlay-open" : ""}`}
        style={{ backgroundColor: selColor?.hex }}
      >
        <div className="color-overlay-content" style={{ color: selColorText }}>
          <p>{selColor?.name}</p>
          <span>{selColor?.hex}</span>
        </div>
      </div>
      <div
        onClick={() => setVisibility(false)}
        className={`app-overlay howto-overlay ${isHowToVisible ? "app-overlay-open" : ""}`}
      >
        <div className="howto-overlay-content">
          <div className="howto-panel">
            <span className="howto-title">How to use this tool</span>
            <span className="howto-section-title">Generic Search</span>
            <p>
              Type your search term into the search bar. This will filter all of the color names by whatever you type in.
            </p>
            <span className="howto-section-title">Advanced Search</span>
            <p>
              Using the following search terms, you can filter the list by a number of different attributes.
            </p>
            <span className="howto-list-title">Search terms</span>
            <ol>
              <li>
                <span>name:</span> Filters by name of color (omit this term to
                use it by default)
              </li>
              <li>
                <span>colorFamily:</span> Filters by simple color family. Think
                &quot;Red&quot;, &quot;Blue&quot;, etc. Sherwin stores these capilatized.
              </li>
              <li>
                <span>hex:</span> Filters by hex value of color. You can use #
                or not; doesn&apos;t matter.
              </li>
              <li>
                <span>red:</span> Filters by red value of color
              </li>
              <li>
                <span>green:</span> Filters by green value of color
              </li>
              <li>
                <span>blue:</span> Filters by blue value of color
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
