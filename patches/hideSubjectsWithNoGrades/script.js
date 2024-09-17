const renderVisibilityButtons = () => {
    const SEMESTERS = 2;
    for (let i = 0; i < SEMESTERS; i++) {
        const isVisible = localStorage.getItem(`hiddenSubjectsVisible:${i}`) === "true"
        toggleVisible(i, isVisible)
    }
}

const toggleVisible = (i, isVisible) => {
    const container = document.querySelector("section > section > .mobile__frame > .content-container").children
    debugger
    if (isVisible !== undefined) {
        if (isVisible) container[i].classList.remove("hide-subjects")
        else container[i].classList.add("hide-subjects")
        debugger
    } else {
        container[i].classList.toggle("hide-subjects")
    }
    isVisible = container[i].classList.contains("hide-subjects")
    localStorage.setItem(`hiddenSubjectsVisible:${i}`, isVisible)
    renderSettings(container[i], isVisible, i)
}

const createInfoElement = (container) => {
    const element = document.createElement("div")
    element.classList.add("hidden-subjects-info")
    container.insertBefore(element, container.children[1])
    return element
}

const renderSettings = (container, isVisible, i) => {
    const secondChild = container.firstChild.children[1]
    debugger
    const element =
        secondChild.classList.contains("hidden-subjects-info") ? secondChild : createInfoElement(container)
    const numberOfSubjects = Array.from(container.querySelectorAll("article:has(.tile__content:first-of-type:empty)")).length
    debugger
    if (numberOfSubjects === 0) {
        element.style.display = "none"
    } else {
        debugger
        element.innerHTML = `Ukryto ${numberOfSubjects} przedmiotów bez ocen <button>${isVisible ? "Ukryj" : "Pokaż"}</button>`
        element.querySelector("button").addEventListener("click", () => toggleVisible(i))
    }
}

window.appendModule({
    run: renderVisibilityButtons,
    onlyOnReloads: false,
    doesRunHere: () => window.location.pathname.endsWith("oceny") && window.innerWidth < 1024,
    isLoaded: () => document.querySelector("section > section > .mobile__frame > .content-container")
})