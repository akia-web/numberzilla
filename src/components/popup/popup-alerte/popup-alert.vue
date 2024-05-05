<template>
    <div class="fond">
        <div class="container-popup container-popup-reload-party-height">
            <div class="popup">
                <header class="header-popup display-flex justify-space-between align-item-center">
                    <h1>{{ props.title }}</h1>
                    <span class="material-symbols-outlined symbole cursor-pointer" @click="close()">cancel</span>
                </header>
                <main class="main-popup">
                    <p> {{props.message}}
                    </p>
                </main>
                <footer class="footer-popup display-flex justify-space-around align-item-center">
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineEmits} from 'vue';
    const emit = defineEmits();
    const props = defineProps<{
        title: string,
        message: string
    }>()
    const close = () :void =>{
        emit('close-popup-alert');
    }
</script>

<style scoped src="../style.scss" lang="scss"></style>