<template>
  <div class="app-container">

    <!-- Header -->
    <header class="app-header">
      <div class="logo-section">
        <img src="@/assets/logo_momentum.png" alt="Momentum Logo" />
        <h1>Momentum</h1>
      </div>

      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </header>

    <!-- Stats -->
    <div class="stats-container">
      <div class="stat-card">
        <p>Total</p>
        <h3>{{ workouts.length }}</h3>
      </div>
      <div class="stat-card">
        <p>Completed</p>
        <h3>{{ completedCount }}</h3>
      </div>
      <div class="stat-card">
        <p>Pending</p>
        <h3>{{ pendingCount }}</h3>
      </div>
    </div>

    <!-- Workout Cards -->
    <div class="card-container">
      <div
        v-for="workout in workouts"
        :key="workout._id"
        class="workout-card"
      >
        <div class="card-top">
          <h3>{{ workout.name }}</h3>

          <span
            :class="[
              'status-badge',
              workout.status === 'completed'
                ? 'badge-completed'
                : 'badge-pending'
            ]"
          >
            {{ workout.status }}
          </span>
        </div>

        <p class="duration">{{ workout.duration }}</p>
        <p class="date">{{ formatDate(workout.dateAdded) }}</p>

        <div class="card-actions">
          <button class="edit-btn" @click="openEditModal(workout)">
            Edit
          </button>
          <button class="delete-btn" @click="deleteWorkout(workout._id)">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- FAB -->
    <button id="addWorkout" class="fab" @click="openAddModal">
      +
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditing ? 'Update Workout' : 'Add Workout' }}</h2>

        <form @submit.prevent="isEditing ? updateWorkout() : addWorkout()">
          <input v-model="name" placeholder="Workout Name" required />
          <input v-model="duration" placeholder="Duration" required />

          <select v-model="status" required>
            <option disabled value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div class="modal-actions">
            <button type="submit" class="primary-btn">
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
            <button type="button" @click="closeModal" class="secondary-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      workouts: [],
      showModal: false,
      isEditing: false,
      editId: null,
      name: '',
      duration: '',
      status: ''
    }
  },

  computed: {
    completedCount() {
      return this.workouts.filter(w => w.status === 'completed').length
    },
    pendingCount() {
      return this.workouts.filter(w => w.status === 'pending').length
    }
  },

  mounted() {
    this.fetchWorkouts()
  },

  methods: {

    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    async fetchWorkouts() {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://fitness-tracker-api-zjx6.onrender.com/workouts/getMyWorkouts',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = await response.json()
      this.workouts = data
    },

    openAddModal() {
      this.isEditing = false
      this.editId = null
      this.name = ''
      this.duration = ''
      this.status = ''
      this.showModal = true
    },

    openEditModal(workout) {
      this.isEditing = true
      this.editId = workout._id
      this.name = workout.name
      this.duration = workout.duration
      this.status = workout.status
      this.showModal = true
    },

    async addWorkout() {
      const token = localStorage.getItem('token')

      await fetch(
        'https://fitness-tracker-api-zjx6.onrender.com/workouts/addWorkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: this.name,
            duration: this.duration,
            status: this.status
          })
        }
      )

      this.closeModal()
      this.fetchWorkouts()
    },

    async updateWorkout() {
      const token = localStorage.getItem('token')

      await fetch(
        `https://fitness-tracker-api-zjx6.onrender.com/workouts/updateWorkout/${this.editId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: this.name,
            duration: this.duration,
            status: this.status
          })
        }
      )

      this.closeModal()
      this.fetchWorkouts()
    },

    async deleteWorkout(id) {
      const token = localStorage.getItem('token')

      const confirmDelete = confirm('Delete this workout?')
      if (!confirmDelete) return

      await fetch(
        `https://fitness-tracker-api-zjx6.onrender.com/workouts/deleteWorkout/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      this.fetchWorkouts()
    },

    closeModal() {
      this.showModal = false
      this.isEditing = false
      this.editId = null
    }

  }
}
</script>

<style scoped>

/* ADD BELOW EXISTING STYLE */

.card-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}

.edit-btn {
  flex: 1;
  background: #2F5D50;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
}

.delete-btn {
  flex: 1;
  background: #D66A6A;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
}

</style>