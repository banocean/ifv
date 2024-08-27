const isMessagesPage = window.location.hostname.match(
    /(dziennik-)?wiadomosci.*/,
);

const doesElementExist = () =>
    document.querySelector(
        `.${isMessagesPage ? "account__name span" : "side_student"}`,
    );

const observer = new MutationObserver((mutationsList, observer) => {
    if (doesElementExist()) {
        observer.disconnect();
        displayFullName();
    }
});

function getStudentData() {
    return isMessagesPage
        ? document
              .querySelector(".account__name span")
              ?.firstChild?.textContent?.split(" ")
              .reverse()
              .join(" ")
        : document.querySelector(".side_student")?.firstChild?.textContent;
}

function displayFullName() {
    const studentData = getStudentData();

    if (!studentData) return;

    const studentNameSpan = document.createElement("span");
    studentNameSpan.style = "font-size: 20px;";
    studentNameSpan.innerHTML = `${studentData}`;

    const usernameContainer = document.querySelector(
        ".user div:nth-of-type(2)",
    );
    usernameContainer.style =
        "display: flex; flex-direction: column; font-size: 16px;";

    usernameContainer.insertBefore(
        studentNameSpan,
        usernameContainer.firstChild,
    );
}

if (doesElementExist()) {
    displayFullName();
} else
    observer.observe(document.body, {
        characterData: false,
        childList: true,
        attributes: false,
        subtree: true,
    });
