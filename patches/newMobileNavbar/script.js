const getPages = () => {
    if (!document.querySelector("aside")) return []
    return Array.from(
        document.querySelector("aside > section > .MuiList-root > ul").children
    ).map((item) => {
        const isDirectLink = item.classList.contains("MuiListItem-gutters")
        const icon = getComputedStyle(
            isDirectLink ? item : item.querySelector("div > button"), ":before"
        ).getPropertyValue("content");
        const name = item.querySelector(
            isDirectLink ? "a" : ".accordion__title__content"
        )?.innerText

        const items = isDirectLink ? undefined :
            Array.from(item.querySelector(".items").children)

        return {
            type: isDirectLink ? 1 : 2,
            element: item,
            items,
            icon,
            name
        }
    })
}

const run = () => {
    document.querySelector(".header__hamburger__icon button").click()

    const nav = document.createElement("nav")
    nav.classList.add(".bottom-navigation-bar")

    const more = document.createElement("div")
    more.classList.add("more-popup")
    more.innerHTML = "<div><img src=''</div><h1>Więcej</h1></div><div></div>"

    const ignoredPages = []
    const pages = getPages()

    console.log(pages)
    for (const page of pages) {
        const item = document.createElement("div")
        item.innerHTML = "<div class='icon'></div><span class='name'></span>"
        item.querySelector(".icon").style.content = page.icon
        item.querySelector(".name").innerText = page.name
        if (page.type === 1) item.addEventListener("click", () => {
            page.element.querySelector("a").click()
            more.style.display = "none"
        })
        more.querySelector("div:last-of-type").appendChild(item)
    }

    document.body.appendChild(more)
}

let alreadyClicked = false;

window.modules.push({
    run,
    doesRunHere: () => window.location.hostname.match(/^(dziennik-)?(uczen).*/) && window.innerWidth < 1024,
    onlyOnReloads: true,
    isLoaded: () => {
        if (!document.querySelector("aside") && !alreadyClicked) {
            alreadyClicked = true
            document.querySelector(".header__hamburger__icon button").click()
        }

        return !!document.querySelector(".header__hamburger__icon") &&
            !!document.querySelector("aside") && getPages().length > 1
    }
})