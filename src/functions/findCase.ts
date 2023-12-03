import {Case} from "@/types/case";
import {GameRecord} from "@/types/gameRecord";
import { defaultTotalCase } from "@/data/default-record-game";

export const findRightCase = (
  item: Case, recordGame: GameRecord, caseTableau:number = item.indexColonne+1, ligne:number = item.indexLigne, parcourt=0
  ) :any => {
  if(caseTableau === defaultTotalCase && ligne === recordGame.game!.length - 1 && parcourt === 0){
    parcourt = 1;
    caseTableau = 0;
    ligne = 0;
    
  }else if(caseTableau === defaultTotalCase && ligne < recordGame.game!.length){
    caseTableau = 0;
    ligne += 1;
  }

  if(caseTableau === defaultTotalCase && ligne === recordGame.game!.length - 1 && parcourt === 1){
    return undefined;
  }

  for(let i : number = caseTableau; i < recordGame.game![ligne].length; i++){
    if(recordGame.game![ligne][i].visible===true){
     const result: Case = recordGame.game![ligne][i];
      result.proposal = true;
      return result;
    }
  }

  caseTableau = 0;
  if(ligne + 1 >= recordGame.game!.length){
    ligne = 0;
  }else{
    ligne += 1;
  }

  return findRightCase(item, recordGame, caseTableau, ligne, parcourt);
}

export const findLeftCase = (
  item: Case, recordGame: GameRecord, caseTableau: number = item.indexColonne -1, ligne = item.indexLigne, parcourt = 0  
  ) : any => {
    if(caseTableau === -1 && ligne === 0 && parcourt === 0){
      parcourt = 1;
      caseTableau = defaultTotalCase - 1;
      ligne = recordGame.game!.length - 1;
    }
    if(caseTableau === 0 && ligne === 0 && parcourt === 1){
      return undefined;
    }

    for(let i = caseTableau; i >= 0; i--){
      if(recordGame.game![ligne][i].visible===true){
        const result : Case = recordGame.game![ligne][i];
        result.proposal = true;
        return result;
      }
    }

    caseTableau = defaultTotalCase - 1;

    if(ligne === 0){
      ligne = recordGame.game!.length-1;
    }else{
      ligne -= 1;
    }     
    return findLeftCase(item, recordGame, caseTableau, ligne, parcourt);
}
  
export const findTopCase = (
  item: Case, recordGame : GameRecord, ligne:number = item.indexLigne-1, caseTableau: number = item.indexColonne
  ) : any =>{
    
    if(ligne === -1){
      return undefined;
    }

    for(let i = ligne; i >= 0; i--){
      if(recordGame.game![i][caseTableau].visible===true){
        const result : Case = recordGame.game![i][caseTableau];
        result.proposal = true;
        return result;
      }
    }

    if(ligne === 0){
      return undefined;
    }else{
      ligne -= 1;
    }

    return findTopCase(item, recordGame, ligne, caseTableau);
}

export const findbottomCase = (
  item : Case, recordGame: GameRecord, caseTableau: number = item.indexColonne, ligne: number = item.indexLigne+1
  ) : any => {
  if(ligne === recordGame.game!.length){
    return undefined;
  }

  for(let i = ligne; i < recordGame.game!.length; i++){
    if(recordGame.game![i][caseTableau].visible===true){
      const result : Case = recordGame.game![i][caseTableau];
      result.proposal = true;
      return result;
    }
  }
  if(ligne === recordGame.game!.length - 1){
    return undefined;
  }else{
    ligne += 1;
  }
  return findbottomCase(item, recordGame, caseTableau, ligne);
}
