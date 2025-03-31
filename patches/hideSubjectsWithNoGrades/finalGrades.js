import { waitForRender } from "../apis/waitForElement.js";

const hideEmptyColumns = async () => {
    if (window.innerWidth > 1024) {
        await waitForRender(() => document.querySelector(".p-datatable-table .details-btn--appearance"));

        const headers = document.querySelectorAll('.p-datatable-table th');

        headers.forEach((header, idx) => {
            const cells = Array.from(document.querySelectorAll('tbody tr td:nth-child(' + (idx + 1) + ')'));
            const check = cells.some(cell => cell.textContent.trim().length > 0);

            const columnCells = document.querySelectorAll('tr th:nth-child(' + (idx + 1) + '), tr td:nth-child(' + (idx + 1) + ')');
            columnCells.forEach(cell => {
                cell.style.display = check ? '' : 'none';
            });
        });
    } else {
        await waitForRender(() => document.querySelector(".MuiAccordionDetails-root .grades__box .info-row"));
        setTimeout(() => {
            document.querySelectorAll('.info-row').forEach(e => {
                if (e.querySelector('.info-text > span').textContent.trim() === "" || e.querySelector('.info-text > span').textContent.trim() === "0") {
                    e.style.display = "none";
                }
            });
        }, 100)
    }
};

async function prep() {
    hideEmptyColumns()

    if (window.innerWidth > 1024) {
        await waitForRender(() => document.querySelector('.MuiTabs-flexContainer > button'))
        document.querySelectorAll(".MuiTabs-flexContainer > button").forEach(e => {
            e.addEventListener("click", () => {
                setTimeout(hideEmptyColumns, 100)
            })
        })
    } else {
        await waitForRender(() => document.querySelector('.MuiPaper-root .accordion__full-width__header'))
        document.querySelectorAll('.MuiPaper-root .accordion__full-width__header').forEach(e => {
            e.addEventListener("click", () => {
                setTimeout(hideEmptyColumns, 100);
            })
        })
    }
}

window.appendModule({
    run: prep,
    onlyOnReloads: false,
    doesRunHere: () =>
        window.location.pathname.endsWith("oceny"),
    isLoaded: () => true,
});
