<template>
    <div class="container-action">
        <div class="container" v-if="!props.echangeMode">
            
            <div @click="emitMessage('addLine')" 
            :class="{
                'no-active': props.tableauLenght + props.tableauLenght / 3 > props.gameMaxLines, 
                'cursor-pointer': props.tableauLenght + props.tableauLenght / 3 < props.gameMaxLines}">
                <div class="display-flex align-item-end container-bonus">
                    <span class="material-symbols-outlined ft-size-32px" >
                    add_circle
                    </span>
                </div>
       
                <p class="text-item ml-4px">Ligne</p>
            </div>
            
            <div  @click="emitMessage('open-popup-recommencer')"
            class="cursor-pointer" >
            <div class="display-flex align-item-end container-bonus">
                    <span class="material-symbols-outlined ft-size-32px" >
                        restart_alt
                    </span>
                </div>
                <p class="text-item ml-4px">nouveau</p>
            </div>
           

            <div @click="emitMessage('useLamp')">
                <div class="display-flex align-item-end container-bonus">
                    <span class="number-item">{{formatNumberBonus( props.lamp) }}</span>
                    <span 
                    class="lamp"
                    :class="{'active': props.canUseLamp, 'icone-disabled': !props.canUseLamp || props.lamp === 0}">💡</span>
                </div>
                <p class="text-item ml-6px">Solution</p>
            </div>

            <div  @click="emitMessage('useEchange')">
                <div class="display-flex align-item-end container-bonus">
                    <span class="number-item"> {{formatNumberBonus(props.echange)}}</span>
                    <span class="lamp">✨</span>
                </div>
                <p class="text-item ml-6px">Échanger</p>
            </div>

            <div  @click="emitMessage('useGather')">
                <div class="display-flex align-item-end container-bonus">
                    <span class="number-item"> {{formatNumberBonus(props.gather)}}</span>
                    <span class="lamp gather">🧲</span>
                </div>
                <p class="text-item ml-6px">Regrouper</p>
                
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
    import {formatNumberBonus} from '@/functions/formats'
    import { defineEmits } from 'vue';
    const props = defineProps<{
    lamp : number,
    canUseLamp: boolean,
    echange:number,
    gather: number,
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