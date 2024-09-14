const toggleModal = () => {
    document.querySelector(".modal-background").classList.toggle("active");
    document.querySelector(".modal-user").classList.toggle("active");
};

const moveUserOptionsToHeader = async () => {
    const userLinks = await window.getFromAside(async () => {
        const user = document.querySelector(".user");
        if (user) {
            user.click();
            await window.waitForRender(() =>
                document.querySelector(".user__links"),
            );
            return document.querySelectorAll(".user__links a");
        }
    });
    const userData = await window.getUserData();

    const modalBackground = document.createElement("div");
    const modalElement = document.createElement("div");

    modalBackground.classList.add("modal-background");
    modalElement.classList.add("modal-user");

    const userDataElement = document.createElement("div");
    userDataElement.classList.add("modal-data");

    const userAvatar = document.createElement("div");
    userAvatar.innerHTML = `<span>${userData.fullName[0]}</span>`;
    userAvatar.classList.add("user-avatar");
    userDataElement.appendChild(userAvatar.cloneNode(true));

    const nameElement = document.createElement("div");
    nameElement.classList.add("modal-name");
    nameElement.innerHTML = `<span style="font-size: 20px">${userData?.fullName}</span><span style="font-size: 1rem;">${userData?.username}</span>`;
    userDataElement.appendChild(nameElement);

    modalElement.appendChild(userDataElement);

    userLinks.forEach((link) => {
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("modal-link-container");

        const linkText = document.createElement("span");
        linkText.innerHTML = link.textContent;

        linkText.addEventListener("click", () => {
            link.click();
            toggleModal();
        });

        linkContainer.appendChild(linkText);
        modalElement.appendChild(linkContainer);
    });

    const backButtonContainer = document.createElement("div");
    backButtonContainer.classList.add("modal-back-container");
    const backButton = document.createElement("span");
    backButton.classList.add("modal-cancel");
    backButton.innerHTML = "Anuluj";
    backButtonContainer.appendChild(backButton);
    modalElement.appendChild(backButtonContainer);

    modalBackground.addEventListener("click", toggleModal);
    backButton.addEventListener("click", toggleModal);
    userAvatar.addEventListener("click", toggleModal);

    document.body.appendChild(modalElement);
    document.body.appendChild(modalBackground);
    document
        .querySelector(".header_logo_tools_user-wrapper")
        .appendChild(userAvatar);
};

window.appendModule({
    isLoaded: () =>
        document.querySelector(".header__logo-product")?.firstChild &&
        document.querySelector(".header__hamburger__icon button"),
    onlyOnReloads: true,
    run: moveUserOptionsToHeader,
    doesRunHere: () =>
        !!window.location.hostname.match(/^(dziennik-)?(wiadomosci|uczen).*/) &&
        window.innerWidth < 1024,
});
