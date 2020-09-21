const EventEmitter = require('eventemitter3')
export default class EventBus {
  constructor() {
    this.emitter = new EventEmitter()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new EventBus()
    }
    return this.instance
  }
}
