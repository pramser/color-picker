import { isColorLight } from "@/types/_utils"
import { useEffect, useState } from "react"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid"

function getRandomColor() {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16)
  })
}

interface Props {
  onClick: () => void
}

export default function InfoSwash({ onClick }: Props) {
  const [color, setColor] = useState("#000000")

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColor(getRandomColor())
    }, 1500)

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [color])

  let textColor = isColorLight(color) ? "black" : "white"

  return (
    <div
      key="info"
      className="color-swash info-swash"
      style={{ backgroundColor: color, color: textColor }}
      onClick={onClick}
    >
      <QuestionMarkCircleIcon className="info-swash-icon" />
      <span>How to use this tool</span>
      <span className="font-bold">Click here!</span>
    </div>
  )
}
