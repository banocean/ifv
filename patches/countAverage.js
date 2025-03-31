function modifyGradesRequests() {
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function () {
        this._requestMethod = arguments[0];
        this._requestURL = arguments[1];
        return originalXHROpen.apply(this, arguments);
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
                                let sum = 0;
                                let totalWeight = 0;

                                if (subject.kolumnyOcenyCzastkowe && Array.isArray(subject.kolumnyOcenyCzastkowe)) {
                                    subject.kolumnyOcenyCzastkowe.forEach(column => {
                                        if (column.oceny && Array.isArray(column.oceny)) {
                                            column.oceny.forEach(grade => {
                                                if (grade.wpis && grade.wpis.match(/^[0-6](\+|\-)?$/)) {
                                                    let value = parseFloat(grade.wpis);
                                                    if (grade.wpis.includes('+')) value += 0.5;
                                                    else if (grade.wpis.includes('-')) value -= 0.25;

                                                    sum += value * grade.waga;
                                                    totalWeight += grade.waga;
                                                }
                                            });
                                        }
                                    });
                                }

                                if (totalWeight > 0) {
                                    subject.srednia = (sum / totalWeight).toFixed(2);
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
    doesRunHere: () => true
});