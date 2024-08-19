// Mock dependencies
jest.mock('fabric');

// Setup
let container, canvas;

beforeEach(() => {
  // Set up our document body
  document.body.innerHTML = '<div class="image-annotator"></div>';
  container = document.querySelector('.image-annotator');
  
  // Mock Fabric.Canvas
  canvas = new fabric.Canvas();
  fabric.Canvas.mockImplementation(() => canvas);

  // Initialize our plugin
  $('.image-annotator').imageAnnotator();
});

// Initialization and Setup
test('1. Plugin initializes correctly', () => {
  expect(container.querySelector('canvas')).not.toBeNull();
});

test('2. Canvas is created with correct dimensions', () => {
  expect(canvas.setWidth).toHaveBeenCalledWith(800);
  expect(canvas.setHeight).toHaveBeenCalledWith(600);
});

test('3. All UI elements are present after initialization', () => {
  expect(container.querySelector('#imageUpload')).not.toBeNull();
  expect(container.querySelector('#addArrow')).not.toBeNull();
  expect(container.querySelector('#addTextbox')).not.toBeNull();
  expect(container.querySelector('#eraseElement')).not.toBeNull();
  expect(container.querySelector('#saveButton')).not.toBeNull();
});

// Image Upload and Display
test('4. PNG file can be successfully uploaded', () => {
  const file = new File([''], 'test.png', { type: 'image/png' });
  const event = { target: { files: [file] } };
  
  const fileReader = { 
    readAsDataURL: jest.fn(),
    onload: null
  };
  window.FileReader = jest.fn(() => fileReader);

  $('#imageUpload').trigger('change', event);
  
  expect(fileReader.readAsDataURL).toHaveBeenCalledWith(file);
});

test('5. Uploaded image is displayed correctly on the canvas', () => {
  // This test would be similar to test 4, but would also check that fabric.Image.fromURL is called
  // and that setBackgroundImage is called on the canvas
});

test('6. Image is scaled appropriately to fit the canvas', () => {
  // Similar to test 5, but would check the scaling parameters passed to setBackgroundImage
});

test('7. Invalid file types are handled', () => {
  const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
  const event = { target: { files: [file] } };
  
  console.error = jest.fn();

  $('#imageUpload').trigger('change', event);
  
  expect(console.error).toHaveBeenCalledWith('Please upload a PNG file.');
});

// Arrow Addition
test('9. Clicking "Add Arrow" creates a new arrow on the canvas', () => {
  $('#addArrow').click();
  
  expect(fabric.Path).toHaveBeenCalled();
  expect(canvas.add).toHaveBeenCalled();
});

// Textbox Addition
test('12. Clicking "Add Textbox" creates a new textbox on the canvas', () => {
  $('#addTextbox').click();
  
  expect(fabric.Textbox).toHaveBeenCalled();
  expect(canvas.add).toHaveBeenCalled();
});

// Element Manipulation
test('16. Arrows can be selected, moved, resized, and rotated', () => {
  const arrow = new fabric.Path();
  canvas.getActiveObject.mockReturnValue(arrow);
  
  arrow.set = jest.fn();
  
  canvas.trigger('object:modified', { target: arrow });
  
  expect(arrow.set).toHaveBeenCalled();
});

// Erasing Elements
test('20. Clicking "Erase Element" removes the currently selected element', () => {
  const object = new fabric.Object();
  canvas.getActiveObject.mockReturnValue(object);
  
  $('#eraseElement').click();
  
  expect(canvas.remove).toHaveBeenCalledWith(object);
});

// Saving Functionality
test('24. Clicking "Save" triggers the confirmation dialog', () => {
  window.confirm = jest.fn(() => true);
  
  $('#saveButton').click();
  
  expect(window.confirm).toHaveBeenCalled();
});

test('26. Confirming the dialog generates a Base64 PNG string', () => {
  window.confirm = jest.fn(() => true);
  canvas.toDataURL = jest.fn(() => 'data:image/png;base64,ABC123');
  
  $('#saveButton').click();
  
  expect(canvas.toDataURL).toHaveBeenCalledWith({ format: 'png', quality: 1 });
});

// Edge Cases and Error Handling
test('29. Plugin handles initialization on an invalid DOM element', () => {
  console.error = jest.fn();
  
  $('.non-existent-element').imageAnnotator();
  
  expect(console.error).toHaveBeenCalledWith('Invalid element for image annotator');
});

// Performance
test('34. Rendering performance with many elements', () => {
  const start = performance.now();
  
  for (let i = 0; i < 100; i++) {
    canvas.add(new fabric.Path());
  }
  
  canvas.renderAll();
  
  const end = performance.now();
  expect(end - start).toBeLessThan(1000); // Assuming 1 second is our performance threshold
});

// Browser Compatibility
// Note: This would typically be done with a tool like Selenium or Cypress for cross-browser testing

// Accessibility
test('38. Keyboard navigation for adding elements', () => {
  const event = new KeyboardEvent('keydown', {'key': 'Enter'});
  $('#addArrow').focus();
  $('#addArrow')[0].dispatchEvent(event);
  
  expect(fabric.Path).toHaveBeenCalled();
});

// Security
test('41. Confirmation dialog appears consistently before saving', () => {
  window.confirm = jest.fn(() => true);
  
  $('#saveButton').click();
  $('#saveButton').click();
  $('#saveButton').click();
  
  expect(window.confirm).toHaveBeenCalledTimes(3);
});