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

const isOpened = (element) => element.querySelector(".MuiCollapse-root")?.style?.minHeight === "0px"

const openAll = async () => {
    const container = document.querySelectorAll(".app__content .MuiPaper-root")
    for (const element of container) {
        if (isOpened(element)) element.querySelector(".accordion__full-width__header")?.click()
        await window.waitForRender(() => isOpened(element), element)
    }
}

const execute = () => {

}