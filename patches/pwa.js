function injectWebManifest() {
    const metaLink = document.createElement("link");

    metaLink.setAttribute("rel", "manifest");
    metaLink.setAttribute(
        "href",
        `${
            !window.location.hostname.startsWith("dziennik")
                ? "https://gist.githubusercontent.com/PanLiszka/ba52ff26cd7fc774137766ea9f81f67e/raw/674836637599d6e91d5a47a2038e589ce48bcc32/manifest-eduvulcan.json"
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
