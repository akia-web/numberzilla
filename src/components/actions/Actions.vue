<template>

            <div class="container-action">
                <div class="container" v-if="!props.echangeMode">
                    <span class="material-symbols-outlined symbole" @click="addLine()">add_circle</span>
                    <span class="material-symbols-outlined symbole" @click="openPopup()">restart_alt</span>

                    <div class="display-flex align-item-end">
                        <span class="number-item">{{ props.lamp }}</span>
                        <span 
                        @click="useLamp()"
                        class="lamp"
                        :class="{'active': props.canUseLamp, 'icone-disabled': !props.canUseLamp}">💡</span>
                    </div>

                    <div class="display-flex align-item-end">
                        <span class="number-item">{{props.echange}}</span>
                        <span class="material-symbols-outlined symbole" @click="useEchange()">swap_horiz</span>
                    </div>
                </div>

                <div class="container" v-if="props.echangeMode">
                    <p> Choisi deux cases à échanger</p>
                    <span class="material-symbols-outlined symbole" @click="stopEchange()">cancel</span>
                </div>


            </div>

</template>

<script setup lang="ts">
    import { defineEmits } from 'vue';
    const props = defineProps<{
    lamp : number,
    canUseLamp: boolean,
    echange:number,
    echangeMode:boolean
    }>()

    const emit = defineEmits();

    const openPopup = () : void =>{
        emit('open-popup-recommencer')
    }

    const addLine = () : void =>{
        emit('addLine');
    }

    const useLamp = () : void =>{
        if(props.canUseLamp){
            emit('useLamp');
        }
    }

    const useEchange = () : void => {
        emit('useEchange')
    }

    const stopEchange = () : void => {
        emit('stop-echange')
    }

</script>
<style scoped src="./style.scss" lang="scss">
</style>