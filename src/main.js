import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: defineAsyncComponent(() => import('./views/HomeComponent.vue'))
        },
        {
            path: '/preferences',
            name: 'Preferences',
            component: defineAsyncComponent(() => import('./views/PreferencesComponent.vue'))
        }
    ]
})

app.use(router).mount('#app')