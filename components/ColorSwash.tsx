import { isColorLight } from "@/types/_utils"
import { ArrowsPointingOutIcon, Square3Stack3DIcon } from "@heroicons/react/24/solid"

interface Props {
  color: Color
  setSelColor?: (color: Color) => void
  getRelatedColors?: (color: Color) => void
}

export default function ColorSwash({ color, setSelColor, getRelatedColors }: Props) {
  const { id, name, hex } = color
  const textColor = isColorLight(hex) ? "#000" : "#fff"

  return (
    <div key={id} className="color-swash group tracking-wide" style={{ backgroundColor: hex }}>
      <p className="absolute top-2 left-2 text-xs" style={{ color: textColor }}>
        {name}
      </p>
      <div className="m-auto text-xs hidden group-hover:block">
        <button onClick={() => setSelColor && setSelColor(color)}>
          <ArrowsPointingOutIcon className="pr-2 h-12 w-12" style={{ color: textColor }} />
        </button>
        <button onClick={() => getRelatedColors && getRelatedColors(color)}>
          <Square3Stack3DIcon className="pr-2 h-12 w-12" style={{ color: textColor }} />
        </button>
      </div>
    </div>
  )
}
