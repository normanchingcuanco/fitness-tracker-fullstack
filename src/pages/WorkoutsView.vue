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

    <!-- Cards -->
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

        <p class="duration">Duration: {{ workout.duration }}</p>
        <p class="date">{{ formatDate(workout.dateAdded) }}</p>

        <div class="card-actions">

          <!-- Edit -->
          <button @click="openEditModal(workout)" class="edit-btn">
            Edit
          </button>

          <!-- Complete (only if pending) -->
          <button
            v-if="workout.status !== 'completed'"
            @click="completeWorkout(workout._id)"
            class="complete-btn"
          >
            Complete
          </button>

          <!-- Delete -->
          <button @click="deleteWorkout(workout._id)" class="delete-btn">
            Delete
          </button>

        </div>

      </div>
    </div>

    <!-- Add Button -->
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
      duration: ''
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
      if (!date) return ''
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
      this.showModal = true
    },

    openEditModal(workout) {
      this.isEditing = true
      this.editId = workout._id
      this.name = workout.name
      this.duration = workout.duration
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
            duration: this.duration
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
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: this.name,
            duration: this.duration
          })
        }
      )

      this.closeModal()
      this.fetchWorkouts()
    },

    async completeWorkout(id) {
      const token = localStorage.getItem('token')

      await fetch(
        `https://fitness-tracker-api-zjx6.onrender.com/workouts/completeWorkoutStatus/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      this.fetchWorkouts()
    },

    async deleteWorkout(id) {
      const token = localStorage.getItem('token')

      if (!confirm('Delete this workout?')) return

      await fetch(
        `https://fitness-tracker-api-zjx6.onrender.com/workouts/deleteWorkout/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
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

.app-container {
  min-height: 100vh;
  background: #EFE8DD;
}

/* HEADER */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-section img {
  width: 110px;
}

.logo-section h1 {
  font-size: 24px;
  color: #2F5D50;
  margin: 0;
}

.logout-btn {
  background: #C75C5C;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}

/* CARDS */
.card-container {
  padding: 20px;
  display: grid;
  gap: 18px;
}

.workout-card {
  background: white;
  padding: 18px;
  border-radius: 18px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: white;
}

.badge-completed {
  background: #2F5D50;
}

.badge-pending {
  background: #C75C5C;
}

.card-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn,
.complete-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background: #2F5D50;
  color: white;
}

.complete-btn {
  background: #3B7DDD;
  color: white;
}

.delete-btn {
  background: #C75C5C;
  color: white;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #2F5D50;
  color: white;
  border: none;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  font-size: 30px;
  cursor: pointer;
}

/* MODAL */
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
  padding: 24px;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
}

.modal input {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.primary-btn {
  flex: 1;
  background: #2F5D50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
}

.secondary-btn {
  flex: 1;
  background: #ddd;
  border: none;
  padding: 10px;
  border-radius: 10px;
}

</style>