const toggleModal = (e) => {
    console.log(e.target)
    document.querySelector(".modal-background").classList.toggle("active");
}

const moveUserOptionsToHeader = () => {
    /* Open Aside */
    document.querySelector(".app").classList.add("hideAside");
    document.querySelector(".header__hamburger__icon button").click();

    const userAvatar = document.querySelector(".user .MuiAvatar-root img")
    const userData = {
        fullname: document.querySelector(".side_important-text.side_student").textContent,
        username: document.querySelector(".user div:nth-child(2)").lastChild.textContent
    }

    document.querySelector(".user").click()
    const userLinks = document.querySelectorAll(".user__links a")

    /* Close Aside */
    document.querySelector(".close-button").click();
    document.querySelector(".app").classList.remove("hideAside");

    const modalBackground = document.createElement("div");
    const modalElement = document.createElement("div");

    modalBackground.classList.add("modal-background");
    modalElement.classList.add("modal__user");

    const userDataElement = document.createElement("div");
    userDataElement.classList.add("modal__data");

    const avatarElement = userAvatar.cloneNode(true)
    avatarElement.style.width = "50px"
    avatarElement.style.height = "50px"
    userDataElement.appendChild(avatarElement)

    const nameElement = document.createElement("div");
    nameElement.classList.add("modal__name");
    nameElement.innerHTML = `<span style="font-size: 20px">${userData?.fullname}</span><span style="font-size: 1rem;">${userData?.username}</span>`
    userDataElement.appendChild(nameElement)

    modalElement.appendChild(userDataElement)

    userLinks.forEach(link => {
        const linkContainer = document.createElement("div")
        linkContainer.classList.add("modal__link")
        linkContainer.appendChild(link)
        modalElement.appendChild(linkContainer)
    });

    const backButton = document.createElement("span")
    backButton.classList.add("modal__back")
    backButton.innerHTML = "Anuluj"
    modalElement.appendChild(backButton)


    modalBackground.addEventListener("click", toggleModal)
    modalElement.addEventListener("click", e => null)
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