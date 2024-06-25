// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'flatpickr/dist/flatpickr.min.css';

createApp(App).use(router).mount('#app');
