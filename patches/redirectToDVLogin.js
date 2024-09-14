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
