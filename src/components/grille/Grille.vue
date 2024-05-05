<template>

    <Navbar2
    :score="recordGame.score"
    :money="recordGame.money"
    @scroll="scrollPage"
    @close-open-popup = "handlePopup"
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
        <!-- 'proposal': caseLine.proposal -->
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
          class="item" @click="getItem(caseLine)">✨</span>

          <span v-if="!caseLine.visible && caseLine.item==='1000pts'"
          class="point" @click="getItem(caseLine)">
            +1000
          </span>

          <span v-if="!caseLine.visible && caseLine.item==='gather'"
          class="item" @click="getItem(caseLine)">
          🧲
          </span>
        </p>
  
      </div>
  </div>
    <div class="left-right">
      <Action 
        @open-popup-recommencer="handleOpenPopupRestart" 
        @addLine="handleAddLine"  
        @useLamp="useLamp" 
        @useEchange="activeEchangeMode"
        @useGather="useGather"
        @stop-echange="handleStopEchange"
        :lamp="recordGame.lamp"
        :can-use-lamp="canUseLamp"
        :echange="recordGame.echange"
        :gather="recordGame.gather ? recordGame.gather : 0"
        :echangeMode="echangeMode"
        :volume="Number(recordGame.UserOptions.sound)"
        :tableauLenght="recordGame.game.length"
        :gameMaxLines = "maxLine"
      />
    </div>
    <PopupRestart 
      v-if="openPopupRestart" 
      @choice="handlePopupRestartChoice"
    />
    <PopupAlert 
      v-if="openPopupAlert" 
      @close-popup-alert="handlePopup('alert')"
      :title="titleAlert"
      :message="messageAlert"
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

      <PopupShop
      v-if="openPopupShop"  
      :money="recordGame.money"
      @pay-bonus="handlePayBonus" 
      @close-open-popup="handlePopup"
      ></PopupShop>

      <PopupWin
      v-if="openPopupWin"  
      @choice="handlePopupRestartChoice"
      ></PopupWin>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Case} from "@/types/case"
import {NearCase} from "@/types/nearCase"
import {GameRecord} from "@/types/gameRecord"
import {getNextCase} from "@/functions/findCase"
import Action from '@/components/actions/Actions.vue'
import PopupRestart from '@/components/popup/popup-restart/popup-restart.vue'
import PopupOptions from '@/components/popup/popup-options/popup-options.vue'
import PopupShop from '@/components/popup/popup-shop/popup-shop.vue'
import PopupStatistiques from '@/components/popup/popup-statistiques/popup-statistiques.vue'
import Statistiques from '@/components/statistiques/statistiques.vue'
import Navbar2 from '@/components/navbar/navbar.vue'
import {DefaultRecordGame, defaultTotalCase} from '@/data/default-record-game'
import {assignPropertieColor, isValidGame, matchJson } from '@/functions/valid-game';
import {playAudio} from '@/functions/audio'
import { getColonne, newIndexColor, replaceIndexGame, searchSoluce, allNearCase} from './grilleService'
import {EnumPopupRestartChoice} from '@/types/Enum/popupRestartChoice'
import {scrollPage} from '@/functions/scroll-page'
import { color } from '@/data/default-color';
import { getSoluceDto } from './dto/get-soluce-dto';
import { defaultCaseTableau } from '@/data/default-case';
import PopupAlert from '../popup/popup-alerte/popup-alert.vue';
import PopupWin from '../popup/popup-win/popup-win.vue';
const recordGame = ref<GameRecord>(DefaultRecordGame);
const caseSelected1 = ref<Case | null>(null);
const possibility = ref<NearCase|null>(null);
const lastSelectedColor = ref<string>('white');
const openPopupRestart = ref<boolean>(false);
const openPopupOptions = ref<boolean>(false);
const openPopupShop = ref<boolean>(false);
const openPopupStatistiques = ref<boolean>(false);
const openPopupAlert = ref<boolean>(false);
const openPopupWin = ref<boolean>(false)
const canUseLamp = ref<boolean>(true);
const echangeMode = ref<boolean>(false);
const maxLine : number = 300;
const titleAlert = ref<string>('');
const messageAlert = ref<string>('');

const tabNumberExchange = ref<Case[]>([])

const createGame = (colonne: number, ligne: number) : void => {
  recordGame.value.game = getColonne(colonne, ligne, color[4]);
  lastSelectedColor.value = color[4];
  save()
}

const getItem = (item: Case) : void => {
    playAudio('getBonus', recordGame.value.UserOptions.sound);

  if(item.item === 'lamp'){
    recordGame.value.lamp += 1;
  }else if(item.item === 'echanger'){
    recordGame.value.echange +=1;
  }else if(item.item === 'money'){
    recordGame.value.money +=1;
  }else if(item.item === '1000pts'){
    recordGame.value.score +=1000;
  }else if(item.item === 'gather'){
    recordGame.value.gather += 1;
  }
  item.item = 'none';
  save();
}

const removingLine=(item:Case) : boolean =>{
  const line : Element | null = document.querySelector(`#ligne-${item.indexLigne}`);
  let deleteLine : boolean = true;
  let lampNotCollected = 0;
  let pointNotCollected = 0;
  let moneyNotCollected = 0;
  let echangeNotCollected = 0;
  let gatherNotCollected = 0
  recordGame.value.game![item.indexLigne].forEach((e)=>{
    if(e.item === 'lamp'){
      lampNotCollected += 1;
    }else if(e.item === 'money'){
      moneyNotCollected += 1
    }else if(e.item === '1000pts'){
      pointNotCollected += 1
    }else if(e.item === 'echanger'){
      echangeNotCollected += 1
    }else if(e.item === 'gather'){
      gatherNotCollected += 1
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
    recordGame.value.gather += gatherNotCollected

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
      console.log(recordGame.value.game.length)
      if(recordGame.value.game.length === 0){
        console.log('gagne')
        openPopupWin.value = true
        recordGame.value.score += 10000
      }
  }, 101 )
  
  }

  return deleteLine;
}

const activeCase = (item : Case) : void => {
  if(!echangeMode.value){
   
    removePossibilityProposal();
    if(item.visible && !caseSelected1.value){
      item.active = true;
      playAudio('select',recordGame.value.UserOptions.sound);

      possibility.value = allNearCase(item, recordGame.value.game);
      caseSelected1.value = item;
      return
    }

    if(item.visible && caseSelected1.value){
      const possibilityCase = [possibility.value?.left, possibility.value?.right, possibility.value?.top, possibility.value?.bottom]
      const itemIsInPossibility : number = possibilityCase.indexOf(item);
      
      if(itemIsInPossibility !== -1 && (caseSelected1.value.number + item.number === 10 || caseSelected1.value.number === item.number)){
        playAudio('pop', recordGame.value.UserOptions.sound);

        item.proposal = false;
        caseSelected1.value.proposal = false;
        recordGame.value.destroyeCases += 1   
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
          },suppressLine1? 103 : 0);
        }
        caseSelected1.value = null;
        console.log(recordGame.value.game.length === 0)
        
        save();
        }else{
          playAudio('select', recordGame.value.UserOptions.sound);
          caseSelected1.value.active = false;
          item.active = true;
          caseSelected1.value = item;
          possibility.value =  allNearCase(caseSelected1.value, recordGame.value.game);
        }
    }
    
  }else{
    echangeCase(item);
  }
}

const removePossibilityProposal = () : void => {
  if(possibility.value){
      if(possibility.value.bottom){
        possibility.value.bottom.proposal = false;
      }
      
      if(possibility.value.top){
        possibility.value.top.proposal = false;
      }
      
      if(possibility.value.left){
        possibility.value.left.proposal = false;
      }

      if(possibility.value.right){
        possibility.value.right.proposal = false;
      }
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

const handleOpenPopupRestart = () : void => {
  openPopupRestart.value = !openPopupRestart.value;
}

const handleChangeVolume = (e:number): void => {
  recordGame.value.UserOptions.sound = e;
}

const handleClosePopupSettings = (): void => {
  openPopupOptions.value = !openPopupOptions.value
  save();
}

const handlePopup = (e:any):void =>{
  switch (e){
    case 'statistics':
      openPopupStatistiques.value = !openPopupStatistiques.value;
      break
    case 'shop':
      openPopupShop.value = !openPopupShop.value;
      break
    case 'options':
      openPopupOptions.value = !openPopupOptions.value;
      break
    case 'alert':
      openPopupAlert.value = !openPopupAlert.value
      messageAlert.value ='';
      titleAlert.value =''
  }
}

const handleAddLine = () : void => {
  if(recordGame.value.lamp >0){
    canUseLamp.value = true;
  }
  
  let indexColor: number = newIndexColor(lastSelectedColor.value);

  if(recordGame.value.game!.length + recordGame.value.game!.length/3 < maxLine){
    const valueScroll = recordGame.value.game!.length; 
    lastSelectedColor.value = color[indexColor];
    const newLine : Case[][] = getColonne(defaultTotalCase, recordGame.value.game!.length/3, color[indexColor]);

    newLine.forEach(e=>{
      recordGame.value.game!.push(e);
    })
    playAudio('plic', recordGame.value.UserOptions.sound);
    recordGame.value.game = replaceIndexGame(recordGame.value.game);
    document.getElementById(`case-${valueScroll-1}-0`)?.scrollIntoView({ behavior: 'smooth' });
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
  openPopupWin.value = false;
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

const handleStopEchange = () : void => {
  echangeMode.value = !echangeMode.value;
  tabNumberExchange.value.map(e=>e.isOnEchangeMode = false);
  tabNumberExchange.value = [];
}

const handlePayBonus = (e:string): void => {
  if(recordGame.value.money >= 5){

    playAudio('pay', recordGame.value.UserOptions.sound);

    switch (e){
      case 'lamp':
        recordGame.value.lamp += 3;
        break
      case 'echanges':
        recordGame.value.echange += 3;
        break
    }
    recordGame.value.money -= 5;
    save()
  }else{

    playAudio('negative', recordGame.value.UserOptions.sound);
  }
 
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
      possibility.value = null;
      let item = getNextCase(recordGame.value.game, ligne, caseGame);
      
      if(item === undefined){
        playAudio('negative', recordGame.value.UserOptions.sound);
        canUseLamp.value = false;
        break;
      }

      possibility.value = allNearCase (item!, recordGame.value.game);
      const searchSoluceDto: getSoluceDto = searchSoluce(item!, possibility.value)
      recordGame.value.lampSoluces = searchSoluceDto.lampSoluces;
      const isSoluceFind : boolean = searchSoluceDto.response;

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

        playAudio('negative', recordGame.value.UserOptions.sound);

        canUseLamp.value = false;
        break;
      }
    }
  }else{
    playAudio('negative', recordGame.value.UserOptions.sound);
    canUseLamp.value = false;
  }
}

const activeSoluce = () :void =>{

  playAudio('selectLamp', recordGame.value.UserOptions.sound);

  recordGame.value.lamp -= 1;
  recordGame.value.lampUsed += 1;
  canUseLamp.value = false;
  const element = document.getElementById(`case-${recordGame.value.lampSoluces[1].indexLigne}-${recordGame.value.lampSoluces[1].indexColonne}`);
  let position = element?.offsetTop;
  window?.scroll({
    top: position!-150,
    left: 0,
    behavior: "smooth",
  });

  recordGame.value.game.forEach((e:Case[]) =>{
    e.forEach((item:Case)=>{
      if(!recordGame.value.lampSoluces.includes(item))
      item.proposal = false;
    })
  })
  save();
}

const activeEchangeMode = () : void => {
  if(recordGame.value.echange >0){
    echangeMode.value = !echangeMode.value;
  }
}

const createGameWithExistingData = (tableau: Case[]) : Case[][] => {
  const tableauLength: number = tableau.length
  const numberSoustableau: number =  Math.ceil(tableauLength / 9);
  const newTableau: Case[][] = []
  for(let i = 0; i< numberSoustableau; i++){
    const debut = i * 9
    const fin = debut + 9;
    const sousTableau = tableau.slice(debut, fin);
    newTableau.push(sousTableau)
  }

  const lastLine = newTableau[newTableau.length - 1];
  const lengthLastLine = lastLine.length
  const dif = 9 - lengthLastLine;
  if(lengthLastLine !== 9){
    for(let i = 0; i< dif; i++){
      const newCase:Case = defaultCaseTableau(0,0,'red')
      newCase.visible=false;
      newCase.number = 0;
      newCase.item='none'
      newTableau[newTableau.length - 1].push(newCase);

    }
  }

  for(let i=0; i<newTableau.length;i++){
      let indexCase = 0;
      newTableau[i].forEach(e=>{
          e.indexLigne = i;
          e.indexColonne = indexCase;
          indexCase ++ 
        })
        indexCase = 0
      }

    return newTableau;
}

const useGather = (): void => {
  if(recordGame.value.lampSoluces.length > 0){
    messageAlert.value='Vous ne pouvez pas utiliser ce bonus tant que la solution n\'a pas été utilisé';
    titleAlert.value = `Bonus 'Regroupé'`
    openPopupAlert.value= true;
    return
  }

  if(recordGame.value.gather> 0){
    const tableau: Case[][] = recordGame.value.game
    const allNumber: Case[] = []
    tableau.forEach((line: Case[]) => {
      line.forEach((caseNumber: Case) => {
        if(caseNumber.visible){
          allNumber.push(caseNumber);
        }
      })
    })
    recordGame.value.game =  createGameWithExistingData(allNumber);
    recordGame.value.gather -= 1
    save();
  }
    
}
onMounted(() => {
    document.body.setAttribute('onselectstart', 'return false');
    document.body.setAttribute('onmousedown', 'if (!(event.target.classList.contains("slider") || event.target.classList.contains("color"))) return false;');    const getLocalStorage = localStorage.getItem('numberzilla');
    
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

<style scoped src="./style.scss" lang="scss"></style>