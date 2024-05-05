const audioBonus = new Audio(require(`@/assets/getBonus.mp3`))
const audioNegative = new Audio(require(`@/assets/negative.mp3`))
const audioPay = new Audio(require(`@/assets/pay.mp3`))
const audioPlic = new Audio(require(`@/assets/plic.mp3`))
const audioPop = new Audio(require(`@/assets/pop.mp3`))
const audioRemoveLine = new Audio(require(`@/assets/removeline.mp3`))
const audioSelect = new Audio(require(`@/assets/select.mp3`))
const audioSelectLamp = new Audio(require(`@/assets/selectLamp.mp3`))

const getAudio = (name:string) => {
    switch (name){
        case 'getBonus':
            return audioBonus;
        case 'negative':
            return audioNegative;
        case 'pay':
            return audioPay;
        case 'plic':
            return audioPlic;
        case 'pop':
            return audioPop;
        case 'removeline':
            return audioRemoveLine;
        case 'select':
            return audioSelect;
        case 'selectLamp':
            return audioSelectLamp;
        default: 
        return audioPop;
    }
}

export const playAudio =  (name:string, volume: number) : void => {
    const audio = getAudio(name)
    audio.volume = volume;
    audio.play();    
};
