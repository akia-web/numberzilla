import {Case} from "@/types/case"
import {determineBonus} from '@/components/grille/grilleService'

export const defaultCaseTableau = (i:number, ligne: number, color: string) : Case =>{
  return  {
        indexColonne : i,
        indexLigne : ligne,
        number : Math.floor(Math.random() * (9 - 1 + 1)) + 1,
        // number : 6,
        active: false,
        visible: true,
        proposal: false,
        color: color,
        item: determineBonus(),
        soluce: false,
        isOnEchangeMode:false
    };
} 
    
