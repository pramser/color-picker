export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function isColorLight(color: string) {
  let rgb = hexToRgb(color)
  if (!rgb) {
    rgb = { r: 0, g: 0, b: 0 }
  }

  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186
}
