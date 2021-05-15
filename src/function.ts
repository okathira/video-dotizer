export const toMatrix2d = <T>(arr: T[], cols: number) => {
  const oldArray = [...arr]
  const newArray: T[][] = []
  while (oldArray.length) newArray.push(oldArray.splice(0, cols))

  return newArray
}

export const toPixelIndex = (x: number, y: number, width: number) => {
  const elements = 4 // rgba
  return (width * y + x) * elements
}

// Rec.601
export const toGrayScale = (r: number, g: number, b: number) => {
  return r * 0.299 + g * 0.587 + b * 0.114
}
