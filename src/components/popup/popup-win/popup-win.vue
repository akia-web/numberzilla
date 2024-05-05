<template>
    <div class="fond">
        <div class="container-popup container-popup-reload-party-height">
            <div class="popup">
                <header class="header-popup display-flex justify-space-between align-item-center">
                    <h1>Gagné !</h1>
                    <span class="material-symbols-outlined symbole cursor-pointer" @click="choice(EnumPopupRestartChoice.Non)">cancel</span>
                </header>
                <main class="main-popup">
                    <p> Bravo vous avez gagné ! <br>
                        10 000 points ont été rajouté à votre score !
                    </p>
                </main>
                <footer class="footer-popup display-flex justify-space-around align-item-center">
                    <button @click="choice(EnumPopupRestartChoice.Oui)" class="right-button cursor-pointer">Recommencer</button>
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