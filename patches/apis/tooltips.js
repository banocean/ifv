/**
 * Show a tooltip with the specified text at the position relative to the target element. Hides after mouseleave.
 *
 * @param {Event} event event that triggered the tooltip (prob mouseenter)
 * @param {string} text text to display in the tooltip
 * @param {string} [position] position of the tooltip relative to the target element ('top', 'bottom', 'left', 'right')
 */
export function showTooltip(event, text, position = 'top') {
    addStylesIfNotPresent();

    const element = event.target;
    const tooltipWrapper = document.createElement("div");
    tooltipWrapper.className = `ifv-tooltip-wrapper`;
    tooltipWrapper.innerHTML = `
            <div class="ifv-tooltip">
                ${text}
            </div>
        `;

    document.body.appendChild(tooltipWrapper);

    const targetRect = element.getBoundingClientRect();
    const tooltipRect = tooltipWrapper.getBoundingClientRect();
    const gap = 8;

    let top, left;

    switch (position) {
        case "top":
            top = targetRect.top - tooltipRect.height - gap;
            left =
                targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
            break;
        case "bottom":
            top = targetRect.bottom + gap;
            left =
                targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
            break;
        case "left":
            top =
                targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
            left = targetRect.left - tooltipRect.width - gap;
            break;
        case "right":
            top =
                targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
            left = targetRect.right + gap;
            break;
    }

    tooltipWrapper.style.top = `${window.scrollY + top}px`;
    tooltipWrapper.style.left = `${window.scrollX + left}px`;

    requestAnimationFrame(() => {
        tooltipWrapper.classList.add("show");
    });

    element.addEventListener("mouseleave", () => {
        tooltipWrapper.classList.remove("show");

        setTimeout(() => {
                tooltipWrapper.remove();
        }, 200);
    });
}

function addStylesIfNotPresent() {
    if (document.querySelector('style#tooltip-styles')) return;

    const style = document.createElement('style');
    style.id = 'tooltip-styles';

    style.textContent = `
        .ifv-tooltip-wrapper {
            position: absolute;
            z-index: 99999;
        }

        .ifv-tooltip-wrapper .ifv-tooltip {
            background-color: #323232;
            border-radius: 4px;
            color: #fff;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            font-size: 12px;
            padding: 6px 10px;
            line-height: 1.4em;
            font-weight: 500;
        }

        .ifv-tooltip-wrapper .ifv-tooltip {
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 133ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ifv-tooltip-wrapper.show .ifv-tooltip {
            opacity: 1;
            transform: scale(1);
        }
    `;

    document.head.appendChild(style);
}