
<script setup lang="ts">
import {ref} from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
}

type TaskStatus = 'open' | 'in_progress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
}

const {
  data: users,
  refresh: refreshUsers
} = await useFetch<User[]>('/api/v1/users', {
  default: () => []
})

const {
  data: tasks,
  refresh: refreshTasks
} = await useFetch<Task[]>('/api/v1/tasks', {
  default: () => []
})

const userForm = ref({name: '', email: ''});
const taskForm = ref({ title: '', description: '', userId: ''});
const errorMessages = ref<string[]>([]);
const isSubmitting = ref(false);

function handleApiError(err: any){
  if (err?.data?.messages && Array.isArray(err.data.messages)) {
    errorMessages.value = err.data.messages;
  } else {
    errorMessages.value = [err?.message || 'Failed to connect to API'];
  }
}

async function createUser() {
  errorMessages.value = [];
  isSubmitting.value = true;
  try {
    const newUser = await $fetch<User>('/api/v1/users', {
      method: 'POST',
      body: userForm.value
    });
    userForm.value = { name: '', email: ''};
    await refreshUsers();
    taskForm.value.userId = newUser.id;
  } catch ( err ) {
    handleApiError(err);
  } finally {
    isSubmitting.value = false;
  }
}

async function createTask() {
  errorMessages.value = [];
  isSubmitting.value = true;
  try {
    await $fetch('/api/v1/tasks', {
      method: 'POST',
      body: taskForm.value
    });
    taskForm.value.title = '';
    taskForm.value.description = '';
    await refreshTasks();
  } catch (err) {
    handleApiError(err);
  } finally {
    isSubmitting.value = false;
  }
}

async function updateStatus( taskId: string, status : TaskStatus ) {
  errorMessages.value = [];
  try {
    await $fetch(`/api/v1/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: { status }
    });
    await refreshTasks();
  } catch (err) {
    handleApiError(err);
  }
}

async function deleteTask( taskId: string) {
  errorMessages.value = [];
  try {
    await $fetch(`/api/v1/tasks/${taskId}`,{
      method: 'DELETE',
    });
    await refreshTasks();
  } catch (err) {
    handleApiError(err);
  }
}

</script>

<template>
  <main style="max-width: 820px; margin: 2rem auto; font-family: system-ui, sans-serif; padding: 0 1rem;">
    <h1>TaskFlow — NestJS + Nuxt 3 (Week 1)</h1>

    <!-- Standardized Error Banner from NestJS AllExceptionsFilter -->
    <div
      v-if="errorMessages.length > 0"
      style="background: #fee2e2; border: 1px solid #ef4444; color: #991b1b; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;"
    >
      <strong>API Error:</strong>
      <ul style="margin: 0.5rem 0 0 1.2rem; padding: 0;">
        <li v-for="(msg, idx) in errorMessages" :key="idx">{{ msg }}</li>
      </ul>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
      <!-- Step 1: Create User Card -->
      <section style="border: 1px solid #e5e7eb; padding: 1rem; border-radius: 8px;">
        <h2 style="margin-top: 0; font-size: 1.1rem;">1. Create User</h2>
        <form @submit.prevent="createUser" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <input v-model="userForm.name" placeholder="Name (e.g. Joof)" style="padding: 0.5rem;" />
          <input v-model="userForm.email" placeholder="Email (e.g. joof@example.com)" style="padding: 0.5rem;" />
          <button type="submit" :disabled="isSubmitting" style="padding: 0.5rem; cursor: pointer;">
            Add User ({{ users.length }})
          </button>
        </form>
      </section>

      <!-- Step 2: Create Task Card -->
      <section style="border: 1px solid #e5e7eb; padding: 1rem; border-radius: 8px;">
        <h2 style="margin-top: 0; font-size: 1.1rem;">2. Create Task</h2>
        <form @submit.prevent="createTask" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <input v-model="taskForm.title" placeholder="Task title (min 3 chars)" style="padding: 0.5rem;" />
          <input v-model="taskForm.description" placeholder="Description" style="padding: 0.5rem;" />
          <select v-model="taskForm.userId" style="padding: 0.5rem;">
            <option value="">-- Select Assigned User --</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
              {{ u.name }} ({{ u.email }})
            </option>
          </select>
          <button type="submit" :disabled="isSubmitting" style="padding: 0.5rem; cursor: pointer;">
            Create Task
          </button>
        </form>
      </section>
    </div>

    <!-- Step 3: Task List & Status Controls -->
    <section>
      <h2>Tasks ({{ tasks.length }})</h2>
      <p v-if="tasks.length === 0" style="color: #6b7280;">No tasks yet. Create a user and assign a task above!</p>

      <div
        v-for="task in tasks"
        :key="task.id"
        style="border: 1px solid #d1d5db; padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;"
      >
        <div>
          <strong>{{ task.title }}</strong>
          <span style="margin-left: 0.5rem; font-size: 0.8rem; padding: 0.2rem 0.5rem; background: #f3f4f6; border-radius: 4px;">
            {{ task.status }}
          </span>
          <p style="margin: 0.25rem 0 0; color: #4b5563; font-size: 0.9rem;">{{ task.description }}</p>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button @click="updateStatus(task.id, 'open')">OPEN</button>
          <button @click="updateStatus(task.id, 'in_progress')">IN_PROGRESS</button>
          <button @click="updateStatus(task.id, 'done')">DONE</button>
          <button @click="deleteTask(task.id)" style="color: #dc2626;">Delete</button>
        </div>
      </div>
    </section>
  </main>
</template>