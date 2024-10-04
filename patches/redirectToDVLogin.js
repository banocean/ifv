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

const newSpanContent = `
  Nie pamiętasz loginu lub hasła? Możemy wysłać na Twój <nobr>e-mail</nobr> link do zresetowania dostępu. 
  Przejdź do <a href="https://dziennik-logowanie.vulcan.net.pl/${pathSegment}/PasswordReset/UnlockRequest" class="link-simple">formularza</a> 
  lub użyj <a href="https://uonetplus.vulcan.net.pl/${pathSegment}" class="link-simple">innej metody logowania</a>
`;

const spanElements = document.querySelectorAll('span');

spanElements.forEach(span => {
  if (span.querySelector('nobr')) {
    span.innerHTML = newSpanContent;
  }
});



