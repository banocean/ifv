function redirectToLoginPage() {
	window.location.pathname = `/${window.location.pathname.split("/")[1]}/LoginEndpoint.aspx`;
}

window.appendModule({
    onlyOnReloads: true,
    run: redirectToLoginPage,
    doesRunHere: () =>
        window.location.hostname === "dziennik-uczen.vulcan.net.pl"
		&& !window.location.pathname.split("/")[2]
});

const pathSegment = window.location.pathname.split("/")[1];

const targetSpan = document.querySelector('.input-components ~ .form-gap > span');

if (targetSpan) {
  const spanText = targetSpan.textContent;
    const newText = spanText.slice(0, -1);
    const additionalText = ` lub użyj <a href="https://uonetplus.vulcan.net.pl/${pathSegment}" class="link-simple">innej metody logowania</a>`;
    targetSpan.innerHTML = `${newText}${additionalText}`;
  }