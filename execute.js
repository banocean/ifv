const modules = [];
let loadedScripts = 0;

const isEverythingLoaded = () =>
    document.querySelectorAll(".injected-script").length === loadedScripts;

window.appendModule = (...args) => {
    modules.push(...args);
    loadedScripts++;
    if (isEverythingLoaded()) execute();
};

const execute = () => {
    if (!modules.length)
        console.warn(
            "Script tried executing before all files loaded or all patches are disabled",
        );

    const isFirstRun = !window.iWasThere; // :)
    window.iWasThere = true;

    for (const { onlyOnReloads, doesRunHere, isLoaded, run } of modules) {
        if (onlyOnReloads && !isFirstRun) continue;
        if (doesRunHere !== undefined && !doesRunHere()) continue;

        if (!isLoaded || isLoaded()) run();
        else {
            const observer = new MutationObserver((mutationsList, observer) => {
                if (!isLoaded()) return;
                observer.disconnect();
                run();
            });
            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        }
    }
};

window.history.pushState = new Proxy(window.history.pushState, {
    apply: (target, a, args) => {
        target.apply(a, args);
        if (modules.length !== 0 && isEverythingLoaded()) execute();
    },
});
