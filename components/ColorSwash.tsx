import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid"

interface Props {
  id: number
  name: string
  hex: string
  setSelColor: (color: { id: number; name: string; hex: string }) => void
}

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

export default function ColorSwash({ id, name, hex, setSelColor }: Props) {
  const textColor = isColorLight(hex) ? "#000" : "#fff"

  return (
    <div
      key={id}
      className="border-r border-t flex flex-col group justify-center relative p-2 h-48 w-full md:w-1/4 lg:w-1/6"
      style={{ backgroundColor: hex }}
    >
      <p className="absolute top-2 left-2 text-xs" style={{ color: textColor }}>
        {name}
      </p>
      <div className="m-auto text-xs hidden group-hover:block">
        <button onClick={() => setSelColor({ id, name, hex })}>
          <ArrowsPointingOutIcon className="pr-2 h-12 w-12" style={{ color: textColor }} />
        </button>
      </div>
    </div>
  )
}