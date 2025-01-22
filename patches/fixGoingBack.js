import { waitForRender } from './apis/waitForElement.js';
import { setHighlights } from './newMobileNavbar/highlights.js';

const whereToApply = [
    { endpoint: "oceny", button: "button.grades__button__one-grade", closeButtonIndex: 2 },
    { endpoint: "planZajec", button: "button.details-btn--position-r-bottom", closeButtonIndex: 1 },
    { endpoint: "sprawdzianyZadaniaDomowe", button: "button.scheduler-cell-item", closeButtonIndex: 2 },
];

const fixGoingBack = () => {
    addEventListener('popstate', (e) => {
        if (e.state?.wiecej) {
            document.querySelector('.more-popup').style.display = "block";
        } else {
            document.querySelectorAll('.list-modal').forEach((e) => {
                e.style.display = "none";
            });
        }
        setHighlights();
    });

    let lastPathname;

    const observer = new MutationObserver(() => {
        const { endpoint, button, closeButtonIndex } = whereToApply.find((e) => location.pathname.includes(e.endpoint)) || {};

        if (endpoint !== undefined && lastPathname !== location.pathname) {
            setupButtonListeners(endpoint, button, closeButtonIndex);
        }
        lastPathname = location.pathname;
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};

const setupButtonListeners = async (endpoint, button, closeButtonIndex) => {
    console.debug(endpoint, button, closeButtonIndex);
    await waitForRender(() => document.querySelector(button));
    document.querySelectorAll(button).forEach((e) => {
        e.addEventListener('click', async () => {
            history.pushState({ ...history.state, szczegoly: 1 }, '', `${location.pathname}#`);
            addEventListener('popstate', () => {
                if (location.pathname.endsWith(endpoint)) {
                    document.querySelectorAll('.close-button')[closeButtonIndex]?.click();
                }
            }, { once: true });
            await waitForRender(() => document.querySelectorAll('.close-button')[1]);
            document.querySelectorAll('.close-button')[closeButtonIndex].addEventListener('click', () => {
                if (history.state?.szczegoly) {
                    history.back();
                }
            });
        }  );
    });
};

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: fixGoingBack,
    doesRunHere: () =>
        [
            "eduvulcan.pl",
            "uczen.eduvulcan.pl",
            "dziennik-uczen.vulcan.net.pl",
        ].includes(window.location.hostname),
});