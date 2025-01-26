const selector = document.createElement("div")
if (window.innerWidth >= 1024) selector.innerHTML =
    '<button class="MuiButtonBase-root MuiButton-root MuiButton-contained default-button primary-button" disabled><span class="MuiButton-label">Frekwencja</span></button><button class="MuiButtonBase-root MuiButton-root MuiButton-contained default-button primary-button"><span class="MuiButton-label">Statystyki</span></button>';
else selector.innerHTML = '<button disabled>Frekwencja</button><button><span>Statystyki</span></button><div></div><div></div>'
selector.classList.add("attendance-tabs")

const createSelector = () => {
    const container = window.innerWidth < 1024 ? ".app__content > .mobile__frame" : ".app__content > .desktop__frame"
    document.querySelector(container).insertBefore(selector, document.querySelector(container + "> *"))
    changeStatsVisibility(false)
}

const changeStatsVisibility = (isStatsVisible) => {
    const mainStats = document.querySelector(".content-container:has(.statistics)")
    mainStats.style.display = isStatsVisible ? "block" : "none"
    const element = document.querySelector(".tabsview")
    element.classList.add("attendance-init")
    if (isStatsVisible) element.classList.add("stats")
    else element.classList.remove("stats")
}

selector.querySelector("button:first-of-type").addEventListener("click", () => {
    changeStatsVisibility(false)

    selector.querySelector("button:first-of-type").disabled = true
    selector.querySelector("button:last-of-type").disabled = false
})

selector.querySelector("button:last-of-type").addEventListener("click", () => {
    changeStatsVisibility(true)

    selector.querySelector("button:first-of-type").disabled = false
    selector.querySelector("button:last-of-type").disabled = true
})

const isAttendancePage = () => window.location.pathname.endsWith("frekwencja")

const isRendered = () =>
    !!document.querySelector(".content-container:has(.statistics)")
        && !!document.querySelector(".tabsview")

window.appendModule({
    isLoaded: isRendered,
    run: createSelector,
    onlyOnReloads: false,
    doesRunHere: isAttendancePage
})