import { generateSettingsList } from "./generateSettingsList.js";

const ifvLogoUrl = window.location.hostname.includes("eduvulcan")
    ? "https://raw.githubusercontent.com/banocean/ifv/refs/heads/main/assets/logo/logo-128-blue.png"
    : "https://raw.githubusercontent.com/banocean/ifv/refs/heads/main/assets/logo/logo-128-red.png";
const settingsIconUrl =
    "https://raw.githubusercontent.com/banocean/ifv/refs/heads/main/assets/icons/settings.svg";
const closeIconUrl =
    "https://raw.githubusercontent.com/banocean/ifv/refs/heads/main/assets/icons/close.svg";

const settingsButton = document.createElement("button");
const modalDiv = document.createElement("div");
const modalBackground = document.createElement("div");

async function addDesktopSettings() {
    settingsButton.innerHTML = `<img src="${settingsIconUrl}" style="width: 40px; height: 40px; filter: invert(1);">`;
    settingsButton.classList.add("ifv-settings-button");
    settingsButton.setAttribute("title", "Ustawienia ifv");
    modalDiv.className = "ifv-patches-modal";
    modalBackground.className = "ifv-patches-modal-background";
    modalDiv.innerHTML = `
        <div class="ifv-patches-modal-header">
            <img src="${ifvLogoUrl}" class="ifv-logo">
            <h1>Ustawienia ifv</h1>
            <button id="ifv-close-patches-modal"><img src="${closeIconUrl}"></button>
        </div>
    `;

    settingsButton.addEventListener("click", showModal);
    modalDiv
        .querySelector("#ifv-close-patches-modal")
        .addEventListener("click", hideModal);
    modalBackground.addEventListener("click", hideModal);

    modalDiv.appendChild(await generateSettingsList());
    document.body.appendChild(modalBackground);
    document.body.appendChild(modalDiv);
    document
        .querySelector(".app__aside__desktop + .app__main .header__tools")
        .appendChild(settingsButton);
}

async function hideModal() {
    modalDiv.style.transform = "translate(-50%, 200%)";
    modalDiv.style.opacity = "0.3";
    modalBackground.style.background = "rgba(0, 0, 0, 0)";
    document.body.style.overflow = "auto";
    setTimeout(() => {
        modalDiv.style.zIndex = "-1";
        modalBackground.style.zIndex = "-1";
        modalDiv.scroll(0, 0);
    }, 300);
}

async function showModal() {
    modalDiv.style.transform = "translate(-50%, -50%)";
    modalDiv.style.zIndex = "1000";
    modalDiv.style.opacity = "1";
    modalBackground.style.background = "rgba(0, 0, 0, 0.5)";
    modalBackground.style.zIndex = "999";
    document.body.style.overflow = "hidden";
}

window.appendModule({
    run: addDesktopSettings,
    onlyOnReloads: true,
    doesRunHere: () =>
        [
            "uczen.eduvulcan.pl",
            "dziennik-uczen.vulcan.net.pl",
            "wiadomosci.eduvulcan.pl",
            "dziennik-wiadomosci.vulcan.net.pl",
        ].includes(window.location.hostname) && window.innerWidth >= 1024,
});
