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

window.appendModule({
    run: applyIcons,
    doesRunHere: () => window.location.href.endsWith("tablica"),
    onlyOnReloads: false,
    isLoaded: () =>
        document.querySelector(".plan-zajec") &&
        !document.querySelector(".spinner"),
});