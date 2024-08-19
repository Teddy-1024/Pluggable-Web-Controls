(function($) {
    $.fn.screenshotExporter = function(options) {
        var settings = $.extend({
            filename: 'screenshot.png',
            excludeSelector: null
        }, options);

        return this.each(function() {
            var $button = $(this);

            $button.on('click', function() {
                takeScreenshot();
            });

            function takeScreenshot() {
                // Hide the button temporarily
                $button.hide();

                // Find the maximum z-index in the document
                var maxZIndex = Math.max(
                    ...Array.from(document.querySelectorAll('body *'))
                        .map(a => parseFloat(window.getComputedStyle(a).zIndex))
                        .filter(a => !isNaN(a))
                );

                // Create a wrapper div
                var $wrapper = $('<div>')
                    .css({
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: maxZIndex + 1,
                        pointerEvents: 'none'
                    })
                    .appendTo('body');

                // Move all fixed and absolute positioned elements into the wrapper
                $('body *').each(function() {
                    var $el = $(this);
                    var position = $el.css('position');
                    if (position === 'fixed' || position === 'absolute') {
                        var offset = $el.offset();
                        $el.data('original-position', {
                            parent: $el.parent(),
                            nextSibling: $el.next(),
                            position: position,
                            top: $el.css('top'),
                            left: $el.css('left'),
                            zIndex: $el.css('z-index')
                        });
                        $el.appendTo($wrapper)
                           .css({
                               position: 'absolute',
                               top: offset.top,
                               left: offset.left,
                               zIndex: position === 'fixed' ? (parseFloat($el.css('z-index')) || 0) + maxZIndex : $el.css('z-index')
                           });
                    }
                });

                // Use html2canvas to capture the screenshot
                html2canvas(document.body, {
                    ignoreElements: function(element) {
                        // Exclude the button and any elements matching the excludeSelector
                        return element === $button[0] || 
                               (settings.excludeSelector && $(element).is(settings.excludeSelector));
                    },
                    windowWidth: document.documentElement.scrollWidth,
                    windowHeight: document.documentElement.scrollHeight
                }).then(function(canvas) {
                    // Convert canvas to blob
                    canvas.toBlob(function(blob) {
                        // Create a temporary URL for the blob
                        var url = URL.createObjectURL(blob);

                        // Create a temporary anchor element
                        var a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = settings.filename;

                        // Append the anchor to the body, click it, and remove it
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        // Revoke the blob URL
                        URL.revokeObjectURL(url);

                        // Restore the original positions of moved elements
                        $wrapper.children().each(function() {
                            var $el = $(this);
                            var originalPosition = $el.data('original-position');
                            if (originalPosition) {
                                if (originalPosition.nextSibling.length) {
                                    $el.insertBefore(originalPosition.nextSibling);
                                } else {
                                    $el.appendTo(originalPosition.parent);
                                }
                                $el.css({
                                    position: originalPosition.position,
                                    top: originalPosition.top,
                                    left: originalPosition.left,
                                    zIndex: originalPosition.zIndex
                                });
                            }
                        });

                        // Remove the wrapper
                        $wrapper.remove();

                        // Show the button again
                        $button.show();
                    });
                });
            }
        });
    };
}(jQuery));