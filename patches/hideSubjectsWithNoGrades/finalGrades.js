import { waitForRender, waitForReplacement } from "../apis/waitForElement.js";

const hideEmptyColumns = async () => {
    await waitForRender(() =>
        document.querySelector(".p-datatable-table .details-btn--appearance")
    );

    const headers = document.querySelectorAll(".p-datatable-table th");

    headers.forEach((header, idx) => {
        const cells = Array.from(
            document.querySelectorAll(
                "tbody tr td:nth-child(" + (idx + 1) + ")"
            )
        );
        const check = cells.some((cell) => cell.textContent.trim().length > 0);

        const columnCells = document.querySelectorAll(
            "tr th:nth-child(" +
                (idx + 1) +
                "), tr td:nth-child(" +
                (idx + 1) +
                ")"
        );
        columnCells.forEach((cell) => {
            cell.style.display = check ? "" : "none";
        });
    });
};

async function prep() {
    if (window.innerWidth > 1024) {
        await waitForRender(() =>
            document.querySelector(".MuiTabs-flexContainer > button")
        );

        hideEmptyColumns();
        document
            .querySelectorAll(".MuiTabs-flexContainer > button")
            .forEach((e) => {
                e.addEventListener("click", async () => {
                    await waitForReplacement(() =>
                        document.querySelector(
                            ".p-datatable-table .details-btn--appearance"
                        )
                    );
                    hideEmptyColumns();
                });
            });
    } else {
        await waitForRender(() =>
            document.querySelector(
                ".MuiAccordionDetails-root.accordion__full-width__content > .mobile__frame .grades__box"
            )
        );
        document
            .querySelectorAll(
                ".MuiAccordionDetails-root.accordion__full-width__content > .mobile__frame"
            )
            .forEach(async (semester) => {
                await waitForRender(() =>
                    semester.querySelector(
                        ".MuiAccordionDetails-root .grades__box .info-row .info-text > span"
                    )
                );
                semester.querySelectorAll(".info-row").forEach((e) => {
                    if (
                        e
                            .querySelector(".info-text > span")
                            .textContent.trim() === "" ||
                        e
                            .querySelector(".info-text > span")
                            .textContent.trim() === "0"
                    ) {
                        e.remove();
                    }
                });
            });
    }
}

window.appendModule({
    run: prep,
    onlyOnReloads: false,
    doesRunHere: () => window.location.pathname.endsWith("oceny"),
});
