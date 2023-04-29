<template>
    <section class="sessao">
        <h2>{{nomeSessao}}</h2>
        <div class="line">
            <button class="direcional left whiteBox" @click="produtosEsquerda()">
                <img src="/img/seta.svg" alt="seta" width="20" height="55">
            </button>
            <ListaProdutos class="list" :produtos="listaProdutos"/>
            <button class="direcional right whiteBox" @click="produtosDireita()">
                <img src="/img/seta.svg" alt="seta" width="20" height="55">
            </button>
        </div>
    </section>
</template>
<script>
import ListaProdutos from '../components/ListaProdutos.vue';
export default {
    components: { ListaProdutos },
    props:{
        listaProdutos : Array,
        nomeSessao: String,
        id: String
    },
    data(){
      return{
        produtos:[],
        indice: 0
      }
    }, 
    methods:{/* Não estavam sendo utilizadas, mas podem vir a ser uteis
        getProdutos(){
            this.produtos = this.listaProdutos.slice(this.indice,this.indice+4)
        },
        produtosEsquerda(){
            if(this.indice>0){
                this.indice = this.indice - 4;
                this.getProdutos();
            }
        },
        produtosDireita(){
            if(this.produtos.length-4>=this.indice){
                this.indice = this.indice + 4;
                this.getProdutos();
            }
            //console.log(this.indice)
        },*/
        produtosEsquerda(){
            //Encontar a lista do componente indivivual
            let lista =  this.$el.getElementsByClassName("list")[0]
            //Usei este para diminuir a velocidade da mudança, mas fora o lista.scrollLeft-=300, a função não é necessaria, o valor de 300 no lista.scrollLeft também pode ser alterado
            lista.scrollLeft -= 500;
        },
        produtosDireita(){
            
            let lista =  this.$el.getElementsByClassName("list")[0]
            lista.scrollLeft += 500;
        }
    },
    mounted(){
       // this.getProdutos()
    }
}
</script>
<style scoped>
    .list{
        left: -30px;
        right: -30px;
        /*Em vez de hidden coloquei para um scroll escondido, movimentado pelos botões externos */
        overflow: scroll;
        /*Este paddin ainha o primeiro produto, mas não é a solução perfeita, já que mudar o tamanho da tela afeta*/
        
        /*Esta configuração causa o deslize, mas se quiser experimentar com outros para ver um melhor pode ficar a vontade */
        scroll-behavior: smooth;
    }
    .list::-webkit-scrollbar {
       display: none;
    }
    .sessao{
        padding: 20px;
        padding-top: 0.1px;
        border-radius: 12px;
        font-family: Lato;
        display: flex;
        flex-direction: column;
    }

    .sessao h2{
        font-size: 24px;
        font-weight: 500;
        letter-spacing: 0em;
        text-align: left;
    }

    .line{
        display: flex;
        flex-direction:row;
        align-items: center;
        justify-content: center;
        padding: 0 30px;
    }
    .direcional{
        position: relative;
        height: 110px;
        padding: 28px;
        z-index: 1;
        border: none;
        background-color: #f9f9f9;
        opacity: 50%;
        cursor: pointer;
    }
    @media (max-width: 1000px) {
        .direcional {
            height: unset;
            padding: 10px;
        }
        .line{
            padding: 0;
        }
        .sessao{
            padding: 0;
        }
    }
    .direcional:hover{
        opacity: 100%;
    }

    .left{
        margin-right: -30px;
    }
    .right{
        margin-left: -30px;
    }
    .right img{
        transform: scaleX(-1);
    }
</style>