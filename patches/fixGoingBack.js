import { waitForRender } from './apis/waitForElement.js';
import { setHighlights } from './newMobileNavbar/highlights.js';

const whereToApply = [
    {
        endpoint: "oceny", buttons: [
            { buttonPushingHistory: "button.grades__button__one-grade", closeButtonIndex: 2 },
            { buttonPushingHistory: "button.details-btn--appearance", closeButtonIndex: 2 }
        ]
    },
    {
        endpoint: "planZajec", buttons: [
            { buttonPushingHistory: "button.details-btn--position-r-bottom", closeButtonIndex: 1 }
        ]
    },
    {
        endpoint: "sprawdzianyZadaniaDomowe", buttons: [
            { buttonPushingHistory: "button.scheduler-simple-cell__all-plans-btn", closeButtonIndex: 1 },
            // { buttonPushingHistory: "button.scheduler-cell-item", closeButtonIndex: 2 }
        ]
    },
    {
        endpoint: ["odebrane", "wyslane", "kopie"], buttons: [
            { buttonPushingHistory: "div.message--details", closeButtonIndex: 0 },
            { buttonPushingHistory: "button.goto", closeButtonIndex: 0 },
            { buttonPushingHistory: "button.message-tools__delete", closeButtonIndex: 0 }
        ]
    },
    {
        endpoint: "usuniete", buttons: [
            { buttonPushingHistory: "div.message--details", closeButtonIndex: 0 },
            { buttonPushingHistory: "button.goto", closeButtonIndex: 0 },
            { buttonPushingHistory: "button.message-tools__delete", closeButtonIndex: 0 },
            { buttonPushingHistory: "button.message-tools__restore", closeButtonIndex: 0 }
        ]
    },
    {
        endpoint: "ustawienia", buttons: [
            { buttonPushingHistory: "button.primary-button", closeButtonIndex: 0 }
        ]
    }
];

const fixGoingBack = () => {
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

    let lastPathname;

    const observer = new MutationObserver(() => {
        const { endpoint, buttons } = whereToApply.find((e) =>
            Array.isArray(e.endpoint)
                ? e.endpoint.some(ep => location.pathname.includes(ep))
                : location.pathname.includes(e.endpoint)
        ) || {};

        if (endpoint !== undefined && lastPathname !== location.pathname) {
            setupButtonListeners(buttons);
        }
        lastPathname = location.pathname;
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
};

const setupButtonListeners = async (buttons) => {
    for (const { buttonPushingHistory, closeButtonIndex } of buttons) {
        await waitForRender(() => document.querySelector(buttonPushingHistory));
        document.querySelectorAll(buttonPushingHistory).forEach((e) => {
            e.addEventListener('click', async () => {
                history.pushState({ ...history.state, details: true }, '', `${location.pathname}#`);
                addEventListener('popstate', () => {
                    document.querySelectorAll('.close-button')[closeButtonIndex]?.click();
                }, { once: true });
                await waitForRender(() => document.querySelectorAll('.close-button')[closeButtonIndex]);
                document.querySelectorAll('.close-button')[closeButtonIndex].addEventListener('click', () => {
                    if (history.state?.details) {
                        history.back();
                    }
                });
            });
        });
    }
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
        ].includes(window.location.hostname),
});