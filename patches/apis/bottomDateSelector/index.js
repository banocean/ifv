import { waitForRender } from "../waitForElement.js";

const dayNames = [
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
    "sobota",
    "niedziela",
];
const getWeekStartingMonday = (i) => (i === 0 ? 6 : i - 1);

const getWeek = (date) => {
    const DAY = 24 * 60 * 60 * 1000;
    const firstDay = new Date(`${date.getFullYear()}-01-01`);
    return Math.floor((date.getTime() - firstDay.getTime()) / DAY / 7);
};

const isSameWeek = (date, comparedDate) =>
    getWeek(date) === getWeek(comparedDate);

const updateReactInput = (input, value) => {
    const setValue = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(input),
        "value",
    ).set;
    const event = new Event("input", { bubbles: true });

    setValue.call(input, value);
    input.dispatchEvent(event);
};

export class SelectorRenderer {
    constructor(renderContentFn) {
        this.renderContent = renderContentFn;
        this.currentWeekDay = 0;

        this.#render().then(() => console.debug("Rendered date selector"));
    }

    #createSelector(dayName) {
        const element = document.createElement("div");
        element.innerHTML = `
            <input type="date">
            <div>
                <img src='https://raw.githubusercontent.com/banocean/ifv/refs/heads/redesigned-timetable/assets/icons/chevron_left_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'>
                <span></span>
                <img src='https://raw.githubusercontent.com/banocean/ifv/refs/heads/redesigned-timetable/assets/icons/chevron_right_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'>
            </div>
        `;

        const dayDisplay = element.querySelector("span");
        dayDisplay.innerText = dayName;
        dayDisplay.addEventListener("click", () =>
            element.querySelector("input").showPicker(),
        );

        const datePicker = element.querySelector("input");
        datePicker.addEventListener("change", () =>
            this.#setDay(datePicker.value, datePicker.valueAsDate),
        );

        element
            .querySelector("img:first-of-type")
            .addEventListener("click", () => this.#setSiblingDay(-1));
        element
            .querySelector("img:last-of-type")
            .addEventListener("click", () => this.#setSiblingDay(1));
        element.classList.add("date-selector");

        return element;
    }

    #updateSelectorDate(name) {
        document.querySelector(".date-selector span").innerText = name;
    }

    #getDaysDropdowns() {
        return Array.from(
            document.querySelectorAll(".app__content .MuiPaper-root"),
        ).map((element) => ({
            element,
            note: element.querySelector(".plan-zajec__accordion__wolne")
                ?.innerText,
            day: element.querySelector(".MuiAccordionSummary-content > h2")
                ?.innerText,
        }));
    }

    #isDayListLoaded() {
        return !document.querySelector(".spinner") && this.#isWeekChanged();
    }

    #isWeekChanged() {
        return (
            !this.firstDayName ||
            document.querySelector(
                ".app__content .MuiPaper-root .MuiAccordionSummary-content > h2",
            )?.innerText !== this.firstDayName
        );
    }

    async #setDay(value, valueDate) {
        if (
            !isSameWeek(
                document.querySelector(".week-selector input").valueAsDate,
                valueDate,
            )
        ) {
            this.#setChecking();

            if (!value || !valueDate) return;
            updateReactInput(
                document.querySelector(".week-selector input"),
                value,
            );

            await waitForRender(() => this.#isDayListLoaded());
        }

        this.currentWeekDay = Math.min(
            getWeekStartingMonday(valueDate.getDay()),
            this.cachedWeek.length - 1,
        );
        await this.#render();
    }

    async #setupAutoRender() {
        if (this.observer) return;
        this.observer = new MutationObserver(async () => {
            const content = await this.renderContent(
                this.cachedWeek[this.currentWeekDay],
            );
            content.classList.add("day-content");
            document.querySelector(".day-content").replaceWith(content);
        });

        this.observer.observe(
            document.querySelector(
                ".content-container__tab-subheader:has(.week-selector) + div",
            ),
            {
                childList: true,
                subtree: true,
            },
        );
    }

    async #render() {
        let replaceable = document.querySelector(".day-content");
        if (!replaceable) {
            replaceable = document.createElement("div");
            document
                .querySelector("section.app__content .mobile__frame")
                .appendChild(replaceable);
        }

        this.cachedWeek = this.#getDaysDropdowns();
        const content = await this.renderContent(
            this.cachedWeek[this.currentWeekDay],
        );
        content.classList.add("day-content");
        replaceable.replaceWith(content);

        if (document.querySelector(".date-selector")) {
            this.#updateSelectorDate(this.cachedWeek[this.currentWeekDay].day);
        } else
            document
                .querySelector("section.app__content .mobile__frame")
                .appendChild(
                    this.#createSelector(
                        this.cachedWeek[this.currentWeekDay].day,
                    ),
                );

        this.#setupAutoRender();
    }

    #setChecking() {
        this.firstDayName = this.cachedWeek[0].day;
    }

    async #setSiblingDay(direction = 1) {
        this.#setChecking();
        document.querySelector("#root").scroll(0, 0);

        const target = this.currentWeekDay + direction;
        if (target >= this.cachedWeek.length || target < 0) {
            if (target < 0) {
                this.currentWeekDay = 4;
                document
                    .querySelector(".week-selector > button:first-of-type")
                    .click();
            } else {
                this.currentWeekDay = 0;
                document
                    .querySelector(".week-selector > button:last-of-type")
                    .click();
            }

            await waitForRender(() => this.#isDayListLoaded());
        } else {
            this.currentWeekDay = target;
        }

        await this.#render();
    }
}
