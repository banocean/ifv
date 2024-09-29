import { waitForRender } from "../apis/waitForElement.js";

const mapData = () =>
    Array.from(document.querySelectorAll(".app__content .MuiPaper-root")).map(
        (element) => {
            return {
                note: element.querySelector(".plan-zajec__accordion__wolne")?.innerText,
                day: element.querySelector(".MuiAccordionSummary-content > h2")?.innerText,
                lessons: Array.from(
                    element.querySelectorAll(
                        ".cell--single, .cell--multi--conflicted",
                    ),
                ).map((lesson) => {
                    const hoursText = (
                        lesson.querySelector(".position__lesson__hours, .conflicted--details--hours")
                            ?.innerText || "  "
                    ).split(" ");
                    const startingHour = hoursText[0];
                    const endingHour = hoursText[2];

                    const subjectText =
                        lesson
                            .querySelector(".position__lesson__subject")
                            ?.innerText?.split(" Grupa-") || [];

                    const annotationText = lesson.querySelector(
                        ".plan-position__adnotation-title",
                    )?.innerText;

                    const type = lesson.classList.contains(
                        "cell--multi--conflicted",
                    )
                        ? "conflicted"
                        : lesson.querySelector(".zastepstwo")
                            ? "substitute"
                            : lesson.querySelector(".odwolane")
                                ? "canceled"
                                : annotationText
                                    ? "unknown"
                                    : "normal";

                    return {
                        originalElement: lesson,
                        type,
                        subject: subjectText[0],
                        group: subjectText[1],
                        teacher: lesson.querySelector(".position__lesson__teacher")?.innerText,
                        classroom: [
                            ...(lesson.querySelector(
                                ".position__lesson__subject + span",
                            )?.innerText || ""),
                        ]
                            .filter((c) => !"()".includes(c))
                            .join(""),
                        annotationText,
                        startingHour,
                        endingHour,
                    };
                }),
            }
        }
    );

const isOpened = (element) => element.querySelector(".MuiCollapse-root")?.style?.height !== "0px"

const openAll = async () => {
    const container = document.querySelectorAll(".app__content .MuiPaper-root")
    for (const element of container) {
        if (!isOpened(element)) element.querySelector(".accordion__full-width__header h2")?.click()
        await waitForRender(() => isOpened(element), element)
    }
}

const mapStartingHours = (data) => {
    const all = new Set()
    for (const day of data) if (day.lessons) for (const lesson of day.lessons) if (lesson.startingHour) all.add(lesson.startingHour)
    const result = [...all].sort()
    const [firstHour, firstMinutes] = (result[0] || "08:00" ).split(":")
    return Number(firstHour) <= 7 && Number(firstMinutes) <= 30 ? result : ["7:00", ...result]
}

const renderDay = (data, startingHours) => {
    const element = document.createElement("section")
    element.classList.add("timetable")

    if (data.lessons.length < 1) {
        const infoElement = document.createElement("div")
        infoElement.innerHTML = "<div><span>Nie ma lekcji 😎</span><span></span></div>"
        if (data.note) infoElement.querySelector("span:last-of-type").innerText = data.note
    } else {
        for (const lesson of data.lessons) {
            const lessonElement = document.createElement("div")
            lessonElement.innerHTML = `
                <div>${startingHours.findIndex((h) => h === lesson.startingHour)}</div>
                <article>
                    <div class='info'><span></span><span></span></div>
                    <div class='data'></div>
                </article>
            `
            const lessonDataElement = lessonElement.querySelector(".data")

            const timeContainer = lessonElement.querySelector(".info")
            timeContainer.firstElementChild.innerText = lesson.startingHour
            timeContainer.lastElementChild.innerText = lesson.endingHour

            lessonElement.classList.add("lesson")
            lessonElement.classList.add(lesson.type)

            if (lesson.type === "conflicted") {
                lessonDataElement.innerHTML = `
                    <span class='conflict-title'>Wpisana jest więcej niż jedna lekcja</span>
                    <span class='conflict-description'>Kliknij, by dowiedzieć się więcej</span>
                `
            } else {
                lessonDataElement.innerHTML = `<div class="subject"></div> <div class="additional-info"></div>`
                lessonDataElement.querySelector(".subject").innerText = lesson.subject
                lessonDataElement.querySelector(".additional-info").innerText = `${lesson.classroom} ${lesson.teacher.split(" ").reverse().join(" ")}`
            }

            lessonElement.addEventListener("click", () => lesson.originalElement.querySelector("button").click())
            element.appendChild(lessonElement)
        }
    }

    return element
}

let currentIndex = 0
let data = []

const renderMove = (startingHours, direction = 1) => {
    document.querySelector("#root").scroll(0,0)
    const target = currentIndex + direction
    if (target >= data.length || target < 0) {
        if (target < 0) {
            currentIndex = 5
        } else {
            currentIndex = 0
        }
    } else {
        currentIndex = target
    }

    document.querySelector(".timetable").replaceWith(renderDay(data[currentIndex], startingHours))
    document.querySelector(".date-selector > div > span").innerText = data[currentIndex].day
}

const updateReactInput = (input, value) => {
    const setValue = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
    const event = new Event('input', { bubbles: true });

    setValue.call(input, value);
    input.dispatchEvent(event);
}

const renderDaySwitch = (startingHours) => {
    const element = document.createElement("div")
    element.innerHTML = `
        <input type="date">
        <div>
            <img src='https://raw.githubusercontent.com/banocean/ifv/refs/heads/redesigned-timetable/assets/icons/chevron_left_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'>
            <span>${data[currentIndex].day}</span>
            <img src='https://raw.githubusercontent.com/banocean/ifv/refs/heads/redesigned-timetable/assets/icons/chevron_right_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg'>
        </div>
    `

    element.querySelector("img:first-of-type").addEventListener("click", () => renderMove(startingHours, -1))
    element.querySelector("img:last-of-type").addEventListener("click", () => renderMove(startingHours, 1))
    element.classList.add("date-selector")

    const datePicker = element.querySelector("input");
    element.querySelector("span").addEventListener("click", () => datePicker.showPicker())
    datePicker.addEventListener("change", async () => {
        if (!datePicker.value) return
        updateReactInput(document.querySelector(".week-selector input"), datePicker.value)

        await waitForRender(isLoaded)
        await openAll()

        data = mapData()
        currentIndex = Math.max(getWeekStartingMonday(datePicker.valueAsDate.getDay()), data.length - 1)
        renderDay(data[currentIndex], startingHours)
    })

    datePicker.min = document.querySelector(".week-selector input").min
    datePicker.max = document.querySelector(".week-selector input").max

    return element
}

const dayNames = ["poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota", "niedziela"]
const getWeekStartingMonday = (i) => i === 0 ? 6 : i - 1

const run = async () => {
    document.querySelector("section.app__content .app__content__header").style.display = "none"
    document.querySelector("section.app__content .mobile__frame > div").style.display = "none"

    await openAll()
    data = mapData()
    const startingHours = mapStartingHours(data)

    const today = new Date()
    const day = getWeekStartingMonday(today.getDay())
    const i = data.findIndex((timetableDay) => (timetableDay.day || "-, ").split(", ")[0].toLowerCase() === dayNames[day]);

    currentIndex = i && i !== -1 ? i : Math.min(day, data.length - 1)

    document.querySelector("section.app__content .mobile__frame")
        .appendChild(renderDay(data[currentIndex], startingHours))
    document.querySelector("section.app__content .mobile__frame")
        .appendChild(renderDaySwitch(startingHours))
}

const isLoaded = () => document.querySelector(".app__content .MuiCollapse-root")?.style?.minHeight
    && document.querySelector("section.app__content .mobile__frame .plan-zajec") && !document.querySelector(".spinner")

window.appendModule({
    isLoaded,
    onlyOnReloads: false,
    run,
    doesRunHere: () => window.location.pathname.endsWith("planZajec")
})