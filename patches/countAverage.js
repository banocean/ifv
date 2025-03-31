function modifyGradesRequests() {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    XMLHttpRequest.prototype.open = function () {
        this._requestMethod = arguments[0];
        this._requestURL = arguments[1];
        this._requestAsync = arguments[2];
        this._requestHeaders = {};
        return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        return originalXHRSetRequestHeader.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        const xhr = this;

        if (xhr._requestURL && xhr._requestURL.includes('/api/Oceny?')) {
            console.debug('Przechwycono żądanie do API ocen w celu wstrzyknięcia średnich:', xhr._requestURL);

            const originalOnReadyStateChange = xhr.onreadystatechange;

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        // Przechwycenie oryginalnej odpowiedzi
                        const originalResponse = xhr.responseText;
                        let data = JSON.parse(originalResponse);

                        console.debug('Oryginalna odpowiedź:', JSON.parse(JSON.stringify(data)));

                        // ================================
                        // Modyfikacja danych - cała magia
                        // ================================
                        if (data && data.ocenyPrzedmioty && Array.isArray(data.ocenyPrzedmioty)) {
                            data.ocenyPrzedmioty.forEach(subject => {
                                let grades = [];

                                if (subject.kolumnyOcenyCzastkowe && Array.isArray(subject.kolumnyOcenyCzastkowe)) {
                                    subject.kolumnyOcenyCzastkowe.forEach(column => {
                                        if (column.oceny && Array.isArray(column.oceny)) {
                                            column.oceny.forEach(grade => {
                                                if (grade.wpis && grade.wpis.match(/^[0-6](\+|\-)?$/)) {
                                                    let value;

                                                    if (grade.wpis.endsWith('+')) {
                                                        value = parseFloat(grade.wpis.slice(0, -1)) + 0.5;
                                                    } else if (grade.wpis.endsWith('-')) {
                                                        value = parseFloat(grade.wpis.slice(0, -1)) - 0.25;
                                                    } else {
                                                        value = parseFloat(grade.wpis);
                                                    }

                                                    for (let i = 0; i < grade.waga; i++) {
                                                        grades.push(value);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }

                                if (grades.length > 0) {
                                    let average = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)

                                    subject.srednia = average;
                                }
                            });

                            if (data.ustawienia) {
                                data.ustawienia.isSredniaAndPunkty = true;
                            }
                        }
                        // ================================

                        const modifiedResponse = JSON.stringify(data);
                        console.debug('Zmodyfikowana odpowiedź:', JSON.parse(modifiedResponse));

                        Object.defineProperty(xhr, 'responseText', {
                            get: function () {
                                return modifiedResponse;
                            }
                        });

                        Object.defineProperty(xhr, 'response', {
                            get: function () {
                                return modifiedResponse;
                            }
                        });
                    } catch (e) {
                        console.error('Błąd modyfikacji odpowiedzi:', e);
                    }
                }

                if (typeof originalOnReadyStateChange === 'function') {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }

        return originalXHRSend.apply(this, arguments);
    };
}

window.appendModule({
    run: modifyGradesRequests,
    onlyOnReloads: true,
    doesRunHere: () => window.location.href.includes("oceny")
});