const isEduVulcan = !window.location.hostname.startsWith("dziennik");
const isMobile = window.innerWidth < 1024;

const getLogoElement = () =>
    document.querySelector(".header__logo-product a").firstChild;

const logoObserver = new MutationObserver((mutationsList, observer) => {
    if (getLogoElement()) {
        observer.disconnect();
        redirectToBoard();
    }
});

function redirectToBoard() {
    const logoElement = getLogoElement();
    if (!!window.location.hostname.match(/^(dziennik-)?wiadomosci.*/)) {
        const url = `https://${window.location.hostname.replace(
            "wiadomosci",
            "uczen",
        )}/${window.location.pathname.split("/")[1]}/App`;

        if (isEduVulcan) logoElement.href = url;
        else {
            logoElement.onclick = () => (window.location.href = url);
            logoElement.style = "cursor: pointer;";
        }
    } else if (isMobile) {
        if (isEduVulcan) logoElement.href = "javascript:void(0)";

        logoElement.onclick = () => {
            document.querySelector(".app").classList.add("hideAside");
            document.querySelector(".header__hamburger__icon button").click();
            document.querySelector(".tablica a").click();
            document.querySelector(".app").classList.remove("hideAside");
        };
    } else {
        if (isEduVulcan) logoElement.href = "javascript:void(0)";
        logoElement.onclick = () =>
            document.querySelector(".tablica a").click();
    }
}

if (getLogoElement()) {
    redirectToBoard();
} else
    logoObserver.observe(document.body, {
        subtree: true,
    });
