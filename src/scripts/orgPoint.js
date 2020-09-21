export default class OrgPoint {
  constructor(map, position, ratio = 1) {
    this.map = map
    this.position = position
    this.layerGroup = null
    this.ratio = ratio
  }
  create() {
    this.layerGroup = new AMap.OverlayGroup()
    this.layerGroup.addOverlay(
      new AMap.Circle({
        center: new AMap.LngLat(this.position.lng, this.position.lat),
        radius: 40 / this.ratio,
        fillColor: '#38A5FF',
        fillOpacity: 1,
        strokeStyle: 'solid',
        strokeOpacity: 0
      })
    )
    this.layerGroup.addOverlay(
      new AMap.Circle({
        center: new AMap.LngLat(this.position.lng, this.position.lat),
        radius: 100 / this.ratio,
        fillColor: '#38A5FF',
        fillOpacity: 0.64,
        strokeStyle: 'solid',
        strokeOpacity: 0
      })
    )

    this.layerGroup.addOverlay(
      new AMap.Circle({
        center: new AMap.LngLat(this.position.lng, this.position.lat),
        radius: 160 / this.ratio,
        fillColor: '#38A5FF',
        fillOpacity: 0.4,
        strokeStyle: 'solid',
        strokeOpacity: 0
      })
    )
    this.layerGroup.setMap(this.map)
    return this
  }
  destroy() {
    this.layerGroup.clearOverlays()
    this.layerGroup.setMap(null)
  }
}
