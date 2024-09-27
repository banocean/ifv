import { waitForRender } from "./waitForElement.js";
import { getFromAside } from "./aside.js";

export const getUserData = async () => {
    return await getFromAside(async () => {
        await waitForRender(
            () =>
                document.querySelector(
                    window.location.hostname.includes("wiadomosci")
                        ? ".account__name span"
                        : ".side_important-text.side_student",
                ) && document.querySelector(".user div:nth-child(2)"),
        );

        return {
            fullName: window.location.hostname.includes("wiadomosci")
                ? document
                      .querySelector(".account__name span")
                      ?.firstChild?.textContent?.split(" ")
                      .reverse()
                      .join(" ")
                : document.querySelector(".side_important-text.side_student")
                      ?.textContent,
            username: document.querySelector(".user div:nth-child(2)").lastChild
                .textContent,
        };
    });
};
