function move(){
    const header = document.querySelector('.header__logo-product')
    const title = document.querySelector('.app__content__header__h1_subtitle>h1').innerText
    // const click = document.querySelector('.header__logo-product>div')
    header.innerText = title
    const button = document.createElement("span")
    button.className = "go_to_dashboard"
    button.innerHTML = "Tablica"
    document.body.appendChild(button)
    // click.addEventListener("click", ()=>{
    //    
    // })
}

window.appendModule({
    run: move,
    doesRunHere: () =>
        window.location.hostname.match(/^(dziennik-)?(uczen).*/) &&
        window.innerWidth < 1024,
    onlyOnReloads: false,
    isLoaded: () => !!document.querySelector(".header_logo_tools-container")
});