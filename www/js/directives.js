angular.module('starter.directives', [])

.directive('ngClickDebounce', function ($timeout) {
    var delay = 500;   // min milliseconds between clicks

    return {
        restrict: 'A',
        priority: -1,   // cause out postLink function to execute before native `ngClick`'s
                        // ensuring that we can stop the propagation of the 'click' event
                        // before it reaches `ngClick`'s listener
        link: function (scope, elem) {
            var disabled = false;

            function onClick(evt) {
                if (disabled) {
                    console.info('debounce directive stopped a click event');
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                } else {
                    disabled = true;
                    $timeout(function () { disabled = false; }, delay, false);
                }
            }

            scope.$on('$destroy', function () { elem.off('click', onClick); });
            elem.on('click', onClick);
        }
    };
});