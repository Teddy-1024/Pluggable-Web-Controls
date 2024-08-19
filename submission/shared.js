
var flagInitialised = "initialised";
var flagIsHidden = "is-hidden";
var flagIsVisible = "is-visible";

async function waitForClick($element) {
    return new Promise((resolve) => {
        $element.on('click', function() {
            resolve();
        });
        $element.click();
    });
}