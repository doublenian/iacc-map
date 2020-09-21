// import GaodeCircle from './GaodeCircle'
import Track from './track'
import CurveLine from './curveLine'
import { Howl, Howler } from 'howler'
import {
  fiveRoutePoint,
  cameraMove,
  randomPoint,
  alarmPoint
} from '~/utils/position'
import anime from 'animejs/lib/anime.es'
import Point from './point'
import OrgMarker from './orgMarker'
import EventBus from '~/utils/eventbus'
import GaodeCircle from './gaodeCircle'
import AlarmCircle from './alarmCircle'
import OrgPoint from './orgPoint'
let tipsTemp = require('~/template/tips.hbs')

import {
  getRandomAngle,
  pointOnCircle,
  get3PointAroundCenter,
  AiZhaohu,
  combileTwoPoint,
  delay
} from '~/utils'
export default class Storyboard {
  constructor(scene, map, data) {
    this.scene = scene
    this.mapinstance = map
    this.data = data
    this.emitter = EventBus.getInstance().emitter
    this._godStoryLayerObj = {
      orgMarker: [],
      curveLine: [],
      GaodeCircle: [],
      orgPoint: []
    }
    this._huangpuStoryLayerObj = {
      point: [],
      track: [],
      alarm: []
    }
  }
  //开始进入的上帝视角
  async startGodStory(markerAudio) {
    this.mapinstance.setCenter(new AMap.LngLat(AiZhaohu.lng, AiZhaohu.lat))

    //创建总部Marker
    this._godStoryLayerObj.orgMarker.push(
      new OrgMarker(this.mapinstance, AiZhaohu).create()
    )
    delay(1).then(ret => {
      markerAudio.play()
    })
    //创建总部圈圈
    this._godStoryLayerObj.GaodeCircle.push(
      new GaodeCircle(this.mapinstance, {
        lng: AiZhaohu.lng,
        lat: AiZhaohu.lat
      }).create()
    )
    let { threePoint, remainOrgs } = get3PointAroundCenter(this.data)
    let startPoint = AiZhaohu
    //开场 创建旁边三个机构，圈圈以及射线分别射向他们
    for (let i = 0; i < threePoint.length; i++) {
      await delay(4)
      this._godStoryLayerObj.GaodeCircle.push(
        new GaodeCircle(this.mapinstance, {
          lng: threePoint[i].lng,
          lat: threePoint[i].lat
        }).create()
      )
      this._godStoryLayerObj.orgMarker.push(
        new OrgMarker(this.mapinstance, threePoint[i]).create()
      )
      delay(1).then(ret => {
        markerAudio.play()
      })
      this._godStoryLayerObj.curveLine.push(
        new CurveLine(
          this.scene,
          combileTwoPoint(startPoint.coord, threePoint[i].coord)
        ).create()
      )
      this.scene.panTo(threePoint[i].coord)
    }
    await delay(3)
    this.scene.setZoomAndCenter(14.2, AiZhaohu.coord)
    remainOrgs.forEach(c => {
      this._godStoryLayerObj.orgMarker.push(
        new OrgMarker(this.mapinstance, c).create()
      )
      this._godStoryLayerObj.GaodeCircle.push(
        new GaodeCircle(this.mapinstance, {
          lng: c.lng,
          lat: c.lat
        }).create()
      )
      this._godStoryLayerObj.curveLine.push(
        new CurveLine(
          this.scene,
          combileTwoPoint(startPoint.coord, c.coord)
        ).create()
      )
    })
    await delay(5)
  }
  clearGodStory() {
    this._godStoryLayerObj.curveLine.forEach(c => {
      c.destroy()
    })
    this._godStoryLayerObj.GaodeCircle.forEach(c => {
      c.destroy()
    })
    this._godStoryLayerObj.orgMarker.forEach(c => {
      c.destroy()
    })
    this._godStoryLayerObj.orgPoint.forEach(c => {
      c.destroy()
    })
    this._godStoryLayerObj.curveLine = []
    this._godStoryLayerObj.GaodeCircle = []
    this._godStoryLayerObj.orgMarker = []
    this._godStoryLayerObj.orgPoint = []
  }
  //黄浦江视角
  async startHuangpuStory(huangPuAudio) {
    this.clearGodStory()
    this.mapinstance.setStatus({
      scrollWheel: false
    })
    this.scene.setCenter(cameraMove.start)
    this._huangpuStoryLayerObj.point.push(
      new Point(this.scene, cameraMove.start, 'yellow-point').create()
    )
    this._huangpuStoryLayerObj.point.push(
      new Point(this.scene, cameraMove.end, 'green-point').create()
    )

    this.scene.setZoom(17)
    this.scene.setRotation(40)
    let rotate = 0
    this.scene.setPitch(60)
    this.scene.panTo(cameraMove.start)
    var myObject = {
      prop1: 0
    }
    let self = this
    Array.from([cameraMove.start, cameraMove.end]).forEach(item => {
      fiveRoutePoint.forEach(c => {
        let combile = combileTwoPoint(item, c)[0]
        this._huangpuStoryLayerObj.track.push(
          new Track(
            this.scene,
            {
              lng: combile.lng1,
              lat: combile.lat1
            },
            {
              lng: combile.lng2,
              lat: combile.lat2
            }
          ).create()
        )
      })
    })
    randomPoint.forEach((c, index) => {
      if (index % 3 == 0) {
        this._huangpuStoryLayerObj.point.push(
          new Point(this.scene, c, 'yellow-point').create()
        )
      } else {
        this._huangpuStoryLayerObj.point.push(
          new Point(this.scene, c, 'green-point').create()
        )
      }
    })
    alarmPoint.forEach(c => {
      this._huangpuStoryLayerObj.alarm.push(
        new AlarmCircle(this.mapinstance, c, 500).create()
      )
    })
    await delay(2)
    huangPuAudio.play()
    anime({
      targets: myObject,
      prop1: 40,
      easing: 'linear',
      duration: 25 * 1000,
      round: 1,
      update(v) {
        self.mapinstance.panBy(-5, 4)
        // self.scene.panBy(-5, 4)
      },
      endDelay: 0,
      complete() {
        // self.scene.setCenter([121.487918, 31.24109])
        // self.scene.setZoom(14.03)
        huangPuAudio.stop()
        self.emitter.emit('huangpuStoryEnd')
      }
    })
  }
  returnToGodStory() {
    document.body.insertAdjacentHTML(
      'beforeend',
      tipsTemp({
        tips: '点击机构名进入社区模式'
      })
    )
    this.mapinstance.setCenter(new AMap.LngLat(AiZhaohu.lng, AiZhaohu.lat))
    this.scene.setPitch(40)
    this.scene.setZoom(14.2)
    let startPoint = AiZhaohu

    this.data.forEach(c => {
      this._godStoryLayerObj.orgMarker.push(
        new OrgMarker(this.mapinstance, c).create()
      )
      this._godStoryLayerObj.orgPoint.push(
        new OrgPoint(this.mapinstance, {
          lng: c.lng,
          lat: c.lat
        }).create()
      )
      this._godStoryLayerObj.curveLine.push(
        new CurveLine(
          this.scene,
          combileTwoPoint(startPoint.coord, c.coord)
        ).create()
      )
    })
  }
  clearHuangpuStory() {
    this._huangpuStoryLayerObj.point.forEach(c => {
      c.destroy()
    })
    this._huangpuStoryLayerObj.track.forEach(c => {
      c.destroy()
    })
    this._huangpuStoryLayerObj.alarm.forEach(c => {
      c.destroy()
    })
    this._huangpuStoryLayerObj.point = []
    this._huangpuStoryLayerObj.track = []
    this._huangpuStoryLayerObj.alarm = []
    this.mapinstance.setStatus({
      scrollWheel: true
    })
  }
  //创建机构的名字Marker
  addMarker(item) {
    let markerHtml = markerTemp({
      name: item.name
    })
    new AMap.Marker({
      map: this.mapinstance,
      position: new AMap.LngLat(item.lng, item.lat),
      anchor: 'top-left',
      content: markerHtml,
      animation: 'AMAP_ANIMATION_NONE',
      offset: new AMap.Pixel(20, -84)
    })
  }
}
