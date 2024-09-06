function redirectToLoginPage() {
    window.location.pathname = "/logowanie";
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: redirectToLoginPage,
    doesRunHere: () =>
        window.location.hostname === "eduvulcan.pl"
        && window.location.pathname === "/"
        && !!document.querySelector("#panelLoginButton")
});
