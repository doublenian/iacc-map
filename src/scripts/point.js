import { pointOnCoord } from '~/utils'

export default class Point {
  constructor(scene, position, shape) {
    this.scene = scene
    this.position = position
    this.shape = shape
    this._pointLayer = null
  }
  create() {
    this._pointLayer = this.scene
      .PointLayer({
        zIndex: 0
      })
      .source(pointOnCoord(this.position))
      .shape(this.shape)
      .size(30)
      .active(true)
      .render()
    return this
  }
  destroy() {
    this._pointLayer && this.scene.removeLayer(this._pointLayer)
  }
}
