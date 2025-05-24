import { generateSettingsList } from "./generateSettingsList.js";
import { waitForRender } from "../apis/waitForElement.js";

const backIconUrl =
    "https://raw.githubusercontent.com/banocean/ifv/new-navbar/assets/icons/keyboard_backspace_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg";
const settingsIconUrl = "https://raw.githubusercontent.com/yoper12/ifv/refs/heads/patches-settings/assets/settings.svg"

function addMobileSettings() {
    const settingsButton = document.createElement("div");
    settingsButton.innerHTML = `<div class="icon" style="content: url(&quot;${settingsIconUrl}&quot;);"></div><span class="name">Ustawienia ifv</span>`;
    settingsButton.addEventListener("click", async () => {
        const settingsModal = document.createElement("div");
        settingsModal.classList.add("settings-popup", "list-modal");
        settingsModal.innerHTML = `<div><img src='${backIconUrl}'><h1>Ustawienia IFV</h1></div><div></div>`;
        settingsModal.querySelector("img").addEventListener("click", () => {
            settingsModal.remove();
        });
        const settingsList = await generateSettingsList();
        settingsModal
            .querySelector("div:last-of-type")
            .appendChild(settingsList);
        settingsModal
            .querySelector("div:last-of-type")
            .classList.add("ifv-patches-mobile");
        document.body.appendChild(settingsModal);
    });

    waitForRender(() =>
        document.querySelector(".more-popup.list-modal div")
    ).then(() => {
        document
            .querySelectorAll(".more-popup.list-modal div")[1]
            .appendChild(settingsButton);
    });
}

window.appendModule({
    run: addMobileSettings,
    onlyOnReloads: true,
    doesRunHere: () =>
        ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"].includes(
            window.location.hostname
        ) && window.innerWidth < 1024,
});
