"use client"

import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"

// components
import ColorSwash from "@/components/ColorSwash"

export default function Home() {
  // general info
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [colors, setColors] = useState<any[]>([])
  const [searchText, setSearchText] = useState("")
  const filterByName = (name: string) => name.includes(searchText)

  // selected color
  const [selColor, setSelColor] = useState<any | null>(null)

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
        .map(({ id, name, hex }) => (
          <ColorSwash key={id} id={id} name={name} hex={hex} setSelColor={setSelColor} />
        ))}
      <div
        onClick={() => setSelColor(null)}
        className={`fixed top-0 h-full w-full z-10 ${selColor ? "visible" : "hidden"}`}
        style={{ backgroundColor: selColor?.hex }}
      ></div>
    </main>
  )
}
