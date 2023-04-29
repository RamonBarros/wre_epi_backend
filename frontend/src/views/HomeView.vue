<template>
   
  <main>
    <CarrouselComponent />
    <BotaoFaleConosco/>
    <section id="campoSessoes">
      <div class="sessao">
        <SessaoProdutos :nomeSessao="sessao1" :listaProdutos="produtos1"/>
        <br>
      </div>
      <div class="sessao">
        <SessaoProdutos :nomeSessao="sessao2" :listaProdutos="produtos2"/>
        <br>
      </div>
      <div class="sessao">
        <SessaoProdutos :nomeSessao="sessao3" :listaProdutos="produtos3"/>
        <br>
      </div>
    </section>
  </main>

</template>

<script>
import SessaoProdutos from '../components/sessaoProdutos.vue';
import BotaoFaleConosco from '@/components/BotaoFaleConosco.vue';
import HeaderComponent from "../components/Header.vue";
import CarrouselComponent from "../components/CarrouselComponent.vue";
import FooterComponent from "../components/footer.vue";
import { baseApiUrl } from '@/global';
import axios from "axios"
export default {
  components: { 
    SessaoProdutos, 
    BotaoFaleConosco,
    HeaderComponent,
    CarrouselComponent,
    FooterComponent,
  },
    data(){
      return{
        produtos1:[],        
        produtos2:[],
        produtos3:[],
        sessao1: "Capacetes de Proteção",
        sessao2: "Visores de Proteção",
        sessao3: "Luvas de Proteção",
        info:[]
     
      }
    },
    methods: {
          
          async getItemsSection1(categoryId){
          const url = `${baseApiUrl}/categories/${categoryId}/products`
          await axios.get(url).then(response => {
            //console.log(response.data) 
            this.produtos1=response.data;
          })
          .catch(error => {
            console.log(error)
          })
        },
          async getItemsSection2(categoryId){
          const url = `${baseApiUrl}/categories/${categoryId}/products`
          await axios.get(url).then(response => {
            //console.log(response.data)
            this.produtos2=response.data;
          })
          .catch(error => {
            console.log(error)
          })
        },
          async getItemsSection3(categoryId){
          const url = `${baseApiUrl}/categories/${categoryId}/products`
          await axios.get(url).then(response => {
            //console.log(response.data)
            this.produtos3=response.data;
          })
          .catch(error => {
            console.log(error)
          })
        }
    },
    mounted() {
      
    this.getItemsSection1(1);
    this.getItemsSection2(3);
    this.getItemsSection3(4);
    
    }
}
</script>

<style>
  main{
    background: rgb(236,236,236);
    background: linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 14%, rgba(143,143,143,1) 15%, rgba(124,124,124,1) 50%, rgba(157,157,157,1) 84%, white 85%, white 100%);
  }
  #campoSessoes{
    padding-top: 2em;
    width: 70%;
    margin: auto;
  }
  .sessao{
    margin: auto;
  }
</style>
