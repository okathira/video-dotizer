import p5 from 'p5'
import { onMessage, publish } from './connection'

const toMatrix = <T>(arr: T[], x: number) => {
  const oldArray = [...arr]
  const newArray: T[][] = []
  while (oldArray.length) newArray.push(oldArray.splice(0, x))

  return newArray
}

// INSTANCE MODE
const sketch = (p: p5) => {
  // GLOBAL VARS & TYPES
  let outX = 7
  let outY = 7
  let srcX = 480 // 4:3
  let srcY = 360
  let pixelX = srcX / outX
  let pixelY = srcY / outY
  let FPS = 11

  let input: p5.Element // input type='file'
  let inputElem: p5.Element | null // input picture
  let inputMediaElem: p5.VideoElement | null // input video
  let isVideoLoaded: boolean = false // input video

  let outputCanvas: p5.Element | null // processed video

  // INSTANCE MODE
  p.setup = () => {
    console.log('🚀 - Setup initialized - P5 is running')

    outputCanvas = p.createCanvas(srcX, srcY)
    // p.noSmooth()
    p.noStroke()
    p.frameRate(FPS)

    input = p.createFileInput(handleFile)
    // input.position(0, 0)

    onMessage()
  }

  // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
  p.draw = () => {
    if (isVideoLoaded && inputMediaElem) {
      // p.background(0)

      inputMediaElem.loadPixels()
      const pixelData: number[] = [] // モノクロ

      for (let y = 0, yi = 0; yi < outY; yi++) {
        for (let x = 0, xi = 0; xi < outX; xi++) {
          const index =
            (srcX * Math.floor(y + pixelY / 2) + Math.floor(x + pixelX / 2)) * 4 // RGBA

          const grayPixel = inputMediaElem.pixels[index] > 127 ? 255 : 0 // モノクロ
          p.fill(grayPixel) // 線と点の色
          p.rect(x, y, pixelX, pixelY)

          pixelData.push(grayPixel) // モノクロ

          x += pixelX
        }
        y += pixelY
      }

      const publishData = toMatrix(
        pixelData.map((v) => (v ? 1 : 0)),
        outX
      )

      const publishStr = JSON.stringify(publishData)
      publish(publishStr)

      console.log(pixelData)
      console.log(publishStr)
    }
  }

  // p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
  p.windowResized = () => {}

  const handleFile = (f: p5.File) => {
    initElems()

    if (f.type === 'image') {
      inputElem = p.createImg(f.data, 'your local file')
    } else if (f.type === 'video') {
      inputMediaElem = p.createVideo(f.data, videoLoad)
    }
  }

  const videoLoad = () => {
    if (!inputMediaElem) return undefined

    isVideoLoaded = true
    inputMediaElem.loop()
    inputMediaElem.showControls()

    // const mediaSize = inputMediaElem.size()
    // inputMediaElem.size(mediaSize.width / 4, mediaSize.height / 4)
    inputMediaElem.size(srcX, srcY)
  }

  const initElems = () => {
    inputElem?.remove()
    inputMediaElem?.remove()

    inputElem = null
    inputMediaElem = null
    isVideoLoaded = false
  }
}

new p5(sketch)
