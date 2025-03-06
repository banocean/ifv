import {waitForRender} from "../apis/waitForElement.js";

const icons = [
        ["Dzisiejszy plan zajęć", "calendar_clock_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Oceny od ostatniego logowania", "counter_6_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Sprawdziany", "quiz_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Zadania domowe", "summarize_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Informacje", "folder_info_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Ogłoszenia", "campaign_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Ankiety", "feedback_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Frekwencja", "event_available_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Dyżurni", "person_raised_hand_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"],
        ["Ważne dzisiaj", "strategy_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg"]
]

const applyIcons = () => {
    for (const [key, value] of icons) {
        const icon = document.createElement("img")
        icon.src = `https://raw.githubusercontent.com/banocean/ifv/refs/heads/dashboard-improvements/assets/icons/${value}`
        console.debug(key, value)
        const container = Array.from(document.querySelectorAll(".content-container .tile.box"))
            ?.find((e) => e.querySelector("h2").textContent === key)
            ?.querySelector(".tile__header.flex__items > .flex__item-auto")
        
        if (container) container.insertBefore(icon, container.firstChild)
        else console.debug(`Tile ${key} not found`)
    }
}

const changeTitles = () => {
    
}

const createToolbar = async () => {
    const element = document.createElement("div")
    element.classList.add("dashboard-info-toolbar")
    element.innerHTML = `
        <div>
            <img src="https://raw.githubusercontent.com/banocean/ifv/refs/heads/dashboard-improvements/assets/icons/star_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg">
            <span>-</span>
        </div>
        <div>
            <img src="https://raw.githubusercontent.com/banocean/ifv/refs/heads/dashboard-improvements/assets/icons/event_note_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg">
            <span>-</span>
        </div>
        <div>
            <img src="https://raw.githubusercontent.com/banocean/ifv/refs/heads/dashboard-improvements/assets/icons/mail_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.svg">
            <span>-</span>
        </div>
    </div>`
    
    const container = document.querySelector(".content-container > .tile-container > .tile-subcontainer")
    container.insertBefore(element, container.firstChild)
    
    const getLuckyNumber = () => document.querySelector(".lucky-number__circle.lucky-number__number > span")?.innerText
    waitForRender(getLuckyNumber).then(() => element.querySelector("div:first-of-type > span").innerText = getLuckyNumber())
    
    const getAmountOfMessages = () => document.querySelector("a[title=\"Przejdź do modułu wiadomości\"] .MuiBadge-anchorOriginTopRightRectangle").innerText
    waitForRender(getAmountOfMessages).then(() => element.querySelector("div:last-of-type > span").innerText = getAmountOfMessages())
    
    
}

window.appendModule({
    run: () => { applyIcons(); createToolbar(); },
    doesRunHere: () => window.location.href.endsWith("tablica"),
    onlyOnReloads: false,
    isLoaded: () =>
        document.querySelector(".plan-zajec") &&
        !document.querySelector(".spinner"),
});