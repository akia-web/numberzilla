<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <Grille />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Grille from '@/components/grille/Grille.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    Grille,
  },
});
</script>
