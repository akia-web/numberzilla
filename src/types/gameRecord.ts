import {Case} from "@/types/case"
import {UserOptions} from "@/types/user-options"
export interface GameRecord {
 game: Case[][],
 score: number,
 money:number,
 lamp: number,
 gather: number,
 echange:number,
 lampSoluces: Case[],
 destroyeLines:number,
 destroyeCases: number,
 lampUsed: number,
 echangeUsed:number,
 UserOptions: UserOptions

}