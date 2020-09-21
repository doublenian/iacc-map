import L7 from '@antv/l7'
import EventBus from '~/utils/eventbus'
import StartUp from './startup'
import GlobalMapEvent from './globalMapEvent'
import Storyboard from './storyboard'
import { AiZhaohu, delay } from '~/utils'
import { Howl, Howler } from 'howler'
import { ModelEnum, AudioEnum, ImageEnum, AvatarEnum } from '~/utils/assets'
import ThreeDModel from './threeDModel'
import Community from './community'
export default class L7Map {
  constructor(data, hasStartup) {
    this.data = data
    this.hasStartup = hasStartup
    this.emitter = EventBus.getInstance().emitter
    //https://lbs.amap.com/api/javascript-api/reference/map
    this.mapinstance = new AMap.Map('map', {
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      pitch: 40,
      viewMode: '3D',
      rotation: 0,
      center: AiZhaohu.coord,
      zoom: 0,
      maxZoom: 20,
      minZoom: 0,
      animateEnable: true,
      scrollWheel: false,
      mapStyle: 'amap://styles/29944f7fc0f660069369919e3dd6efc6',
      features: ['bg', 'road', 'building']
      // features: ['bg', 'road', 'building', 'point'],
    })
    //加入3D层
    this.object3Dlayer = new AMap.Object3DLayer()
    this.mapinstance.add(this.object3Dlayer)
    let options = {
      scale: 0.5,
      height: 0,
      scene: 0,
      rotateX: 90,
      rotateY: 0,
      rotateZ: 180
    }
    //创建爱照护总部3D模型
    this.headquarters3D = new ThreeDModel(
      this.object3Dlayer,
      ModelEnum.headquarters,
      options,
      AiZhaohu
    )
    this.mapinstance.on('complete', () => {
      this.scene = new L7.Scene({
        zoomControl: false,
        scaleControl: false,
        attributionControl: false,
        mapStyle: 'amap://styles/29944f7fc0f660069369919e3dd6efc6',
        map: this.mapinstance
      })
      this.scene.on('loaded', () => {
        this.onSceneLoaded()
      })
      new GlobalMapEvent(this.scene, this.mapinstance).initEvent()
    })
  }
  //当场景加载完，从此回调处开始
  onSceneLoaded() {
    const storyboard = new Storyboard(this.scene, this.mapinstance, this.data)
    this.headquarters3D.create()
    // this.goCommunityMode()
    this.emitter.on('returnToGodStory', () => {
      this.headquarters3D.addToLayer()
      storyboard.returnToGodStory()
    })
    // return
    //加载视频和音频资源
    let { markerAudio, huangPuAudio } = this.addAudioAssets()
    this.addLocalImageToScene()
    //开场动画
    if (this.hasStartup) {
      new StartUp(this.mapinstance, this.scene).init()
    } else {
      this.mapinstance.setStatus({
        scrollWheel: true
      })
      storyboard.returnToGodStory()
    }

    // return
    //开启上帝模式和黄浦江情景
    this.emitter.on('rotationEnd', async () => {
      await storyboard.startGodStory(markerAudio)
      this.headquarters3D.destroy()
      await storyboard.startHuangpuStory(huangPuAudio)
    })
    //黄浦江情景结束回到上帝模式
    this.emitter.on('huangpuStoryEnd', async () => {
      // await delay(6)
      storyboard.clearHuangpuStory()
      this.headquarters3D.addToLayer()
      storyboard.returnToGodStory()
      //模拟点击场景
      // await delay(3)
      // this.headquarters3D.destroy()
      // storyboard.clearGodStory()
      // this.goCommunityMode()
    })
    this.emitter.on('zoomEnd', () => {
      document.querySelector('.startup-mask').remove()
    })
    this.emitter.on('orgMarkerClicked', async ev => {
      document.querySelector('.tips-wrapper').remove()
      let data = ev.item
      this.scene.panTo(data.coord)
      // await delay(2)
      this.headquarters3D.destroy()
      storyboard.clearGodStory()
      this.scene.setCenter(data.coord)
      this.scene.setZoom(17)
      this.scene.setPitch(60)
      new Community(this.scene, this.mapinstance, ev.item).create()
    })
  }
  async goCommunityMode() {
    document.querySelector('.startup-mask') &&
      document.querySelector('.startup-mask').remove()
    let data = this.data.find(c => c.name == '上海曹杨社区长者照护之家')
    this.scene.setCenter(data.coord)
    this.scene.setZoom(17)
    this.scene.setPitch(60)
    await delay(1)
    new Community(this.scene, this.mapinstance, data).create()
  }
  //加载音频资源
  addAudioAssets() {
    const markerAudio = new Howl({
      src: [AudioEnum.marker],
      preload: true,
      autoplay: false
    })
    const huangPuAudio = new Howl({
      src: [AudioEnum.waitan],
      preload: true,
      autoplay: false
    })
    Howler.volume(1)
    return {
      markerAudio,
      huangPuAudio
    }
  }
  //全局加入 图片资源
  addLocalImageToScene() {
    this.scene.image.addImage('head', ImageEnum.head)
    this.scene.image.addImage('green-point', ImageEnum['green-point'])
    this.scene.image.addImage('yellow-point', ImageEnum['yellow-point'])
  }
}
