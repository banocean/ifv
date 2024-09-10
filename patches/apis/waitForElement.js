window.waitForRender = async (fn) => {
    let resolve
    const wait = new Promise((r) => resolve = r)
    const observer = new MutationObserver((mutations, observer) => {
        if (!fn()) return
        resolve()
        observer.disconnect()
    })
    observer.observe(document.body, { subtree: true, childList: true })

    const lastTry = fn()
    if (!lastTry) {
        await wait
    }
}

window.skipModule()