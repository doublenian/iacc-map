import EventBus from '~/utils/eventbus'
export default class StartUp {
  constructor(map, scene) {
    this.map = map
    this.scene = scene
    this.emitter = EventBus.getInstance().emitter
  }
  init() {
    let request,
      start = 0,
      end = 360,
      zoom = 3
    let onRotationEnd = () => {
      cancelAnimationFrame(request)
      this.emitter.emit('rotationEnd')
    }
    let draw = () => {
      start += 4
      this.scene.setRotation(start)
      if (start >= end) {
        onRotationEnd()
      }
    }
    const animate = () => {
      request = requestAnimationFrame(animate)
      draw()
    }
    let interval = setInterval(() => {
      zoom += 1.01
      if (zoom <= 16.1) {
        this.scene.setZoom(zoom)
      } else {
        this.emitter.emit('zoomEnd')
        clearInterval(interval)
      }
    }, 200)
    animate()
  }
}
