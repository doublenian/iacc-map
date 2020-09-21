import {
  pointOnCircle,
  delay,
  getRandomAngle,
  getRandomAnglefrom360,
  getMinDistancePoint,
  getRandomInt,
} from '~/utils'
import OrgMarker from './orgMarker'
import MarkerPoint from './markerPoint'
import { ImageEnum, AvatarEnum, AudioEnum } from '~/utils/assets'
import EventBus from '~/utils/eventbus'
import RouteLine from './routeLine'
import AlarmCircle from './alarmCircle'
import { Howl, Howler } from 'howler'
import OrgPoint from './orgPoint'

let alarmTemp = require('~/template/alarm.hbs')
const monitorUrl = 'ezopen://open.ys7.com/203751922/1.hd.live'
const accessToken = 'xx'
export default class Community {
  constructor(scene, map, data) {
    this.scene = scene
    this.map = map
    this.data = data
    this._olderIcon = this.createIcon(ImageEnum['yellow-point'])
    this._staffIcon = this.createIcon(ImageEnum['green-point'])
    this.routeLine = null
    this.oldersPoint = []
    this.staffPoint = []
    this.orderIndex = 0
    this.OrgMarker = null
    this.OrgPoint = null
    this.emitter = EventBus.getInstance().emitter
    this.heatmap = null
    this.isRunning = false //照护员是否在行经中
    this.showHeatMap = false //是否show 热力图
    this.isDisplayAvatar = false //是否显示头像
    this.alarmAudio = new Howl({
      src: [AudioEnum.warning],
      preload: true,
      loop: false,
    })

    let alarmHtml = alarmTemp()
    document.body.insertAdjacentHTML('beforeend', alarmHtml)
  }
  createIcon(image) {
    return new AMap.Icon({
      size: new AMap.Size(30, 30),
      image: image,
      // 图标所用图片大小
      imageSize: new AMap.Size(30, 30),
      // 图标取图偏移量
    })
  }
  async create() {
    this.addEventListener()
    this.OrgMarker = new OrgMarker(this.map, this.data, true, false).create()
    this.OrgPoint = new OrgPoint(
      this.map,
      {
        lng: this.data.lng,
        lat: this.data.lat,
      },
      5
    ).create()
    this.map.setFeatures(['bg', 'road', 'building', 'point'])
    this.map.setStatus({
      scrollWheel: false,
    })
    getRandomAngle(20).forEach((item) => {
      let coord = pointOnCircle(this.data.coord, item, 0.004)
      this.oldersPoint.push(
        new MarkerPoint(this.map, coord, this._olderIcon).create()
      )
    })
    getRandomAngle(14).forEach((item) => {
      let coord = pointOnCircle(this.data.coord, item, 0.001)
      this.staffPoint.push(
        new MarkerPoint(this.map, coord, this._staffIcon).create()
      )
    })
    this.createHeatMap()
  }
  createHeatMap() {
    let heatPoints = []
    this.oldersPoint.forEach((older, index) => {
      if (index === 0) {
        getRandomAnglefrom360(90).forEach((item) => {
          let coord = pointOnCircle(older.position, item, 0.004, 0.001)
          if (item % 2 === 0) {
            heatPoints.push({
              lng: coord[0],
              lat: coord[1],
              count: getRandomInt(1, 100),
            })
          }
        })
      }
    })
    //初始化heatmap对象
    this.heatmap = new AMap.Heatmap(null, {
      radius: 180, //给定半径
      opacity: [0, 0.8],
      gradient: {
        0.5: 'blue',
        0.65: 'rgb(117,211,248)',
        0.7: 'rgb(0, 255, 0)',
        0.9: '#ffea00',
        1.0: 'red',
      },
    })
    this.heatmap.setDataSet({
      data: heatPoints,
      max: 100,
    })
  }
  addEventListener() {
    this.emitter.on('CommunityOrgMarkerClicked', () => {
      let url = `https://open.ys7.com/ezopen/h5/iframe?url=${monitorUrl}&autoplay=1&accessToken=${accessToken}&audio=1`
      let monitorTemp = require('~/template/monitor.hbs')({
        url: url,
      })
      document.body.insertAdjacentHTML('beforeend', monitorTemp)
    })
    this.emitter.on('closeMonitor', () => {
      document.querySelector('.org-monitor-wrapper').remove()
    })
    this.emitter.on('simulateAlarm', () => {
      this.isRunning = true
      let minPoint = getMinDistancePoint(
        this.oldersPoint[this.orderIndex],
        this.staffPoint
      )
      this.startRouting(minPoint, this.oldersPoint[this.orderIndex])
      this.oldersPoint[this.orderIndex].circle = new AlarmCircle(
        this.map,
        this.oldersPoint[this.orderIndex].position
      ).create()
      this.alarmAudio.play()
      this.orderIndex++
      if (this.orderIndex === this.oldersPoint.length) {
        this.orderIndex = 0
      }
      this.emitter.on('routeLineMoveEnd', (point) => {
        this.isRunning = false
        //路径结束后 回到初始位置
        this.scene.setCenter(this.data.coord)
        this.alarmAudio.stop()
        point.circle && point.circle.destroy()
      })
    })
    this.emitter.on('turnOnHeatMap', () => {
      this.showHeatMap = !this.showHeatMap
      this.showHeatMap
        ? this.heatmap.setMap(this.map)
        : this.heatmap.setMap(null)
    })
    this.emitter.on('goback', () => {
      this.clearCommunity()
    })
    this.emitter.on('displayAvatar', () => {
      this.isDisplayAvatar = !this.isDisplayAvatar
      if (this.isDisplayAvatar) {
        this.staffPoint.forEach((item, index) => {
          let urlIndex = index >= 4 ? index % 4 : index
          item.setAvatar(this.createIcon(AvatarEnum.staff + urlIndex + '.png'))
        })
        this.oldersPoint.forEach((item, index) => {
          let urlIndex = index >= 4 ? index % 4 : index
          item.setAvatar(this.createIcon(AvatarEnum.older + urlIndex + '.png'))
        })
      } else {
        this.staffPoint.forEach((item) => {
          item.setAvatar(this._staffIcon)
        })
        this.oldersPoint.forEach((item) => {
          item.setAvatar(this._olderIcon)
        })
      }
      setTimeout(() => {
        this.staffPoint.forEach((item) => {
          item.marker.setLabel(null)
        })
        this.oldersPoint.forEach((item) => {
          item.marker.setLabel(null)
        })
      }, 150)
    })
  }
  clearCommunity() {
    if (this.isRunning) {
      alert('照护员正在路上，等完成路径再返回')
      return
    }
    this.map.setFeatures(['bg', 'road', 'building'])
    this.OrgMarker.destroy()
    document.querySelector('.alarm-button-group').remove()
    this.staffPoint.forEach((c) => {
      c.destroy()
    })
    this.oldersPoint.forEach((c) => {
      c.destroy()
    })
    this.staffPoint = []
    this.oldersPoint = []
    this.emitter.emit('returnToGodStory')
    this.emitter.off('simulateAlarm')
    this.emitter.off('goback')
    this.map.setStatus({
      scrollWheel: true,
    })
    //删掉HeatMap
    this.heatmap.setMap(null)
  }
  startRouting(start, end) {
    let startCoord = {
      lng: start.position[0],
      lat: start.position[1],
    }
    let endCoord = {
      lng: end.position[0],
      lat: end.position[1],
    }
    new RouteLine(
      this.scene,
      this.map,
      start,
      end,
      startCoord,
      endCoord
    ).create()
  }
}
