const toggleModal = (e) => {
    document.querySelector(".modal-background").classList.toggle("active");
    document.querySelector(".modal-user").classList.toggle("active");
};

const moveUserOptionsToHeader = async () => {
    let isAlreadyVisible = document.querySelector("aside")
    if (!isAlreadyVisible) document.querySelector(".app").classList.add("hideAside");
    if (!isAlreadyVisible)
        document.querySelector(".header__hamburger__icon button").click();

    const selector = window.location.hostname.includes("wiadomosci")
        ? ".account_name span" : ".side_important-text.side_student"
    if (!document.querySelector(selector)) {
        let resolve
        const wait = new Promise((r) => resolve = r)
        const observer = new MutationObserver((mutations, observer) => {
            if (!document.querySelector(selector)) return
            resolve()
            observer.disconnect()
        })
        observer.observe(document.body, { subtree: true, childList: true })
        await wait
    }

    console.log("test")

    const userAvatar = document.querySelector(".user .MuiAvatar-root img");
    const userData = {
        fullName: window.location.hostname.includes("wiadomosci")
            ? document
                  .querySelector(".account__name span")
                  ?.firstChild?.textContent?.split(" ")
                  .reverse()
                  .join(" ")
            : document.querySelector(".side_important-text.side_student")
                  ?.textContent,
        username: document.querySelector(".user div:nth-child(2)").lastChild
            .textContent,
    };

    document.querySelector(".user").click();
    const userLinks = document.querySelectorAll(".user__links a");

    if (!isAlreadyVisible) {
        document.querySelector(".close-button").click();
        document.querySelector(".app").classList.remove("hideAside");
    }

    const modalBackground = document.createElement("div");
    const modalElement = document.createElement("div");

    modalBackground.classList.add("modal-background");
    modalElement.classList.add("modal-user");

    const userDataElement = document.createElement("div");
    userDataElement.classList.add("modal-data");

    const avatarElement = userAvatar.cloneNode(true);
    avatarElement.style.width = "50px";
    avatarElement.style.height = "50px";
    userDataElement.appendChild(avatarElement);

    const nameElement = document.createElement("div");
    nameElement.classList.add("modal-name");
    nameElement.innerHTML = `<span style="font-size: 20px">${userData?.fullname}</span><span style="font-size: 1rem;">${userData?.username}</span>`;
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
        })

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
    isLoaded: () => {
        document.querySelector(".header__logo-product")?.firstChild
            && document.querySelector(".header__hamburger__icon button")
    },
    onlyOnReloads: true,
    run: moveUserOptionsToHeader,
    doesRunHere: () =>
        !!window.location.hostname.match(/^(dziennik-)?(wiadomosci|uczen).*/) &&
        window.innerWidth < 1024,
});
