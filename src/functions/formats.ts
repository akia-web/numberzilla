export const formatNumber = (number:number) =>{
    if (!number && number !== 0) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const formatNumberBonus = (number:number) =>{
    if (number && number <10){
        return `0${number}`
    }else{
        return number
    } 
}