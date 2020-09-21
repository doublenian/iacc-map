import { parseRouteToPath } from '~/utils'
export default class Track {
  constructor(scene, startPosition, endPosition) {
    this.startPosition = startPosition
    this.endPosition = endPosition
    this.scene = scene
    this.driving = new AMap.Driving({
      policy: AMap.DrivingPolicy.LEAST_TIME, // 其它policy参数请参考 https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingPolicy
      ferry: 1, // 是否可以使用轮渡
      province: '沪' // 车牌省份的汉字缩写
    })
    this._route = null
  }
  create() {
    // 根据起终点经纬度规划驾车导航路线
    this.driving.search(
      new AMap.LngLat(this.startPosition.lng, this.startPosition.lat),
      new AMap.LngLat(this.endPosition.lng, this.endPosition.lat),
      (status, result) => {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            this.drawRoute(parseRouteToPath(result.routes[0]))
            // this.drawRouteByGaoDe(parseRouteToPath(result.routes[0]))
          }
        } else {
          console.error('获取驾车数据失败：' + result)
        }
      }
    )
    return this
  }
  drawRoute(data) {
    let gpsData = data.map(c => {
      return [c.lng, c.lat]
    })
    let dataGeo = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
      },
      features: [
        {
          type: 'Feature',
          properties: {
            Id: 0,
            经济带名称: '',
            经济带分类: '海上丝绸之路'
          },
          geometry: { type: 'LineString', coordinates: gpsData }
        }
      ]
    }
    this._route = this.scene
      .LineLayer({
        zIndex: 3
      })
      .source(dataGeo)
      .color('rgb(80,148,246)')
      .size(6)
      .shape('line')
      .style({
        lineType: 'solid'
      })
      .animate({
        enable: true,
        duration: 3, // 动画时间
        interval: 0.5,
        trailLength: 0.8
      })
      .render()
  }
  destroy() {
    this._route && this.scene.removeLayer(this._route)
  }
}
