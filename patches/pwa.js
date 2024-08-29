function injectWebManifest() {
    const metaLink = document.createElement("link");

    metaLink.setAttribute("rel", "manifest");
    metaLink.setAttribute(
        "href",
        `${
            !window.location.hostname.startsWith("dziennik")
                ? "https://raw.githubusercontent.com/banocean/ifv/main/pwa/manifest-eduvulcan.json"
                : "todo: manifest for uonet"
        }`,
    );

    document.head.appendChild(metaLink);
}

window.modules.push({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: injectWebManifest,
    doesRunHere: () => ["eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"].includes(window.location.hostname),
});
