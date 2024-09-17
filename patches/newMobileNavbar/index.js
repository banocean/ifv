if (window.location.hostname.match(/^(dziennik-)?(uczen).*/)) window.asideMode = "hidden"

const getPages = (selector = "aside > section > .MuiList-root > ul") => {
    if (!document.querySelector("aside")) return []
    return Array.from(
        document.querySelector(selector).children
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

const BACK_ICON_URL = "https://raw.githubusercontent.com/banocean/ifv/new-navbar/assets/icons/keyboard_backspace_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"

const navIcons = {
    "tablica": "dashboard",
    "oceny": "counter_6",
    "frekwencja": "event_available",
    "planZajec": "calendar_clock"
}

const run = async () => {
    const nav = document.createElement("nav")
    nav.classList.add("bottom-navigation-bar")

    const more = document.createElement("div")
    more.classList.add("more-popup")
    more.classList.add("list-modal")
    more.innerHTML = `<div><img src='${BACK_ICON_URL}'><h1>Więcej</h1></div><div></div>`
    more.style.display = "none"

    more.querySelector("img").addEventListener("click", () => {
        more.style.display = "none"
        setHighlights()
    })

    await window.getFromAside(() => null) // We need aside to just load
    await window.waitForRender(() => getPages().length > 1)

    const navPages = ["tablica", "oceny", "frekwencja", "planZajec"]
    const pages = getPages()
    for (const page of pages) {
        const itemClass = Array.from(page.element.classList)
            .find((c) => !["MuiListItem-root", "MuiListItem-gutters", "selected"].includes(c))
        const item = document.createElement("div")

        if (!navPages.includes(itemClass)) {
            item.innerHTML = "<div class='icon'></div><span class='name'></span>"
            item.querySelector(".icon").style.content = page.icon
            item.querySelector(".name").innerText = page.name
            more.querySelector("div:last-of-type").appendChild(item)
        } else {
            item.innerHTML = `<div><img src="https://raw.githubusercontent.com/banocean/ifv/new-navbar/assets/icons/${navIcons[itemClass]}_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"></div><div></div>`
            item.querySelector("div:last-of-type").innerText = page.name
            nav.appendChild(item)
        }

        if (page.type === 1) {
            item.addEventListener("click", () => {
                document.querySelector(`.${itemClass} a`).click()
                more.style.display = "none"
                document.querySelector(".header__hamburger__icon button").click()
                document.querySelector("div#root").scroll(0,0)
                setHighlights()
            })
        } else {
            const detailedOptionsPage = document.createElement("div")
            detailedOptionsPage.innerHTML = `<div><img src='${BACK_ICON_URL}'><h1></h1></div><div></div>`
            detailedOptionsPage.style.zIndex = "4002"
            detailedOptionsPage.style.display = "none"
            detailedOptionsPage.classList.add("list-modal")

            detailedOptionsPage.querySelector("h1").innerText = page.name
            detailedOptionsPage.querySelector("img").addEventListener("click", () => {
                detailedOptionsPage.style.display = "none"
            })

            for (let i = 0; i < page.items.length; i++) {
                const option = page.items[i]
                const element = document.createElement("div")
                element.innerHTML = "<div class='icon'></div><span class='name'></span>"
                element.querySelector(".icon").style.content = page.icon
                element.querySelector(".name").innerText = option.firstChild.innerText
                element.addEventListener("click", () => {
                    Array.from(document.querySelectorAll(`.${itemClass} .items a`))[i].click()
                    detailedOptionsPage.style.display = "none"
                    more.style.display = "none"
                    document.querySelector(".header__hamburger__icon button").click()
                    document.querySelector("div#root").scroll(0,0)
                })
                detailedOptionsPage.lastElementChild.appendChild(element)
            }

            item.addEventListener("click", () => {
                detailedOptionsPage.style.display = "block"
            })

            document.body.appendChild(detailedOptionsPage)
        }
    }

    const moreButton = document.createElement("div")
    moreButton.innerHTML = `
        <div>
            <img src="https://raw.githubusercontent.com/banocean/ifv/new-navbar/assets/icons/menu_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg">
        </div>
        <div>Więcej</div>
        `
    moreButton.addEventListener("click", () => {
        more.style.display = "block"
        setHighlights()
    })
    nav.appendChild(moreButton)

    document.body.appendChild(nav)
    document.body.appendChild(more)
}


window.appendModule({
    run,
    doesRunHere: () => window.location.hostname.match(/^(dziennik-)?(uczen).*/) && window.innerWidth < 1024,
    onlyOnReloads: true,
    isLoaded: () => !!document.querySelector(".header__hamburger__icon")
})