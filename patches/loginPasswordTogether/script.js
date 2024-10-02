function setAutocomplete() {
    document.querySelector("#Login")?.setAttribute("autocomplete", "username");
    document
        .querySelector("#Haslo")
        ?.setAttribute("autocomplete", "current-password");
}

function hideBtNext() {
    document.querySelector("#btNext").remove();
}

function moveEVLinks() {
    const linksEl = document.querySelector("#wizard1 > div > .flex-row:has(a)");
    document.querySelector("#wizard2").appendChild(linksEl);
}

function swapLoginInput() {
    const wizard2 = document.querySelector("#wizard2");
    wizard2.parentElement.insertBefore(
        document.querySelector("#wizard1"),
        wizard2,
    );
    // Force firefox to check inputs again
    const centerBox = document.querySelector(".center-box");
    centerBox.innerHTML = centerBox.innerHTML;
}

function fixLoginPage() {
    setAutocomplete();
    hideBtNext();
    if (window.location.hostname === "eduvulcan.pl") moveEVLinks();
    swapLoginInput();
}

window.appendModule({
    isLoaded: () => document.querySelector("#Haslo"),
    onlyOnReloads: true,
    run: fixLoginPage,
    doesRunHere: () =>
        ["eduvulcan.pl", "dziennik-logowanie.vulcan.net.pl"].includes(
            window.location.hostname,
        ),
});
