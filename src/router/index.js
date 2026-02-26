import { createRouter, createWebHistory } from 'vue-router'

import RegisterView from '../pages/RegisterView.vue'
import LoginView from '../pages/LoginView.vue'
import WorkoutsView from '../pages/WorkoutsView.vue'

const routes = [
  { path: '/register', component: RegisterView },
  { path: '/login', component: LoginView },
  { 
    path: '/workouts', 
    component: WorkoutsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router