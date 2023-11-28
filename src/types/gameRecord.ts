import {Case} from "@/types/case"
import {UserOptions} from "@/types/user-options"
export interface GameRecord {
 game: Case[][],
 score: number,
 lamp: number,
 lampSoluces: Case[],
 destroyeLines:number,
 destroyeCases: number,
 lampUsed: number,
 UserOptions: UserOptions

}