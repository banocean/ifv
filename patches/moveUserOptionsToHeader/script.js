import { waitForRender } from "../apis/waitForElement.js";
import { executeActionOnAside, getFromAside } from "../apis/aside.js";
import { getUserData } from "../apis/getUserData.js";

const toggleModal = () => {
    document.querySelector(".modal-background").classList.toggle("active");
    document.querySelector(".modal-user").classList.toggle("active");
};

const moveUserOptionsToHeader = async () => {
    const userLinks = await getFromAside(async () => {
        const user = document.querySelector(".user");
        if (user) {
            user.click();
            await waitForRender(() =>
                document.querySelector(".user__links a"),
            );
            return document.querySelectorAll(".user__links a");
        }
    });
    const userData = await getUserData();

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

    userLinks.forEach((link, i) => {
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("modal-link-container");

        const linkText = document.createElement("span");
        linkText.innerHTML = link.textContent;

        linkText.addEventListener("click", () => {
            executeActionOnAside(async () => {
                document.querySelector(".user").click();
                await waitForRender(() => document.querySelector(".user__links"));
                document.querySelectorAll(".user__links a")[i].click();
            });
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

    modalBackground.addEventListener("click", () => {
        history.back();
    });
    backButton.addEventListener("click", () => {
        history.back();
    });
    userAvatar.addEventListener("click", () => {
        toggleModal();
        history.pushState({ ...history.state, userModal: true }, "", `${location.pathname}#user-modal`);
    });

    document.body.appendChild(modalElement);
    document.body.appendChild(modalBackground);
    document
        .querySelector(".header_logo_tools_user-wrapper")
        .appendChild(userAvatar);

    addEventListener('popstate', (e) => {
        if (document.querySelector(".modal-user").classList.contains("active")) {
            toggleModal();
        }
    });
};

window.appendModule({
    isLoaded: () =>
        document.querySelector(".header__logo-product")?.firstChild &&
        document.querySelector(".header__hamburger__icon button"),
    onlyOnReloads: true,
    run: moveUserOptionsToHeader,
    doesRunHere: () =>
        !!window.location.hostname.match(/^(dziennik-)?(wiadomosci|uczen).*/),
});
