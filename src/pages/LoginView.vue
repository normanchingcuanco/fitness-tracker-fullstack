<template>
  <div class="auth-container">
    <img src="@/assets/logo_momentum.png" class="auth-logo" />
    <h1>Momentum</h1>

    <form @submit.prevent="loginUser" class="auth-card">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <router-link to="/register">Create account</router-link>
    </form>

    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return { email:'', password:'', message:'' }
  },
  methods:{
    async loginUser(){
      const response = await fetch(
        'https://fitness-tracker-api-zjx6.onrender.com/users/login',
        {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email:this.email,password:this.password})
        }
      )
      const data = await response.json()
      if(response.ok){
        localStorage.setItem('token',data.access)
        this.$router.push('/workouts')
      } else {
        this.message='Login failed'
      }
    }
  }
}
</script>

<style scoped>
.auth-container{
  background:#EFE8DD;
  min-height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
}

.auth-logo {
  width: 150px;          /* Bigger logo */
  margin-bottom: 18px;
}

.auth-card{
  background:white;
  padding:30px;
  border-radius:20px;
  display:flex;
  flex-direction:column;
  gap:15px;
  width:90%;
  max-width:350px;
  box-shadow:0 6px 20px rgba(0,0,0,0.05);
}

.auth-card input{
  padding:10px;
  border-radius:10px;
  border:1px solid #ddd;
}

.auth-card button{
  background:#2F5D50;
  color:white;
  padding:10px;
  border:none;
  border-radius:10px;
}
</style>