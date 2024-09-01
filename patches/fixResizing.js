const startingWidth = window.innerWidth

const startListening = () => {
    addEventListener("resize", (event) => {
        if (startingWidth < 1024 !== window.innerWidth < 1024) window.location.reload()
    });
}

window.modules.push({
    run: startListening,
    onlyOnReloads: true
})
