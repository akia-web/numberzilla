export const scrollPage = (e:string) :void =>{
    const scrollToTop = e==='top'? 0 : document.body.scrollHeight;
    window.scroll({top:scrollToTop, behavior:'smooth'});
}