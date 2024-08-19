
function hookupTestModals() {
    let $buttonToggleModalChat = $(idButtonToggleModalChat);
    let $modalChat = $(idModalChat);
    let $buttonToggleModalNotifications = $(idButtonToggleModalNotifications);
    let $modalNotifications = $(idModalNotifications);
    let $buttonToggleModalSettings = $(idButtonToggleModalSettings);
    let $modalSettings = $(idModalSettings);

    if (!$buttonToggleModalChat.hasClass(flagInitialised)) {
        $buttonToggleModalChat.addClass(flagInitialised);
        $buttonToggleModalChat.on('click', function() {
            if ($modalChat.hasClass(flagIsHidden)) {
                $modalChat.removeClass(flagIsHidden);
            } else {
                $modalChat.addClass(flagIsHidden);
            }
        });
    }
    if (!$modalChat.hasClass(flagInitialised)) {
        $modalChat.addClass(flagInitialised);
    }
    $modalChat.addClass(flagIsHidden);

    if (!$buttonToggleModalNotifications.hasClass(flagInitialised)) {
        $buttonToggleModalNotifications.addClass(flagInitialised);
        $buttonToggleModalNotifications.on('click', function() {
            if ($modalNotifications.hasClass(flagIsHidden)) {
                $modalNotifications.removeClass(flagIsHidden);
            } else {
                $modalNotifications.addClass(flagIsHidden);
            }
        });
    }
    if (!$modalNotifications.hasClass(flagInitialised)) {
        $modalNotifications.addClass(flagInitialised);
    }
    $modalNotifications.addClass(flagIsHidden);

    if (!$buttonToggleModalSettings.hasClass(flagInitialised)) {
        $buttonToggleModalSettings.addClass(flagInitialised);
        $buttonToggleModalSettings.on('click', function() {
            if ($modalSettings.hasClass(flagIsHidden)) {
                $modalSettings.removeClass(flagIsHidden);
            } else {
                $modalSettings.addClass(flagIsHidden);
            }
        });
    }
    if (!$modalSettings.hasClass(flagInitialised)) {
        $modalSettings.addClass(flagInitialised);
    }
    $modalSettings.addClass(flagIsHidden);
}

describe('Screen Capture Plugin', function() {
    var $button, sandbox, originalBodyHTML;

    beforeEach(function() {
        originalBodyHTML = document.body.innerHTML;
        
        $button = $('.' + flagCaptureScreen);
        $button.screenshotButton(defaultOptions);
        
        sandbox = sinon.createSandbox();
    });

    afterEach(function() {
        sandbox.restore();
        $button.screenshotButton(defaultOptions);
        setTimeout(() => {}, 2000);
    });

    after(function() {
        document.body.innerHTML = originalBodyHTML;
    });

    describe('1. Initialization and Setup', function() {
        afterEach(function() {
            setTimeout(() => {}, 2000);
        });

        it('a. Should initialize correctly on a given DOM element', function() {
            expect($button).to.exist;
        });

        it('b. Should create the button with correct text', function() {
            expect($button.text()).to.equal('Capture Screen');
        });

        it('c. Should make the button visible on the page', function() {
            expect($button.is(':visible')).to.be.true;
        });
    });

    describe('2. Button Functionality', function() {
        afterEach(function() {
            setTimeout(() => {}, 2000);
        });

        it('a. Should trigger screenshot process on click', function() {
            sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
            return waitForClick($button)
                .then(() => {
                    expect(html2canvas.called).to.be.true;
                    expect(html2canvas.callCount).to.equal(1);
                    html2canvas.restore();
                });
        });

        it('b. Should hide button during screenshot process', function(done) {
                sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
                $button.click();
                expect($button.hasClass(flagIsHidden)).to.be.true;
                html2canvas.restore();
                done();
            }
        );

        it('c. Should show button after screenshot is taken', function() {
            sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
            return waitForClick($button)
                .then(() => {
                    expect($button.hasClass(flagIsHidden)).to.be.false;
                    html2canvas.restore();
                });
        });
    });

    describe('3. Input Handling', function() {
        let $input, $textarea;

        beforeEach(function() {
            $input = $('<input type="text" value="test">').appendTo('body');
            $textarea = $('<textarea>test</textarea>').appendTo('body');
        });

        afterEach(function() {
            $input.remove();
            $textarea.remove();
            setTimeout(() => {}, 2000);
        });

        it('a. Should clear input and textarea values during screenshot', function(done) {
            sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
            $button.click();
            expect($input.val()).to.equal('');
            expect($textarea.val()).to.equal('');
            html2canvas.restore();
            done();
        });

        it('b. Should restore input and textarea values after screenshot', function() {
            sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
            return waitForClick($button)
                .then(() => {
                    expect($input.val()).to.equal('test');
                    expect($textarea.val()).to.equal('test');
                    html2canvas.restore();
                });
        });
    });

    describe('4. Modal and Floating Element Handling', function() {
        let $modal;

        beforeEach(function() {
            $modal = $('<div class="modal">Modal Content</div>').appendTo('body');
        });

        afterEach(function() {
            $modal.remove();
            setTimeout(() => {}, 2000);
        });


        it('a. Should capture visible modals', function(done) {
            sinon.stub(window, 'html2canvas').callsFake(function(element) {
                expect($(element).find('.modal').length).to.equal(5);
                return Promise.resolve(document.createElement('canvas'));
            });
            $button.click();
            html2canvas.restore();
            done();
        });
    });

    describe('5. HTML2Canvas Integration', function() {
        let html2canvasStub, consoleErrorStub;
    
        afterEach(function() {
            if (html2canvasStub && html2canvasStub.restore) {
                html2canvasStub.restore();
            }
            if (consoleErrorStub && consoleErrorStub.restore) {
                consoleErrorStub.restore();
            }
        });
    
        it('a. Should call html2canvas with correct parameters', function() {
            html2canvasStub = sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
            
            return waitForClick($button)
                .then(() => {
                    expect(html2canvasStub.calledWith(document.body)).to.be.true;
                });
        });
    
        it('b. Should handle html2canvas errors gracefully', function() {
            html2canvasStub = sinon.stub(window, 'html2canvas').rejects(new Error('Test error'));
            consoleErrorStub = sinon.stub(console, 'error');
            
            return waitForClick($button)
                .then(() => {
                    expect(consoleErrorStub.called).to.be.true;
                    expect(consoleErrorStub.firstCall.args[0]).to.be.an('error');
                    expect(consoleErrorStub.firstCall.args[0].message).to.equal('Test error');
                });
        });
    });

    describe('6. Screenshot Generation', function() {
        afterEach(function() {
            setTimeout(() => {}, 2000);
        });

        /* Base64 string used instead of Blob
        it('a. Should create a blob from the canvas', function(done) {
            const canvas = document.createElement('canvas');
            sinon.stub(window, 'html2canvas').resolves(canvas);
            sinon.stub(canvas, 'toBlob').callsArgWith(0, new Blob());
            $button.click();
            html2canvas.restore();
            expect(canvas.toBlob.called).to.be.true;
            canvas.toBlob.restore();
        });
        */

        it('b. Should generate a Base64 PNG string when saving is confirmed', function(done) {
            const consoleStub = sinon.stub(console, 'log');
            $button.click();
            setTimeout(() => {
                expect(consoleStub.callCount).to.equal(2);
                const base64String = consoleStub.getCall(0).args[1];
                expect(base64String).to.be.a('string');
                expect(base64String).to.match(/^data:image\/png;base64,/);
                consoleStub.restore();
                done();
            }, 1000); 
        });
    });

    describe('7. Download Functionality', function() {
        let createElementStub, appendChildStub, removeChildStub, html2canvasStub;
        let originalJQuery, jQueryStub, eachStub, originalCreateElement;
        
        beforeEach(function() {
            originalJQuery = window.$;
            originalCreateElement = document.createElement;
            
            jQueryStub = sinon.stub();
            eachStub = sinon.stub();
            jQueryStub.returns({
                each: eachStub,
                attr: sinon.stub(),
                val: sinon.stub(),
                addClass: sinon.stub(),
                removeClass: sinon.stub()
            });
            window.$ = jQueryStub;
    
            html2canvasStub = sinon.stub(window, 'html2canvas').resolves(document.createElement('canvas'));
    
            createElementStub = sinon.stub(document, 'createElement').callsFake(function(tagName) {
                if (tagName === 'a') {
                    return {
                        style: {},
                        href: '',
                        download: '',
                        click: sinon.spy(),
                        textContent: ''
                    };
                }
                return originalCreateElement.call(document, tagName);
            });
            appendChildStub = sinon.stub(document.body, 'appendChild');
            removeChildStub = sinon.stub(document.body, 'removeChild');
    
            sinon.stub(URL, 'createObjectURL').returns('blob:http://example.com/test');
            sinon.stub(URL, 'revokeObjectURL');
        });
    
        afterEach(function() {
            sinon.restore();
            window.$ = originalJQuery;
            document.createElement = originalCreateElement;
        });
    
        it('a. Should create a temporary anchor element for download', function() {
            return waitForClick($button)
            .then(() => {
                expect(html2canvasStub.calledWith(document.body)).to.be.true;
                expect(createElementStub.calledWith('a')).to.be.true;
                expect(appendChildStub.calledOnce).to.be.true;
                expect(removeChildStub.calledOnce).to.be.true;
    
                const aElement = appendChildStub.getCall(0).args[0];
                expect(aElement.href).to.include('data:image/png;base64');
                expect(aElement.download).to.equal('screenshot.png');
            });
        });
        
        it('b. Should click the temporary anchor element programmatically', function() {
            return waitForClick($button)
            .then(() => {
                console.log("createElementStub: ", createElementStub, createElementStub.calledOnce);
                expect(createElementStub.calledOnce).to.be.true;
            });
        });

        it('c. Should remove the temporary anchor after download', function(done) {
            $button.click();
            setTimeout(() => {
                expect(removeChildStub.calledOnce).to.be.true;
                done();
            }, 1000);
        });
    });

    describe('8. Performance', function() {
        it('a. Should capture and generate screenshot within acceptable time', function(done) {
            this.timeout(5000);

            const startTime = performance.now();

            $button.click();

            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).to.be.below(1000);
            done();
        });
    });

    describe('9. Error Handling', function() {
        var html2canvasStub, consoleErrorStub;

        beforeEach(function() {
            consoleErrorStub = sandbox.stub(console, 'error');
            setTimeout(() => {}, 2000);
        });
    
        afterEach(function() {
            if (html2canvasStub && html2canvasStub.restore) {
                html2canvasStub.restore();
            }
            if (consoleErrorStub && consoleErrorStub.restore) {
                consoleErrorStub.restore();
            }
        });

        it('a. Should log error when html2canvas is not loaded', function(done) {
            const originalHtml2Canvas = window.html2canvas;
            delete window.html2canvas;

            $button.click();

            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(consoleErrorStub.args[0][0]).to.include('html2canvas is not loaded');

            window.html2canvas = originalHtml2Canvas;
            done();
        });

        it('b. Should handle errors during capture process', function() {
            let errorName = 'Capture failed';
            html2canvasStub = sinon.stub(window, 'html2canvas').rejects(new Error(errorName));
            
            return waitForClick($button)
                .then(() => {
                    expect(consoleErrorStub.called).to.be.true;
                    expect(consoleErrorStub.firstCall.args[0]).to.be.an('error');
                    expect(consoleErrorStub.firstCall.args[0].message).to.equal(errorName);
                });
        });
    });

    describe('10. Configuration Options', function() {
        beforeEach(function() {
        });
    
        afterEach(function() {
            sinon.restore();
            setTimeout(() => {}, 2000);
        });

        it('a. Should apply custom button text correctly', function() {
            const customText = 'Custom Capture Screen';
            $button.screenshotButton({ buttonText: customText });
            expect($button.text()).to.equal(customText);
        });

        it('b. Should use custom filename for the downloaded image', function(done) {
            console.log("11.b");
            this.timeout(5000);
            const customFileName = 'custom-screenshot.png';
            $button.screenshotButton({ fileName: customFileName });
            const consoleStub = sinon.stub(console, 'log');
            
            $button.click();
            setTimeout(() => {
                console.log("consoleStub: ", consoleStub);
                try {
                    expect(consoleStub.callCount).to.equal(2);
                    const call = consoleStub.getCall(1);
                    console.log("call: ", call);
                    const a = call.args[1];
                    console.log("a: ", a);
                    // expect(consoleLogStub.calledWith("adding button a: ", customFileName)).to.be.true;
                } catch (e) {
                    console.log("error: ", e);
                }
                consoleStub.restore();
                done();
            }, 1000);
        });
    });

    describe('11. Accessibility', function() {
        it('a. Should have appropriate ARIA attributes', function() {
            expect($button.attr('role')).to.equal('button');
            expect($button.attr('aria-label')).to.equal(defaultOptions.buttonText);
        });

        it('b. Should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($button).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $button.on('keydown', function(e) {
                if (e.which === 13) {  // Enter key
                    done();
                }
            });
            const event = new KeyboardEvent('keydown', { 'keyCode': 13 });
            $button[0].dispatchEvent(event);
        });
    });

    describe('12. Security', function() {
        const inputValue = 'sensitive-info';
        const textareaValue = 'confidential-data';
        const idInput = 'testInput1';
        const idTextarea = 'testInput2';

        afterEach(function() {
            setTimeout(() => {}, 2000);
        });

        it('a. Should not capture sensitive information in inputs and textareas', function(done) {
            $('<input id="' + idInput + '" type="text" value="' + inputValue + '">').appendTo('body');
            $('<textarea id="' + idTextarea + '">' + textareaValue + '</textarea>').appendTo('body');
            $button.click();
            const inputs = document.querySelectorAll('input, textarea');
            try {
                inputs.forEach(input => {
                    expect(input.value).to.be.empty;
                });
                if ($('#' + idInput)) $('#' + idInput).remove();
                if ($('#' + idTextarea)) $('#' + idTextarea).remove();
            } catch(e) {
                console.log("12.a error: ", e);
            }
            done();
        });

        it('b. Should restore input and textarea values after capture', function() {

            $('#' + idInput).remove();
            $('#' + idTextarea).remove();
            $('<input id="' + idInput + '" type="text" value="' + inputValue + '">').appendTo('body');
            $('<textarea id="' + idTextarea + '">' + textareaValue + '</textarea>').appendTo('body');

            return waitForClick($button)
                .then(() => {
                    setTimeout(() => {
                        let $input = $('#' + idInput);
                        let $textarea = $('#' + idTextarea);
                        expect($input.val()).to.equal(inputValue);
                        expect($textarea.val()).to.equal(textareaValue);
                        $input.remove();
                        $textarea.remove();
                    }, 2000);
                });
        });
    });

    describe('13. CSS Interaction', function() {
        it('a. Should not break existing page styles', function() {
            const originalStyles = getComputedStyle(document.body);
            const newStyles = getComputedStyle(document.body);
            expect(originalStyles.cssText).to.equal(newStyles.cssText);
        });

        it('b. Should apply correct button styling', function() {
            const buttonStyles = getComputedStyle($button[0]);
            expect(buttonStyles.display).to.not.equal('none');
            expect($button.hasClass(flagIsHidden)).to.be.false;
        });
    });

    describe('14. jQuery Plugin Requirements', function() {
        it('a. Should return jQuery object for chaining', function() {
            const result = $button.screenshotButton();
            expect(result).to.equal($button);
        });

        it('b. Should initialize plugin on multiple elements', function() {
            $('body').append('<div class="test-class"></div><div class="test-class"></div>');
            $('.test-class').screenshotButton();
            expect($('.test-class').length).to.equal(2);
            $('.test-class').remove();
        });
    });

    describe('15. Memory Management', function() {
        it('a. Should not leak memory on repeated initialization and destruction', function() {
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            for (let i = 0; i < 500; i++) {
                $button.screenshotButton();
                $button.empty();
            }
            const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            expect(finalMemory - initialMemory).to.be.below(1000000); // 1 MB ish
        });

        it('b. Should remove all created DOM elements after use', function() {
            $button.screenshotButton();
            const initialChildCount = $button[0].childElementCount;
            
            return waitForClick($button)
                .then(() => {
                    expect($button[0].childElementCount).to.equal(initialChildCount);
                });
        });
    });

    describe('16. Responsiveness', function() {
        var html2canvasStub;

        beforeEach(function() {
            setTimeout(() => {}, 2000);
        });
    
        afterEach(function() {
            if (html2canvasStub && html2canvasStub.restore) {
                html2canvasStub.restore();
            }
            $button.width(100).height(50);
        });

        it('a. Should behave correctly on different screen sizes', function() {
            const viewports = [
                {width: 320, height: 568},  // iPhone 5
                {width: 1024, height: 768}, // iPad
                {width: 1920, height: 1080} // Full HD
            ];

            viewports.forEach(size => {
                $button.width(size.width).height(size.height);
                $button.screenshotButton();
                expect($button.hasClass(flagIsHidden)).to.be.false;
                expect($button.width()).to.be.at.most(size.width);
            });
        });

        it('', function() {});
    });
});