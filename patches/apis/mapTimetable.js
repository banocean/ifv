const normalizeLesson = (lesson) => {
    const hoursText = (
        lesson.querySelector(
            ".position__lesson__hours, .conflicted--details--hours",
        )?.innerText || "  "
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

    const type = lesson.classList.contains("cell--multi--conflicted")
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
            ...(lesson.querySelector(".position__lesson__subject + span")
                ?.innerText || ""),
        ]
            .filter((c) => !"()".includes(c))
            .join("")
            .trim(),
        annotationText,
        startingHour,
        endingHour,
    };
};
export const mapDay = (element) =>
    Array.from(
        element.querySelectorAll(".cell--single, .cell--multi--conflicted"),
    ).map(normalizeLesson);
