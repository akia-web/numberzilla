import {Case} from "@/types/case";
import {defaultCaseTableau} from "@/data/default-case";
import { color } from "@/data/default-color";
import { NearCase } from "@/types/nearCase";
import { getSoluceDto } from "./dto/get-soluce-dto";
import {getNextCase, findRightCase, findbottomCase, findLeftCase, findTopCase} from "@/functions/findCase"

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
    const randomValue: number = Math.random() * 100;
    let result: string;

    if (randomValue < 97) {
        result = 'none';
    } else {
        const subRandomValue: number = Math.random() * 100; 

        if (subRandomValue < 20) { 
            result = 'lamp';
        } else if (subRandomValue < 40) {
            result = 'money';
        } else if (subRandomValue < 60) { 
            result = '1000pts';
        } else if (subRandomValue < 80) { 
            result = 'echanger';
        } else {
            result = 'gather'; 
        }
    }
  
  return result;
}

export const replaceIndexGame = (tableau:Case[][]) : Case[][] =>{
    for(let i: number = 0; i < tableau.length; i++){
        tableau[i].forEach((e:Case)=>{
          e.indexLigne = i;
        })
      }
      return tableau;
}

export const newIndexColor = (lastSelectedColor: string) =>{
    let indexColor: number = Math.floor(Math.random() * 5);

    while(indexColor === color.indexOf(lastSelectedColor)){
      indexColor = Math.floor(Math.random() * 5);
    }
    return indexColor;
}

export const addLampSoluce = (item : Case, possibility : Case) : Case[] => {
    let lampSoluces = [];
    item.soluce = true;
    possibility.soluce = true;
    lampSoluces?.push(item);
    lampSoluces?.push(possibility);
    return lampSoluces;
}

export const searchSoluce = ( item : Case, possibility:NearCase|null ) : getSoluceDto => {
    const result : getSoluceDto = {
        lampSoluces: [],
        response: false
    } 

    if(possibility?.right && (possibility.right?.number === item.number ||  possibility.right!.number + item.number === 10)){
      result.lampSoluces = addLampSoluce(item, possibility.right!);
      result.response = true; 
    }
    
    if(possibility?.top && (possibility.top?.number === item.number ||  possibility.top!.number + item.number === 10)){
        result.lampSoluces = addLampSoluce(item, possibility.top!);
        result.response = true;
    }
    return result; 
}

export const findSoluce = (useLamp:boolean = true, sound:number, game: Case[][]) => {
   
}

export const allNearCase = (item: Case, game: Case[][]) : NearCase =>{
    let result : NearCase = {};
    result.right = findRightCase(item, game);
    result.left = findLeftCase(item, game);
    result.top = findTopCase(item, game);
    result.bottom = findbottomCase(item, game)
    return result;
  }