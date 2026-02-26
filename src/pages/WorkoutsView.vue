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

    <!-- Stats Summary -->
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
      </div>
    </div>

    <!-- Floating Add Button -->
    <button id="addWorkout" class="fab" @click="showModal = true">
      +
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Add Workout</h2>

        <form @submit.prevent="addWorkout">
          <input v-model="name" placeholder="Workout Name" required />
          <input v-model="duration" placeholder="Duration" required />

          <select v-model="status" required>
            <option disabled value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div class="modal-actions">
            <button type="submit" class="primary-btn">Save</button>
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

    async addWorkout() {
      const token = localStorage.getItem('token')

      const response = await fetch(
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

      if (response.ok) {
        this.closeModal()
        this.fetchWorkouts()
      }
    },

    closeModal() {
      this.showModal = false
      this.name = ''
      this.duration = ''
      this.status = ''
    }
  }
}
</script>

<style scoped>
.app-container {
  background: #EFE8DD;
  min-height: 100vh;
  padding: 30px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo-section img {
  width: 150px;          /* 🔥 Increased size */
}

.logo-section h1 {
  font-size: 30px;
  font-weight: 600;
  color: #2F5D50;
}

.logout-btn {
  border: 1px solid #2F5D50;
  background: transparent;
  padding: 8px 18px;
  border-radius: 24px;
  color: #2F5D50;
  cursor: pointer;
  transition: 0.2s ease;
}

.logout-btn:hover {
  background: #2F5D50;
  color: white;
}

/* Stats */
.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  padding: 18px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

.stat-card h3 {
  color: #2F5D50;
}

/* Cards */
.card-container {
  display: grid;
  gap: 18px;
}

.workout-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  transition: transform 0.2s ease;
}

.workout-card:hover {
  transform: translateY(-4px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  text-transform: capitalize;
}

.badge-completed {
  background: #2F5D50;
  color: white;
}

.badge-pending {
  background: #D6C3B3;
}

.duration {
  margin-top: 10px;
  font-size: 15px;
}

.date {
  font-size: 12px;
  color: #777;
  margin-top: 6px;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #2F5D50;
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 30px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.2);
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 28px;
  border-radius: 22px;
  width: 90%;
  max-width: 420px;
}

.modal input,
.modal select {
  width: 100%;
  padding: 12px;
  margin-top: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.primary-btn {
  background: #2F5D50;
  color: white;
  border: none;
  padding: 12px;
  flex: 1;
  border-radius: 12px;
}

.secondary-btn {
  background: #E5E5E5;
  border: none;
  padding: 12px;
  flex: 1;
  border-radius: 12px;
}

@media (min-width: 768px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>