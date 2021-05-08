// INSTANCE MODE
const sketch = (p: p5) => {
  // GLOBAL VARS & TYPES

  // INSTANCE MODE
  p.setup = () => {
    console.log('🚀 - Setup initialized - P5 is running')
  }

  // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
  p.draw = () => {}

  // p5 WILL AUTO RUN THIS FUNCTION IF THE BROWSER WINDOW SIZE CHANGES
  p.windowResized = () => {}
}

new p5(sketch)
