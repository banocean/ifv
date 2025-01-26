const createButton = () => {
    console.debug("test")
    const button = document.createElement("button")
    button.classList.add("justify-abstence")
    button.innerHTML = `<img src="https://raw.githubusercontent.com/banocean/ifv/refs/heads/excuse-attendance-button/assets/icons/stylus_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"> Usprawiedliw`
    button.addEventListener("click", () => {
        document.querySelector(".app__content__header > .toolbar > button").click()
    })
    document.querySelector(window.innerWidth < 1024 ? ".app__content > .mobile__frame" : ".app__content > .desktop__frame").appendChild(button)
}

window.appendModule({
    run: createButton,
    doesRunHere: () => window.location.href.endsWith("frekwencja"),
    onlyOnReloads: false,
    isLoaded: () => document.querySelector(".app__content > .mobile__frame, .app__content > .desktop__frame")
        && document.querySelector(".app__content__header > .toolbar > button")
        && !document.querySelector(".spinner")
});