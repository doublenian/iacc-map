export default class CurveLine {
  constructor(scene, data) {
    this.scene = scene
    this.data = data
    this._curveLine = null
  }
  create() {
    this._curveLine = this.scene
      .LineLayer({
        zIndex: 1
      })
      .source(this.data, {
        parser: {
          type: 'json',
          x: 'lng1',
          y: 'lat1',
          x1: 'lng2',
          y1: 'lat2'
        }
      })
      // .shape('greatCircle')
      .shape('arc')
      .size(1)
      .color('rgb(60,255,255)')
      .style({
        opacity: 1
      })
      .animate({
        enable: true,
        interval: 0.1,
        duration: 1,
        trailLength: 0.05
      })
      .render()
    return this
  }
  destroy() {
    this._curveLine && this.scene.removeLayer(this._curveLine)
    this._curveLine = undefined
  }
}
