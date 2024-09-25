function setAutocomplete() {
    document.querySelector('#Login')?.setAttribute('autocomplete', 'username');
    document.querySelector('#Haslo')?.setAttribute('autocomplete', 'current-password');
}

function hideBtNext() {
    document.querySelector("#btNext").remove();
}

function moveNodes() {
    const linksEl = document.querySelector("#wizard1 > div > .flex-row:has(a)");
    const wizard2 = document.querySelector("#wizard2")

    wizard2.appendChild(linksEl);
    wizard2.insertBefore(wizard2, document.querySelector("#wizard1"));
}

function fixLoginPage() {
    setAutocomplete()
    hideBtNext()
    moveNodes()
}

window.appendModule({
    isLoaded: () => document.querySelector("#Haslo"),
    onlyOnReloads: true,
    run: fixLoginPage,
    doesRunHere: () => window.location.hostname === "eduvulcan.pl",
});
