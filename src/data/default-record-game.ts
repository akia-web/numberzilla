import {GameRecord} from "@/types/gameRecord"
export const DefaultRecordGame : GameRecord = {
    game:[], 
    score:0, 
    lamp: 0, 
    lampSoluces: [], 
  
    destroyeLines: 0, 
    destroyeCases: 0, 
    lampUsed: 0,
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