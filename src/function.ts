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
