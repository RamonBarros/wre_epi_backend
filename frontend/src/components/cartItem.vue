<template>
    <div class="cartItem">
        <div class="nameItem">
            <p class="label">Produto</p>
            <p class="Value">{{this.item.nome}}</p> 
        </div>
        <div class="quantity">
            <p class="label">Quantidade:</p>
            <div class="controlQuantity">
                <button class="inputButton" @click="sub()">
                -
                </button>
                <p class="inputText">{{this.item.quantity}}</p>
                <button class="inputButton" @click="add()">
                    +
                </button>
            </div>
        </div>
        <div class="atributs">
            <p class="label">Atributos:</p>
            <div class="Value" v-if="Object.keys(this.item.atributs) != 0">
                <p v-for="(value, index) in Object.entries(this.item.atributs)" :key="index">
                    {{value[0]}}: {{value[1]}}
                </p>
            </div>
            <p v-else> - </p>
            
        </div>
        <div class="price">
            <p class="label">Valor</p>
            <p class="Value">R${{ (this.item.preco*this.item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2}) }}</p> 
        </div>
    </div>
</template>
<script>
import "/src/assets/main.css"
export default {
    name: "CartItem",
    mounted(){
        //console.log(this.item.key);
    },
    props:{
        item:{
            nome: String,
            quantity: Number,
            preco: Number,
            parcelas: Number,
            imagem: String,
            atributs: {
                cor: String,
                tamanho: Number, 
                tipo: String
            }
        }
    },
    methods:{
        add(){
            this.item.quantity = this.item.quantity+1;
        },
        sub(){
           if(this.item.quantity>1){
                this.item.quantity = this.item.quantity-1;
           }
        }
    }
}
</script>
<style scoped>
.cartItem{
    display: flex;
    font-size: 1vw;
    margin: 0px;
    align-items: baseline;
    flex-wrap: nowrap;
}
.nameItem{
    text-align: left;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    justify-content: baseline;
}

.label{
    font-weight: bolder;
    color: #5D5D5D;
    padding: 0.5rem;
}

.Value{
    font-weight: bolder;
    padding-bottom: 2rem;
    font-size: 1.2vw;
}

.quantity{
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 5rem;
    justify-content: center;
    align-items: center;
    margin: 0vw 2vw 0vw 8vw;
}
.controlQuantity{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
/*
.controlQuantity button{
    width: 2vw;
    height: 2vw;
    background: linear-gradient(180deg, #F7F7F7 0%, #E7E3E3 100%);
    border: 0.1rem solid #969393;
    border-radius: 0.5rem;
    font-size: 1.2vw;
    
}
/*
.controlQuantity p{
    width: 2.2vw;
    height: 2vw;
    background: #EEEEEE;
    border: 0.1em solid hsl(0, 0%, 100%);
    box-shadow: inset 0 0.05em 0.2em 0.05em rgba(0, 0, 0, 0.25);
    border-radius: 0.3em;
    padding: 0.3em;
    font-size: 0.8vw;
}
*/
.atributs{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 15vw;
}
.atributs p{
    text-transform: capitalize;
    font-size: 1vw;
}
.price{
    text-align: left;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    margin: 0;
}
</style>