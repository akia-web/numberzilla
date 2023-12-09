export const playAudio =  (name:string, volume:number) : void => {
    const audio = new Audio(require(`@/assets/${name}.mp3`));
    audio.volume = volume;
    audio.play()
};

export const chargeAudio = () => {
  new Audio(require(`@/assets/pop.mp3`)).load();
  new Audio(require(`@/assets/getBonus.mp3`)).load();
  new Audio(require(`@/assets/negative.mp3`)).load();
  new Audio(require(`@/assets/plic.mp3`)).load();
  new Audio(require(`@/assets/removeline.mp3`)).load();
  new Audio(require(`@/assets/select.mp3`)).load();
  new Audio(require(`@/assets/selectLamp.mp3`)).load();
  new Audio(require(`@/assets/pay.mp3`)).load();
}