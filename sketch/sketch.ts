// INSTANCE MODE
const sketch = (p: p5) => {
  // GLOBAL VARS & TYPES
  let input: p5.Element // input type='file'
  let inputElem: p5.Element | null // picture
  let inputMediaElem: p5.MediaElement | null // video

  // INSTANCE MODE
  p.setup = () => {
    console.log('🚀 - Setup initialized - P5 is running')

    input = p.createFileInput(handleFile)
    input.position(0, 0)
  }

  // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
  p.draw = () => {}

  // p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
  p.windowResized = () => {}

  const handleFile = (f: p5.File) => {
    initElems()

    if (f.type === 'image') {
      inputElem = p.createImg(f.data, 'your local file')
    } else if (f.type === 'video') {
      inputMediaElem = p.createVideo(f.data, videoLoad)
      inputMediaElem.showControls()
    }
  }

  const videoLoad = () => {
    if (!inputMediaElem) return undefined

    inputMediaElem.loop()
  }

  const initElems = () => {
    inputElem?.remove()
    inputMediaElem?.remove()

    inputElem = null
    inputMediaElem = null
  }
}

new p5(sketch)
