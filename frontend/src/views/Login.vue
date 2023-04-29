<template>
    <div class="row" style="width: 100%; justify-content: center">
        <section class="whiteBox row">
            <div class="col" style="width: 100%; margin: 3rem">
                <label class="lblTitle">Login:</label>
                <div style="margin: 2rem 0">
                    <div class="col" style="padding: 0 2rem">
                        <label class="lblInput">E-mail:</label>
                        <input id="email" type="text" class="inputText" placeholder="Digite seu e-mail" v-model="user.email"/>
                    </div>

                    <div class="col" style="padding: 0 2rem">
                        <label class="lblInput">Senha:</label>
                        <input id="senha" type="password" class="inputText" placeholder="Digite sua senha" v-model="user.password"/>
                    </div>
                </div>

                <div class="row" style="justify-content: center">
                    <button @click="signin">Login</button>

                    <button @click="reset">Cancelar</button>
                </div>

                <div class="lblTextInf">
                    <span>Não possui uma conta? </span>
                    <router-link to="/cadastro">
                    <a href="">Cadastre-se</a>
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>
  
<script>
    import { baseApiUrl,userKey } from '@/global'
    import axios from 'axios'
  export default {
    mounted() {
        },
    data() {
        return {
            user:{}
        }
      },
      methods:{
        reset(){
              this.user = {}
        },
        signin(){
            const url = `${baseApiUrl}/signin`
            axios.post(url, this.user)
                .then(res=>{
                    this.$store.commit('setUser',res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    this.$router.push('/')
                })
                .catch((e=>{
                    alert(e.response.data)
                }))
        }
      }

  }
</script>
  
<style scoped>
    section {
        margin: 5rem;
        width: 100%;
        max-width: 50rem;
    }
    button {
        color: white;
        font-size: 2rem;
        font-family: Lato;
        background-color: #0a260b;
        border: none;
        margin: 1rem;
        border-radius: 0.5rem;
        padding: 0.4rem 2rem 0.7rem 2rem;
        cursor: pointer;
        transition: 0.05s ease-in-out;
    }
    button:hover {
        background-color: #2A732A;
    }
    .lblInput {
        text-align: left;
        font-family: 'Inter', sans-serif;
        font-size: 1.2rem;
        margin: 1rem 0 0.5rem 0;
        color: #515151;
    }
    .lblTitle {
        font-family: 'Inter', sans-serif;
        font-size: 2.4rem;
        font-weight: bold;
        margin: 0 0 0.5rem 0;
        color: #0A260B;
    }
    .lblTextInf {
        margin: 2rem 0;
        font-family: 'Inter', sans-serif;
        font-size: 1.6rem;
        color: #414141;
    }
</style>