import {Case} from "@/types/case"
import {GameRecord} from "@/types/gameRecord"

export const findRightCase = (item : Case, recordGame: GameRecord ) : Case | undefined => {
    let rightFind = false;
    let caseTableau = item.indexColonne+1;
    let ligne = item.indexLigne;
    let result : Case | undefined;
    let parcourt = 0;
  
    while(!rightFind){
      if(caseTableau === 10 && ligne === recordGame.game!.length - 1 && parcourt === 0){
        parcourt = 1;
        caseTableau = 0;
        ligne = 0;
      }else if(caseTableau === 10 && ligne < recordGame.game!.length){
        caseTableau = 0;
        ligne += 1;
      }
  
      if(caseTableau === 10 && ligne === recordGame.game!.length - 1 && parcourt === 1){
        result = undefined;
        break;
      }
  
      for(let i : number = caseTableau; i < recordGame.game![ligne].length; i++){
        if(recordGame.game![ligne][i].visible===true){
          result = recordGame.game![ligne][i];
          result.proposal = true;
          rightFind = true;
          break
        }
      }
  
      caseTableau = 0;
      if(ligne + 1 >= recordGame.game!.length){
        ligne = 0;
      }else{
        ligne += 1;
      }
      
    }
    return result;
    
  }
  
  export const findLeftCase = (item : Case, recordGame: GameRecord) : Case | undefined => {
     let caseTableau = item.indexColonne-1;
     let ligne = item.indexLigne;
     let parcourt = 0;
     let leftFind = false;
     let result : Case | undefined;
    
     while(!leftFind){
      if(caseTableau === -1 && ligne === 0){
        caseTableau = 9;
        ligne = recordGame.game!.length - 1;
      }else if(caseTableau === 0 && ligne === 0 && parcourt === 0){
        parcourt = 1;
        caseTableau = 9;
        ligne = recordGame.game!.length - 1;
  
      }
      if(caseTableau === 0 && ligne === 0 && parcourt === 1){
        result = undefined
        break
      }
      for(let i = caseTableau; i >= 0; i--){
        if(recordGame.game![ligne][i].visible===true){
          result = recordGame.game![ligne][i]
          result.proposal = true
          leftFind = true
          break
        }
      }
      caseTableau = 9
      if(ligne === 0){
        ligne = recordGame.game!.length-1
      }else{
        ligne -= 1
      }
    }
    return result;
    
  }
  
 export const findTopCase = (item : Case, recordGame: GameRecord) : Case | undefined => {
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
        if(recordGame.game![i][caseTableau].visible===true){
          // result.left = game.value[ligne][i]
          result = recordGame.game![i][caseTableau]
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
  
  export const findbottomCase = (item : Case, recordGame: GameRecord) : Case | undefined => {
    let caseTableau = item.indexColonne
    let ligne = item.indexLigne + 1
    let result : Case | undefined;
    let bottomFind = false;
    while(!bottomFind){
      if(ligne === recordGame.game!.length){
        result = undefined
        bottomFind = true
        break
      }
      for(let i = ligne; i < recordGame.game!.length; i++){
          if(recordGame.game![i][caseTableau].visible===true){
            result = recordGame.game![i][caseTableau]
            bottomFind = true
            result.proposal = true
            break
          }
      }
        if(ligne === recordGame.game!.length - 1 && !result){
        result = undefined
        bottomFind = true
        }else{
        ligne += 1
      }
    }
    return result
  }