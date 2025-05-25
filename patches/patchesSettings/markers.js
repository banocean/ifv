/**
 * Usuwa znaczniki <mark> z elementu
 *
 * @param {Node} element element, z którego usuwamy znaczniki <mark>
 * @returns {void}
 */
export async function removeMarks(element) {
    const marks = element.querySelectorAll("mark");
    marks.forEach(async (mark) => {
        const parent = mark.parentNode;
        while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark);
        }
        parent.removeChild(mark);
    });

    element.normalize();
}

/**
 * Zaznacza tekst w elemencie, który pasuje do podanego zapytania.
 *
 * @param {Node} element element, w którym zaznaczamy tekst
 * @param {string} textQueryToHighlight string do wyszukania
 * @returns {void}
 */
export async function markTextInElement(element, textQueryToHighlight) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT
    );
    const nodesToModify = [];

    let currentNode;
    while ((currentNode = walker.nextNode())) {
        const nodeText = currentNode.nodeValue;
        const lowerNodeText = nodeText.toLowerCase();

        if (lowerNodeText.includes(textQueryToHighlight)) {
            nodesToModify.push({
                node: currentNode,
                text: nodeText,
                query: textQueryToHighlight,
            });
        }
    }

    nodesToModify.forEach(async ({ node, text, query }) => {
        const lowerText = text.toLowerCase();
        let matchIndex = lowerText.indexOf(query);
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        while (matchIndex !== -1) {
            fragment.appendChild(
                document.createTextNode(text.substring(lastIndex, matchIndex))
            );
            const mark = document.createElement("mark");
            mark.textContent = text.substring(
                matchIndex,
                matchIndex + query.length
            );
            fragment.appendChild(mark);

            lastIndex = matchIndex + query.length;
            matchIndex = lowerText.indexOf(query, lastIndex);
        }
        fragment.appendChild(
            document.createTextNode(text.substring(lastIndex))
        );

        node.parentNode.replaceChild(fragment, node);
    });

    element.normalize();
}
