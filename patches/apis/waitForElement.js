export const waitForRender = async (fn, target = document.body) => {
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

export const waitForReplacement = async (fn, target = document.body) => {
    const initialElement = fn();

    if (!initialElement) {
        return waitForRender(fn, target);
    }

    let resolveDisappear;
    const waitForDisappear = new Promise((r) => (resolveDisappear = r));

    const disappearObserver = new MutationObserver((mutations, observer) => {
        if (!document.body.contains(initialElement)) {
            resolveDisappear();
            observer.disconnect();
        }
    });

    disappearObserver.observe(target, { subtree: true, childList: true });

    await waitForDisappear;

    return waitForRender(fn, target);
};
