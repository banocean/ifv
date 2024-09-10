const getAsideElement = async () => {
    if (window.asideMode === "hidden" && document.querySelector("aside")) {
        return document.querySelector("aside")
    } else {
        document.querySelector(".header__hamburger__icon button").click();
        await window.waitForRender(() => document.querySelector("aside"))
        document.querySelector("aside").classList.add("hideAside")
        return document.querySelector("aside")
    }
}

const closeAside = () => {
    const closeButton = document.querySelector("aside .close-button")
    if (window.asideMode !== "hidden") {
        if (closeButton) closeButton.click()
        document.querySelector("aside")?.classList?.remove("hideAside")
    }
}

window.clickOnAside = async (selector) => {
    const aside = await getAsideElement()
    aside.querySelector(selector)?.click()
    if (!document.querySelector("aside") && window.asideMode === "hidden") {
        document.querySelector(".header__hamburger__icon button").click();
    }
}

window.getFromAside = async (fn) => {
    const aside = await getAsideElement()
    const result = await fn(aside)
    closeAside()
    return result
}

window.skipModule()
