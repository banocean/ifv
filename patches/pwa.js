function injectWebManifest() {
    const metaLink = document.createElement("link");

    metaLink.setAttribute("rel", "manifest");
    metaLink.setAttribute(
        "href",
        window.location.hostname === "uczen.eduvulcan.pl"
            ? `https://ifv-pwa.banocean.com/eduvulcan/${
                  window.location.pathname.split("/")[1]
              }`
            : `https://ifv-pwa.banocean.com/dziennik/${
                  window.location.pathname.split("/")[1]
              }`
    );

    document.head.appendChild(metaLink);
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: injectWebManifest,
    doesRunHere: () =>
        ["uczen.eduvulcan.pl", "dziennik-uczen.vulcan.net.pl"].includes(
            window.location.hostname
        ),
});
