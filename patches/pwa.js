function injectWebManifest() {
    const metaLink = document.createElement("link");

    metaLink.setAttribute("rel", "manifest");
    metaLink.setAttribute("href", getManifestLink(window.location.hostname));

    document.head.appendChild(metaLink);
}

function getManifestLink(hostname) {
    switch (hostname) {
        case "eduvulcan.pl":
            return "https://raw.githubusercontent.com/banocean/ifv/main/pwa/manifest-eduvulcan.json";
        case "uczen.eduvulcan.pl":
            return `https://ifv-pwa.banocean.com/eduvulcan/${
                window.location.pathname.split("/")[1]
            }`;
        case "dziennik-uczen.vulcan.net.pl":
            return `https://ifv-pwa.banocean.com/dziennik/${
                window.location.pathname.split("/")[1]
            }`;
    }
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: injectWebManifest,
    doesRunHere: () =>
        [
            "eduvulcan.pl",
            "uczen.eduvulcan.pl",
            "dziennik-uczen.vulcan.net.pl",
        ].includes(window.location.hostname),
});
