<template>
  <div>
    <div class="conteiner row" style="">
      <div class="whiteBox productView col">
        <div class="row">
          <div class="columns images col">
            <span class="text">
              Imagem do produto:
            </span>
            
            <div class="bigImage">
              <img :src="bigImage">
            </div>

            <div class="otherImages">
              <img v-for="(image, index) in otherImages" :key="index" :src="image" @click="select(index)">
            </div>
          </div>

          <div class="columns col">
            <div class="text">
              <h2 class="padText">
                Nome Produto
              </h2>

              <div class="padText">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </div>
            </div>

          <div>
            <VideoEmbed url="745aPtV_W60"/>
          </div>
        </div>
      </div>
    </div>

      <div class="whiteBox productBuy col">
            
      </div>
    </div>
    <div class="whiteBox detail">
      <h3>Descrição:</h3>
      <div class="descricao">

        <p class="padText">
          Descrição longa: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum eros nec finibus lobortis. Quisque ultricies nec lorem vitae tincidunt. Vivamus aliquam, nisi posuere maximus ullamcorper, lectus magna ultricies eros, et molestie tortor dui at nulla. In hac habitasse platea dictumst. Nam ornare elementum arcu tincidunt laoreet. In hac habitasse platea dictumst. Nam ornare elementum arcu tincidunt laoreet.<br><br>

          Descrição rápida: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum eros nec finibus lobortis. Quisque ultricies nec lorem vitae tincidunt. Vivamus aliquam, nisi posuere maximus ullamcorper, lectus magna ultricies eros, et molestie tortor dui at nulla. In hac habitasse platea dictumst. Nam ornare elementum arcu tincidunt laoreet. In hac habitasse platea dictumst. Nam ornare elementum arcu tincidunt laoreet.<br><br>

          Descrição rápida: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum eros nec finibus lobortis. Quisque ultricies nec lorem vitae tincidunt. Vivamus aliquam, nisi posuere maximus ullamcorper, lectus magna ultricies eros, et molestie tortor dui at nulla. In hac habitasse platea dictumst. Nam ornare elementum arcu tincidunt laoreet. In hac habitasse platea dictumst. Nam ornare elementum arcu tincidunt laoreet.<br><br>
        </p>
        <div class="video-detalhado">
          <h2>Vídeo com descrição detalhada:</h2>
            <VideoEmbed url="j5a0jTc9S10"/>
        </div>
      </div>
    </div>         
    <SessaoProdutos id="itens-similares" :nomeSessao="sessao" :listaProdutos="produtos"/> 
  </div>
</template>
  
<script>
import SessaoProdutos from '@/components/sessaoProdutos.vue';
import VideoEmbed from "../components/VideoEmbed.vue";
  export default {
    components: { 
      VideoEmbed,
      SessaoProdutos
    },
    props:{
     /* bigImage: String,
      otherImages: Array*/
    },
    mounted(){
       console.log(this.$route.params.id)
    },
      data(){
        return{
          bigImage: "/img/prod1.svg",
          otherImages: ["/img/prod1.svg","/img/prod2.svg","/img/prod3.svg"],

          produtos:[
            {nome: "Nome do produto 1 - Capacete do tipo",
            preco: 100.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 2 - Capacete do tipo",
            preco: 200.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 3 - Capacete do tipo",
            preco: 300.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 4 - Capacete do tipo",
            preco: 400.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 5 - Capacete do tipo",
            preco: 500.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 6 - Capacete do tipo",
            preco: 600.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 7 - Capacete do tipo",
            preco: 700.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            },
            {nome: "Nome do produto 8 - Capacete do tipo",
            preco: 800.00,
            parcelas: 4,
            imagem: "/img/produto.svg",
            }
        ],
        sessao: "Produtos similares..."
        }
      },
      methods: {
        select(image) {
          this.bigImage = this.otherImages[image]
        }
      }
  }
</script>

<style scoped>
  .conteiner {
    padding: 1rem 4rem;
  }
  .productView{
    padding: 2rem;
    margin: 0.5rem;
    width: 70%;
    font-size: 1.4rem;
  }
  .productBuy{
    min-width: 35rem;
    width: 30%;
    padding: 3rem;
    margin: 0.5rem;
  }
  .bigImage img{
    height: 33rem;
    width: 33rem;
   /* aspect-ratio: 1/1;*/
    width: auto;
    border: 0.1em solid rgb(0, 0, 0, 0.5);
    border-radius: 0.2rem;
  }
  @media only screen and (max-width: 1200px) {
    .conteiner {
      flex-wrap: wrap;
    }
    .productView {
      width: 100%;
    }
    .productBuy {
      width: 100%;
    }
  }
  .images{
    text-align: left;
  }
  .text{
    font-family: Inter;
    text-align: justify;
    padding-bottom: 0.5rem;
  }
  
  .otherImages img{
    height: 5rem;
    aspect-ratio: 1/1;
    width: auto;
    margin: 0.1em;
    border: 0.1em solid rgb(0, 0, 0, 0.5);
    border-radius: 0.2rem;
  }
  .columns {
    padding: 2rem;
  }
  .padText {
    padding-bottom: 1rem;
  }
  .video{
    width: 100%;
    aspect-ratio: 16/9;
    border: none;
  }
  .detail{
    font-size: 1.4rem;
    margin: 4.5rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding: 2em;
    display: flex;
    flex-direction: row;
  }

  .detail h3{
    width: 8em;
    color: #521717;
  }
  .descricao{
    display: flex;
    flex-direction: column;
    margin-inline: 2em;
  }
  .descricao p{
    font-size: 1.6rem;
    text-align: left;
  }
  .video-detalhado{
    margin: 1em;
    margin-inline: 4em;
  }
  .video-detalhado h2{
    text-align: left;
    margin-bottom: 1rem;
  }
  .video-detalhado iframe{
    max-height: 50em;
  }
  #itens-similares{
    margin: 2em;
  }

  @media only screen and (max-width: 820px) {
    .detail{
      margin: 1.5rem;
    } 
    .descricao{
      margin-inline: 0.4em;
    }
    
    .video-detalhado{
      margin: 0;
    }
    .video-detalhado iframe{
      height: 10em;
    }                   
  }
</style>