import Home from '../layouts/Home.vue'
import ContactInfo from '../views/ContactInfo.vue'

export const routes = [
    { path: '/', component: Home },
    { path: '/ContactInfo/:contact_id', component: ContactInfo }
]