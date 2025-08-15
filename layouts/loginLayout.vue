<template>
  <div class="body overflow-hidden">
    <nuxt />
  </div>
</template>

<script>
export default {
  created(){
    if(localStorage.length !== 0){
      this.$router.push(`/`);
    }
  }
};
</script>

<style>
/* On mouse-over, add a deeper shadow */


/* Add some padding inside the card container */


</style>
