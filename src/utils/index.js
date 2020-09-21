export function parseRouteToPath(route) {
  var path = []

  for (var i = 0, l = route.steps.length; i < l; i++) {
    var step = route.steps[i]

    for (var j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }
  return path
}

export function parseRideRouteToPath(route) {
  var path = []

  for (var i = 0, l = route.rides.length; i < l; i++) {
    var step = route.rides[i]
    for (var j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }
  return path
}

export function delay(s) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, s * 1000)
  })
}

export function pointOnCoord(coordinates) {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coordinates,
        },
      },
    ],
  }
}

export function pointOnCircle(coordinates, angle, radius = 0.004, beta = 0) {
  return [
    parseFloat(coordinates[0]) + Math.cos(angle) * radius,
    parseFloat(coordinates[1]) + Math.sin(angle) * radius + beta,
  ]
}

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getRandomAngle(amount) {
  const angle = [0, 30, 50, 80, 110, 140, 160, 180, 240, 270, 300, 330, 350]
  const arr = []
  for (let i = 0; i < amount; i++) {
    arr.push(angle[getRandomInt(0, angle.length - 1)])
  }
  //去重
  return [...new Set(arr)]
}

export function getRandomAnglefrom360(amount) {
  let arr = []
  for (let i = 0; i < amount; i++) {
    arr.push(getRandomInt(60, 90))
  }
  return arr
}

/**
 * 获取总部周围的3个机构
 * @param {*} data
 */
export function get3PointAroundCenter(data) {
  let d = [...data]
  let threePoint = [],
    remainOrgs = []
  const orgNames = [
    '上海曹杨社区长者照护之家',
    '上海普陀区石泉街道爱照护长者照护之家',
    '上海普陀区忆桃园长者照护之家',
  ]
  d.forEach((c, index) => {
    orgNames.includes(c.name) && threePoint.push(c)
  })
  remainOrgs = d.filter((c) => !orgNames.includes(c.name))
  return {
    threePoint,
    remainOrgs,
  }
}

export function combileTwoPoint(coord1, coord2) {
  return [
    {
      lng1: coord1[0],
      lat1: coord1[1],
      lng2: coord2[0],
      lat2: coord2[1],
    },
  ]
}
//从 A 到 B

export function centerToAll(center, orgs) {
  return orgs.map((c) => {
    return {
      lng1: center.lng,
      lat1: center.lat,
      lng2: c.lng,
      lat2: c.lat,
    }
  })
}

//计算 一组点中，距离离point 最近的那个点
export function getMinDistancePoint(point, pointArr) {
  let distancesPoint = []
  pointArr.forEach((c) => {
    let d = AMap.GeometryUtil.distance(point.position, c.position)
    distancesPoint.push({
      point: c,
      distance: d,
    })
  })
  let min = Math.min(...distancesPoint.map((c) => c.distance))
  let minPoint = distancesPoint.find((c) => c.distance === min)
  return minPoint.point
}

export const AiZhaohu = {
  lng: '121.421939',
  lat: '31.256198',
  name: '总部',
  coord: ['121.421939', '31.256198'],
}
