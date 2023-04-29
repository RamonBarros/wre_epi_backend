import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
    setUser(state,user){
      state.user = user
      if(user){
        axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
      } else{
        delete axios.defaults.headers.common['Authorization']
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
