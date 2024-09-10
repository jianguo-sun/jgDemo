import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import pinia from './store/index'
import router from './router/router'
import { message } from 'ant-design-vue';

// import VueKonva from 'vue-konva'
// import { Graph } from '@antv/x6'
// window.__x6_instances__ = []

// const graph = new Graph({ ...blablabla })

// window.__x6_instances__.push(graph)
const app = createApp(App)
app.config.globalProperties.$message = message;
// app.use(VueKonva);
app.use(pinia)
app.use(router)
app.mount('#app')
