<template>
    <div class="main">
    <vueper-slides autoplay :fixed-height="true">
    
    <vueper-slide
      @click="teste()"
      v-for="(slide, i) in slides"
      :key="i"
      :image="slide.image"
      :title="slide.title"
      :content="slide.content"
      :style="slide.style"
      >
    </vueper-slide>
  </vueper-slides>
    </div>
</template>

<script>
//Para instalar o componente usa npm i vueperslides    
//link documentação: https://antoniandre.github.io/vueper-slides/?ref=madewithvuejs.com#ex--events
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
export default {
    name: 'Carousel',
    methods: {
    teste: function() {
      console.log("click Funcionou!!!")
    },
    },
    components: {
    VueperSlides, 
    VueperSlide,
    },
  data: () => ({
  slides: [
    {
      //title: 'Slide #1',
     // content: 'Slide 1 content.',
      image: require('../assets/logo.png'),
      style: 'backgroundSize: auto; backgroundRepeat: no-repeat'
      
    },
    {
     image: require('../assets/logo.png'),
      style: 'backgroundSize: auto; backgroundRepeat: no-repeat'
      
    },
    {
      image: require('../assets/logo.png'),
      style: 'backgroundSize: auto; backgroundRepeat: no-repeat'
    },
    {
      image: require('../assets/logo.png'),
      style: 'backgroundSize: auto; backgroundRepeat: no-repeat'
    },
    {
      image: require('../assets/logo.png'),
      style: 'backgroundSize: auto; backgroundRepeat: no-repeat'
    },
  ]
}),
methods: {
    teste: function() {
      console.log("click Funcionou!!!")
    }
  },
    
}
</script>

<style>
  .vueperslides--fixed-height { height: 200px; }
</style>