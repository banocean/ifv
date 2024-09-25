const SEMESTERS = 2;
const renderVisibilityButtons = () => {
    for (let i = 0; i < SEMESTERS; i++) {
        hideEmptyFinalGradesInfo(i)
    }
}

const getSemestersContainer = () => document.querySelector("section > section > .mobile__frame > .content-container").children

const hideEmptyFinalGradesInfo = async (i) => {
    await window.waitForRender(() => getSemestersContainer()[i].querySelector("article"), document.querySelector("section > section > .mobile__frame > .content-container"))
    const container = getSemestersContainer()[i]
    const subjects = container.querySelectorAll("article")
    for (const subject of subjects) {
        const finalGrades = subject.querySelector(".tile__content:last-of-type")
        const predictedFinalGrade  = finalGrades.children[0]
        const finalGrade = finalGrades.children[1]
        if (!predictedFinalGrade.querySelector(".info-text > span")?.innerText?.trim()) {
            predictedFinalGrade.style.display = "none !important"
            if (!subject.querySelector(".border-b-1:empty")) debugger
        }

        if (!finalGrade.querySelector(".info-text > span")?.innerHTML?.trim()) {
            finalGrade.style.display = "none"
        }
    }
}

window.appendModule({
    run: renderVisibilityButtons,
    onlyOnReloads: false,
    doesRunHere: () => window.location.pathname.endsWith("oceny") && window.innerWidth < 1024,
    isLoaded: () => document.querySelector("section > section > .mobile__frame > .content-container")
})