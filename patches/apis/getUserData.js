window.getUserData = async () => {
    return await window.getFromAside(() => ({
        fullName: window.location.hostname.includes("wiadomosci")
            ? document
                .querySelector(".account__name span")
                ?.firstChild?.textContent?.split(" ")
                .reverse()
                .join(" ")
            : document.querySelector(".side_important-text.side_student")?.textContent,
        username: document.querySelector(".user div:nth-child(2)").lastChild.textContent,
    }))
}

window.skipModule()