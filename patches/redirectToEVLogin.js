function redirectToLoginPage() {
    window.location.pathname = "/logowanie";
}

window.modules.push({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: redirectToLoginPage,
    doesRunHere: () =>
        window.location.pathname === "/"
        && !!document.querySelector("#panelLoginButton")
});
