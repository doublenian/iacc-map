let olderInfo = require('~/template/older-info.hbs')
import { Howl, Howler } from 'howler'
import { AudioEnum } from '~/utils/assets'
const detailAudio = new Howl({
  src: [AudioEnum.detail],
  preload: true,
  loop: false
})
export default class markerPoint {
  constructor(map, position, image) {
    this.map = map
    this.position = position
    this.image = image
    this.marker = null
  }
  create() {
    this.marker = new AMap.Marker({
      map: this.map,
      position: this.position, //[116.478935, 39.997761]
      icon: this.image,
      offset: new AMap.Pixel(-26, -18),
      autoRotation: false,
      zIndex: 0,
      bubble: false,
      label: null
    })
    this.marker.on('mouseover', ev => {
      let html = olderInfo()
      this.marker.setLabel({
        content: html,
        direction: 'right'
      })
      // detailAudio.play()
    })
    this.marker.on('mouseout', () => {
      this.marker.setLabel(undefined)
    })
    return this
  }
  setAvatar(icon) {
    this.marker.setIcon(icon)
  }
  destroy() {
    this.marker && this.map.remove(this.marker)
    this.marker.off('mouseover')
    this.marker.off('mouseout')
    this.marker = undefined
  }
}
