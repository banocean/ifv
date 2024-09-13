function hideBtNext() {
    document.querySelector("#btNext").remove();
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: hideBtNext,
    doesRunHere: () =>
        ["eduvulcan.pl", "dziennik-logowanie.vulcan.net.pl"].includes(
            window.location.hostname
        ),
});
