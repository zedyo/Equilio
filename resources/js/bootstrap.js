/**
 * axios als globaler HTTP-Client für die Redux-Slices.
 * (Die App nutzt React-Bootstrap für UI – das frühere jQuery/Popper/
 * Bootstrap-JS-Setup wurde entfernt, da nirgends mehr verwendet.)
 */
import axios from 'axios'

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
