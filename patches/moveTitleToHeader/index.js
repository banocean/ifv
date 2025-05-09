import { clickOnAside } from "../apis/aside.js";

function createButton() {
    const button = document.createElement("span");
    button.className = "go_to_dashboard";
    return button;
}

function updateTitle() {
    const header = document.querySelector(".header__logo-product > span");
    const title = document.querySelector(
        ".app__content__header__h1_subtitle > h1",
    );
    if (header && title?.innerText && header.innerText !== title.innerText)
        header.innerText = title.innerText;
}

function move() {
    const header = document.querySelector(".header__logo-product");
    header.appendChild(document.createElement("span"));
    updateTitle();

    const observer = new MutationObserver(updateTitle);
    observer.observe(document.querySelector(".app__content"), {
        characterData: true,
        childList: true,
        subtree: true,
    });

    const button = document.querySelector(".go_to_dashboard") || createButton();
    button.style.left = `${document.querySelector(".header__logo").getBoundingClientRect().left}px`;
    button.innerHTML =
        "<img src='https://raw.githubusercontent.com/banocean/ifv/main/assets/icons/reply_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'> Tablica";
    button.classList.add("hidden");
    document.body.appendChild(button);

    header.addEventListener("click", () => {
        button.classList.toggle("hidden");
        if (!button.classList.contains("hidden")) button.classList.add("animate");
        setTimeout(() => {
            button.classList.remove("animate");
        }, 100);
    });

    button.addEventListener("click", async () => {
        button.classList.toggle("hidden");
        if (!!window.location.hostname.match(/^(dziennik-)?wiadomosci.*/)) {
            location.replace(
                `https://${window.location.hostname.replace(
                    "wiadomosci",
                    "uczen",
                )}/${window.location.pathname.split("/")[1]}/App`,
            );
        } else await clickOnAside(".tablica a");
    });

    window.addEventListener("click", (e) => {
        if (!header.contains(e.target) && !button.contains(e.target)) {
            hideButton();
        }
    });

    window.addEventListener("scroll", hideButton);

    function hideButton() {
        button.classList.add("hidden");
    }
}

window.appendModule({
    run: move,
    doesRunHere: () =>
        window.location.hostname.match(/^(dziennik-)?(uczen|wiadomosci).*/),
    onlyOnReloads: true,
    isLoaded: () =>
        !!document.querySelector(".header_logo_tools-container") &&
        document.querySelector(".app__content__header__h1_subtitle > h1"),
});
