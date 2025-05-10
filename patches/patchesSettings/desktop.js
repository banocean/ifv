import { generateSettingsList } from "./generateSettingsList.js";

const ifvLogo =
    "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";

const settingsButton = document.createElement("button");
const modalDiv = document.createElement("div");
const modalBackground = document.createElement("div");

async function addDesktopSettings() {
    settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M429.74-100q-14.1 0-24.85-9.24-10.76-9.25-12.91-23.14l-12.75-88.39q-19.05-6.46-40.47-18.59-21.43-12.13-37.3-25.77l-80.95 36.49q-13.56 5.74-27.19 1.28t-21.19-17.2l-50.62-88.98q-7.56-12.74-4.38-26.45 3.18-13.7 14.97-22.68L205.16-437q-1.8-10-2.58-21.31-.78-11.31-.78-21.31 0-9.61.78-20.85.78-11.25 2.58-22.53l-73.06-54.33q-11.79-8.98-14.78-22.88-2.99-13.89 4.58-26.64l50.23-87.82q7.56-12.35 21.19-17.01 13.63-4.65 27.19 1.09l80.57 35.85q17.02-13.77 37.78-25.71 20.76-11.93 39.99-18.11l13.13-89.05q2.15-13.9 12.91-23.15 10.75-9.24 24.85-9.24h100.52q14.1 0 24.85 9.24 10.76 9.25 12.91 23.15l12.75 88.76q20.72 7.62 40.29 18.58 19.58 10.96 36.32 25.53l82.49-35.85q13.57-5.74 26.99-1.09 13.42 4.66 20.98 17.01l50.65 88.21q7.56 12.74 4.38 26.78-3.18 14.04-14.97 22.35l-74.59 54.41q2.56 11.18 3.09 22.04.52 10.85.52 20.88 0 9.64-.72 20.3-.71 10.65-3.1 22.73l73.44 54.3q11.79 8.31 15.16 22.35 3.38 14.04-4.19 26.78l-50.18 88.59q-7.82 12.74-21.64 17.2-13.82 4.47-27.13-1.28l-81.18-36.48q-17.41 14.41-37 26.29-19.59 11.89-39.61 18.07l-12.75 88.77q-2.15 13.89-12.91 23.14-10.75 9.24-24.85 9.24H429.74Zm8.36-50.26h83.08l14.38-110.12q31.44-8 58.27-23.48 26.84-15.47 51.45-39.45l102.77 44.08 39.8-69.9-90.57-67.28q4.34-17.03 6.48-32.49 2.14-15.46 2.14-31.1 0-16.28-1.94-31.36-1.93-15.08-6.68-31.46l91.34-68.05-39.8-69.9-103.92 44.28q-20.75-22.95-49.94-40.48-29.19-17.54-59.78-22.65L521.9-809.74h-83.59L425.08-700q-32.36 6.82-59.64 22.49-27.29 15.66-51.23 40.43l-103.03-43.69-39.8 69.9 90.44 66.69q-4.59 15.31-6.79 31.31-2.21 16-2.21 33.25 0 16.29 2.21 31.9 2.2 15.62 6.41 31.31l-90.06 67.28 39.8 69.9 102.64-43.9q23.59 24.05 51 39.59Q392.23-268 424.69-260l13.41 109.74Zm41.28-214.61q48.03 0 81.58-33.55T594.51-480q0-48.03-33.55-81.58t-81.58-33.55q-47.97 0-81.55 33.55-33.57 33.55-33.57 81.58t33.57 81.58q33.58 33.55 81.55 33.55ZM480-480Z"/></svg>`;
    settingsButton.classList.add("ifv-settings-button");
    settingsButton.setAttribute("title", "Ustawienia ifv");
    modalDiv.className = "ifv-patches-modal";
    modalBackground.className = "ifv-patches-modal-background";
    modalDiv.innerHTML = `
        <div class="ifv-patches-modal-header">
            <img src="data:image/png;base64,${ifvLogo}">
            <h1>Ustawienia ifv</h1>
            <button id="ifv-close-patches-modal"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
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
    modalBackground.style.backdropFilter = "blur(0px)";
    modalBackground.style.background = "rgba(0, 0, 0, 0)";
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
    modalBackground.style.backdropFilter = "blur(5px)";
    modalBackground.style.background = "rgba(0, 0, 0, 0.5)";
    modalBackground.style.zIndex = "999";
}

window.appendModule({
    run: addDesktopSettings,
    onlyOnReloads: true,
    doesRunHere: () =>
        ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"].includes(
            window.location.hostname
        ) && window.innerWidth >= 1024,
});
