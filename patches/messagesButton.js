function move() {
    const messages = document.createElement("div");
    messages.innerHTML = document.querySelector(".messages").innerHTML;
    messages.style.float = "right";
    messages.style.padding = "20px";
    messages.style.marginLeft = "auto";
    messages.querySelector(
        ".MuiBadge-anchorOriginTopRightRectangle",
    ).style.transitionDuration = "0ms";

    document
        .querySelector(".header_logo_tools-container")
        .appendChild(messages);
}

window.appendModule({
    run: move,
    doesRunHere: () =>
        window.location.hostname.match(/^(dziennik-)?(uczen).*/) &&
        window.innerWidth < 1024,
    onlyOnReloads: true,
    isLoaded: () => {
        return (
            !!document.querySelector(".header__hamburger__icon") &&
            !!document.querySelector("aside") &&
            getPages().length > 1 &&
            document.querySelector(".header_logo_tools-container") &&
            document.querySelector(".messages")
        );
    },
});
