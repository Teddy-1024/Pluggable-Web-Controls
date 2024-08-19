


var isEraseMode = false;
var activeSelection = null;

function hookupPageDisplayPng() {
    const canvas = new fabric.Canvas('canvas');
    const symbolSelect = document.getElementById('symbolSelect');
    const colorPicker = document.getElementById('colorPicker');
    const symbols = ['Orange Arrow.png'];

    // Populate symbol select
    symbols.forEach(symbol => {
        const option = document.createElement('option');
        option.value = symbol;
        option.textContent = symbol.replace('.png', '');
        symbolSelect.appendChild(option);
    });

    // Image upload
    document.getElementById('imageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(f) {
            fabric.Image.fromURL(f.target.result, function(img) {
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    scaleX: canvas.width / img.width,
                    scaleY: canvas.height / img.height
                });
            });
        };
        reader.readAsDataURL(file);
    });

    // Add arrow
    document.getElementById('addArrow').addEventListener('click', function() {
        const arrow = new fabric.Path('M 0 0 L 200 100', {
            fill: colorPicker.value,
            stroke: colorPicker.value,
            strokeWidth: 2,
            left: 100,
            top: 100
        });
        canvas.add(arrow);
    });

    // Add textbox
    document.getElementById('addTextbox').addEventListener('click', function() {
        const textbox = new fabric.Textbox('Type here', {
            left: 100,
            top: 100,
            width: 150,
            fontSize: 20,
            fill: colorPicker.value
        });
        canvas.add(textbox);
    });

    // Add symbol
    symbolSelect.addEventListener('change', function() {
        if (this.value) {
            fabric.Image.fromURL(`symbols/${this.value}`, function(img) {
                img.set({
                    left: 100,
                    top: 100,
                    scaleX: 0.5,
                    scaleY: 0.5
                });
                canvas.add(img);
            });
            this.value = ''; // Reset select
        }
    });

    // Color change for selected object
    colorPicker.addEventListener('change', function() {
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

    // Erase mode
    document.getElementById('eraseMode').addEventListener('click', function() {
        isEraseMode = !isEraseMode;
        this.textContent = isEraseMode ? 'Exit Erase Mode' : 'Erase Mode';
        
        if (isEraseMode) {
            // Delete any pre-selected elements when entering erase mode
            deleteSelectedObjects(canvas);
            
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
    canvas.on('selection:created', function(options) {
        if (isEraseMode) {
            deleteSelectedObjects(canvas);
        }
    });

    canvas.on('mouse:down', function(options) {
        if (isEraseMode && options.target) {
            canvas.remove(options.target);
            canvas.requestRenderAll();
        }
    });

    // Prevent dragging in erase mode
    canvas.on('object:moving', function(options) {
        if (isEraseMode) {
            options.target.setCoords();
            canvas.remove(options.target);
            canvas.requestRenderAll();
        }
    });

    // Save image
    document.getElementById('saveImage').addEventListener('click', function() {
        if (confirm("Please ensure there is no sensitive information or PII in your annotations. Do you want to proceed with saving?")) {
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1
            });
            console.log("Base64 string:", dataURL);
            // Here you would typically send this dataURL to your server or database
            alert("Image saved as Base64 string. Check the console for the output.");
        }
    });
    /*
    // Object selection
    canvas.on('selection:created', function(options) {
        if (isEraseMode && options.target) {
            canvas.remove(options.target);
        } else if (options.target) {
            if (options.target.type === 'textbox') {
                colorPicker.value = options.target.fill;
            } else {
                colorPicker.value = options.target.stroke || options.target.fill;
            }
        }
    });
    */
}

function deleteSelectedObjects(canvas) {
    // const canvas = new fabric.Canvas('canvas');
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
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
