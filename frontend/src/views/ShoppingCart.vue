<template>
  <div>

  
    <section class="col">
        <div class="whiteBox row" style="flex-wrap: wrap; padding: 1rem 0rem 2rem 0rem;">
          <div style="padding: 1rem 3rem 1rem 3rem">
            <label id="lblDados">Dados Pessoais:</label>
          </div>

          <div class="row" style="flex-wrap: wrap-reverse;">
            <div class="row" style="padding-left: 1rem; flex-wrap: wrap; max-width: 80rem">
              <div class="col paddingForm">
                <label class="lblInput">Nome:</label>
                <input id="nome" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">Empresa:</label>
                <input id="empresa" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">CPF:</label>
                <input id="cpf" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">Endereço:</label>
                <input id="endereco" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">Número:</label>
                <input id="numero" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">Complemento:</label>
                <input id="complemento" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">Bairro:</label>
                <input id="bairro" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">Cidade:</label>
                <input id="cidade" type="text" class="inputText"/>
              </div>

              <div class="col paddingForm">
                <label class="lblInput">UF:</label>
                <input id="uf" type="text" class="inputText"/>
              </div>
            </div>

            <div class="paddingForm">
              <div class="col" style="padding-left: 1rem">
                <label class="lblInput">CEP:</label>
                <input id="cep" type="text" class="inputText"/>
              </div>
            </div>
          </div>
        </div>
        
    </section>
  
    <section class="whiteBox" >
      <div class="label-itens">
       <p>Itens:</p>
      </div>
      <div class="itemCart" v-for="(item, index) in listTest" :key="index">
        
        <div class="rowItem">
          <div class="removeButton">
          <button @click="remove(index), calcTotal()">X</button>
          </div>

          <div class="itemInfo">
          <CartItem @click="calcTotal()" :item=item></CartItem>
          </div> 
          
        </div>
      </div>
      <hr>
      <div class="totalPrice">
      <p class="priceLabel">
        Total: 
      </p>
      <p>R$ {{som}}</p>
      </div>
    </section> 
  </div>
</template>

<style scoped>
  .lblInput {
    text-align: left;
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    margin: 1rem 0 0.5rem 0;
    color: #515151;
  }
  .paddingForm {
    margin: 0rem 0.5rem 0.5rem 0.5rem
  }
  #cep {
    width: 12rem;
  }
  #cpf {
    max-width: 15rem;
  }
  #numero {
    max-width: 10rem;
  }
  #uf {
    max-width: 10rem;
  }
  #lblDados {
    font-family: 'Inter', sans-serif;
    font-size: 1.6rem;
    color: #521717;
    white-space: nowrap;
  }
</style>
  
<script>
import CartItem from '@/components/cartItem.vue';
import axios from "axios"

  export default {
    beforeMount(){
      this.calcTotal()
    },
    data() {
        return {
            listTest: [
              {nome: "Nome do produto 1 - Capacete do tipo",
                quantity: 2,
                preco: 100.00,
                parcelas: 4,
                imagem: "/img/produto.svg",
                atributs:  {cor: 'tal',
              tamanho: 12}
              },
              {nome: "Nome do produto 2 - Capacete do tipo",
                quantity: 3,
                preco: 200.00,
                parcelas: 4,
                imagem: "/img/produto.svg",
                atributs:  {
                  
                }
              },
              {nome: "Nome do produto 3 - Capacete do tipo",
                quantity: 2,
                preco: 300.00,
                parcelas: 4,
                imagem: "/img/produto.svg",
                atributs:  {
              tamanho: 12}
              },
              {nome: "Nome do produto 4 - Capacete do tipo",
                quantity: 1,
                preco: 400.00,
                parcelas: 4,
                imagem: "/img/produto.svg",
                atributs: {cor: 'tal',
              tamanho: 12}
              },
            ],
            som: 0,
        };
    },
    methods: {
        calcTotal() {
            this.som = 0
            this.listTest.forEach(element => {
              this.som = this.som + element.preco*element.quantity
            //  console.log(element.preco)
            });
        },
        remove(index){
          this.listTest.splice(index,1)
        },
    },
    mounted() {
    },
    components: { CartItem }
}
</script>
  
<style scoped>
section{
  font-size: 10rem;
  margin: 5rem;
}

.label-itens{
  display: flex;
  font-size: 2vw;
  margin: 1rem 0rem 0rem 5rem;
  color: #521717;
  height: fit-content;
}

.rowItem{
  display: flex;
  align-items: center;
  justify-content:center;
  margin:0;
  padding: 0rem;
  
}

.itemCart{
  margin-right: 0vw;
}

.removeButton{
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0rem 4vw 0rem 10vw;
  
}

.removeButton button{
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 100%;
  font-size: 1.5vw;
  font-weight: bold;
  border: 0px;
  background-color: #e8e8e8;
  justify-content: center;
  margin: auto;
  width: 2vw;
  height: 2vw;
}

.itemInfo{
  flex-grow: 0;
  margin: 0vw 10vw 0vw 0vw;
}

.totalPrice{
  display: flex;
  justify-content: flex-end;
  margin: 1vw 5vw;
  margin-bottom: 3vw;
  font-weight: bolder;
}
.totalPrice p{
  font-size: 2.5vw;
}
hr{
  margin: 2rem;
  
}
</style>
