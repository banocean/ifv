function injectWebManifest() {
    const metaLink = document.createElement("link");

    metaLink.setAttribute("rel", "manifest");
    metaLink.setAttribute(
        "href",
        window.location.hostname === "eduvulcan.pl" ?
            "https://raw.githubusercontent.com/banocean/ifv/main/pwa/manifest-eduvulcan.json" :
            `https://ifv-pwa.banocean.com/${window.location.pathname.split("/")[1]}`,
    );

    document.head.appendChild(metaLink);
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: injectWebManifest,
    doesRunHere: () => ["eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"].includes(window.location.hostname),
});
