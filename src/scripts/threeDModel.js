export default class threeDModel {
  /**
   * @param {*} object3Dlayer
   * @param {*} model
   * @param {*} options 3D loader的options,如 scale,height,scene
   * @param {*} position
   */
  constructor(object3Dlayer, model, options, position) {
    this.object3Dlayer = object3Dlayer
    this.model = model
    this.options = options
    this.position = position
    this._gltfObj = null
  }
  create() {
    let gltfLoader = new AMap.GltfLoader()
    gltfLoader.load(this.model, gltfObj => {
      this._gltfObj = gltfObj
      gltfObj.setOption({
        position: new AMap.LngLat(this.position.lng, this.position.lat), // 必须
        scale: this.options.scale || 1, // 非必须，默认1
        height: this.options.height || 0, // 非必须，默认0
        scene: this.options.scene || 0 // 非必须，默认0
      })
      gltfObj.rotateX(this.options.rotateX || 0)
      gltfObj.rotateY(this.options.rotateY || 0)
      gltfObj.rotateZ(this.options.rotateZ || 0)
      this.object3Dlayer.add(gltfObj)
    })
    return this
  }
  addToLayer() {
    this.object3Dlayer.add(this._gltfObj)
  }
  destroy() {
    this._gltfObj && this.object3Dlayer.remove(this._gltfObj)
  }
}
