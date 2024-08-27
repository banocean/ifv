let studentData = document.querySelector(".side_student");
if (window.location.hostname.match(/(dziennik-)?wiadomosci.*/))
  studentData = document.querySelector(".account__name span").firstChild;

if (!studentData.textContent) return;

const studentNameSpan = document.createElement("span");
studentNameSpan.style = "font-size: 20px;";
studentNameSpan.innerHTML = `${studentData.textContent}`;

const usernameContainer = document.querySelector(".user div:nth-of-type(2)");
usernameContainer.style =
  "display: flex; flex-direction: column; font-size: 16px;";

usernameContainer.insertBefore(studentNameSpan, usernameContainer.firstChild);
