import {GameRecord} from "@/types/gameRecord"

export const defaultTotalCase : number = 9;

export const DefaultRecordGame : GameRecord = {
    game:[], 
    score:0, 
    money:0,
    lamp: 0, 
    gather: 0,
    lampSoluces: [], 
    echange: 0,
    destroyeLines: 0, 
    destroyeCases: 0, 
    lampUsed: 0,
    echangeUsed:0,
    UserOptions: {
        sound: 0.5, 
        optionColors: {
            backgroundColor : '#84B8C2',
            secondColorBackground: '#395E74',
            scroll:'#FF00E6',
            textColor:'#ffffff',
        }
    }
}