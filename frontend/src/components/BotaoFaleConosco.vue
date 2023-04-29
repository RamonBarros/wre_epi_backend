<template>
    <div>
        <input type="checkbox" id="activate-div">
        <label for="activate-div">
            <div class="whiteBox" id="faleConosco">
                <div id="faleCabeçalho">
                    <img id="fale_img" src="/img/fale.svg">
                    <span>Fale Conosco</span>
                    <img id="close" src="/img/cross.svg">
                </div>
        <div id="faleText">
            Selecione seu canal de atendimento...
        </div>
        <div id="faleOpcoes">  
            <a href=""><button>
                Fale Conosco: Dúvidas, reclamações
            </button></a>
            <button>
                Atendimento personalizado
            </button>
        </div>
            </div>
        </label>
    </div>
</template>
<script>
export default {
    name: 'FaleConosco',
}
</script>
<style scoped>
#activate-div{display:none}
* {
        font-family: Lato;
        font-weight: 700;
    }
#faleConosco{
    position: fixed;
    right: 1rem;
    bottom: 3rem;
    width: 5rem;
    height: 5rem;
    border-radius: 100%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1D531F;
    z-index: 3;   
    cursor: pointer;
    overflow: hidden;
}
#buttonCabeçalho{
    display: none;
    justify-content: space-between;
}
#faleText{
    display: none;
}
#faleOpcoes{
    display: none;
}
span{
    display: none;
}
#faleCabeçalho #fale_img{
    height: 2.6em;
}
#close{
    display: none;
}
#activate-div:checked ~ label #faleConosco{
    width: 24rem;
    height: 24.2rem;
    border-radius: 1em 1em 0 1em;
    display: flex;
    flex-direction: column;
    align-content: center;
    cursor:auto;
    transition: height ease-in-out 1s;
    
}
#activate-div:checked ~ label #faleConosco #close{
    display: flex;
    cursor: pointer;
}
#activate-div:checked ~ label #faleConosco #faleCabeçalho{
    visibility: visible;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1.4em;
    width: 100%;
}
#activate-div:checked ~ label #faleConosco #faleCabeçalho span{
    display: initial;
    font-size: 1.8em;
    color: white;
}
#activate-div:checked ~ label #faleConosco #faleText{
    display: flex;
    background-color: #F3FFF7;
    color: #6F8674;
    font-size: 1.4em;
    padding: 1em;
    margin: 0.1em;
}
#activate-div:checked ~ label #faleConosco #faleOpcoes{
    display: flex;
    flex-direction: column;
    background-color: #CCEBD4;
    color:white;
    font-size: 1.4em;
    padding: 1em;
    margin: 0.1em;
    margin-bottom: 0.4em;
    border-radius: 0 0 0 0.6em;
}
#activate-div:checked ~ label #faleConosco #faleOpcoes button{
    background-color: #4BBF49;
    margin: 0.2em;
    padding: 0.6em;
    color:white;
    font-size: 1em;
    border-radius: 0.3em;
    border: none;
    cursor: pointer;
}
#activate-div:checked ~ label #faleConosco #faleOpcoes button:hover{
    background-color: #57dc55;
}

</style>