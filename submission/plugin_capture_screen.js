
(function($) {
    $.fn.screenshotButton = function(options) {
        var settings = $.extend({
            buttonText: 'Capture Screen',
            fileName: 'screenshot.png',
            modalsSelector: '.modal, .popup, .overlay, .dialog, .tooltip, [class*="modal"], [class*="popup"], [class*="overlay"], [class*="dialog"], [class*="tooltip"], [style*="position: fixed"], [style*="position: absolute"], [style*="z-index"]',
        }, options);

        function exportToBase64String(canvas) {
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1
            });
            console.log("Base64 string:", dataURL);
            return dataURL;
            // alert("Image saved as Base64 string. Check the console and Downloads folder for the output.");
        }
        function exportToBlob(canvas) {
            canvas.toBlob(function(blob) {
                var url = URL.createObjectURL(blob);
                console.log("blob: ", blob);
                return url;
            });
        }
        function downloadPNG(url) {
            var a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = settings.fileName;

            console.log("adding button a: ", a);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        return this.each(function() {
            var $button = $(this);

            $button.text(settings.buttonText);
            $button.removeClass(flagIsHidden);
            $button.attr('aria-label', settings.buttonText);

            if (!$button.hasClass(flagInitialised)) {
                $button.addClass(flagInitialised);
                $button.on('click', function() {
                    if (typeof html2canvas === 'undefined') {
                        console.error('html2canvas is not loaded. Please include the library.');
                        return;
                    }

                    // Hide button and sensitive information in inputs
                    // $button.hide();
                    $button.addClass(flagIsHidden);
                    $('input').each(function() {
                        $(this).attr("previousValue", $(this).val());
                        $(this).val('');
                    });
                    $('textarea').each(function() {
                        $(this).attr("previousValue", $(this).val());
                        $(this).val('');
                    });

                    // set display: block on element for all visible modals and floating elements
                    // elements not detected by html2canvas with cascaded class-based display style
                    $(settings.modalsSelector).each(function() {
                        $(this).css('display', $(this).css('display'));
                    });
                    
                    html2canvas(document.body, {
                        logging: true, 
                        useCORS: true, 
                        allowTaint: true,
                    }).then(function(canvas) {
                        let url = exportToBase64String(canvas);
                        // exportToBlob(canvas);

                        downloadPNG(url);
                        URL.revokeObjectURL(url);

                        // Show button and sensitive information in inputs
                        // $button.show();
                        $button.removeClass(flagIsHidden);
                        $('input').each(function() {
                            $(this).val($(this).attr("previousValue"));
                        });
                        $('textarea').each(function() {
                            $(this).val($(this).attr("previousValue"));
                        });                            
                    }).catch(function(e) {
                        console.error(e);
                    });
                });
            }
        });
    };
}(jQuery));