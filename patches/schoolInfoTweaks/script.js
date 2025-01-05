function hideEmptyRows() {
    [...document.querySelectorAll('.info-row')].forEach(el => {
        const span = el.querySelector('.info-text > span');
        if (span.textContent === '  ') el.remove();
    })
}

window.appendModule({
    run: hideEmptyRows,
    onlyOnReloads: false,
    doesRunHere: () =>
        window.location.pathname.endsWith("szkola/informacje"),
    isLoaded: () =>
        document.querySelector(
            ".info-row",
        ),
});