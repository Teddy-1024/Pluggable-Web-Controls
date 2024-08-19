
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
        $modalChat.addClass(flagIsHidden);
    }

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
        $modalNotifications.addClass(flagIsHidden);
    }

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
        $modalSettings.addClass(flagIsHidden);
    }
}