window.waitForRender = async (fn, target = document.body) => {
    let resolve;
    const wait = new Promise((r) => (resolve = r));
    const observer = new MutationObserver((mutations, observer) => {
        if (!fn()) return;
        resolve();
        observer.disconnect();
    });
    observer.observe(target, { subtree: true, childList: true });

    const lastTry = fn();
    if (!lastTry) {
        await wait;
    }
};

window.skipModule();
