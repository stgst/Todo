<template>
  <div class="bg-gray-50 p-6 flex items-center justify-center min-h-screen">
    <div class="max-w-6xl w-full bg-white p-8 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">待辦事項</h1>
        <button @click="logout" class="bg-red-600 text-white p-2 rounded-md shadow-sm hover:bg-red-700">登出</button>
      </div>
      <div class="flex">
        
        <div class="w-1/2 pr-4">
          <form @submit.prevent="addTask" class="mb-6">
            <div class="mb-4">
              <label for="task" class="block text-sm font-medium text-gray-700">事項</label>
              <input v-model="newTask.task" type="text" id="task" class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="輸入待辦事項">
            </div>
            <div class="mb-4">
              <label for="deadline" class="block text-sm font-medium text-gray-700">截止時間</label>
              <input v-model="newTask.deadline" type="text" id="deadline" class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flatpickr" placeholder="選擇截止時間">
            </div>
            <div class="mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700">類別</label>
              <select v-model="newTask.category" id="category" class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="工作">工作</option>
                <option value="個人">個人</option>
                <option value="家庭">家庭</option>
              </select>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white p-3 rounded-md shadow-sm hover:bg-indigo-700">新增事項</button>
          </form>
        </div>
        
        <div class="w-1/2 pl-4">
          <div class="mb-4">
            <label for="filter" class="block text-sm font-medium text-gray-700">顯示類別</label>
            <select v-model="filterCategory" id="filter" class="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">全部</option>
              <option value="工作">工作</option>
              <option value="個人">個人</option>
              <option value="家庭">家庭</option>
            </select>
          </div>
          <div v-for="task in filteredTasks" :key="task.id" class="task-item p-4 mb-4 bg-gray-100 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold">{{ task.task }}</h2>
            <p class="text-gray-600">{{ task.deadline }}</p>
            <p class="text-gray-600">{{ task.category }}</p>
            <button @click="deleteTask(task.id)" class="bg-red-600 text-white p-2 rounded-md shadow-sm hover:bg-red-700">刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

export default {
  data() {
    return {
      newTask: {
        task: '',
        deadline: '',
        category: '工作'
      },
      tasks: [],
      filterCategory: ''
    };
  },
  mounted() {
    flatpickr('.flatpickr', {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });
    this.fetchTasks();
  },
  computed: {
    filteredTasks() {
      if (this.filterCategory === '') {
        return this.tasks;
      }
      return this.tasks.filter(task => task.category === this.filterCategory);
    }
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:3000/todos', {
          withCredentials: true
        });
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error.response.data.error);
      }
    },
    async addTask() {
      try {
        const response = await axios.post('http://localhost:3000/todos', this.newTask, {
          withCredentials: true
        });
        this.tasks.push(response.data);
        this.newTask.task = '';
        this.newTask.deadline = '';
        this.newTask.category = '工作';
      } catch (error) {
        console.error('Error adding task:', error.response.data.error);
      }
    },
    async deleteTask(id) {
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`, {
          withCredentials: true
        });
        this.tasks = this.tasks.filter(task => task.id !== id);
      } catch (error) {
        console.error('Error delete task:', error.response.data.error);
      }
    },
    async logout() {
      try {
        await axios.post('http://localhost:3000/logout', { withCredentials: true });
        localStorage.removeItem('user');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error logout:', error.response.data.error);
      }
    }
  }
};
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
.task-item {
  transition: transform 0.3s, box-shadow 0.3s;
}
.task-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
</style>
