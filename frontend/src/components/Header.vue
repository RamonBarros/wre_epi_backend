<template>
    <section class="header">
      <RouterLink to="/">
      <div class="header__logo">
        <img src="../assets/Logomarca.png" alt="Imagem do logo da empresa" />
        <div class="logo__title">
          <h1>wre epi</h1>
          <h3>A vida é sua, a segurança é nossa</h3>
        </div>
      </div>
    </RouterLink>
  
      <div class="header__searchbar">
        <input class="searchbar" type="text" placeholder="Pesquisar produtos" />
        <button class="searchbar-button">
          <img src="../assets/lupa.png" alt="Ícone de busca(lupa)" />
        </button>
      </div>
  
      <div class="header__cart">
        <div class="cart-info">
          <p>Bem-vindo, <span>Usuário</span></p>
          <div class="cart-info-email">
            <p>wreepi@gmail.com</p>
            <a href @click.prevent="logout">Sair</a>
          </div>
        </div>
  
        <router-link to="/cart">
          <button class="cart-button" >
            <img src="../assets/Vector.svg" alt="" />
            <p>0</p>
          </button>
        </router-link>
      </div>
    </section>
  </template>
  
  <script>
    import {userKey} from '@/global'
    
  export default {
    name: "HeaderComponent",
    methods:{
      logout(){
        localStorage.removeItem(userKey)
        this.$store.commit('setUser',null)
        this.$router.push('/login')
      }
    }
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 9rem;
  
    background-color: #3a9e3e;
    font-family: 'Lato';
  }
  
  .header__logo {
    display: flex;
  
    margin-left: 7.2rem;
  
    padding-top: 1.9rem;
  
    /* border: 1px solid green; */
  }
  
  .header__logo img {
    width: 4.6rem;
    height: 4.3rem;
  }
  
  .logo__title {
    color: #ffffff;
    margin-left: 1.5rem;
  
    padding-top: 0.8rem;
    /* font-size: 1.4rem; */
    font-size: clamp(1rem, 1.2rem, 1.6rem);
  }
  
  .logo__title h1 {
    text-transform: uppercase;
    text-align: left;
    font-size: clamp(1em, 1.2em, 1.6em);
  }
  
  .header__searchbar {
    display: flex;
    align-items: center;
    width: 40%;
    /* border: 1px solid red; */
  }
  
  .searchbar {
    width: 100%;
    /* max-width: 44.7rem; */
    height: 3.5rem;
  
    border: none;
    border-radius: 0.5rem 0 0 0.5rem;
  
    padding: 0.8rem 1.2rem;
  
    font-size: 1.6rem;
  }
  
  .searchbar-button {
    width: 4.3rem;
    height: 3.5rem;
  
    background: linear-gradient(180deg, #efefef 0%, #a0a0a0 100%);
  
    border: none;
    border-radius: 0 0.5rem 0.5rem 0;
  
    display: flex;
    justify-content: center;
    align-items: center;
  
    cursor: pointer;
  }
  
  .header__cart {
    /* width: 29.0rem; */
  
    /* border: 1px solid blue; */
    width: 20%;
    height: 6.3rem;
  
    background: #318234;
    box-shadow: 0 0 0.4rem 0.4rem rgba(0, 0, 0, 0.25);
    border-radius: 0 0 0 2.5rem;
  
    color: #ffffff;
    font-size: 1.6rem;
  
    padding: 1.1rem 2.7rem 0.7rem;
  
    display: flex;
    justify-content: space-between;
  }
  
  .cart-info {
    width: 15.3rem;
  
    text-align: left;
  }
  
  .cart-info span {
    font-weight: bold;
  }
  
  .cart-info-email {
    display: flex;
  }
  
  .cart-info-email p:first-child {
    width: 10.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .cart-info-email p:last-child {
    text-decoration: underline;
    margin-left: 0.8rem;
  }
  
  .cart-button {
    width: 5.778rem;
    height: 4.8rem;
  
    background: #1d531f;
    border-radius: 1rem;
  
    border: none;
    position: relative;

    cursor: pointer;
  }
  
  .cart-button p {
    top: 0.2rem;
    right: 0.6rem;
  
    width: 1.422rem;
    height: 1.6rem;
    background: #0a260b;
    border-radius: 0.5rem;
  
    color: #ffffff;
    font-weight: 600;
    font-size: 1.4rem;
    line-height: 1.9rem;
    text-align: center;
    position: absolute;
  }
  
  @media (max-width: 1024px) {
    .header__cart {
      padding: 1.1rem 1.4rem 0.7rem;
  
      font-size: 1.2rem;
    }
  
    .cart-info-email p:first-child {
      width: 7rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  
    .cart-button {
      width: 5rem;
      height: 4rem;
  
      background: #1d531f;
      border-radius: 1rem;
  
      border: none;
      position: relative;
    }
  
    .cart-button img {
      width: 3rem;
    }
  
    .cart-button p {
      right: 0.4rem;
    }
  
    h3 {
      font-size: 1.2rem;
    }
  }
  
  @media (max-width: 768px) {
    .cart-info-email p:first-child {
      width: 5.5rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .cart-button img {
      width: 2rem;
    }
  
    p {
      font-size: 1rem;
    }
  
    .header__logo img {
      width: 4.5rem;
      height: 4rem;
    }
  
    h3 {
      font-size: 0.9rem;
    }
  }
  </style>
  