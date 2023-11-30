import {Case} from "@/types/case"
import {defaultCaseTableau} from "@/data/default-case"
export const getColonne = (colonne: number, ligne: number, color: string) : Case[][] =>{
    let result: Case[][] = [];
    for (let i : number = 0; i< ligne; i++){
     result.push(getLine(colonne, i, color));
    }
    return result;
  }
  
const getLine = (number:number, ligne: number, color:string) : Case[]=>{
    let result: Case[] = [];
    for(let i: number = 0; i<number; i++){
        result.push(defaultCaseTableau(i, ligne, color));
    }
    return result;
}

export const determineBonus = () : string =>{
    const randomValue :number = Math.random();
    let result : string;
  
    if (randomValue < 0.004) {
        result = 'lamp';
    } else if (randomValue < 0.014) { 
        result = 'money';
    } else if (randomValue < 0.024) {
        result = '1000pts';
    } else if (randomValue < 0.030) { 
        result = 'echanger';
    } else {
        result = 'none';
    }
  
  return result;
}