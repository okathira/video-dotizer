import p5 from 'p5'

// INSTANCE MODE
const sketch = (p: p5) => {
  // GLOBAL VARS & TYPES
  let outX = 7 // 16 * 2
  let outY = 7 // 12 * 2
  let srcX = 480 // 4:3
  let srcY = 360
  let pixelX = srcX / outX
  let pixelY = srcY / outY
  let FPS = 12

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
  }

  // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
  p.draw = () => {
    if (isVideoLoaded && inputMediaElem) {
      // p.background(0)

      inputMediaElem.loadPixels()
      let pixelData: number[] = [] // モノクロ

      for (let y = 0; y < srcY; y += pixelY) {
        for (let x = 0; x < srcX; x += pixelX) {
          const index =
            (srcX * Math.floor(y + pixelY / 2) + Math.floor(x + pixelX / 2)) * 4 // RGBA

          p.fill(
            // 線と点の色
            inputMediaElem.pixels[index] // > 127 ? 255 : 0 // モノクロ
          )
          p.rect(x, y, pixelX, pixelY)

          pixelData.push(inputMediaElem.pixels[index]) // モノクロ
        }
      }

      console.log(pixelData)
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
