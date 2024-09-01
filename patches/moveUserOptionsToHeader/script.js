const toggleModal = () => {
    document.querySelector(".modal-background").classList.toggle("active");
}

const moveUserOptionsToHeader = () => {
    /* Open Aside */
    document.querySelector(".app").classList.add("hideAside");
    document.querySelector(".header__hamburger__icon button").click();

    const userAvatar = document.querySelector(".user .MuiAvatar-root img")

    document.querySelector(".user").click()
    const userLinks = document.querySelectorAll(".user__links a")

    /* Close Aside */
    document.querySelector(".close-button").click();
    document.querySelector(".app").classList.remove("hideAside");

    const modalBackground = document.createElement("div");
    const modalElement = document.createElement("div");

    modalBackground.classList.add("modal-background");
    modalElement.classList.add("modal");
    userLinks.forEach(link => {
        const linkContainer = document.createElement("div")
        linkContainer.classList.add("modal__link")
        linkContainer.appendChild(link)
        modalElement.appendChild(linkContainer)
    });
    modalElement.style.maxHeight = userLinks.length * 36 + "px"

    modalBackground.addEventListener("click", toggleModal)
    userAvatar.addEventListener("click", toggleModal)

    modalBackground.appendChild(modalElement)
    document.body.appendChild(modalBackground)
    document.querySelector(".header_logo_tools_user-wrapper").appendChild(userAvatar)
};

window.modules.push({
    isLoaded: () => document.querySelector(".header__logo-product")?.firstChild,
    onlyOnReloads: true,
    run: moveUserOptionsToHeader,
    doesRunHere: () => !!window.location.hostname.match(/^(dziennik-)?(wiadomosci|uczen).*/) && window.innerWidth < 1024
})