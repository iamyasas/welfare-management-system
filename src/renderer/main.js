import Vue from 'vue'

import 'bulma/css/bulma.css'
import 'bulma-calendar/dist/css/bulma-calendar.min.css'

//import 'bulma-calendar/dist/js/bulma-calendar.min.js'
import '@fortawesome/fontawesome-free/js/all.js'
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
