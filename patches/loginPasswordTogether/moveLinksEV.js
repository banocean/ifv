function moveLinks() {
    const linksEl = document.querySelector("#wizard1 > div > .flex-row:has(a)");
    document.querySelector("#wizard2").appendChild(linksEl);
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: moveLinks,
    doesRunHere: () => window.location.hostname === "eduvulcan.pl",
});
