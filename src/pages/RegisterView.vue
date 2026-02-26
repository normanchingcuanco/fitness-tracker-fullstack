<template>
  <div class="auth-container">
    <div class="brand-section">
      <img src="@/assets/logo_momentum.png" class="auth-logo" />
      <h1>Momentum</h1>
    </div>

    <form @submit.prevent="registerUser" class="auth-card">
      <input
        type="email"
        placeholder="Email"
        v-model="email"
        required
      />

      <input
        type="password"
        placeholder="Password"
        v-model="password"
        required
      />

      <button type="submit">Create Account</button>

      <router-link to="/login" class="auth-link">
        Already have an account?
      </router-link>
    </form>

    <p class="message">{{ message }}</p>
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
      const response = await fetch(
        'https://fitness-tracker-api-zjx6.onrender.com/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        this.$router.push('/login')
      } else {
        this.message = data.message || 'Registration failed.'
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  background: #EFE8DD;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Brand Section */
.brand-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.auth-logo {
  width: 150px;          /* Match login page */
  margin-bottom: 18px;
}

.brand-section h1 {
  font-size: 28px;
  font-weight: 600;
  color: #2F5D50;
}

/* Card */
.auth-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
}

.auth-card input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.auth-card button {
  background: #2F5D50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease;
}

.auth-card button:hover {
  opacity: 0.9;
}

.auth-link {
  text-align: center;
  font-size: 14px;
  color: #2F5D50;
  text-decoration: none;
}

.message {
  margin-top: 15px;
  color: #B00020;
}
</style>