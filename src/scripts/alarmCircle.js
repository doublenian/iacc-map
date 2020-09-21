import anime from 'animejs/lib/anime.es'

const strokeWeight = 30

export default class AlarmCircle {
  constructor(map, position, radius = 200) {
    this.map = map
    this.position = position
    this.alarmCircle1 = null
    this.anime = null
    this.radius = radius
  }
  create() {
    this.alarmCircle1 = new AMap.Circle({
      map: this.map,
      center: new AMap.LngLat(this.position[0], this.position[1]),
      radius: 0,
      strokeColor: '#F59F23',
      strokeOpacity: 1,
      strokeWeight: 0,
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
      strokeWeight: 0,
      strokeOpacity: 0.1
    }
    let self = this
    this.anime = anime({
      targets: myObject,
      radius1: this.radius,
      strokeOpacity: 100,
      strokeWeight: 30,
      duration: 1.5 * 1000,
      loop: true,
      easing: 'cubicBezier(.5, .05, .1, .3)',
      update(v) {
        self.alarmCircle1.setRadius(myObject.radius1)
        let weight = strokeWeight - myObject.strokeWeight
        let opacity = (100 - myObject.strokeOpacity) / 100
        self.alarmCircle1.setOptions({
          strokeOpacity: opacity,
          strokeWeight: weight
        })
      },
      loopComplete: function(anim) {
        self.alarmCircle1.setRadius(0)
      }
    })
  }
  destroy() {
    this.anime.pause()
    this.alarmCircle1.setMap(null)
  }
}
