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
        <div class="display-flex align-item-center">
            <span>💡</span>
            <p>Indices utilisés : {{formatNumber(props.lampUsed)}} </p>
        </div>
        <div class="display-flex align-item-center">
            <span>✨</span>
            <p> Échanges utilisés : {{formatNumber(props.echangeUsed)}} </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {formatNumber} from '@/functions/formats'
    const props = defineProps<{
    lines: number,
    destroyeLines: number,
    destroyeCases: number,
    lampUsed: number,
    echangeUsed: number
    }>();
 
</script>

<style scoped src="./style.scss" lang="scss"></style>