(function($) {
    $.fn.simpleTooltip = function(options) {
        // Default settings
        var settings = $.extend({
            color: '#000000',
            backgroundColor: '#FFFFFF',
            borderColor: '#CCCCCC',
            position: 'top'
        }, options);

        return this.each(function() {
            var $element = $(this);
            var tooltipText = $element.attr('data-tooltip');

            // Create tooltip element
            var $tooltip = $('<div class="simple-tooltip">' + tooltipText + '</div>');

            // Apply styles to tooltip
            $tooltip.css({
                'position': 'absolute',
                'display': 'none',
                'padding': '5px 10px',
                'border': '1px solid ' + settings.borderColor,
                'border-radius': '4px',
                'background-color': settings.backgroundColor,
                'color': settings.color,
                'font-size': '12px',
                'z-index': 1000
            });

            // Add tooltip to body
            $('body').append($tooltip);

            // Show tooltip on hover
            $element.on('mouseenter', function() {
                var elementOffset = $element.offset();
                var elementWidth = $element.outerWidth();
                var elementHeight = $element.outerHeight();
                var tooltipWidth = $tooltip.outerWidth();
                var tooltipHeight = $tooltip.outerHeight();

                var left, top;

                switch(settings.position) {
                    case 'top':
                        left = elementOffset.left + (elementWidth / 2) - (tooltipWidth / 2);
                        top = elementOffset.top - tooltipHeight - 5;
                        break;
                    case 'bottom':
                        left = elementOffset.left + (elementWidth / 2) - (tooltipWidth / 2);
                        top = elementOffset.top + elementHeight + 5;
                        break;
                    case 'left':
                        left = elementOffset.left - tooltipWidth - 5;
                        top = elementOffset.top + (elementHeight / 2) - (tooltipHeight / 2);
                        break;
                    case 'right':
                        left = elementOffset.left + elementWidth + 5;
                        top = elementOffset.top + (elementHeight / 2) - (tooltipHeight / 2);
                        break;
                }

                $tooltip.css({left: left, top: top}).fadeIn(200);
            });

            // Hide tooltip on mouse leave
            $element.on('mouseleave', function() {
                $tooltip.fadeOut(200);
            });
        });
    };
}(jQuery));