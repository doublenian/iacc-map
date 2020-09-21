import anime from 'animejs/lib/anime.es'
const strokeWeight = 80
export default class GaodeCircle {
  constructor(map, position) {
    this.map = map
    this.position = position
    this.alarmCircle1 = null
    this.alarmCircle2 = null
    this.anime = null
  }
  create() {
    this.alarmCircle1 = new AMap.Circle({
      map: this.map,
      center: new AMap.LngLat(this.position.lng, this.position.lat),
      radius: 0,
      strokeColor: '#3ea0fb',
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: '#fff',
      fillOpacity: 0,
      strokeStyle: 'solid'
    })
    this.alarmCircle2 = new AMap.Circle({
      map: this.map,
      center: new AMap.LngLat(this.position.lng, this.position.lat),
      radius: 0,
      strokeColor: '#3ea0fb',
      strokeOpacity: 0.56,
      strokeWeight: 3,
      fillColor: '#fff',
      fillOpacity: 0,
      strokeStyle: 'solid'
    })
    this.startAnimate()
    return this
  }
  startAnimate() {
    var myObject = {
      radius1: 0,
      radius2: strokeWeight,
      strokeOpacity: 10
    }
    let self = this
    this.anime = anime({
      targets: myObject,
      radius1: strokeWeight,
      radius2: strokeWeight * 2,
      strokeOpacity: 56,
      duration: 1 * 1000,
      loop: true,
      easing: 'cubicBezier(.5, .05, .1, .3)',
      update(v) {
        self.alarmCircle1.setRadius(myObject.radius1)
        self.alarmCircle2.setRadius(myObject.radius2)
        let weight = strokeWeight - myObject.strokeWeight
        let opacity = (100 - myObject.strokeOpacity) / 100
        self.alarmCircle2.setOptions({
          strokeOpacity: opacity
        })
      },
      loopComplete: function(anim) {
        self.alarmCircle1.setRadius(0)
        self.alarmCircle2.setRadius(strokeWeight)
      }
    })
  }
  destroy() {
    this.anime.pause()
    this.alarmCircle1.setMap(null)
    this.alarmCircle2.setMap(null)
    this.anime = undefined
    this.alarmCircle1 = undefined
    this.alarmCircle2 = undefined
  }
}
