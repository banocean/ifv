import { waitForRender } from "../apis/waitForElement.js";

const mapData = () =>
    Array.from(document.querySelectorAll(".app__content section")).map(
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
                        lesson.querySelector(".position__lesson__hours")
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

let today = new Date();

const renderDay = (data) => {
    const element = document.createElement("section")
    element.classList.add("timetable")

    if (data.lessons.length < 1) {
        const infoElement = document.createElement("div")
        infoElement.innerHTML = "<div><span>Nie ma lekcji 😎</span><span></span></div>"
        if (data.note) infoElement.querySelector("span:last-of-type").innerText = data.note
    } else {
        for (const lesson of data.lessons) {
            const lessonElement = document.createElement("div")
            lessonElement.innerHTML = "<div>1</div><article><div class='info'><span></span><span></span></div><div class='data'></div></article>"
            const lessonDataElement = lessonElement.querySelector(".data")

            const timeContainer = lessonElement.querySelector(".info")
            timeContainer.firstElementChild.innerText = lesson.startingHour
            timeContainer.lastElementChild.innerText = lesson.endingHour

            lessonElement.classList.add("lesson")
            lessonElement.classList.add(lesson.type)

            if (lesson.type === "conflicted") {
                lessonDataElement.innerHTML = `
                    <span class='conflict-title'>Wpisane jest więcej niż jedna lekcja</span>
                    <span class='conflict-description'>Kliknij by dowiedzieć się więcej</span>
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

const run = async () => {
    document.querySelector("section.app__content").style.display = "none"
    await openAll()
    const currentData = mapData()

    document.querySelector("main.app__main").appendChild(renderDay(currentData[0]))
}

window.appendModule({
    isLoaded: () => document.querySelectorAll(".app__content .MuiPaper-root"),
    onlyOnReloads: false,
    run,
    doesRunHere: () => window.location.pathname.endsWith("planZajec")
})