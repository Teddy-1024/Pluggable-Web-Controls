const keyCodeEnter = 13;

describe('Image Annotation Control', function() {
    var $annotatorPNG, $toolbox, $inputUploadImage, $buttonAddArrow, $buttonAddTextbox, $selectAddSymbol, $inputColourPicker, $buttonEraseMode, $buttonSaveImage, $containerAnnotation, $canvasAnnotation;

    beforeEach(function() {
        $annotatorPNG = $(document).find("." + flagAnnotatorPNG);
        $annotatorPNG.annotatorPNG(annotatorSettings);
        $toolbox = $annotatorPNG.find("." + flagToolbox);
        $inputUploadImage = $toolbox.find("." + flagUploadImage);
        $buttonAddArrow = $toolbox.find("." + flagAddArrow);
        $buttonAddTextbox = $toolbox.find("." + flagAddTextbox);
        $selectAddSymbol = $toolbox.find("." + flagAddSymbol);
        $inputColourPicker = $toolbox.find("." + flagColourPicker);
        $buttonEraseMode = $toolbox.find("." + flagEraseMode);
        $buttonSaveImage = $toolbox.find("." + flagSaveImage);
        $containerAnnotation = $annotatorPNG.find("." + flagContainerAnnotation);
        $canvasAnnotation = $containerAnnotation.find("." + flagCanvasAnnotation);
    });

    afterEach(function() {
        let canvas = $($containerAnnotation.children()[0].children[0]).clone();
        $containerAnnotation.empty();
        $containerAnnotation.append(canvas);
    });

    describe('1. Initialization and Setup', function() {
        it('a. Should initialize correctly on a given DOM element', async function() {
            expect($annotatorPNG).to.exist;
        });

        it('b. Should create canvas with correct dimensions', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            expect(canvas.width).to.equal(800);
            expect(canvas.height).to.equal(600);
            expect($canvasAnnotation.attr('width')).to.equal('800');
            expect($canvasAnnotation.attr('height')).to.equal('600');
        });

        it('c. Should have all UI elements present with correct values after initialization', async function() {
            expect($annotatorPNG.find("." + flagToolbox)).to.have.length(1);
            expect($annotatorPNG.find("." + flagUploadImage)).to.have.length(1);
            expect($annotatorPNG.find("." + flagAddArrow)).to.have.length(1);
            expect($annotatorPNG.find("." + flagAddTextbox)).to.have.length(1);
            expect($annotatorPNG.find("." + flagAddSymbol)).to.have.length(1);
            expect($annotatorPNG.find("." + flagColourPicker)).to.have.length(1);
            expect($annotatorPNG.find("." + flagEraseMode)).to.have.length(1);
            expect($annotatorPNG.find("." + flagSaveImage)).to.have.length(1);
            expect($annotatorPNG.find("." + flagContainerAnnotation)).to.have.length(1);
            expect($annotatorPNG.find("." + flagCanvasAnnotation).length > 0).to.be.true;
            /*
            expect($toolbox).to.exist;
            expect($inputUploadImage).to.exist;
            expect($buttonAddArrow).to.exist;
            expect($buttonAddTextbox).to.exist;
            expect($selectAddSymbol).to.exist;
            expect($selectAddSymbol.find("option")).to.exist;
            expect($inputColourPicker).to.exist;
            expect($buttonEraseMode).to.exist;
            expect($buttonSaveImage).to.exist;
            expect($containerAnnotation).to.exist;
            expect($canvasAnnotation).to.exist;
            */

            expect($inputUploadImage.val()).to.equal('');
            expect($inputColourPicker.val()).to.equal('#ff0000');
            expect($buttonSaveImage.text().length > 0).to.be.true; // For unkown settings argument value
            expect($buttonSaveImage.text()).to.equal('Save Image');
            expect($canvasAnnotation.data(keyFabric)).to.exist;
        });
    });

    describe('2. Image Upload and Display', function() {
        it('a. Should successfully upload a PNG file', function(done) {
            const file = new File([''], 'screenshot (16).png', { type: 'image/png' });
            const fileInput = $inputUploadImage[0];
            
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            $(fileInput).trigger('change');

            setTimeout(() => {
                let canvas = $canvasAnnotation.data(keyFabric);
                if (canvas) console.log("canvas.backgroundImage: " + canvas.backgroundImage);
                expect(canvas.backgroundImage).to.exist;
                done();
            }, 100);
        });

        it('b. Should display the uploaded image correctly on the canvas', function(done) {
            const file = new File([''], 'screenshot (16).png', { type: 'image/png' });
            const fileInput = $inputUploadImage[0];
            
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            $(fileInput).trigger('change');

            setTimeout(() => {
                try {
                    let canvas = $canvasAnnotation.data(keyFabric);
                    let context = canvas.getContext('2d');
                    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    expect(canvas.width).to.equal(800);
                        expect(canvas.height).to.equal(600);
                        expect(imageData.data.length).to.equal(800 * 600 * 4);
                    done();
                }
                catch (e) {
                    console.log("Error during canvas initialisation: " + e);
                    done(e);
                }
            }, 100);
        });

        it('d. Should handle invalid file types', async function() {
            const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = $inputUploadImage[0];
            
            const confirmStub = sinon.stub(window, 'alert').returns(true);
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            expect(() => $(fileInput).trigger('change')).to.throw();
            confirmStub.restore();
        });
    });

    describe('3. Arrow Addition', function() {
        it('a. Should create a new arrow on the canvas when "Add Arrow" is clicked', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            console.log("canvas: " + canvas);
            await waitForClick($buttonAddArrow);
            console.log("canvas after: " + canvas);
            expect(canvas.getObjects()).to.have.lengthOf(1);
            expect(canvas.getObjects()[0].type).to.equal('path');
        });

        it('b. Should create arrow with correct default properties', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddArrow);
            const arrow = canvas.getObjects()[0];
            expect(arrow.fill).to.equal('#ff0000');
            expect(arrow.stroke).to.equal('#ff0000');
            expect(arrow.strokeWidth).to.equal(2);
        });

        it('c. Should allow multiple arrows to be added to the canvas', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddArrow);
            await waitForClick($buttonAddArrow);
            expect(canvas.getObjects()).to.have.lengthOf(2);
        });
    });

    describe('4. Textbox Addition', function() {
        it('a. Should create a new textbox on the canvas when "Add Textbox" is clicked', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddTextbox);
            expect(canvas.getObjects()).to.have.lengthOf(1);
            expect(canvas.getObjects()[0].type).to.equal('textbox');
        });

        it('b. Should create textbox with correct default properties', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddTextbox);
            const textbox = canvas.getObjects()[0];
            expect(textbox.fontSize).to.equal(20);
            expect(textbox.left).to.equal(100);
            expect(textbox.top).to.equal(100);
        });

        it('c. Should allow text to be entered and edited in the textbox', async function() {
            this.timeout(10000);
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddTextbox);
            const textbox = canvas.getObjects()[0];
            console.log("textbox: " + textbox);
            textbox.text = 'New Text';
            console.log("textbox: " + textbox);
            canvas.renderAll();
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(textbox.text).to.equal('New Text');
        });

        it('d. Should allow multiple textboxes to be added to the canvas', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddTextbox);
            await waitForClick($buttonAddTextbox);
            expect(canvas.getObjects()).to.have.lengthOf(2);
        });
    });

    describe('5. Element Manipulation', function() {
        it('a. Should allow arrows to be selected, moved, resized, and rotated', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddArrow);
            const arrow = canvas.getObjects()[0];
            arrow.set({ left: 150, top: 150, scaleX: 2, angle: 45 });
            canvas.renderAll();
            expect(arrow.left).to.equal(150);
            expect(arrow.top).to.equal(150);
            expect(arrow.scaleX).to.equal(2);
            expect(arrow.angle).to.equal(45);
        });

        it('b. Should allow textboxes to be selected, moved, resized, and rotated', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddTextbox);
            const textbox = canvas.getObjects()[0];
            textbox.set({ left: 150, top: 150, scaleX: 2, angle: 45 });
            canvas.renderAll();
            expect(textbox.left).to.equal(150);
            expect(textbox.top).to.equal(150);
            expect(textbox.scaleX).to.equal(2);
            expect(textbox.angle).to.equal(45);
        });
    });

    describe('6. Erasing Elements', function() {
        afterEach(function() {
            setTimeout(() => {}, 2000);
            $annotatorPNG.annotatorPNG(annotatorSettings);
        });

        it('a. Should remove the currently selected arrow when "Erase Element" is clicked', async function() {
            let canvas = $canvasAnnotation.data(keyFabric);
            await waitForClick($buttonAddArrow);
            canvas.setActiveObject(canvas.getObjects()[0]);
            await waitForClick($buttonEraseMode);
            expect(canvas.getObjects()).to.have.lengthOf(0);
        });

        it('b.  Should remove the currently selected textbox when "Erase Element" is clicked', function(done) {
            this.timeout(10000);
            let canvas = $canvasAnnotation.data(keyFabric);
            waitForClick($buttonAddTextbox).then(() => {
                canvas.setActiveObject(canvas.getObjects()[0]);
                canvas.renderAll();
                waitForClick($buttonEraseMode).then(() => {
                    canvas.renderAll();
                    expect(canvas.getObjects()).to.have.lengthOf(0);
                    done();
                });
            });
        });

        it('c. Should not affect other elements on the canvas when erasing', function(done) {
            this.timeout(10000);
            let canvas = $canvasAnnotation.data(keyFabric);
            waitForClick($buttonAddArrow).then(() => {
                console.log("canvas.getObjects()[0]: ", canvas.getObjects()[0]);
                waitForClick($buttonAddTextbox).then(() => {
                    canvas.setActiveObject(canvas.getObjects()[0]);
                    waitForClick($buttonEraseMode).then(() => {
                        expect(canvas.getObjects()).to.have.lengthOf(1);
                        console.log("canvas.getObjects()[0]: ", canvas.getObjects()[0]);
                        expect(canvas.getObjects()[0].text).to.exist;
                        done();
                    });
                });
            });
        });
    });

    describe('7. Saving Functionality', function() {
        it('a. Should trigger confirmation dialog when "Save" is clicked', async function() {
            const confirmStub = sinon.stub(window, 'confirm').returns(true);
            const alertStub = sinon.stub(window, 'alert').returns(true);
            await waitForClick($buttonSaveImage);
            expect(confirmStub.calledOnce).to.be.true;
            confirmStub.restore();
            alertStub.restore();
        });

        it('b. Should prevent saving when confirmation dialog is canceled', async function() {
            const confirmStub = sinon.stub(window, 'confirm').returns(false);
            const consoleStub = sinon.stub(console, 'log');
            await waitForClick($buttonSaveImage);
            expect(consoleStub.called).to.be.false;
            confirmStub.restore();
            consoleStub.restore();
        });

        it('c. Should generate a Base64 PNG string when saving is confirmed', async function() {
            sinon.stub(window, 'confirm').returns(true);
            const alertStub = sinon.stub(window, 'alert').returns(true);
            const consoleStub = sinon.stub(console, 'log');
            await waitForClick($buttonSaveImage);
            expect(consoleStub.calledOnce).to.be.true;
            const base64String = consoleStub.getCall(0).args[1];
            expect(base64String).to.be.a('string');
            expect(base64String).to.match(/^data:image\/png;base64,/);
            window.confirm.restore();
            consoleStub.restore();
            alertStub.restore();
        });
    });

    describe('8. Edge Cases and Error Handling', function() {
        it('a. Should handle initialization on invalid DOM element', async function() {
            expect(() => $('#non-existent-element').imageAnnotator()).to.throw();
        });
    });

    describe('9. Performance', function() {
        it('a. Should capture and generate screenshot within acceptable time', function(done) {
            this.timeout(5000);

            const startTime = performance.now();
            const alertStub = sinon.stub(window, 'alert').returns(true);
            const confirmStub = sinon.stub(window, 'confirm').returns(true);

            $buttonSaveImage.click();

            const endTime = performance.now();
            const duration = endTime - startTime;
            expect(duration).to.be.below(1000);
            alertStub.restore();
            confirmStub.restore();
            done();
        });
    });

    describe('10. Accessibility', function() {
        it('a. Should have appropriate ARIA labels for all interactive elements', async function() {
            expect($inputUploadImage.attr('aria-label').length > 0).to.be.true;
            expect($buttonAddArrow.attr('aria-label').length > 0).to.be.true;
            expect($buttonAddTextbox.attr('aria-label').length > 0).to.be.true;
            expect($selectAddSymbol.attr('aria-label').length > 0).to.be.true;
            expect($inputColourPicker.attr('aria-label').length > 0).to.be.true;
            expect($buttonEraseMode.attr('aria-label').length > 0).to.be.true;
            expect($buttonSaveImage.attr('aria-label').length > 0).to.be.true;
            expect($canvasAnnotation.attr('aria-label').length > 0).to.be.true;
        });

        it('b. File input should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($inputUploadImage).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $inputUploadImage.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $inputUploadImage[0].dispatchEvent(event);
        });

        it('c. Add arrow button should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($buttonAddArrow).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $buttonAddArrow.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $buttonAddArrow[0].dispatchEvent(event);
        });

        it('d. Add textbox button should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($buttonAddTextbox).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $buttonAddTextbox.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $buttonAddTextbox[0].dispatchEvent(event);
        });

        it('e. Add symbol DDL should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($selectAddSymbol).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $selectAddSymbol.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $selectAddSymbol[0].dispatchEvent(event);
        });

        it('f. Colour picker should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($inputColourPicker).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $inputColourPicker.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $inputColourPicker[0].dispatchEvent(event);
        });

        it('g. Erase mode button should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($buttonEraseMode).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $buttonEraseMode.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $buttonEraseMode[0].dispatchEvent(event);
        });

        it('h. Save image button should be keyboard accessible', function(done) {
            // By navigation with tab key
            expect($buttonSaveImage).to.satisfy(function($element) {
                let tabindex = $element.attr('tabindex');
                let index = tabindex ? parseInt(tabindex) : NaN;
                return isNaN(index) || index >= 0;
            });
            // By pressing Enter key
            $buttonSaveImage.on('keydown', function(e) { 
                if (e.which === keyCodeEnter) {
                    done();
                }
             });
            const event = new KeyboardEvent('keydown', { 'keyCode': keyCodeEnter });
            $buttonSaveImage[0].dispatchEvent(event);
        });
    });

    describe('11. jQuery Plugin Requirements', function() {
        it('a. Should return jQuery object for chaining', function() {
            const result = $annotatorPNG.annotatorPNG(annotatorSettings);
            expect(result).to.equal($annotatorPNG);
        });

        it('b. Should initialize plugin on multiple elements', function() {
            $('body').append('<div class="test-class"></div><div class="test-class"></div>');
            $('.test-class').annotatorPNG(annotatorSettings);
            expect($('.test-class').length).to.equal(2);
            $('.test-class').remove();
        });
    });
    
    describe('12. Memory Management', function() {
        it('a. Should not leak memory on repeated initialization and destruction', function() {
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            for (let i = 0; i < 500; i++) {
                $annotatorPNG.annotatorPNG(annotatorSettings);
                $canvasAnnotation.data(keyFabric).dispose();
            }
            const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            expect(finalMemory - initialMemory).to.be.below(1000000); // 1 MB ish
        });

        it('b. Should remove all created DOM elements after use', function() {
            const initialChildCount = $annotatorPNG[0].childElementCount;
            const initialCanvasCount = $containerAnnotation[0].childElementCount;

            $annotatorPNG.annotatorPNG(annotatorSettings);
            
            expect($annotatorPNG[0].childElementCount).to.equal(initialChildCount);
            expect($containerAnnotation[0].childElementCount).to.equal(initialCanvasCount);
        });
    });
});