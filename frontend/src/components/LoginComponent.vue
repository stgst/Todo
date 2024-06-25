<!-- src/components/Login.vue -->
<template>
  <div class="bg-gray-50 p-6 flex items-center justify-center min-h-screen">
    <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">登入</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">電子郵件</label>
          <input v-model="email" type="email" id="email" class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="輸入電子郵件">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">密碼</label>
          <input v-model="password" type="password" id="password" class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="輸入密碼">
        </div>
        <div v-if="error" class="mb-4 text-red-600">{{ error }}</div>
        <button type="submit" class="w-full bg-indigo-600 text-white p-3 rounded-md shadow-sm hover:bg-indigo-700">登入</button>
      </form>
      <button @click="register" class="mt-4 w-full bg-green-600 text-white p-3 rounded-md shadow-sm hover:bg-green-700">註冊</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        var response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password
        }, { withCredentials: true });
        
        localStorage.setItem('user', JSON.stringify(response.data));
        this.$router.push('/');
      } catch (error) {
        console.error('Error login:', error.response.data.error);
        this.error = '登入失敗，請檢查您的電子郵件和密碼。';
      }
    },
    async register() {
      try {
        await axios.post('http://localhost:3000/register', {
          email: this.email,
          password: this.password
        });

        this.login();
      } catch (error) {
        console.error('Error register:', error.response.data.error);
        this.error = '註冊失敗，請重試。';
      }
    }
  }
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
