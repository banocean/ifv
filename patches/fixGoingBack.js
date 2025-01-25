import { waitForRender } from './apis/waitForElement.js';
import { setHighlights } from './newMobileNavbar/highlights.js';

const fixGoingBack = async () => {
    addEventListener('popstate', (e) => {
        if (e.state?.more) {
            document.querySelector('.more-popup').style.display = "block";
        } else {
            document.querySelectorAll('.list-modal').forEach((e) => {
                e.style.display = "none";
            });
        }
        if (document.querySelector('.modal-user').classList.contains('active')) {
            history.forward();
            document.querySelector('.modal-user').classList.remove('active');
            document.querySelector('.modal-background').classList.remove('active');
        }
        if (!location.hostname.includes('wiadomosci')) {
            setHighlights();
        }
    });

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

            await waitForRender(() => modal.querySelector('.close-button'));
            const closeButton = modal.querySelector('.close-button');

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
    if (e?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute('data-has-listener') !== 'true') return;
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
        ].includes(window.location.hostname) && window.innerWidth < 1024,
});