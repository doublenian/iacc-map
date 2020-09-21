export default class GlobalMapEvent {
  constructor(scene, map) {
    this.scene = scene
    this.map = map
  }
  initEvent() {
    this.initMapEvent()
    this.initSceneEvent()
  }
  initMapEvent() {
    this.map.on('click', e => {
      document.querySelector('#map-center').innerText =
        e.lnglat.getLng() + ',' + e.lnglat.getLat()
      document.querySelector('#map-pitch').innerText = this.map.getPitch()
    })
    this.map.on('zoomend', () => {
      //document.querySelector('#map-zoom').innerText = this.map.getZoom()
    })
    this.map.on('zoomchange', () => {
      document.querySelector('#map-zoom').innerText = this.map.getZoom()
    })
  }
  initSceneEvent() {
    // this.scene.on('zoomend', ev => {
    //   console.log('====zoom changed======')
    // })
  }
}
