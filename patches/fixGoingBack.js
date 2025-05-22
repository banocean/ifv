import { waitForRender } from './apis/waitForElement.js';

const fixGoingBack = async () => {
    const observer = new MutationObserver(mutationHandler);
    observer.observe(document.body, {
        childList: true
    });
};

const mutationHandler = async (mutationList) => {
    for (const mutation of mutationList) {
        const modals = document.querySelectorAll('.MuiDrawer-modal');
        const modal = modals[modals.length - 1] || undefined;

        if (modal && modal.getAttribute('data-has-listener') !== 'true') {
            history.pushState({ ...history.state, details: true }, '', `${location.pathname}#`);
            modal.setAttribute('data-has-listener', 'true');

            for (const e of modals) {
                if (e === modal) continue;
                e.removeAttribute('data-has-listener');
            }

            await waitForRender(() => modal.querySelector('.modal-button--close'));
            const closeButton = modal.querySelector('.modal-button--close');

            addEventListener('popstate', popstateHandler(closeButton), { once: true });

            closeButton?.addEventListener('click', () => {
                if (history.state?.details) {
                    history.back();
                }
            });
        }
    }
};

const popstateHandler = (e) => () => {
    if (e?.closest("div[role=presentation].MuiDrawer-modal")?.getAttribute('data-has-listener') !== 'true') return;
    e?.click();
};

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: fixGoingBack,
    doesRunHere: () =>
        [
            "eduvulcan.pl",
            "uczen.eduvulcan.pl",
            "wiadomosci.eduvulcan.pl",
            "dziennik-uczen.vulcan.net.pl",
            "dziennik-wiadomosci.vulcan.net.pl"
        ].includes(window.location.hostname) && typeof InstallTrigger !== 'undefined',
});