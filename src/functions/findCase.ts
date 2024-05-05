import {Case} from "@/types/case";
import { defaultTotalCase } from "@/data/default-record-game";

export const findRightCase = (
  item: Case, game: Case[][], caseTableau:number = item.indexColonne+1, ligne:number = item.indexLigne, parcourt=0
  ) :Case | undefined => {
  if(caseTableau === defaultTotalCase && ligne === game!.length - 1 && parcourt === 0){
    parcourt = 1;
    caseTableau = 0;
    ligne = 0;
    
  }else if(caseTableau === defaultTotalCase && ligne < game!.length){
    caseTableau = 0;
    ligne += 1;
  }

  if(caseTableau === defaultTotalCase && ligne === game!.length - 1 && parcourt === 1){
    return undefined;
  }

  for(let i : number = caseTableau; i < game![ligne].length; i++){
    if(game![ligne][i].visible===true){
     const result: Case = game![ligne][i];
      result.proposal = true;
      return result;
    }
  }

  caseTableau = 0;
  if(ligne + 1 >= game!.length){
    ligne = 0;
  }else{
    ligne += 1;
  }
  item.proposal = false;
  return findRightCase(item, game, caseTableau, ligne, parcourt);
}

export const findLeftCase = (
  item: Case, game: Case[][], caseTableau: number = item.indexColonne -1, ligne = item.indexLigne, parcourt = 0  
  ) :Case | undefined => {
    if(caseTableau === -1 && ligne === 0 && parcourt === 0){
      parcourt = 1;
      caseTableau = defaultTotalCase - 1;
      ligne = game!.length - 1;
    }
    if(caseTableau === 0 && ligne === 0 && parcourt === 1){
      return undefined;
    }

    for(let i = caseTableau; i >= 0; i--){
      if(game![ligne][i].visible===true){
        const result : Case = game![ligne][i];
        result.proposal = true;
        return result;
      }
    }

    caseTableau = defaultTotalCase - 1;

    if(ligne === 0){
      ligne = game!.length-1;
    }else{
      ligne -= 1;
    }     
    return findLeftCase(item, game, caseTableau, ligne, parcourt);
}
  
export const findTopCase = (
  item: Case, game : Case[][], ligne:number = item.indexLigne-1, caseTableau: number = item.indexColonne
  ) :Case | undefined =>{
    
    if(ligne === -1){
      return undefined;
    }

    for(let i = ligne; i >= 0; i--){
      if(game![i][caseTableau].visible===true){
        const result : Case = game![i][caseTableau];
        result.proposal = true;
        return result;
      }
    }

    if(ligne === 0){
      return undefined;
    }else{
      ligne -= 1;
    }

    return findTopCase(item, game, ligne, caseTableau);
}

export const findbottomCase = (
  item : Case, game: Case[][], caseTableau: number = item.indexColonne, ligne: number = item.indexLigne+1
  ) :Case | undefined => {
  if(ligne === game!.length){
    return undefined;
  }

  for(let i = ligne; i < game!.length; i++){
    if(game![i][caseTableau].visible===true){
      const result : Case = game![i][caseTableau];
      result.proposal = true;
      return result;
    }
  }
  if(ligne === game!.length - 1){
    return undefined;
  }else{
    ligne += 1;
  }
  return findbottomCase(item, game, caseTableau, ligne);
}

export const getNextCase = (game : Case[][], line:number , column: number ): Case | undefined => {
  const item: Case = game[line][column];
  if (item && item.visible){
    return item;
  }
    column += 1;

    if(column === game[0].length){
      column = 0;
      line += 1;
    }
    if(line === game.length){
      line = 0
    }

    if(column === 0 && line === 0){
      return undefined;
    }
    return getNextCase(game, line,column);
} 