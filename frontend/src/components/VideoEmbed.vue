<template>
    <div>
    <iframe class="video" 
        :src="video">
    </iframe>
    </div>
</template>

<script>
export default {
    name: 'VideoEmbed',
    props:{
        url: String
    },
    data(){
      return{
        video: "https://www.youtube.com/embed/"
      }
    },
    mounted(){
        this.video = this.video + this.url
    }
}
</script>

<style scoped>
    .video{
        width: 100%;
        aspect-ratio: 16/9;
        border: none;
    }
</style>