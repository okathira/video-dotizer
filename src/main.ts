import p5 from 'p5'
import { publish } from './connection'
import { toMatrix2d, toPixelIndex } from './function'

// INSTANCE MODE
const sketch = (p: p5) => {
  // グローバル変数
  // TODO: 可変にする
  let outX = 7 // UIflow emoji
  let outY = 7
  let srcX = 480 // 4:3
  let srcY = 360
  let pixelX = srcX / outX
  let pixelY = srcY / outY
  let FPS = 11 // M5側の描画が追いつくギリギリ

  // HTML要素
  let input: p5.Element // input type='file'
  let inputElem: p5.Element | null // input picture
  let inputMediaElem: p5.VideoElement | null // input video
  let isVideoLoaded: boolean = false // input video

  let outputCanvas: p5.Element | null // processed video

  p.setup = () => {
    console.log('🚀 - Setup initialized - P5 is running')

    outputCanvas = p.createCanvas(srcX, srcY)
    p.noStroke()
    p.frameRate(FPS)

    input = p.createFileInput(handleFile)
  }

  p.draw = () => {
    if (isVideoLoaded && inputMediaElem) {
      // p.background(0)

      inputMediaElem.loadPixels()
      const pixelData: number[] = [] // モノクロ

      for (let y = 0, yi = 0; yi < outY; yi++) {
        for (let x = 0, xi = 0; xi < outX; xi++) {
          const index = toPixelIndex(
            Math.floor(x + pixelX / 2),
            Math.floor(y + pixelY / 2),
            srcX
          )

          const grayPixel = inputMediaElem.pixels[index] > 127 ? 255 : 0 // モノクロ
          p.fill(grayPixel) // 線と点の色
          p.rect(x, y, pixelX, pixelY)

          pixelData.push(grayPixel) // モノクロ

          x += pixelX
        }
        y += pixelY
      }

      const publishData = toMatrix2d(
        pixelData.map((v) => (v ? 1 : 0)), // 二値化
        outX
      )

      const publishStr = JSON.stringify(publishData)
      publish(publishStr)

      // console.log(pixelData)
      // console.log(publishStr)
    }
  }

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

    inputMediaElem.loop()
    inputMediaElem.showControls()
    inputMediaElem.size(srcX, srcY)
    // const mediaSize = inputMediaElem.size()
    // inputMediaElem.size(mediaSize.width / 4, mediaSize.height / 4)

    isVideoLoaded = true
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
