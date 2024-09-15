let asideReads = 0;

const getAsideElement = async () => {
    if (window.asideMode === "hidden" && document.querySelector("aside")) {
        return document.querySelector("aside");
    }

    asideReads++;
    if (!document.querySelector("aside"))
        document.querySelector(".header__hamburger__icon button").click();
    await window.waitForRender(() => document.querySelector("aside"));
    document.querySelector("aside").classList.add("hideAside");
    return document.querySelector("aside");
};

const closeAside = () => {
    const closeButton = document.querySelector("aside .close-button");
    if (window.asideMode !== "hidden") {
        asideReads--;
        if (closeButton && asideReads <= 0) closeButton.click();
        document.querySelector("aside")?.classList?.remove("hideAside");
    }
};

window.executeActionOnAside = async (fn) => {
    const aside = await getAsideElement();
    await fn(aside)
    if (!document.querySelector("aside") && window.asideMode === "hidden") {
        document.querySelector(".header__hamburger__icon button").click();
    } else asideReads--;
}

window.clickOnAside = (selector) => window.executeActionOnAside((aside) => aside.querySelector(selector)?.click());

window.getFromAside = async (fn) => {
    const aside = await getAsideElement();
    const result = await fn(aside);
    closeAside();
    return result;
};

window.skipModule();
