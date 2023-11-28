<template>
    <div>
        <div class="container-action">
            <div class="container">
                <span class="material-symbols-outlined symbole" @click="addLine()">add_circle</span>
                <span class="material-symbols-outlined symbole" @click="openPopup()">restart_alt</span>

                <div class="container-lamp">
                    <span class="number-item">{{ props.lamp }}</span>
                    <span 
                    @click="useLamp()"
                    class="lamp"
                    :class="{'active': props.canUseLamp, 'icone-disabled': !props.canUseLamp}">💡</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineEmits } from 'vue';
    const props = defineProps<{
    lamp : number,
    canUseLamp: boolean,
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

    const openOption = () : void => {
        emit('open-popup-options')
    }

</script>
<style scoped src="./style.scss" lang="scss">
</style>