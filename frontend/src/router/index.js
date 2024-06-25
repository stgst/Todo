import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginComponent.vue';
import Todo from '../components/TodoComponent.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Todo }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user');
  if (to.path !== '/login' && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
