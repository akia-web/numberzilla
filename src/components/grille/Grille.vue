<template>

  <div class="container">
    <div class="left-right"></div>
    <div class="main">
    <div v-for="(item, index) in game" :key="index" class="bidule" :id="'ligne-'+index">
      <!-- 'proposal': bidule.proposal -->
      <span 
        v-for="caseLine in item" 
        :class="{'active': caseLine!.active ,[caseLine.color]: true, 'not-visible': !caseLine!.visible, ['ligne-'+caseLine.indexLigne]: true}"
        @click="activeCase(caseLine)">{{ caseLine!.number }}</span>
    </div>
  </div>
    <div class="left-right">
      <Action @open-popup="handleOpenPopup" @addLine="handleAddLine" :score="score"/>
    </div>
    <Popup v-if="openPopup" @choice="handlePopupChoice"/>
  </div>
 
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Case} from "@/types/case"
import {NearCase} from "@/types/nearCase"
import {GameRecord} from "@/types/gameRecord"
import Action from '@/components/actions/Actions.vue'
import Popup from '@/components/popup/popup.vue'
const recordGame = ref<GameRecord>({game:null, score:null})
const game = ref<Case[][]>([])
const caseSelected1 = ref<Case | null>(null);
let possibility = ref<NearCase|null>(null)
let score = ref<number>(0)
let lastSelectedColor = ref<string>('white')
let openPopup = ref<boolean>(false);

const color: string[] = ['blue', 'pink', 'green', 'yellow', 'white']

const createGame = (colonne: number, ligne: number) =>{
  game.value =  getColonne(colonne, ligne, color[4])
  console.log(game.value)
  lastSelectedColor.value = color[4]
}

const getColonne= (colonne: number, ligne: number, color: string): Case[][]=>{
  let result: Case[][] = []
  for (let i = 0; i< ligne; i++){
   result.push( getLine(colonne, i, color));
  }
  return result
}

const getLine = (number:number, ligne: number, color:string) : Case[]=>{
  let result: Case[] = []
  for(let i = 0; i<number; i++){
    const lala : Case | null = 
    {
      indexColonne : i,
      indexLigne : ligne,
      number : Math.floor(Math.random() * (9 - 1 + 1)) + 1,
      // number : 6,
      active: false,
      visible: true,
      proposal: false,
      color: color
    }
    result.push(lala)
  }
  return result
}

const allNearCase=(item: Case)=>{
  let result : NearCase = {};
  let rightFind = false
  let bottomFind = false
  let leftFind = false
  let topFind = false
  console.log('start right')

  // calcule right
  let caseTableau = item.indexColonne+1
  let ligne = item.indexLigne
  console.log('ligne: '+ ligne)
  console.log('longueur Tableau:  '+ game.value.length)
  let parcourt = 0
  while(!rightFind || parcourt === 2){
    
    if(caseTableau ===10 && ligne === game.value.length - 1){
      console.log('coucou')
      parcourt = 1
      caseTableau = 0
      ligne = 0
    }else if(caseTableau ===10 && ligne < game.value.length){
      caseTableau = 0
      ligne += 1
    }
  
    if(caseTableau === 10 && ligne === game.value.length - 1 && parcourt === 0){
      parcourt = 1
    }
    if(caseTableau === 10 && ligne === game.value.length - 1 && parcourt === 1){
      parcourt = 2
      break
    }

    for(let i = caseTableau; i < game.value[ligne].length; i++){
      console.log('gnia')
      if(game.value[ligne][i].visible===true){
        result.right = game.value[ligne][i];
        result.right.proposal = true
        rightFind = true
        break
      }
    }
    caseTableau = 0
    if(ligne + 1 >= game.value.length){
      ligne = 0
    }else{
      ligne += 1
    }
    

  }
  console.log('end right')

  // calcul left
  console.log('start left')
   caseTableau = item.indexColonne-1
   ligne = item.indexLigne
   parcourt = 0
  
   while(!leftFind || parcourt === 2){
    console.log('start case' + caseTableau)
    console.log('start ligne' + ligne)
    if(caseTableau === -1 && ligne === 0){
      caseTableau = 9
      ligne = game.value.length - 1
    }else if(caseTableau ===0 && ligne === 0){
      parcourt = 1
      caseTableau = 9
      ligne = game.value.length - 1

    }
    else if(caseTableau ===-1 && ligne >= 0 && ligne <= 9){
      caseTableau = 9
      ligne -= 1

    }

    if(caseTableau === 0 && ligne === 0 && parcourt === 0){
      parcourt = 1
    }
    if(caseTableau === 0 && ligne === 0 && parcourt === 1){
      parcourt = 2
      result.left = undefined
      break
    }
    for(let i = caseTableau; i >= 0; i--){
      if(game.value[ligne][i].visible===true){
        result.left = game.value[ligne][i]
        result.left.proposal = true
        leftFind = true
        break
      }
    }
    console.log('fin for')
    caseTableau = 9
    if(ligne === 0){
      ligne = game.value.length-1
    }else{
      ligne -= 1
    }
    

  }
  console.log('end left')

  // calcul top
  console.log('start top')
  caseTableau = item.indexColonne
  ligne = item.indexLigne - 1
  while(!topFind){
    if(ligne === -1){
      result.top = undefined
      topFind = true
      break
    }
    for(let i = ligne; i >= 0; i--){
      if(game.value[i][caseTableau].visible===true){
        // result.left = game.value[ligne][i]
        result.top = game.value[i][caseTableau]
        result.top.proposal = true
        topFind = true
        break
      }
    }
    if(ligne === 0 && !result.top){
      result.top = undefined
      topFind = true
    }else{
      ligne -= 1
    }
  }
  console.log('end top')
  // calcul botom
  console.log('start bottom')
  caseTableau = item.indexColonne
  ligne = item.indexLigne + 1
  while(!bottomFind){
    if(ligne === game.value.length){
      result.bottom = undefined
      bottomFind = true
      break
    }
    for(let i = ligne; i < game.value.length; i++){
        if(game.value[i][caseTableau].visible===true){
          result.bottom = game.value[i][caseTableau]
          bottomFind = true
          result.bottom.proposal = true
          break
        }
    }
      if(ligne === game.value.length - 1 && !result.bottom){
      result.bottom = undefined
      bottomFind = true
      }else{
      ligne += 1
    }
  }
 
  
  console.log('end bottom')
  console.log(result)
  possibility.value = result
}

const removingLine=(item:Case)=>{
  const line = document.querySelector(`#ligne-${item.indexLigne}`)
  let deleteLine1 : boolean = true
  game.value[item.indexLigne].forEach((e)=>{
    if(e.visible){
      deleteLine1 = false
    }
  })
  if(deleteLine1){
    line?.classList.add('removeLine')
    setTimeout(function () {
      playAudio('removeline')
      game.value.splice(item.indexLigne,1)

      for(let i=0; i<game.value.length;i++){
        game.value[i].forEach(e=>{
          e.indexLigne = i
        })
      }
      score.value += 100
      save()
    }, 200 )
    setTimeout(function () {
    line?.classList.remove('removeLine')
  }, 201 )
  
  }
  return deleteLine1;
}

const activeCase = (item : Case) => {
  if(caseSelected1.value){
    if(possibility.value?.left === item 
      || possibility.value?.right === item
      || possibility.value?.top === item
      || possibility.value?.bottom === item
      ){
        if(caseSelected1.value.number + item.number === 10 || caseSelected1.value.number === item.number){
            caseSelected1.value.visible = false
            item.visible = false
            playAudio('pop')
            if(caseSelected1.value.number + item.number === 10){
              score.value += 10
            }else{
              score.value += 5
            }
            const suppressLine1 = removingLine(caseSelected1.value)

            setTimeout(function () {
              removingLine(item)
            },suppressLine1? 203 : 0)
           
        }
      }
        caseSelected1.value.active = false
        item.active = false
        if(possibility.value){
          if(possibility.value.bottom){
            possibility.value.bottom.proposal=false
          }
          
          if(possibility.value.top){
            possibility.value.top.proposal=false
          }

          if(possibility.value.left){
            possibility.value.left.proposal=false
          }
          if(possibility.value.right){
            possibility.value.right.proposal=false
          }
        }

        possibility.value = null
        caseSelected1.value = null
        save()
  }else{
    if(item.visible){
      item.active = true
      if(!caseSelected1.value){
        allNearCase(item);
        caseSelected1.value = item
      }
    }
  }
}

 const playAudio = async (name:string) => {
  const audioContext = new (window.AudioContext)();

  try {
    const response = await fetch(require(`@/assets/${name}.mp3`));
    const data = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(data);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.2;

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

const handleOpenPopup = () => {
  openPopup.value = true;
  console.log('popup')
  // createGame(10,7)
  // save()
}
const handleAddLine = () => {
  let indexColor = Math.floor(Math.random() * (4 - 1 + 1)) + 1

  while(indexColor === color.indexOf(lastSelectedColor.value)){
    indexColor = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  }
  lastSelectedColor.value = color[indexColor]
  console.log(indexColor)
  const truc = getColonne(10, game.value.length, color[indexColor])
  console.log(truc)
  truc.forEach(e=>{
    game.value.push(e)
    
  })
  playAudio('plic')
  for(let i = 0; i<game.value.length; i++){
    game.value[i].forEach(e=>{
      e.indexLigne = i
    })
  }
  save()
}

const handlePopupChoice = (e:any) => {
  if(e === 'oui'){
      createGame(10,7)
      save()
  }
  openPopup.value = false
}

const save = () => {
  recordGame.value.game = game.value;
  recordGame.value.score = score.value
  console.log(recordGame)
  const objetTransformer = JSON.stringify(recordGame);
  localStorage.setItem('numberzilla', objetTransformer)

}
onMounted(() => {
    const getLocalStorage = localStorage.getItem('numberzilla')
    if(getLocalStorage){
      let object = JSON.parse(getLocalStorage)
      game.value = object._value.game
      score.value = object._value.score
      const tailleTableau = game.value.length-1
      lastSelectedColor.value = game.value[tailleTableau][9].color
    }
    else{
      createGame(10,7)
    }
    
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./style.scss" lang="scss">
</style>
