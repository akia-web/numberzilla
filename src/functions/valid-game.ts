import { DefaultRecordGame, defaultTotalCase } from "@/data/default-record-game";
import { Case } from "@/types/case";
import { GameRecord } from "@/types/gameRecord";
import { UserOptionsColors } from "@/types/user-options-colors";

let missingElementCase : string[] = []

const isValidCase= (item:any) : string[] => {
    missingElementCase = [];
    if(item.item === undefined){
        missingElementCase.push('item');
    }

    if(item.soluce === undefined){
        missingElementCase.push('soluce');
    }

    if(item.isOnEchangeMode === undefined){
        missingElementCase.push('isOnEchangeMode');
    }
    return missingElementCase;
}

const addMissingElement = (tableau: Case[][]) : Case[][] => {
    tableau.forEach(ligne => {
        ligne.forEach(caseLigne => {
            if(missingElementCase.includes('item')){
                caseLigne.item = 'none';
            }

            if(missingElementCase.includes('soluce')){
                caseLigne.soluce = false;
            }

            if(missingElementCase.includes('isOnEchangeMode')){
                caseLigne.isOnEchangeMode = false;
            }    
        })
    });

    return tableau;
}

const isValidLine=(ligne:Case[]) : boolean =>{
    return ligne.length === defaultTotalCase;
}

export const isValidGame = (item : any) : boolean | Case[][]  => {
    if(item.game !== undefined && item.game.length !==0 && isValidLine(item.game[0])){
      isValidCase(item.game[0][0]);
  
      if(missingElementCase.length > 0){
          return addMissingElement(item.game);
      }
  
      return item.game;

    }else{
      return false;
    }
}

export const matchJson = (item: any, validGame: boolean |Case[][] ) : GameRecord => {
  const result : GameRecord = DefaultRecordGame;
  if(item.score){
    result.score = item.score;
  }
  if(item.money){
    result.money = item.money;
  }

  if(item.lamp){
    result.lamp = item.lamp;
  }
  if(item.echange){
    result.echange = item.echange;
  }

  if(item.lampSoluces){
    result.lampSoluces = validGame? item.lampSoluces : [];
  }

  if(item.UserOptions && item.UserOptions.sound){
    result.UserOptions.sound = item.UserOptions.sound;
  }

  if(item.lampUsed){
    result.lampUsed = validGame?  item.lampUsed : 0;
  }
  if(item.echangeUsed){
    result.echangeUsed = validGame? item.echangeUsed: 0;
  }
  
  if( item.destroyeLines){
    result.destroyeLines = validGame? item.destroyeLines : 0;
  }

  if( item.destroyeCases){
    result.destroyeCases = validGame? item.destroyeCases : 0;
  }

  if(item.gather){
    result.gather = validGame ? item.gather : 0;
  }

  if(item.UserOptions.optionColors){
    if(item.UserOptions.optionColors.backgroundColor){
      result.UserOptions.optionColors.backgroundColor =  item.UserOptions.optionColors.backgroundColor;
    }
    if(item.UserOptions.optionColors.secondColorBackground){
      result.UserOptions.optionColors.secondColorBackground =  item.UserOptions.optionColors.secondColorBackground;
    }
    if(item.UserOptions.optionColors.scroll){
      result.UserOptions.optionColors.scroll =  item.UserOptions.optionColors.scroll;
    }
    if(item.UserOptions.optionColors.textColor){
      result.UserOptions.optionColors.textColor =  item.UserOptions.optionColors.textColor;
    }
  }
  return result;
}

export const assignPropertieColor = (item : UserOptionsColors) : void =>{
  document.documentElement.style.setProperty('--main-color-background', item.backgroundColor);
  document.documentElement.style.setProperty('--second-color-background', item.secondColorBackground);
  document.documentElement.style.setProperty('--scroll-bar', item.scroll);    
  document.documentElement.style.setProperty('--text-color', item.textColor); 
}  
