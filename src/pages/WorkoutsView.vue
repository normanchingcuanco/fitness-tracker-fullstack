<template>
  <div>
    <h1>Workouts Page</h1>

    <!-- Add Workout Button -->
    <button id="addWorkout" @click="showModal = true">
      Add Workout
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Add Workout</h2>

        <form @submit.prevent="addWorkout">
          <input
            type="text"
            placeholder="Workout Name"
            v-model="name"
            required
          />

          <input
            type="text"
            placeholder="Duration (e.g. 30 mins)"
            v-model="duration"
            required
          />

          <select v-model="status" required>
            <option disabled value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div class="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Workout Cards -->
    <div v-if="workouts.length === 0">
      <p>No workouts found.</p>
    </div>

    <div v-else>
      <div
        v-for="workout in workouts"
        :key="workout._id"
        class="workout-card"
      >
        <h3>{{ workout.name }}</h3>
        <p>Duration: {{ workout.duration }}</p>
        <p>Status: {{ workout.status }}</p>
        <p>Date Added: {{ workout.dateAdded }}</p>
      </div>
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workouts: [],
      message: '',
      showModal: false,
      name: '',
      duration: '',
      status: ''
    }
  },

  mounted() {
    this.fetchWorkouts()
  },

  methods: {
    async fetchWorkouts() {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch(
          'https://fitness-tracker-api-zjx6.onrender.com/workouts/getMyWorkouts',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          this.message = errorData.message || 'Failed to fetch workouts.'
          return
        }

        const data = await response.json()
        this.workouts = data

      } catch (error) {
        this.message = 'Server error.'
      }
    },

    async addWorkout() {
      const token = localStorage.getItem('token')

      try {
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
              duration: this.duration,   // ✅ string (schema expects string)
              status: this.status        // already lowercase
            })
          }
        )

        if (response.status === 204 || response.ok) {
          this.closeModal()
          this.fetchWorkouts()
        } else {
          const errorData = await response.json()
          this.message = errorData.message || 'Failed to add workout.'
        }

      } catch (error) {
        this.message = 'Server error.'
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

<style>
.workout-card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  width: 300px;
}

.modal-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>