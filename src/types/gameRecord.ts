import {Case} from "@/types/case"
export interface GameRecord {
 game: Case[][] | null,
 score: number | null,
 lamp: number | null,
 lampSoluces: Case[],
 sound: number
}