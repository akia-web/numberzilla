export const playAudio =  (name:string, volume:number) : void => {
    const audio = new Audio(require(`@/assets/${name}.mp3`));
    audio.volume = volume;
    audio.play()
  };