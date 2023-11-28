<template>
    <div class="fond">
        <div class="container-popup container-popup-options-height">
            <div class="popup">
                <header>
                    <h1>
                        Réglages
                    </h1>
                    <span class="material-symbols-outlined symbole" @click="closePopup()">cancel</span>
                </header>
                <main class="popupMain">
                    <div class="slider-container display-flex">
                        <svg class="icone" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 24 24"><path d="M15 23l-9.309-6h-5.691v-10h5.691l9.309-6v22zm-9-15.009v8.018l8 5.157v-18.332l-8 5.157zm14.228-4.219c2.327 1.989 3.772 4.942 3.772 8.229 0 3.288-1.445 6.241-3.77 8.229l-.708-.708c2.136-1.791 3.478-4.501 3.478-7.522s-1.342-5.731-3.478-7.522l.706-.706zm-2.929 2.929c1.521 1.257 2.476 3.167 2.476 5.299 0 2.132-.955 4.042-2.476 5.299l-.706-.706c1.331-1.063 2.182-2.729 2.182-4.591 0-1.863-.851-3.529-2.184-4.593l.708-.708zm-12.299 1.299h-4v8h4v-8z"/></svg>
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
                
                    <button @click="resetColors()" class="button-reset-colors">Reset les couleurs</button>
                    <div class="display-flex align-item-center mt-1">
                        <input type="color" class="color" v-model="color.backgroundColor"  @input="changeColor('background', color.backgroundColor)"  > 
                        <p>Couleur de fond</p>
                    </div>
                    <div class="display-flex align-item-center">
                        <input type="color" class="color" v-model="color.secondColorBackground"  @input="changeColor('second-color-background', color.secondColorBackground)"  > 
                        <p>Couleur des encadrés</p>
                    </div>
                    <div class="display-flex align-item-center"> 
                        <input type="color" class="color" v-model="color.textColor"  @input="changeColor('text-color', color.textColor)"> 
                        <p>Couleur du texte</p>
                    </div>
                    
                    <div class="display-flex align-item-center">
                        <input type="color" id="color-4" class="color" v-model="color.scroll"  @input="changeColor('scroll-bar', color.scroll)"> 
                        <p>Couleur de survolement</p>
                    </div>
                </main>
            
            </div>
        </div>
</div>
</template>

<script lang="ts" setup>
 import { defineEmits, ref, onMounted, ToRefs} from 'vue';
 import {UserOptionsColors} from '@/types/user-options-colors'
 import {DefaultColors} from '@/data/default-color'
 

 const props = defineProps<{
    soundValue: number,
    colorsValue: UserOptionsColors
    }>()
    const emit = defineEmits();
    const volume = ref(props.soundValue);
    const color = ref<UserOptionsColors>(props.colorsValue);

    const closePopup = () =>{
        emit('close-settings-popup');
    }
    const changeVolume = () =>{
        emit('change-volume', volume.value);
    }

    const changeColor = (type:string, color: string) => {
        emit('change-color', {type: type, colorChoice : color})
    }


    const resetColors = () => {
        color.value.backgroundColor = DefaultColors.backgroundColor;
        color.value.secondColorBackground = DefaultColors.secondColorBackground;
        color.value.textColor = DefaultColors.textColor
        emit('change-color', {type: 'background', colorChoice : color.value.backgroundColor})
        emit('change-color', {type: 'second-color-background', colorChoice : color.value.secondColorBackground})    
        emit('change-color', {type: 'text-color', colorChoice : color.value.textColor})
        emit('change-color', {type: 'scroll-bar', colorChoice : color.value.scroll})        
    }
</script>

<style scoped src="../style.scss" lang="scss"></style>
<style>
.fond{
    position: absolute;
    background:transparent;
    height: 100vh;
    width: 100%;
    top:0;

}
</style>