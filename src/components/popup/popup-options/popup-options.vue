<template>
    <div class="fond">
        <div class="container-popup container-popup-options-height">
            <div class="popup">
                <header class="header-popup display-flex justify-space-between align-item-center">
                    <h1>
                        Réglages
                    </h1>
                    <span 
                        class="material-symbols-outlined symbole cursor-pointer" 
                        @click="closePopup()">
                        cancel
                    </span>
                </header>
                <main class="main-popup">
                    <div class="slider-container display-flex">
                        <span class="material-symbols-outlined symbole" style="color: black;">
                            volume_up
                        </span>
                        <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        v-model="volume"
                        @input="changeVolume()"
                        class="slider">
                    </div>
                    <br>                
                
                    <button 
                        @click="resetColors()" 
                        class="button-reset-colors">
                        Reset les couleurs
                    </button>

                    <div class="display-flex align-item-center mt-1">
                        <input 
                        type="color" 
                        class="color cursor-pointer" 
                        v-model="color.backgroundColor"  
                        @input="changeColor('background', color.backgroundColor)"> 
                        <p>Couleur de fond</p>
                    </div>

                    <div class="display-flex align-item-center">
                        <input 
                        type="color" 
                        class="color cursor-pointer" 
                        v-model="color.secondColorBackground"  
                        @input="changeColor('second-color-background', color.secondColorBackground)"  > 
                        <p>Couleur des encadrés</p>
                    </div>

                    <div class="display-flex align-item-center"> 
                        <input 
                        type="color" 
                        class="color cursor-pointer" 
                        v-model="color.textColor"  
                        @input="changeColor('text-color', color.textColor)"> 
                        <p>Couleur du texte</p>
                    </div>
                    
                    <div class="display-flex align-item-center">
                        <input 
                        type="color" 
                        class="color cursor-pointer" 
                        v-model="color.scroll"  
                        @input="changeColor('scroll-bar', color.scroll)"> 
                        <p>Couleur de survolement</p>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
 import { defineEmits, ref} from 'vue';
 import {UserOptionsColors} from '@/types/user-options-colors';
 import {DefaultColors} from '@/data/default-color';
 
 const props = defineProps<{
    soundValue: number,
    colorsValue: UserOptionsColors
    }>();
    const emit = defineEmits();
    const volume = ref(props.soundValue);
    const color = ref<UserOptionsColors>(props.colorsValue);

    const closePopup = () :void =>{
        emit('close-settings-popup');
    }
    const changeVolume = () :void =>{
        emit('change-volume', volume.value);
    }

    const changeColor = (type:string, color: string) :void => {
        emit('change-color', {type: type, colorChoice : color})
    }

    const resetColors = () :void => {
        color.value.backgroundColor = DefaultColors.backgroundColor;
        color.value.secondColorBackground = DefaultColors.secondColorBackground;
        color.value.textColor = DefaultColors.textColor;
        color.value.scroll = DefaultColors.scroll
        emit('change-color', {type: 'background', colorChoice : color.value.backgroundColor});
        emit('change-color', {type: 'second-color-background', colorChoice : color.value.secondColorBackground});  
        emit('change-color', {type: 'text-color', colorChoice : color.value.textColor});
        emit('change-color', {type: 'scroll-bar', colorChoice : color.value.scroll});       
    }
</script>

<style scoped src="../style.scss" lang="scss"></style>
<style>

</style>