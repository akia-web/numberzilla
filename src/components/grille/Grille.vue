<template>

    <Navbar2
    :score="recordGame.score"
    :money="recordGame.money"
    @scroll-top="scrollTop"
    @scroll-bottom="scrollBottom"
    @open-popup-statistiques = handleOpenPopupStatistique
    @open-popup-options = handleOpenPopupOptions
    ></Navbar2>


  <div class="display-flex row-to-column justify-center align-item-center mt-3 padding-top">
    <div class="left-right">
      <Statistiques  
      :lines="recordGame.game.length" 
      :destroyeLines="recordGame.destroyeLines"
      :destroyeCases="recordGame.destroyeCases"
      :lampUsed="recordGame.lampUsed"
      :echange-used="recordGame.echangeUsed"
      ></Statistiques>
    </div>

    <div class="main">
      <div v-for="(item, index) in recordGame.game" :key="index" 
      class="container-ligne display-flex justify-space-between" 
      :id="'ligne-'+index">
        <!-- 'proposal': bidule.proposal -->
        <p 
          v-for="caseLine in item" 
          :key="caseLine.indexColonne"
          class="case-jeu"
          :class="{'active': caseLine.active, 'active-echange-mode' : caseLine.isOnEchangeMode,[caseLine.color]: true, 'not-visible': !caseLine.visible, ['ligne-'+caseLine.indexLigne]: true, 'soluce': caseLine.soluce, 'hover-case': caseLine.visible}"
          @click="activeCase(caseLine)" :id="'case-'+caseLine.indexLigne+'-'+caseLine.indexColonne">
          {{ caseLine.number }}
          <span 
          v-if="!caseLine.visible && caseLine.item==='lamp'"
          @click="getItem(caseLine)" 
          class="item"> 💡</span>

          <span v-if="!caseLine.visible && caseLine.item==='money'"
          class="item" @click="getItem(caseLine)">
            💰
          </span>

          <span v-if="!caseLine.visible && caseLine.item==='echanger'"
          class="material-symbols-outlined item item-case" @click="getItem(caseLine)">
            swap_horiz
          </span>

          <span v-if="!caseLine.visible && caseLine.item==='1000pts'"
          class="point" @click="getItem(caseLine)">
            +1000
          </span>
        </p>
  
      </div>
  </div>
    <div class="left-right">
      <Action 
        @open-popup-recommencer="handleOpenPopupRestart" 
        @open-popup-options="handleOpenPopupOptions" 
        @addLine="handleAddLine"  
        @useLamp="useLamp" 
        @useEchange="activeEchangeMode"
        @stop-echange="handleStopEchange"
        :lamp="recordGame.lamp"
        :can-use-lamp="canUseLamp"
        :echange="recordGame.echange"
        :echangeMode="echangeMode"
        :volume="recordGame.UserOptions.sound"
        :tableauLenght="recordGame.game.length"
        :gameMaxLines = "maxLine"
      />
    </div>
    <PopupRestart 
      v-if="openPopupRestart" 
      @choice="handlePopupRestartChoice"
    />

    <PopupOptions 
      v-if="openPopupOptions" 
      @change-volume="handleChangeVolume"
      @changeColor="handleChangeColor"
      @close-settings-popup="handleClosePopupSettings"
      :soundValue="Number(recordGame.UserOptions.sound)"
      :colorsValue="recordGame.UserOptions.optionColors"
    />
    <PopupStatistiques
      v-if="openPopupStatistiques"  
      :lines="recordGame.game.length" 
      :destroyeLines="recordGame.destroyeLines"
      :destroyeCases="recordGame.destroyeCases"
      :lampUsed="recordGame.lampUsed"
      :echange-used="recordGame.echangeUsed"
      @close-popup-statistiques="openPopupStatistiques = !openPopupStatistiques"
      ></PopupStatistiques>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Case} from "@/types/case"
import {NearCase} from "@/types/nearCase"
import {GameRecord} from "@/types/gameRecord"
import {findRightCase, findLeftCase, findbottomCase, findTopCase} from "@/functions/findCase"
import Action from '@/components/actions/Actions.vue'
import PopupRestart from '@/components/popup/popup-restart/popup-restart.vue'
import PopupOptions from '@/components/popup/popup-options/popup-options.vue'
import PopupStatistiques from '@/components/popup/popup-statistiques/popup-statistiques.vue'
import Statistiques from '@/components/statistiques/statistiques.vue'
import Navbar2 from '@/components/navbar/navbar.vue'
import {DefaultRecordGame, defaultTotalCase} from '@/data/default-record-game'
import {assignPropertieColor, isValidGame, matchJson } from '@/functions/valid-game';
import {playAudio} from '@/functions/audio'
import {getColonne} from './grilleService'
import {EnumPopupRestartChoice} from '@/types/Enum/popupRestartChoice'
const recordGame = ref<GameRecord>(DefaultRecordGame);
const caseSelected1 = ref<Case | null>(null);
let possibility = ref<NearCase|null>(null);
let lastSelectedColor = ref<string>('white');
let openPopupRestart = ref<boolean>(false);
let openPopupOptions = ref<boolean>(false);
let openPopupStatistiques = ref<boolean>(false);
let canUseLamp = ref<boolean>(true);
let echangeMode = ref<boolean>(false);
const maxLine : number = 300;

let tabNumberExchange = ref<Case[]>([])

const color: string[] = ['purple', 'pink', 'green', 'yellow', 'white'];

const createGame = (colonne: number, ligne: number) : void => {
  recordGame.value.game = getColonne(colonne, ligne, color[4]);
  lastSelectedColor.value = color[4];
  save()
}

const getItem = (item: Case) : void => {
  playAudio('getBonus',recordGame.value.UserOptions.sound);
  if(item.item === 'lamp'){
    recordGame.value.lamp += 1;
  }else if(item.item === 'echanger'){
    recordGame.value.echange +=1;
  }else if(item.item === 'money'){
    recordGame.value.money +=1;
  }else if(item.item === '1000pts'){
    recordGame.value.score +=1000;
  }
  item.item = 'none';
  save();
}

const allNearCase= (item: Case) : void =>{
  let result : NearCase = {};
  result.right = findRightCase(item, recordGame.value);
  result.left = findLeftCase(item, recordGame.value);
  result.top = findTopCase(item, recordGame.value);
  result.bottom = findbottomCase(item, recordGame.value)
  possibility.value = result;
}

const removingLine=(item:Case) : boolean =>{
  const line : Element | null = document.querySelector(`#ligne-${item.indexLigne}`);
  let deleteLine : boolean = true;
  let lampNotCollected = 0;
  let pointNotCollected = 0;
  let moneyNotCollected = 0;
  let echangeNotCollected = 0;
  recordGame.value.game![item.indexLigne].forEach((e)=>{
    if(e.item === 'lamp'){
      lampNotCollected += 1;
    }else if(e.item === 'money'){
      moneyNotCollected += 1
    }else if(e.item === '1000pts'){
      pointNotCollected += 1
    }else if(e.item === 'echanger'){
      echangeNotCollected += 1
    }

    if(e.visible){
      deleteLine = false;
    }
  })
  if(deleteLine){
    playAudio('removeline', recordGame.value.UserOptions.sound);
    recordGame.value.lamp += lampNotCollected;
    recordGame.value.echange += echangeNotCollected;
    recordGame.value.money += moneyNotCollected;
    recordGame.value.score += 1000*pointNotCollected

    line?.classList.add('removeLine');
    setTimeout(function () {
      recordGame.value.game!.splice(item.indexLigne,1);

      for(let i=0; i<recordGame.value.game!.length;i++){
        recordGame.value.game![i].forEach(e=>{
          e.indexLigne = i;
        })
      }
      recordGame.value.score += 100;
      recordGame.value.destroyeLines+= 1;
      save()
    }, 100 )
    setTimeout(function () {
    line?.classList.remove('removeLine');
  }, 101 )
  
  }
  return deleteLine;
}

const activeCase = (item : Case) : void => {
  if(!echangeMode.value){
    if(item.visible && !caseSelected1.value){
      item.active = true;
      playAudio('select', recordGame.value.UserOptions.sound);
      allNearCase(item);
      caseSelected1.value = item;
      return
    }

    if(item.visible && caseSelected1.value){
      const possibilityCase = [possibility.value?.left, possibility.value?.right, possibility.value?.top, possibility.value?.bottom]
      const itemIsInPossibility : number = possibilityCase.indexOf(item);
      
      if(itemIsInPossibility !== -1 && (caseSelected1.value.number + item.number === 10 || caseSelected1.value.number === item.number)){
        playAudio('pop', recordGame.value.UserOptions.sound); 
        recordGame.value.destroyeCases += 2   
        caseSelected1.value.visible = false;
        item.visible = false;
        recordGame.value.score += caseSelected1.value.number + item.number === 10 ?  10 : 5;

        removeSoluceItem(item);

        caseSelected1.value.active = false;
        item.active = false;
        possibility.value = null;
        const suppressLine1 : boolean = removingLine(caseSelected1.value);

        if(caseSelected1.value.indexLigne !== item.indexLigne){
          setTimeout(function () {
            removingLine(item);
          },suppressLine1? 103 : 0)
        }
        caseSelected1.value = null;
        save();
        }else{
          playAudio('select', recordGame.value.UserOptions.sound);
          caseSelected1.value.active = false;
          item.active = true;
          caseSelected1.value = item;
          allNearCase(caseSelected1.value);
        }
    }
    
  }else{
    echangeCase(item);
  }
}


const removeSoluceItem = (item: Case) => {
  if(item.soluce || caseSelected1.value!.soluce){
    recordGame.value.lampSoluces.forEach(e=>{
      recordGame.value.game![e.indexLigne][e.indexColonne].soluce = false
    })
    recordGame.value.lampSoluces= []
    canUseLamp.value = true 
  }
}
const echangeCase = (item:Case) =>{
  if(tabNumberExchange.value.length<2){
      item.isOnEchangeMode= true;
      tabNumberExchange.value.push(item);
    }

    if(tabNumberExchange.value.length === 2){
      const chiffre1 = tabNumberExchange.value[0].number
      const chiffre2 = tabNumberExchange.value[1].number
      tabNumberExchange.value[0].number = chiffre2
      tabNumberExchange.value[0].isOnEchangeMode = false
      tabNumberExchange.value[1].number = chiffre1
      tabNumberExchange.value[1].isOnEchangeMode = false
      tabNumberExchange.value = []
      echangeMode.value = !echangeMode.value
      recordGame.value.echange -=1
      recordGame.value.echangeUsed +=1
      save()
    }
}




const chargeAudio = () => {
  new Audio(require(`@/assets/pop.mp3`)).load();
  new Audio(require(`@/assets/getBonus.mp3`)).load();
  new Audio(require(`@/assets/negative.mp3`)).load();
  new Audio(require(`@/assets/plic.mp3`)).load();
  new Audio(require(`@/assets/removeline.mp3`)).load();
  new Audio(require(`@/assets/select.mp3`)).load();
  new Audio(require(`@/assets/selectLamp.mp3`)).load();
}

const handleOpenPopupRestart = () : void => {
  openPopupRestart.value = !openPopupRestart.value;
}

const handleOpenPopupOptions = () : void => {
  openPopupOptions.value = !openPopupOptions.value;
}

const handleChangeVolume = (e:number): void => {
  recordGame.value.UserOptions.sound = e;
}

const handleClosePopupSettings = (): void => {
  openPopupOptions.value = !openPopupOptions.value
  save();
}

const handleAddLine = () : void => {
  let indexColor: number = Math.floor(Math.random() * 5);

  while(indexColor === color.indexOf(lastSelectedColor.value)){
    indexColor = Math.floor(Math.random() * 5);
  }

  if(recordGame.value.game!.length + recordGame.value.game!.length/3 < maxLine){
    const valueScroll = recordGame.value.game!.length; 
    lastSelectedColor.value = color[indexColor];
    const newLine : Case[][] = getColonne(defaultTotalCase, recordGame.value.game!.length/3, color[indexColor]);

    newLine.forEach(e=>{
      recordGame.value.game!.push(e);
    })

    playAudio('plic', recordGame.value.UserOptions.sound);

    for(let i: number = 0; i < recordGame.value.game!.length; i++){
      recordGame.value.game![i].forEach(e=>{
        e.indexLigne = i;
      })
    }

    const element = document.getElementById(`case-${valueScroll-1}-0`);
    element?.scrollIntoView({ behavior: 'smooth' });
    save();
  }else{
    playAudio('negative', recordGame.value.UserOptions.sound);
  }
}

const handlePopupRestartChoice = (e:EnumPopupRestartChoice) :void => {
  if(e === EnumPopupRestartChoice.Oui){
      createGame(defaultTotalCase,7);
      recordGame.value.lampSoluces = [];
      recordGame.value.destroyeCases = 0;
      recordGame.value.destroyeLines = 0;
      recordGame.value.lampUsed = 0;
      recordGame.value.echangeUsed = 0;
      save();
  }
  openPopupRestart.value = false;
}

const handleChangeColor = (e:{type:string, colorChoice:string}):void =>{

  switch (e.type){
    case 'background' :
      document.documentElement.style.setProperty('--main-color-background', e.colorChoice);
      recordGame.value.UserOptions.optionColors.backgroundColor = e.colorChoice;
      break
    case 'second-color-background' : 
      document.documentElement.style.setProperty('--second-color-background', e.colorChoice);
      recordGame.value.UserOptions.optionColors.secondColorBackground = e.colorChoice;
      break
    case 'text-color':
      document.documentElement.style.setProperty('--text-color', e.colorChoice);
      recordGame.value.UserOptions.optionColors.textColor = e.colorChoice;
      break
    case 'scroll-bar':
      document.documentElement.style.setProperty('--scroll-bar', e.colorChoice);
      recordGame.value.UserOptions.optionColors.scroll = e.colorChoice;
      break
  }
}

const handleOpenPopupStatistique = () :void =>{
  openPopupStatistiques.value = !openPopupStatistiques.value;
}

const handleStopEchange = () : void => {
  echangeMode.value = !echangeMode.value;
  tabNumberExchange.value.forEach(e=>e.isOnEchangeMode = false);
  tabNumberExchange.value = [];
}

const save = () : void => {
  const objetTransformer = JSON.stringify(recordGame);
  localStorage.setItem('numberzilla', objetTransformer);
}

const useLamp = () : void => {
  if(recordGame.value.lamp>0 && recordGame.value.lampSoluces.length === 0){
    let caseGame : number = 0;
    let ligne : number = 0 
    let parcourtSoluce : number = 0;
    let findSoluce : boolean = false;

    while(!findSoluce){
      let item = getNextCase(recordGame.value.game![ligne][caseGame]);
      
      if(item === undefined){
        playAudio('negative', recordGame.value.UserOptions.sound);
        break;
      }

      allNearCase (item!);
      const isSoluceFind : boolean = getSoluce(item!);

      if(isSoluceFind){
        activeSoluce();
        break;
      }

      caseGame += 1;

      if(caseGame === defaultTotalCase){
        caseGame = 0;
        ligne += 1;
      }
      if(ligne === recordGame.value.game!.length){
        ligne = 0;
      }

      if(caseGame === defaultTotalCase-1 && ligne === recordGame.value.game!.length -1){
        parcourtSoluce += 1;
      }

      if(parcourtSoluce === 2){
        playAudio('negative',recordGame.value.UserOptions.sound);
        break;
      }
    }
  }else{
    playAudio('negative',recordGame.value.UserOptions.sound);
  }
}

const activeSoluce = () :void =>{
  playAudio('selectLamp', recordGame.value.UserOptions.sound);
  recordGame.value.lamp -= 1
  recordGame.value.lampUsed += 1
  canUseLamp.value = false;
  const element = document.getElementById(`case-${recordGame.value.lampSoluces[1].indexLigne}-${recordGame.value.lampSoluces[1].indexColonne}`);
  let position = element?.offsetTop;
  window?.scroll({
    top: position!-150,
    left: 0,
    behavior: "smooth",
  });
  save();
}

const activeEchangeMode = () : void => {
  if(recordGame.value.echange >0){
    echangeMode.value = !echangeMode.value;
  }
}

const getNextCase = (item : Case | undefined ) : Case | undefined => {
  let findItem = false;
  let ligne = item!.indexLigne;
  let column = item!.indexColonne;
  while(!findItem){
    item = recordGame.value.game![ligne][column]; 
    if (item && item.visible){
      return item;
    }

    column += 1;

    if(column === recordGame.value.game![0].length){
      column = 0;
      ligne += 1;
    }
    if(ligne === recordGame.value.game!.length){
      ligne = 0
    }

    if(column === 0 && ligne === 0){
      return item = undefined;
    }
  }
}

const getSoluce = ( item : Case ) : boolean => {
  let response : boolean = false;
  if(possibility.value?.right && (possibility.value?.right?.number === item.number ||  possibility.value!.right!.number + item.number === 10)){
    addLampSoluce(item, possibility.value!.right!); 
      return response = true
  }
  
  if(possibility.value?.top && (possibility.value?.top?.number === item.number ||  possibility.value!.top!.number + item.number === 10)){
      addLampSoluce(item, possibility.value!.top!);
      return response = true;
  }
  return response 
}

const addLampSoluce = (item : Case, possibility : Case) : void => {
  recordGame.value.lampSoluces = [];
  item.soluce = true;
  possibility.soluce = true;
  recordGame.value.lampSoluces?.push(item);
  recordGame.value.lampSoluces?.push(possibility);
}

const scrollTop = () :void => {
  window.scroll({top:0, behavior:'smooth'})
}

const scrollBottom = () :void => {
  window.scroll({top: document.body.scrollHeight,behavior: 'smooth'});
}

onMounted(() => {

    const getLocalStorage = localStorage.getItem('numberzilla');
    chargeAudio()

    if(getLocalStorage){
      const gameParse = JSON.parse(getLocalStorage);
      const validGame = isValidGame(gameParse._value);
      recordGame.value = matchJson(gameParse._value, validGame)
      if(!validGame){
        createGame(defaultTotalCase,7);
      }else{
        recordGame.value.game = validGame as Case[][];   
      }
      save()
      const tailleTableau = recordGame.value.game!.length-1;
      lastSelectedColor.value = recordGame.value.game![tailleTableau][defaultTotalCase - 1].color;
      canUseLamp.value = recordGame.value.lampSoluces.length > 0? false : true;
      assignPropertieColor(recordGame.value.UserOptions.optionColors);
    
    }else{
      createGame(defaultTotalCase,7);
      save()
    }
})
</script>

<style scoped src="./style.scss" lang="scss">
</style>
