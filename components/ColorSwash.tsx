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
    <div key={id} className="color-swash tracking-wide" style={{ backgroundColor: hex, color: textColor }}>
      <p className="swash-name">{name}</p>
      <div className="swash-actions">
        <button
          className="swash-action"
          aria-label={`View ${name}`}
          onClick={() => setSelColor && setSelColor(color)}
        >
          <ArrowsPointingOutIcon />
        </button>
        <button
          className="swash-action"
          aria-label={`Show colors related to ${name}`}
          onClick={() => getRelatedColors && getRelatedColors(color)}
        >
          <Square3Stack3DIcon />
        </button>
      </div>
    </div>
  )
}
