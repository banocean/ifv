const SEMESTERS = 2;
const renderVisibilityButtons = () => {
    for (let i = 0; i < SEMESTERS; i++) {
        const isVisible = localStorage.getItem(`hiddenSubjectsVisible:${i}`) === "true"
        toggleVisible(i, isVisible)
    }
}

// For some reason vulcan (prob react does that) overwrites entire classList when component is folded :/
const watchForClassListChanges = async (i) => {
    await window.waitForRender(() => getSemestersContainer()[i])
    const observer = new MutationObserver(() => {
        const isVisible = localStorage.getItem(`hiddenSubjectsVisible:${i}`) === "true"
        toggleVisible(i, isVisible)
    })
    getSemestersContainer()[i].addEventListener("click")
}

const getSemestersContainer = () => document.querySelector("section > section > .mobile__frame > .content-container").children

const toggleVisible = async (i, isVisible) => {
    await window.waitForRender(() => getSemestersContainer()[i].querySelector("article"), document.querySelector("section > section > .mobile__frame > .content-container"))
    const container = getSemestersContainer()[i]
    if (isVisible !== undefined) {
        if (isVisible) {
            container.classList.remove("hide-subjects")
        }
        else {
            container.classList.add("hide-subjects")
        }
    } else {
        container.classList.toggle("hide-subjects")
    }
    isVisible = !container.classList.contains("hide-subjects")
    localStorage.setItem(`hiddenSubjectsVisible:${i}`, isVisible)
    renderSettings(container, isVisible, i)
}

const createInfoElement = (container) => {
    const element = document.createElement("div")
    element.classList.add("hidden-subjects-info")
    container.children[1].insertBefore(element, container.children[1].firstChild)
    return element
}

const renderSettings = (container, isVisible, i) => {
    const secondChild = container.children[1]
    const element =
        secondChild.firstChild.classList.contains("hidden-subjects-info") ? secondChild.firstChild : createInfoElement(container)
    const numberOfSubjects = Array.from(container.querySelectorAll("article:has(.tile__content:first-of-type:empty)")).length
    if (numberOfSubjects === 0) {
        element.style.display = "none"
    } else {
        const FOLD_ICON_URL = "https://raw.githubusercontent.com/banocean/ifv/hswng/assets/icons/unfold_less_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"
        const UNFOLD_ICON_URL = "https://raw.githubusercontent.com/banocean/ifv/hswng/assets/icons/unfold_more_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"
        element.innerHTML = `${isVisible ? "Pokazano" : "Ukryto"} ${numberOfSubjects} przedmiotów bez ocen <button><img src="${isVisible ? `${FOLD_ICON_URL}">Ukryj` : `${UNFOLD_ICON_URL}">Pokaż`}</button>`
        element.querySelector("button").addEventListener("click", () => toggleVisible(i))
    }
}

window.appendModule({
    run: renderVisibilityButtons,
    onlyOnReloads: false,
    doesRunHere: () => window.location.pathname.endsWith("oceny") && window.innerWidth < 1024,
    isLoaded: () => document.querySelector("section > section > .mobile__frame > .content-container")
})