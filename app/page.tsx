"use client"

import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"

// icons
import {
  ArrowsPointingOutIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid"

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
  // general info
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [colors, setColors] = useState([])
  const [searchText, setSearchText] = useState("")
  const filterByName = (name: string) => name.includes(searchText)

  // selected color
  const [selColor, setSelColor] = useState<any | null>(null)

  // compare colors
  const [compareColors, setComparedColors] = useState([])

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
    <main className="flex flex-row flex-wrap items-start content-start min-h-screen">
      <input
        type="text"
        className="p-4 h-12 w-screen"
        placeholder="Search colors"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {colors
        .filter((color) => filterByName(color.name))
        .map(({ id, name, hex }) => {
          const textColor = isColorLight(hex) ? "#000" : "#fff"

          return (
            <div
              key={id}
              className="border-r border-t flex flex-col group justify-center relative p-2 h-48 w-full md:w-1/4 lg:w-1/6"
              style={{ backgroundColor: hex }}
            >
              <p
                className="absolute top-2 left-2 text-xs"
                style={{ color: textColor }}
              >
                {name}
              </p>
              <div className="m-auto text-xs hidden group-hover:block">
                <button onClick={() => setSelColor({ id, name, hex })}>
                  <ArrowsPointingOutIcon
                    className="pr-2 h-12 w-12"
                    style={{ color: textColor }}
                  />
                </button>
                <button onClick={() => console.log("squares")}>
                  <SquaresPlusIcon
                    className="pl-2 h-12 w-12"
                    style={{ color: textColor }}
                  />
                </button>
              </div>
            </div>
          )
        })}
      <div
        onClick={() => setSelColor(null)}
        className={`fixed top-0 h-full w-full z-10 ${
          selColor ? "visible" : "hidden"
        }`}
        style={{ backgroundColor: selColor?.hex }}
      ></div>
    </main>
  )
}
