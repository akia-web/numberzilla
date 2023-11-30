<template>
    <div class="container-action">
        <div class="container" v-if="!props.echangeMode">
            <span 
                class="material-symbols-outlined symbole" 
                :class="{'no-active': props.tableauLenght + props.tableauLenght / 3 > props.gameMaxLines}"
                @click="emitMessage('addLine')">
                add_circle
            </span>
            <span class="material-symbols-outlined symbole" @click="emitMessage('open-popup-recommencer')">restart_alt</span>

            <div class="display-flex align-item-end">
                <span class="number-item">{{ props.lamp }}</span>
                <span 
                @click="useLamp()"
                class="lamp"
                :class="{'active': props.canUseLamp, 'icone-disabled': !props.canUseLamp || props.lamp === 0}">💡</span>
            </div>

            <div class="display-flex align-item-end">
                <span class="number-item">{{props.echange}}</span>
                <span class="material-symbols-outlined symbole" @click="emitMessage('useEchange')">swap_horiz</span>
            </div>
        </div>

        <div class="container" v-if="props.echangeMode">
            <p> Choisi deux cases à échanger</p>
            <span class="material-symbols-outlined symbole" @click="emitMessage('stop-echange')">cancel</span>
        </div>
    </div>

</template>

<script setup lang="ts">
    import { playAudio } from '@/functions/audio';
import { defineEmits } from 'vue';
    const props = defineProps<{
    lamp : number,
    canUseLamp: boolean,
    echange:number,
    echangeMode:boolean,
    volume: number,
    tableauLenght: number,
    gameMaxLines: number,
    }>()

    const emit = defineEmits();

    const emitMessage = (message : string) : void =>{
        emit(message);
    } 

    const useLamp = () : void =>{
        if(props.canUseLamp){
            emit('useLamp');
        }else{
            playAudio('negative', props.volume)
        }
    }

</script>
<style scoped src="./style.scss" lang="scss">
</style>