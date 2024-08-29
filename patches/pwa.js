function injectWebManifest() {
    const metaLink = document.createElement("link");

    metaLink.setAttribute("rel", "manifest");
    metaLink.setAttribute(
        "href",
        // TODO: implement web manifest for UONET+
        "https://raw.githubusercontent.com/banocean/ifv/main/pwa/manifest-eduvulcan.json",
    );

    document.head.appendChild(metaLink);
}

window.modules.push({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: injectWebManifest,
    doesRunHere: () => ["eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"].includes(window.location.hostname),
});
