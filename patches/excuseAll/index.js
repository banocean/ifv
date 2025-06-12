const run = () => {
    const observer = new MutationObserver(() => {
        const modalBody = document.querySelector(".modal__horizontal__group")
        if (!modalBody || modalBody.querySelector(".excuse-all")) return
        
        const element = document.createElement("label");
        element.classList.add("excuse-all");
        element.innerHTML = `
            <span class="MuiButtonBase-root MuiIconButton-root c25 MuiCheckbox-root MuiCheckbox-colorSecondary simple-checkbox__box MuiIconButton-colorSecondary" aria-disabled="false">
                <span class="MuiIconButton-label">
                    <input class="c28" style="display: none" type="checkbox" data-indeterminate="false" aria-label="Usprawiedliw wszystko">
                    <svg class="MuiSvgIcon-root unchecked" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                    </svg>
                    <svg class="MuiSvgIcon-root checked" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                    </svg>
                </span>
                <span class="MuiTouchRipple-root"></span>
            </span>
            <span class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1">Usprawiedliw wszystko</span>
        `
        
        element.querySelector("input").addEventListener("change", () => {
            const isEnabled = element.querySelector("input").checked;
            document.querySelectorAll("input[aria-label=\"Usprawiedliw\"]")
                .forEach((i) => {
                    if(i.checked !== isEnabled) i.click()
                })
        })
        
        modalBody.insertBefore(element, modalBody.firstChild)
    })
    
    observer.observe(document.body, {
        childList: true
    })
}


window.appendModule({
    onlyOnReloads: true,
    run: run,
    doesRunHere: () => window.location.href.includes("frekwencja")
});