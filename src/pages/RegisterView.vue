<template>
  <div class="container">
    <h2>Register</h2>

    <form @submit.prevent="registerUser">
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

      <button type="submit">Register</button>
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
    async registerUser() {
      try {
        const response = await fetch(
          'https://fitness-tracker-api-zjx6.onrender.com/users/register',
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
          this.message = 'Registration successful!'
        } else {
          this.message = data.message || 'Registration failed.'
        }

      } catch (error) {
        this.message = 'Server error.'
      }
    }
  }
}
</script>