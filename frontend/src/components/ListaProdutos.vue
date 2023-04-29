<template>
    <section id="content">
      <ProductCard id="line" v-for="(produto, index) in produtos" :key="index" :produto="produto"/>
    </section>
</template>
<script>
import ProductCard from '../components/ProductCard.vue';
export default {
    name: 'ListaProdutos',
    components: { ProductCard },
    props:{
        produtos: Array
    }
}
</script>
<style scoped>
#line{
    display: inline-block;
    margin: 0.95rem;
}
#content{
    display: flex;
    width: 100%;
}
</style>