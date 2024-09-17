const isEduVulcan = () => !window.location.hostname.startsWith("dziennik");

const getLogoElement = () =>
    document.querySelector(".header__logo-product")?.firstChild;

function setUpRedirectToBoard() {
    const logoElement = getLogoElement();
    if (!!window.location.hostname.match(/^(dziennik-)?wiadomosci.*/)) {
        const url = `https://${window.location.hostname.replace(
            "wiadomosci",
            "uczen"
        )}/${window.location.pathname.split("/")[1]}/App`;

        if (isEduVulcan()) logoElement.href = url;
        else {
            logoElement.onclick = () => (window.location.href = url);
            logoElement.style = "cursor: pointer;";
        }
    } else {
        if (isEduVulcan()) logoElement.href = "javascript:void(0)";
        else logoElement.style = "cursor: pointer;";
        logoElement.addEventListener("click", () => window.clickOnAside(".tablica a"))
    }
}

window.appendModule({
    isLoaded: getLogoElement,
    onlyOnReloads: true,
    run: setUpRedirectToBoard,
    doesRunHere: () => !!window.location.hostname.match(/^(dziennik-)?(wiadomosci|uczen).*/)
})
