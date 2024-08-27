const isEduVulcan = !!window.location.hostname.match(/^((?!dziennik).)*$/);

const getLogoElement = () =>
    document.querySelector(
        `${
            isEduVulcan
                ? ".header__logo-product a"
                : ".header__logo-product img"
        }`,
    );

const logoObserver = new MutationObserver((mutationsList, observer) => {
    console.log(mutationsList);
    if (getLogoElement()) {
        observer.disconnect();
        redirectToBoard();
    }
});

function redirectToBoard() {
    const url = !!window.location.hostname.match(/^(dziennik-)?wiadomosci.*/)
        ? `https://${window.location.hostname.replace("wiadomosci", "uczen")}/${
              window.location.pathname.split("/")[1]
          }/App`
        : window.location.href.split("/").slice(0, -1).join("/") + "/tablica";

    const logoElement = getLogoElement();

    if (isEduVulcan) logoElement.href = url;
    else {
        logoElement.onclick = () => (window.location.href = url);
        logoElement.style = "cursor: pointer;";
    }
}

if (getLogoElement()) {
    redirectToBoard();
} else
    logoObserver.observe(document.body, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true,
    });
