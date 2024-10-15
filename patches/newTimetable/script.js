import { waitForRender } from "../apis/waitForElement.js";
import { SelectorRenderer } from "../apis/bottomDateSelector/index.js";

const normalizeLesson = (lesson) => {
    const hoursText = (
        lesson.querySelector(".position__lesson__hours, .conflicted--details--hours")
            ?.innerText || "  "
    ).split(" ");
    const startingHour = hoursText[0];
    const endingHour = hoursText[2];

    const subjectText =
        lesson
            .querySelector(".position__lesson__subject")
            ?.innerText?.split(/ Grupa-| \|/) || [];

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

}
const mapDay = (element) => Array.from(
    element.querySelectorAll(
        ".cell--single, .cell--multi--conflicted",
    ),
).map(normalizeLesson)

const mapData = () =>
    Array.from(document.querySelectorAll(".app__content .MuiPaper-root")).map(
        (element) => {
            return {
                note: element.querySelector(".plan-zajec__accordion__wolne")?.innerText,
                day: element.querySelector(".MuiAccordionSummary-content > h2")?.innerText,
                lessons: mapDay(element)
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

const getStartingHours = () => JSON.parse(localStorage.getItem("startingHours") || "[]")

const renderDay = async (data) => {
    await openAll()

    if (!data.note) {
        await waitForRender(() => document.querySelector(".details-btn--position-r-bottom"))
    }

    const startingHours = getStartingHours()
    const lessons = mapDay(data.element)
    const element = document.createElement("section")
    element.classList.add("timetable")

    if (lessons.length < 1) {
        const infoElement = document.createElement("div")
        infoElement.innerHTML = "<div><span>Nie ma lekcji 😎</span><br><span></span></div>"
        if (data.note) infoElement.querySelector("span:last-of-type").innerText = data.note
        element.appendChild(infoElement)
    } else {
        for (const lesson of lessons) {
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
                    <div class='subject'>Wpisana jest więcej niż jedna lekcja</div>
                    <div class='additional-info'>Kliknij, aby wyświetlić</div>
                `
            } else {
                lessonDataElement.innerHTML = `<div class="subject"></div> <div class="additional-info"></div>`
                lessonDataElement.querySelector(".subject").innerText = lesson.subject
                lessonDataElement.querySelector(".additional-info").innerText = `${lesson.classroom} ${lesson.teacher?.split(" ")?.reverse()?.join(" ")}`
            }

            lessonElement.addEventListener("click", () => lesson.originalElement.querySelector("button").click())
            element.appendChild(lessonElement)
        }
    }

    return element
}

const run = async () => {
    document.querySelector("section.app__content .app__content__header").style.display = "none"
    document.querySelector("section.app__content .mobile__frame > div").style.display = "none"

    await openAll()
    localStorage.setItem("startingHours", JSON.stringify(mapStartingHours(mapData())))

    new SelectorRenderer(renderDay)
}

const isLoaded = () => document.querySelector(".app__content .MuiCollapse-root")?.style?.minHeight
    && document.querySelector("section.app__content .mobile__frame .plan-zajec") && !document.querySelector(".spinner")

window.appendModule({
    isLoaded,
    onlyOnReloads: false,
    run,
    doesRunHere: () => window.location.pathname.endsWith("planZajec")
})