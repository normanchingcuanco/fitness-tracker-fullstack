<template>
  <div class="container">
    <h2>Login</h2>

    <form @submit.prevent="loginUser">
      <div>
        <input
          type="email"
          placeholder="Email"
          v-model="email"
          required
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          required
        />
      </div>

      <button type="submit">Login</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      message: ''
    }
  },
  methods: {
    async loginUser() {
      try {
        const response = await fetch(
          'https://fitness-tracker-api-zjx6.onrender.com/users/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            })
          }
        )

        const data = await response.json()

        if (response.ok) {
          // store token
          localStorage.setItem('token', data.access)

          this.message = 'Login successful!'

          // redirect to workouts
          this.$router.push('/workouts')

        } else {
          this.message = data.message || 'Login failed.'
        }

      } catch (error) {
        this.message = 'Server error.'
      }
    }
  }
}
</script>