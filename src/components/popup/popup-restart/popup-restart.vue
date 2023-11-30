<template>
    <div class="fond">
        <div class="container-popup container-popup-reload-party-height">
            <div class="popup">
                <header class="header-popup display-flex justify-space-between align-item-center">
                    <h1>Recommencer la partie</h1>
                    <span class="material-symbols-outlined symbole cursor-pointer" @click="choice(EnumPopupRestartChoice.Non)">cancel</span>
                </header>
                <main class="main-popup">
                    <p> Voulez-vous vraiment recommencer votre partie ?
                        <br> <br>
                        Vous ne perdrez pas vos points
                    </p>
                </main>
                <footer class="footer-popup display-flex justify-space-around align-item-center">
                    <button @click="choice(EnumPopupRestartChoice.Non)" class="cursor-pointer">Non</button>
                    <button @click="choice(EnumPopupRestartChoice.Oui)" class="right-button cursor-pointer">Oui</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { EnumPopupRestartChoice } from '@/types/Enum/popupRestartChoice';
import { defineEmits} from 'vue';
    const emit = defineEmits();
    const choice = (response : EnumPopupRestartChoice) :void =>{
        emit('choice', response);
    }
</script>

<style scoped src="../style.scss" lang="scss"></style>