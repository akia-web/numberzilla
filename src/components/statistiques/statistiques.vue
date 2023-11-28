<template>
    <div class="container-statistiques">
        <h1 class="mb-1 center">Statistiques de la partie</h1>
        <p>Nombre de lignes : {{formatNumber(props.lines)}} </p>
        <br>
        <hr>
        <br>
        <p>Paires trouvées : {{formatNumber(props.destroyeCases)}} </p>
        <p>Lignes détruites : {{formatNumber(props.destroyeLines)}} </p>
        <br>
        <hr>
        <br>
        <p>Indices utilisés : {{formatNumber(props.lampUsed)}} </p>
    </div>
</template>

<script setup lang="ts">
    import { defineEmits , ref} from 'vue';
    import {formatNumber} from '@/functions/formats'
    const props = defineProps<{
    lines: number,
    destroyeLines: number,
    destroyeCases: number,
    lampUsed: number,
    }>()
 
</script>

<style scoped src="./style.scss" lang="scss"></style>