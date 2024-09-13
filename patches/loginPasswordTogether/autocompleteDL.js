function appendAutocomplete() {
    document.querySelector('#Login')?.setAttribute('autocomplete', 'username');
    document.querySelector('#Haslo')?.setAttribute('autocomplete', 'current-password');
}

window.appendModule({
    isLoaded: () => true,
    onlyOnReloads: true,
    run: appendAutocomplete,
    doesRunHere: () => true
});