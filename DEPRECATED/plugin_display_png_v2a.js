
(function($) {
    $.fn.annotatorPNG = function(options) {
        var settings = $.extend({
            heightCanvas: "600px",
            widthCanvas: "800px",
        }, options);

        var flagToolbox = "annotator-png-toolbox";
        var flagContainer = "annotator-png-container";
        var flagContainerAnnotation = "annotator-png-container-annotation";
        var flagUploadImage = "annotator-png-upload-image";
        var flagAddArrow = "annotator-png-add-arrow";
        var flagAddTextbox = "annotator-png-add-textbox";
        var flagAddSymbol = "annotator-png-add-symbol";
        var flagColourPicker = "annotator-png-colour-picker";
        var flagEraseMode = "annotator-png-erase-mode";
        var flagSaveImage = "annotator-png-save-image";
        var flagCanvasAnnotation = "annotator-png-canvas-annotation";
        var keyFabric = "fabric";
        var keyIsEraseMode = "isEraseMode";

        function getCanvas() {
            let $annotatorPNG = $(document).find("." + flagAnnotatorPNG);
            let $canvasAnnotation = $annotatorPNG.find("canvas." + flagCanvasAnnotation);
            let canvas = $canvasAnnotation.data(keyFabric);
            console.log("canvas: ", canvas);
            return canvas;
        }

        function deleteSelectedObjects() {
            let canvas = getCanvas();
            const activeObject = canvas.getActiveObject();
            if (activeObject) {
                console.log("active object type:", activeObject.type);
                if (activeObject.type === 'activeSelection') {
                    // If it's a multi-selection, remove all selected objects
                    activeObject.forEachObject(function(obj) {
                        canvas.remove(obj);
                    });
                    canvas.discardActiveObject();
                } else {
                    // If it's a single object, just remove it
                    canvas.remove(activeObject);
                }
                canvas.requestRenderAll();
            }
        }

        return this.each(function() {
            var $annotatorPNG = $(this);
            $annotatorPNG.data(keyIsEraseMode, false);

            const symbols = ['Orange Arrow.png'];
            
            // Make elements
            var $toolbox = $('<div class="' + flagToolbox + ' ' + flagContainer + '"></div>');

            var $inputUploadImage = $('<input type="file" class="' + flagUploadImage + '" accept="image/*">');
            $toolbox.append($inputUploadImage);

            var $buttonAddArrow = $('<button class="' + flagAddArrow + '">Add Arrow</button>');
            $toolbox.append($buttonAddArrow);

            var $buttonAddTextbox = $('<button class="' + flagAddTextbox + '">Add Textbox</button>');
            $toolbox.append($buttonAddTextbox);

            var $selectAddSymbol = $('<select class="' + flagAddSymbol + '"></select>');
            $selectAddSymbol.append($("<option>", {
                value: "",
                text: "Select Symbol",
            }));
            symbols.forEach(symbol => {
                $selectAddSymbol.append($("<option>", {
                    value: symbol,
                    text: symbol.replace('.png', ''),
                }));
            });
            $toolbox.append($selectAddSymbol);

            var $inputColourPicker = $('<input type="color" class="' + flagColourPicker + '">');
            $toolbox.append($inputColourPicker);

            var $buttonEraseMode = $('<button class="' + flagEraseMode + '">Erase Mode</button>');
            $toolbox.append($buttonEraseMode);

            var $buttonSaveImage = $('<button class="' + flagSaveImage + '">Save Image</button>');
            $toolbox.append($buttonSaveImage);
            $annotatorPNG.append($toolbox);

            var $containerAnnotation = $('<div class="' + flagContainerAnnotation + ' ' + flagContainer + '"></div>');
            var $canvasAnnotation = $('<canvas class="' + flagCanvasAnnotation + '" height="' + settings.heightCanvas + '" width="' + settings.widthCanvas + '"></canvas>');
            let canvas = new fabric.Canvas($canvasAnnotation[0]);
            canvas.selection = true;
            $canvasAnnotation.data(keyFabric, canvas);
            $containerAnnotation.append($canvasAnnotation);
            $annotatorPNG.append($containerAnnotation);

            $canvasAnnotation.on('object:selected', function(e) {
                console.log('Object selected:', e.target);
            });
            
            $canvasAnnotation.on('selection:cleared', function() {
                console.log('Selection cleared');
            });

            // Add triggers
            $inputUploadImage.on("change", function(event) {
                console.log("File uploaded:", event.target.files[0]);
                const file = event.target.files[0];
                const reader = new FileReader();
                let canvas = getCanvas();
                reader.onload = function(eventReader) {
                    fabric.Image.fromURL(eventReader.target.result, function(image) {
                        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
                            scaleX: canvas.width / image.width,
                            scaleY: canvas.height / image.height,
                        });
                    });
                };
                reader.readAsDataURL(file);
            });

            $buttonAddArrow.on("click", function() {
                console.log("Add Arrow clicked");
                let canvas = getCanvas();
                const arrow = new fabric.Path('M 0 0 L 200 100', {
                    fill: $inputColourPicker.val(),
                    stroke: $inputColourPicker.val(),
                    strokeWidth: 2,
                    left: 100,
                    top: 100,
                    selectable: true,
                });
                canvas.add(arrow);
                canvas.renderAll();
            });

            $buttonAddTextbox.on("click", function() {
                console.log("Add Textbox clicked");
                let canvas = getCanvas();
                const textbox = new fabric.Textbox('Type here', {
                    left: 100,
                    top: 100,
                    width: 150,
                    fontSize: 20,
                    fill: $inputColourPicker.val(),
                    selectable: true,
                });
                canvas.add(textbox);
                canvas.renderAll();
            });

            $selectAddSymbol.on("change", function() {
                console.log("Add Symbol changed:", this.value);
                if (this.value) {
                    let canvas = getCanvas();
                    fabric.Image.fromURL(`symbols/${this.value}`, function(image) {
                        image.set({
                            left: 100,
                            top: 100,
                            scaleX: 0.5,
                            scaleY: 0.5,
                        });
                        canvas.add(image);
                    });
                    this.value = '';
                }
            });

            $inputColourPicker.on("change", function() {
                console.log("Colour Picker changed:", this.value);
                let canvas = getCanvas();
                const activeObject = canvas.getActiveObject();
                if (activeObject) {
                    if (activeObject.type === 'textbox') {
                        activeObject.set('fill', this.value);
                    } else {
                        activeObject.set('fill', this.value);
                        activeObject.set('stroke', this.value);
                    }
                    canvas.renderAll();
                }
            });

            $buttonEraseMode.on("click", function() {
                console.log("Erase Mode clicked");
                let isEraseMode = $annotatorPNG.data(keyIsEraseMode);
                isEraseMode = !isEraseMode;
                $annotatorPNG.data(keyIsEraseMode, isEraseMode);
                console.log("Erase Mode:", isEraseMode);
                this.textContent = isEraseMode ? 'Exit Erase Mode' : 'Erase Mode';
                
                if (isEraseMode) {
                    // Delete any pre-selected elements when entering erase mode
                    deleteSelectedObjects();
                    
                    // Disable selection and drawing
                    canvas.selection = false;
                    canvas.isDrawingMode = false;
                    
                    // Change cursor to indicate erase mode
                    canvas.defaultCursor = 'crosshair';
                    canvas.hoverCursor = 'crosshair';
                } else {
                    // Re-enable selection when exiting erase mode
                    canvas.selection = true;
                    
                    // Reset cursors
                    canvas.defaultCursor = 'default';
                    canvas.hoverCursor = 'move';
                }
            });

            // Object selection in erase mode
            $canvasAnnotation.on('selection:created', function() {
                console.log("Selection created");
                let isEraseMode = $annotatorPNG.data(keyIsEraseMode);
                if (isEraseMode) {
                    deleteSelectedObjects();
                }
            });

            // Object click in erase mode
            $canvasAnnotation.on('mouse:down', function(event) {
                console.log("Canvas mouse down:", event);
                let isEraseMode = $annotatorPNG.data(keyIsEraseMode);
                if (isEraseMode && event.target) {
                    let canvas = getCanvas();
                    canvas.remove(event.target);
                    canvas.requestRenderAll();
                }
            });

            // Prevent dragging in erase mode
            $canvasAnnotation.on('object:moving', function(event) {
                console.log("Canvas object moving:", event);
                let isEraseMode = $annotatorPNG.data(keyIsEraseMode);
                if (isEraseMode) {
                    let canvas = getCanvas();
                    event.target.setCoords();
                    canvas.remove(event.target);
                    canvas.requestRenderAll();
                }
            });

            $buttonSaveImage.on("click", function() {
                let canvas = getCanvas();
                if (confirm("Please ensure there is no sensitive information or PII in your annotations. Do you want to proceed with saving?")) {
                    const dataURL = canvas.toDataURL({
                        format: 'png',
                        quality: 1
                    });

                    // Output
                    console.log("Base64 string:", dataURL);
                
                    var a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = dataURL;
                    a.download = settings.fileName;

                    alert("Image saved as Base64 string. Check the console and Downloads folder for the output.");
                }
            });
        });
    };
}(jQuery));
