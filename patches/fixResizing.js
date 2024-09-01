const startingWidth = window.innerWidth

const startListening = () => {
    addEventListener("resize", () => {
        if (startingWidth < 1024 !== window.innerWidth < 1024) window.location.reload()
    });
}

window.modules.push({
    run: startListening,
    onlyOnReloads: true,
    doesRunHere: () => window.location.hostname !== "eduvulcan.pl"
})
