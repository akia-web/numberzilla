<template>

  <div class="display-flex row-to-column justify-center align-item-center">
    <div class="left-right">
    </div>
    <div class="main">
    <div v-for="(item, index) in game" :key="index" class="container-ligne display-flex" :id="'ligne-'+index">
      <!-- 'proposal': bidule.proposal -->
      <span 
        v-for="caseLine in item" 
        :key="caseLine.indexColonne"
        :class="{'active': caseLine.active ,[caseLine.color]: true, 'not-visible': !caseLine.visible, ['ligne-'+caseLine.indexLigne]: true, 'soluce': caseLine.soluce, 'hover-case': caseLine.visible}"
        @click="activeCase(caseLine)" :id="'case-'+caseLine.indexLigne+'-'+caseLine.indexColonne">
        {{ caseLine.number }}
        <svg 
        v-if="!caseLine.visible && caseLine.item==='lamp'"
        @click="getItem(caseLine)" 
        class="item" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 24 24"><path d="M13 24h-2c-.288 0-.563-.125-.753-.341l-.576-.659h4.658l-.576.659c-.19.216-.465.341-.753.341zm1.867-3c.287 0 .52.224.52.5s-.233.5-.52.5h-5.734c-.287 0-.52-.224-.52-.5s.233-.5.52-.5h5.734zm-2.871-17c2.983 0 6.004 1.97 6.004 5.734 0 1.937-.97 3.622-1.907 5.252-.907 1.574-1.843 3.201-1.844 5.014h1.001c0-3.286 3.75-6.103 3.75-10.266 0-4.34-3.502-6.734-7.004-6.734-3.498 0-6.996 2.391-6.996 6.734 0 4.163 3.75 6.98 3.75 10.266h.999c.001-1.813-.936-3.44-1.841-5.014-.938-1.63-1.908-3.315-1.908-5.252 0-3.764 3.017-5.734 5.996-5.734zm9.428 7.958c.251.114.362.411.248.662-.114.251-.41.363-.662.249l-.91-.414c-.252-.114-.363-.41-.249-.662.114-.251.411-.362.662-.248l.911.413zm-18.848 0c-.251.114-.362.411-.248.662.114.251.41.363.662.249l.91-.414c.252-.114.363-.41.249-.662-.114-.251-.411-.362-.662-.248l-.911.413zm18.924-2.958h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1c.276 0 .5.224.5.5s-.224.5-.5.5zm-18-1c.276 0 .5.224.5.5s-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h1zm16.818-3.089c.227-.158.284-.469.126-.696-.157-.227-.469-.283-.696-.126l-.821.57c-.227.158-.283.469-.126.696.157.227.469.283.696.126l.821-.57zm-16.636 0c-.227-.158-.284-.469-.126-.696.157-.227.469-.283.696-.126l.821.57c.227.158.283.469.126.696-.157.227-.469.283-.696.126l-.821-.57zm13.333-3.033c.134-.241.048-.546-.193-.68-.241-.135-.546-.048-.68.192l-.488.873c-.135.241-.048.546.192.681.241.134.546.048.681-.193l.488-.873zm-10.03 0c-.134-.241-.048-.546.193-.68.241-.135.546-.048.68.192l.488.873c.135.241.048.546-.192.681-.241.134-.546.048-.681-.193l-.488-.873zm5.515-1.378c0-.276-.224-.5-.5-.5s-.5.224-.5.5v1c0 .276.224.5.5.5s.5-.224.5-.5v-1z"/></svg>
      </span>
 
    </div>
  </div>
    <div class="left-right">
      <Action 
        @open-popup-recommencer="handleOpenPopupRecommencer" 
        @open-popup-options="handleOpenPopupOptions" 
        @addLine="handleAddLine"  
        @useLamp="useLamp" 
        :score="score" 
        :lamp="lamp"
        :can-use-lamp="canUseLamp"
      />
    </div>
    <PopupRecommencer 
      v-if="openPopupRecommencer" 
      @choice="handlePopupRecommencerChoice"
    />

    <PopupOptions 
      v-if="openPopupOptions" 
      @options-jeu="handlePopupOptionsChoice"
      :soundValue="Number(soundValue)"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Case} from "@/types/case"
import {NearCase} from "@/types/nearCase"
import {GameRecord} from "@/types/gameRecord"
import Action from '@/components/actions/Actions.vue'
import PopupRecommencer from '@/components/popup/popup-recommencer/popup-recommencer.vue'
import PopupOptions from '@/components/popup/popup-son/popup-options.vue'
const recordGame = ref<GameRecord>({game:null, score:null, lamp: null, lampSoluces: [], sound: 0.5});
const game = ref<Case[][]>([]);
const caseSelected1 = ref<Case | null>(null);
let possibility = ref<NearCase|null>(null);
let score = ref<number>(0);
let lamp = ref<number>(0);
let lastSelectedColor = ref<string>('white');
let openPopupRecommencer = ref<boolean>(false);
let openPopupOptions = ref<boolean>(false);
let soundValue = ref<number>(0.5)
let lampSoluces = ref<Case[]>([])
let canUseLamp = ref<boolean>(true)

const color: string[] = ['blue', 'pink', 'green', 'yellow', 'white'];

const createGame = (colonne: number, ligne: number) : void => {
  game.value =  getColonne(colonne, ligne, color[4]);
  lastSelectedColor.value = color[4];
  save()
}

const getColonne = (colonne: number, ligne: number, color: string) : Case[][] =>{
  let result: Case[][] = [];
  for (let i : number = 0; i< ligne; i++){
   result.push(getLine(colonne, i, color));
  }
  return result;
}

const getLine = (number:number, ligne: number, color:string) : Case[]=>{
  let result: Case[] = [];
  for(let i: number = 0; i<number; i++){
    const caseTableau : Case = 
    {
      indexColonne : i,
      indexLigne : ligne,
      number : Math.floor(Math.random() * (9 - 1 + 1)) + 1,
      // number : 6,
      active: false,
      visible: true,
      proposal: false,
      color: color,
      item: determineBonus(),
      soluce: false
    };
    result.push(caseTableau);
  }
  return result;
}

const determineBonus = () : string =>{
  const randomValue = Math.random();

  return randomValue < 0.98 ? 'none' : 'lamp';
}

const getItem = (item: Case) : void => {
  if(item.item === 'lamp'){
    playAudio('getBonus')
    lamp.value += 1
  }
  item.item = 'none';
  save()
}

const allNearCase= (item: Case) : void=>{
  let result : NearCase = {};
  result.right = findRightCase(item);
  result.left = findLeftCase(item);
  result.top = findTopCase(item);
  result.bottom = findbottomCase(item)
  possibility.value = result;
}

const findRightCase = (item : Case) : Case | undefined => {
  // calcule right
  let rightFind = false;
  let caseTableau = item.indexColonne+1;
  let ligne = item.indexLigne;
  let result : Case | undefined;
  let parcourt = 0;

  while(!rightFind){
    if(caseTableau === 10 && ligne === game.value.length - 1 && parcourt === 0){
      parcourt = 1;
      caseTableau = 0;
      ligne = 0;
    }else if(caseTableau === 10 && ligne < game.value.length){
      caseTableau = 0;
      ligne += 1;
    }

    if(caseTableau === 10 && ligne === game.value.length - 1 && parcourt === 1){
      result = undefined;
      break;
    }

    for(let i : number = caseTableau; i < game.value[ligne].length; i++){
      if(game.value[ligne][i].visible===true){
        result = game.value[ligne][i];
        result.proposal = true;
        rightFind = true;
        break
      }
    }

    caseTableau = 0;
    if(ligne + 1 >= game.value.length){
      ligne = 0;
    }else{
      ligne += 1;
    }
    
  }
  return result;
  
}

const findLeftCase = (item : Case) : Case | undefined => {
   let caseTableau = item.indexColonne-1;
   let ligne = item.indexLigne;
   let parcourt = 0;
   let leftFind = false;
   let result : Case | undefined;
  
   while(!leftFind){
    if(caseTableau === -1 && ligne === 0){
      caseTableau = 9;
      ligne = game.value.length - 1;
    }else if(caseTableau === 0 && ligne === 0 && parcourt === 0){
      parcourt = 1;
      caseTableau = 9;
      ligne = game.value.length - 1;

    }
    // else if(caseTableau ===-1 && ligne >= 0 && ligne <= 9){
    //   caseTableau = 9;
    //   ligne -= 1;

    // }
    if(caseTableau === 0 && ligne === 0 && parcourt === 1){
      result = undefined
      break
    }
    for(let i = caseTableau; i >= 0; i--){
      if(game.value[ligne][i].visible===true){
        result = game.value[ligne][i]
        result.proposal = true
        leftFind = true
        break
      }
    }
    caseTableau = 9
    if(ligne === 0){
      ligne = game.value.length-1
    }else{
      ligne -= 1
    }
    

  }
  return result;
  
}

const findTopCase = (item : Case) : Case | undefined => {
  let caseTableau = item.indexColonne
  let ligne = item.indexLigne - 1
  let topFind = false;
  let result : Case | undefined;
  

  while(!topFind){
    if(ligne === -1){
      result = undefined
      topFind = true
      break
    }
    for(let i = ligne; i >= 0; i--){
      if(game.value[i][caseTableau].visible===true){
        // result.left = game.value[ligne][i]
        result = game.value[i][caseTableau]
        result.proposal = true
        topFind = true
        break
      }
    }
    if(ligne === 0 && !result){
      result = undefined
      topFind = true
    }else{
      ligne -= 1
    }
  }
  return result
  
}

const findbottomCase = (item : Case) : Case | undefined => {
  let caseTableau = item.indexColonne
  let ligne = item.indexLigne + 1
  let result : Case | undefined;
  let bottomFind = false;
  while(!bottomFind){
    if(ligne === game.value.length){
      result = undefined
      bottomFind = true
      break
    }
    for(let i = ligne; i < game.value.length; i++){
        if(game.value[i][caseTableau].visible===true){
          result = game.value[i][caseTableau]
          bottomFind = true
          result.proposal = true
          break
        }
    }
      if(ligne === game.value.length - 1 && !result){
      result = undefined
      bottomFind = true
      }else{
      ligne += 1
    }
  }
  return result
}

const removingLine=(item:Case) : boolean =>{
  const line : Element | null = document.querySelector(`#ligne-${item.indexLigne}`);
  let deleteLine : boolean = true;
  let lampNotCollected = 0
  game.value[item.indexLigne].forEach((e)=>{
    if(e.item === 'lamp'){
      lampNotCollected += 1;
    }
    if(e.visible){
      deleteLine = false;
    }
  })
  if(deleteLine){
    playAudio('removeline');
    lamp.value += lampNotCollected;
    line?.classList.add('removeLine');
    setTimeout(function () {
      game.value.splice(item.indexLigne,1);

      for(let i=0; i<game.value.length;i++){
        game.value[i].forEach(e=>{
          e.indexLigne = i;
        })
      }
      score.value += 100;
      save()
    }, 200 )
    setTimeout(function () {
    line?.classList.remove('removeLine');
  }, 201 )
  
  }
  return deleteLine;
}

const activeCase = (item : Case) : void => {
  const possibilityCase = [possibility.value?.left, possibility.value?.right, possibility.value?.top, possibility.value?.bottom]
  
  if(caseSelected1.value){
    const itemIsInPossibility : number = possibilityCase.indexOf(item);
    
      if(itemIsInPossibility !== -1 && (caseSelected1.value.number + item.number === 10 || caseSelected1.value.number === item.number)){
        playAudio('pop');    
        caseSelected1.value.visible = false;
          item.visible = false;
          
          score.value += caseSelected1.value.number + item.number === 10 ?  10 : 5;

          if(item.soluce || caseSelected1.value.soluce){
            item.soluce = false
            caseSelected1.value.soluce = false;
            lampSoluces.value.forEach(e=>{
              game.value[e.indexLigne][e.indexColonne].soluce = false
            })
            lampSoluces.value= []
            canUseLamp.value = true 

          }
          caseSelected1.value.active = false;
          item.active = false;
          possibility.value = null;
          const suppressLine1 : boolean = removingLine(caseSelected1.value);

          if(caseSelected1.value.indexLigne !== item.indexLigne){
            setTimeout(function () {
            removingLine(item);
            },suppressLine1? 203 : 0)
          }
          caseSelected1.value = null;
          save();
        }else{
          if(item.visible){
            playAudio('select')
            caseSelected1.value.active = false;
            item.active = false;
            possibility.value = null;
            caseSelected1.value = item;
            caseSelected1.value.active = true;
            allNearCase(caseSelected1.value);
          }
        
        }
  }else{
    if(item.visible){
      item.active = true
      if(!caseSelected1.value){
        playAudio('select')
        allNearCase(item);
        caseSelected1.value = item
      }
    }
  }
}

const playAudio = async (name:string) : Promise<void> => {
  const audioContext = new (window.AudioContext)();

  try {
    const response = await fetch(require(`@/assets/${name}.mp3`));
    const data = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(data);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundValue.value;

    const audioElement = audioContext.createBufferSource();
    audioElement.buffer = buffer;

    // Connecter le nœud audio au contexte audio
    audioElement.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Jouer le fichier audio
    audioElement.start(0);
  } catch (error) {
    console.error('Erreur lors du chargement du fichier audio', error);
  }
};

const handleOpenPopupRecommencer = () : void => {
  openPopupRecommencer.value = true;
}

const handleOpenPopupOptions = () : void => {
  openPopupOptions.value = true
}

const handlePopupOptionsChoice = (e:number): void => {
  openPopupOptions.value = false
  soundValue.value = e
  save()
  console.log(soundValue.value)
}

const handleAddLine = () : void => {
  let indexColor : number = Math.floor(Math.random() * (4 - 1 + 1)) + 1;

  while(indexColor === color.indexOf(lastSelectedColor.value)){
    indexColor = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  }

  lastSelectedColor.value = color[indexColor];
  const newLine : Case[][] = getColonne(10, game.value.length, color[indexColor]);

  newLine.forEach(e=>{
    game.value.push(e);
    
  })

  playAudio('plic');

  for(let i: number = 0; i < game.value.length; i++){
    game.value[i].forEach(e=>{
      e.indexLigne = i;
    })
  }
  save();
}

const handlePopupRecommencerChoice = (e:string) :void => {
  if(e === 'oui'){
      createGame(10,7);
      lampSoluces.value = []
      save();
  }
  openPopupRecommencer.value = false;
}


const save = () : void => {
  recordGame.value.game = game.value;
  recordGame.value.score = score.value;
  recordGame.value.lamp = lamp.value;
  recordGame.value.lampSoluces = lampSoluces.value;
  recordGame.value.sound = soundValue.value;
  const objetTransformer = JSON.stringify(recordGame);
  localStorage.setItem('numberzilla', objetTransformer);
}

const useLamp = () => {
  if(lamp.value>0){
    let caseGame = 0;
    let ligne = 0
    let parcourtSoluce = 0;
    let findSoluce = false;

    while(!findSoluce){
      let item = getNextCase(game.value[ligne][caseGame])
      if(item === undefined){
        playAudio('negative')
        break
      }

      allNearCase (item!);
      const isSoluceFind : Boolean = getSoluce(item!)

      if(isSoluceFind){
        playAudio('selectLamp')
        lamp.value -= 1
        window.location.href = `#case-${lampSoluces.value[1].indexLigne}-${lampSoluces.value[1].indexColonne}`;
        canUseLamp.value = false;
        save()
        break
      }

      caseGame += 1

      if(caseGame === 10){
        caseGame = 0
        ligne += 1
      }
      if(ligne === game.value.length){
        ligne = 0
      }

      if(caseGame === 9 && ligne === game.value.length -1){
        parcourtSoluce += 1
      }

      if(parcourtSoluce === 2){
        playAudio('negative')
        break
      }
    }
  }
  
}

const getNextCase = (item : Case | undefined ) => {
  let findItem = false
  let ligne = item!.indexLigne;
  let column = item!.indexColonne
  while(!findItem){
    if(ligne === game.value.length){
      return item = undefined
    }
    item = game.value[ligne][column] 
    if (item && item.visible){
      return item
    }

    column += 1

    if(column === 10){
      column = 0
      ligne += 1
    }
    if(ligne === game.value.length){
      ligne = 0
    }

    if(column === 0 && ligne === 0){
      return item = undefined
    }
  }
}

const getSoluce = ( item : Case ) => {
  let response : boolean = false;
  if(possibility.value?.right && (possibility.value?.right?.number === item.number ||  possibility.value!.right!.number + item.number === 10)){
      lampSoluces.value = []
      item.soluce = true
      possibility.value!.right!.soluce = true
      lampSoluces.value.push(item)
      lampSoluces.value.push(possibility.value!.right!)
      return response = true
  }
  
  if(possibility.value?.top && (possibility.value?.top?.number === item.number ||  possibility.value!.top!.number + item.number === 10)){
      lampSoluces.value = []
      item.soluce = true
      possibility.value!.top!.soluce = true
      lampSoluces.value?.push(item)
      lampSoluces.value?.push(possibility.value!.top!)
      return response = true
  }


  return response 
}

onMounted(() => {
    const getLocalStorage = localStorage.getItem('numberzilla');

    if(getLocalStorage){
      const gameParse = JSON.parse(getLocalStorage);
      game.value = gameParse._value.game;
      score.value = gameParse._value.score;
      lamp.value = gameParse._value.lamp;
      lampSoluces.value = gameParse._value.lampSoluces
      soundValue.value = gameParse._value.sound
      const tailleTableau = game.value.length-1;
      lastSelectedColor.value = game.value[tailleTableau][9].color;
      canUseLamp.value = lampSoluces.value.length > 0? false : true;
      console.log(game.value.length)
    }
    else{
      createGame(10,7);
      score.value = 0;
      lamp.value = 0;
      lampSoluces.value = []
      soundValue.value = 0.5
    }
    
})
</script>

<style scoped src="./style.scss" lang="scss">
</style>
