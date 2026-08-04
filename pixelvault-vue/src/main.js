
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'nes.css/css/nes.min.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

