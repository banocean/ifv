function redirectToLoginPage() {
	window.location.pathname = `/${window.location.pathname.split("/")[1]}/LoginEndpoint.aspx`;
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: redirectToLoginPage,
    doesRunHere: () =>
        window.location.hostname === "dziennik-uczen.vulcan.net.pl"
		&& (typeof window.location.pathname.split("/")[2] === 'undefined'
		|| window.location.pathname.split("/")[2] === "")
});
