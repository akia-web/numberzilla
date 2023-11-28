<template>
    <div class="container-popup container-popup-reload-party-height">
        <div class="popup">
            <header>
                <h1>Recommencer la partie</h1>
                <span class="material-symbols-outlined symbole" @click="choice('non')">cancel</span>
            </header>
            <main>
                <p> Voulez-vous vraiment recommencer votre partie ?
                    <br> <br>
                    Vous ne perdrez pas vos points
                </p>
            </main>
            <footer>
                <button @click="choice('non')" >Non</button>
                <button @click="choice('oui')" class="right-button">Oui</button>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineEmits , ref} from 'vue';
    const emit = defineEmits();
    const choice = (response : string) =>{
        emit('choice', response);
    }
</script>

<style scoped src="../style.scss" lang="scss"></style>