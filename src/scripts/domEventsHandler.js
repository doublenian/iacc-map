//Dom events handler
import EventBus from '~/utils/eventbus'
const emitter = EventBus.getInstance().emitter
window.simulateAlarm = () => {
  emitter.emit('simulateAlarm')
}
window.goBack = () => {
  emitter.emit('goback')
}

window.turnOnHeatMap = () => {
  emitter.emit('turnOnHeatMap')
}

window.displayAvatar = () => {
  emitter.emit('displayAvatar')
}

window.closeMonitor = () => {
  emitter.emit('closeMonitor')
}
