const baseUrl = window.location.href

//3D 模型资源
export const ModelEnum = {
  headquarters: baseUrl + 'public/3d/big-building/scene.gltf',
  normalOrg: baseUrl + 'public/3d/small-building/scene.gltf'
}

//声音资源
export const AudioEnum = {
  marker: baseUrl + 'public/sound/marker.mp3',
  waitan: baseUrl + 'public/sound/waitan.mp3',
  warning: baseUrl + 'public/sound/warning1.mp3',
  detail: baseUrl + 'public/sound/info-detail.mp3'
}

//图片资源

export const ImageEnum = {
  head: baseUrl + 'public/image/navigator.png',
  'green-point': baseUrl + 'public/image/green-point.png',
  'yellow-point': baseUrl + 'public/image/yellow-point.png'
}

//头像资源

export const AvatarEnum = {
  older: baseUrl + 'public/image/avatar/old',
  staff: baseUrl + 'public/image/avatar/staff'
}
