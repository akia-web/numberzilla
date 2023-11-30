<template>
    <div class="fond">
        <div class="container-popup container-popup-options-height">
            <div class="popup">
                <header class="header-popup display-flex justify-space-between align-item-center">
                    <h1>Statistiques de la partie</h1>
                    <span 
                        class="material-symbols-outlined symbole cursor-pointer" 
                        @click="close()">
                        cancel
                    </span>
                </header>
                <main class="main-popup">
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
                        <span class="material-symbols-outlined mr-10px color-black">swap_horiz</span>
                        <p> Échanges utilisés : {{formatNumber(props.echangeUsed)}} </p>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { defineEmits} from 'vue';
    import {formatNumber} from '@/functions/formats'
    const props = defineProps<{
    lines: number,
    destroyeLines: number,
    destroyeCases: number,
    lampUsed: number,
    echangeUsed: number
    }>()
    const emit = defineEmits();
    const close = () :void =>{
        emit('close-popup-statistiques');
    }
</script>
<style scoped src="../style.scss" lang="scss"></style>