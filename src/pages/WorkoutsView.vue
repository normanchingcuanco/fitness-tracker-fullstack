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

  /* ===============================
     GLOBAL FONT
  ================================ */
  * {
    font-family: 'Poppins', sans-serif;
  }

  /* ===============================
     CONTAINER
  ================================ */
  .app-container {
    min-height: 100vh;
    background: #EFE8DD;
  }

  /* ===============================
     HEADER
  ================================ */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
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
    font-weight: 700;
    font-size: 22px;
    color: #2F5D50;
    letter-spacing: 0.5px;
  }

  .logout-btn {
    background: #2F5D50;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: 0.2s ease;
  }

  .logout-btn:hover {
    background: #244a40;
  }

  /* ===============================
     CARDS
  ================================ */
  .card-container {
    padding: 24px;
    display: grid;
    gap: 20px;
  }

  .workout-card {
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    transition: 0.2s ease;
  }

  .workout-card:hover {
    transform: translateY(-3px);
  }

  /* ===============================
     STATUS BADGES
  ================================ */
  .status-badge {
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    color: white;
    font-weight: 500;
  }

  .badge-completed {
    background: #3BA776; /* fresher green */
  }

  .badge-pending {
    background: #C75C5C;
  }

  /* ===============================
     BUTTONS
  ================================ */
  .card-actions {
    margin-top: 16px;
    display: flex;
    gap: 10px;
  }

  .edit-btn,
  .complete-btn,
  .delete-btn {
    flex: 1;
    padding: 10px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: 0.2s ease;
  }

  /* Edit */
  .edit-btn {
    background: #2F5D50;
    color: white;
  }

  .edit-btn:hover {
    background: #244a40;
  }

  /* Complete */
  .complete-btn {
    background: #3BA776;
    color: white;
  }

  .complete-btn:hover {
    background: #2f8f63;
  }

  /* Delete */
  .delete-btn {
    background: #E06B6B;
    color: white;
  }

  .delete-btn:hover {
    background: #c55353;
  }

  /* ===============================
     FAB
  ================================ */
  .fab {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #2F5D50;
    color: white;
    border: none;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    font-size: 28px;
    cursor: pointer;
    box-shadow: 0 12px 25px rgba(0,0,0,0.2);
    transition: 0.2s ease;
  }

  .fab:hover {
    transform: scale(1.08);
  }

  /* ===============================
     MODAL
  ================================ */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.35);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: white;
    padding: 28px;
    border-radius: 24px;
    width: 100%;
    max-width: 420px;
  }

  .modal input {
    width: 100%;
    padding: 12px;
    margin-top: 14px;
    border-radius: 12px;
    border: 1px solid #ddd;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .primary-btn {
    flex: 1;
    background: #2F5D50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 14px;
    font-weight: 500;
    transition: 0.2s ease;
  }

  .primary-btn:hover {
    background: #244a40;
  }

  .secondary-btn {
    flex: 1;
    background: #f1f1f1;
    border: none;
    padding: 12px;
    border-radius: 14px;
  }

</style>