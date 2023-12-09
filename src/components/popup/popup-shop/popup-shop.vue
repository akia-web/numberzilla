<template>
    <div class="fond">
        <div class="container-popup container-popup-options-height">
            <div class="popup">
                <header class="header-popup display-flex justify-space-between align-item-center">
                    <h1>Boutique</h1>
                    <span 
                        class="material-symbols-outlined symbole cursor-pointer" 
                        @click="emitMessage('close-open-popup','shop')">
                        cancel
                    </span>
                </header>
                <main class="main-popup">
                    <div class="container-card-shop mt-3 display-flex justify-space-around ">
                        <div class="display-flex direction-column card align-item-center relative" >
                            <span class="logo-item-entete"> 💡 </span>
                            <p class="mt-2">3</p>
                            <p>Indices</p>
                            <div class="container-prix display-flex align-item-center mt-1 mb-1 justify-center cursor-pointer" 
                            @click="emitMessage('pay-bonus','lamp')">
                                <span class="mr-10px color-text-user">5</span>
                                <span class="material-symbols-outlined mr-10px"> payments</span>
                            </div>
                        </div>

                        <div class="display-flex direction-column card align-item-center relative " >
                            <span class="logo-item-entete"> ✨ </span>
                            <p class="mt-2">3</p>
                            <p>Échanges</p>
                            <div class="container-prix display-flex align-item-center mt-1 mb-1 justify-center cursor-pointer" 
                            @click="emitMessage('pay-bonus','echanges')">
                                <span class="mr-10px color-text-user">5</span>
                                <span class="material-symbols-outlined mr-10px"> payments</span>
                            </div>
                        </div>
                    </div>
                   
                </main>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { defineEmits} from 'vue';
    const emit = defineEmits();

    const emitMessage = (message:string, item:string ) =>{
        emit(message, item);
    }
</script>
<style scoped src="../style.scss" lang="scss"></style>
<style scoped src="./style.scss" lang="scss"></style>
