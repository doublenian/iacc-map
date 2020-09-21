import { parseRouteToPath } from '~/utils'
import EventBus from '~/utils/eventbus'
export default class RouteLine {
  constructor(scene, map, markerPoint, endPoint, startPosition, endPosition) {
    this.map = map
    this.scene = scene
    //移动到endPosition的位置
    this.startPosition = startPosition
    this.endPosition = endPosition
    this.markerPoint = markerPoint
    this.endPoint = endPoint
    this.polyline = null
    this.passedPolyline = null
    this.timer = null
    this.emitter = EventBus.getInstance().emitter
    //https://lbs.amap.com/api/javascript-api/reference/route-search#AMap.Riding
    this.driving = new AMap.Walking({
      // policy: AMap.DrivingPolicy.LEAST_DISTANCE, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
      // ferry: 1, // 是否可以使用轮渡
      // province: '沪', // 车牌省份的汉字缩写
      // autoFitView:true
    })
  }
  create() {
    this.scene.panTo([this.endPosition.lng, this.endPosition.lat])
    // 根据起终点经纬度规划自行车导航路线
    this.driving.search(
      new AMap.LngLat(this.startPosition.lng, this.startPosition.lat),
      new AMap.LngLat(this.endPosition.lng, this.endPosition.lat),
      (status, result) => {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            let data = parseRouteToPath(result.routes[0]).map(c => [
              c.lng,
              c.lat
            ])
            this.drawRoute(data)
          }
        } else {
          console.error('获取驾车数据失败：' + result)
        }
      }
    )
    return this
  }
  drawRoute(data) {
    //绘制轨迹
    this.polyline = new AMap.Polyline({
      map: this.map,
      path: data,
      isOutline: true,
      lineJoin: 'round',
      strokeColor: '#2979ff', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 10, //线宽
      strokeStyle: 'solid' //线样式
    })
    this.passedPolyline = new AMap.Polyline({
      map: this.map,
      lineJoin: 'round',
      strokeColor: '#607d8b', //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 10, //线宽
      strokeStyle: 'solid' //线样式
    })
    let self = this,
      count = 0,
      currentCount
    this.markerPoint.marker.on('moving', e => {
      count++
      self.passedPolyline.setPath(e.passedPath)
    })
    this.markerPoint.marker.moveAlong(data, 60)
    this.timer = setInterval(() => {
      if (currentCount === count) {
        self.destroy()
        self.emitter.emit('routeLineMoveEnd', this.endPoint)
      } else {
        currentCount = count
      }
    }, 1 * 1000)
    return this
  }
  destroy() {
    this.timer && clearInterval(this.timer)
    this.map.remove([this.polyline, this.passedPolyline])
  }
}
