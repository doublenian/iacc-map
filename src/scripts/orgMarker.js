let markerTemp = require('~/template/marker.hbs')
import EventBus from '~/utils/eventbus'
export default class OrgMarker {
  constructor(mapinstance, item, animation = false, godMode = true) {
    this.mapinstance = mapinstance
    this.item = item
    this._marker = null
    this.animation = animation
    this.godMode = godMode
    this.emitter = EventBus.getInstance().emitter
  }
  create() {
    let markerHtml = markerTemp({
      name: this.item.name
    })
    this._marker = new AMap.Marker({
      map: this.mapinstance,
      position: new AMap.LngLat(this.item.lng, this.item.lat),
      anchor: 'top-left',
      content: markerHtml,
      animation: this.animation ? 'AMAP_ANIMATION_DROP' : 'AMAP_ANIMATION_NONE',
      clickable: true,
      offset: new AMap.Pixel(20, -84)
    })
    if (this.godMode) {
      this._marker.on('click', () => {
        this.emitter.emit('orgMarkerClicked', {
          item: this.item
        })
      })
    } else {
      this._marker.on('click', () => {
        this.emitter.emit('CommunityOrgMarkerClicked', {
          item: this.item
        })
      })
    }

    return this
  }
  destroy() {
    this._marker && this.mapinstance.remove(this._marker)
  }
}
