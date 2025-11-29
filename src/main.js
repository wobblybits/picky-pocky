import './style.css'
import PickyPocky from './game.js'
import { PLAYER_1 } from '@rcade/plugin-input-classic'
import p5 from 'p5'

p5.disableFriendlyErrors = true

const libs = {}
const assets = {}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') { // 38 is the keyCode for the up arrow key
    game.input.upHasBeenPressed = true;
  }
});

const game = new PickyPocky({
  libs,
  input: {
    isPressedUp: () => {
      // Workaround until plugin works
      if (game.input.upHasBeenPressed) {
        game.input.upHasBeenPressed = false;
        return true;
      }
      return false;
      // return PLAYER_1.DPAD.up
    },
  },
  assets,
})

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 240

const assetManifest = {
  'face.png': '/face.png',
  'finger.png': '/finger.png',
  'nose.png': '/nose.png',
}

let lastTime = performance.now()
let assetsReady = false

const sketch = (sk) => {
  libs.p5 = sk

  sk.setup = () => {
    const renderer = sk.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    renderer.canvas.id = 'gameCanvas'
    sk.pixelDensity(1)

    const assetPromises = Object.entries(assetManifest).map(
      ([key, path]) =>
        new Promise((resolve, reject) => {
          sk.loadImage(
            path,
            (img) => {
              assets[key] = img
              resolve()
            },
            (err) => reject(new Error(`Failed to load asset ${path}`, { cause: err }))
          )
        })
    )

    Promise.all(assetPromises)
      .then(() => {
        assetsReady = true
        lastTime = performance.now()
        game.init(renderer.canvas)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  sk.draw = () => {
    if (!assetsReady) {
      sk.background(0)
      sk.fill(255)
      sk.textAlign(sk.CENTER, sk.CENTER)
      sk.text('Loading...', sk.width / 2, sk.height / 2)
      return
    }

    const now = performance.now()
    game.update(now - lastTime)
    lastTime = now
  }
}

new p5(sketch, document.querySelector('#app'))