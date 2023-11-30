<template>
    <div class="header display-flex justify-center align-item-center">
        <div class=" display-flex align-item-center justify-center direction-column">
            <div class="score display-flex align-item-center mr-nav-bar mb-0-4rem">
                <span class="material-symbols-outlined mr-10px">kid_star</span> 
                <span class="mr-1">{{ formatNumber(props.score)  }}</span>
                <span class="material-symbols-outlined mr-10px">payments</span>
                <span class="mr-10px">{{formatNumber(props.money)}}</span> 
            </div>

            <div class="display-flex justify-center">
                <span class="material-symbols-outlined mr-nav-bar symbole">social_leaderboard</span>
                <span class="material-symbols-outlined mr-nav-bar symbole display-block-to-none" @click="openPopupStatistiques()">trending_up</span>
                <span class="material-symbols-outlined mr-nav-bar symbole ">menu_book</span>
                <span class="material-symbols-outlined mr-nav-bar symbole" @click="openPopupOptions()">settings</span>
                <span class="material-symbols-outlined mr-nav-bar symbole">shopping_cart</span>
                <span class="material-symbols-outlined symbole" @click="scrollTop()">vertical_align_top</span>
                <span class="material-symbols-outlined symbole" @click="scrollBottom()">vertical_align_bottom</span>
            </div>
        </div>
    </div> 
</template>

<script lang="ts" setup>
    import { defineEmits} from 'vue';
    import {formatNumber} from '@/functions/formats'
    const props = defineProps<{
    score: number,
    money: number,
    }>()

    const emit = defineEmits();

    const scrollTop = () =>{
        emit('scroll-top');
    }
    const scrollBottom = () =>{
        emit('scroll-bottom');
    }

    const openPopupStatistiques = () =>{
        console.log('open popup statistiques')
        emit('open-popup-statistiques');
    }

    const openPopupOptions = () =>{
        emit('open-popup-options');
    }
</script>
<style scoped src="./style.scss" lang="scss"></style>