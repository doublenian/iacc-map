import '../styles/index.scss'
import L7Map from './l7Map'
import OrgData from '../data/org-data'
import './domEventsHandler'
let orgList = OrgData.map((c) => {
  return {
    lng: c.address.lng || '',
    lat: c.address.lat || '',
    name: c.name,
    coord: [c.address.lng, c.address.lat],
  }
}).filter(
  (c) => c.lng && c.lat && c.lng !== 'undefined' && c.lat !== 'undefined'
)
const goNext = (hasStartup) => {
  new L7Map(orgList, hasStartup)
}
document.querySelector('.startup-btn').addEventListener('click', function () {
  document.querySelector('.container').remove()
  goNext(true)
})
document
  .querySelector('.no-startup-btn')
  .addEventListener('click', function () {
    goNext(false)
    document.querySelector('.startup-mask').remove()
  })
