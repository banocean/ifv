import { waitForRender } from "../apis/waitForElement.js";

const SEMESTERS = 2;
const renderVisibilityButtons = () => {
    for (let i = 0; i < SEMESTERS; i++) {
        hideEmptyFinalGradesInfo(i);
    }
};

const getSemestersContainer = () =>
    document.querySelector(
        "section > section > .mobile__frame > .content-container",
    ).children;
const getRowValue = (node) =>
    node?.querySelector(".info-text > span")?.innerText?.trim();

const hideEmptyFinalGradesInfo = async (i) => {
    await waitForRender(
        () => getSemestersContainer()[i].querySelector("article"),
        document.querySelector(
            "section > section > .mobile__frame > .content-container",
        ),
    );
    const container = getSemestersContainer()[i];
    const subjects = container.querySelectorAll("article");
    for (const subject of subjects) {
        const finalGrades = subject.querySelector(
            ".tile__content:last-of-type",
        );
        const predictedFinalGrade = finalGrades.children[0];
        const finalGrade = finalGrades.children[1];

        const predictedFinalGradeValue = getRowValue(predictedFinalGrade);
        const finalGradeValue = getRowValue(finalGrade);

        if (predictedFinalGrade && !predictedFinalGradeValue)
            predictedFinalGrade.style.display = "none";
        if (finalGrade && !finalGradeValue) {
            if (predictedFinalGrade)
                predictedFinalGrade.style.borderBottom = "none";
            finalGrade.style.display = "none";
        }

        if (!finalGradeValue && !predictedFinalGradeValue) {
            finalGrades.style.display = "none";
            subject.querySelector(
                ".tile__content.border-b-1",
            ).style.borderBottom = "none";
        }
    }
};

window.appendModule({
    run: renderVisibilityButtons,
    onlyOnReloads: false,
    doesRunHere: () => window.location.pathname.endsWith("oceny"),
    isLoaded: () =>
        document.querySelector(
            "section > section > .mobile__frame > .content-container",
        ),
});
