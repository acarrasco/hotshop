define('swiper',
        [],
        function () {
            return function ($container, feed, makeElement, exitCallback, updateCallback) {

                var loadNew = function () {
                    var current = feed();
                    var $newElement = makeElement(current);
                    var newElement = $newElement[0];
                    var startX, startY, startTime;
                    var width = $container.width();
                    $container.empty().append($newElement);
                    $newElement.css({position: 'absolute', top: 0, left: 0, width: '100%', 'max-height':'100%'});


                    function handleStart(event) {
                        //store initial absolute coordinates and time
                        var firstTouch = event.originalEvent.touches[0];
                        startX = firstTouch.pageX;
                        startY = firstTouch.pageY;
                        startTime = event.timeStamp;
                        $newElement.css({'transition': ''});
                    }
                    function handleMove(event) {
                        var firstTouch = event.originalEvent.touches[0];
                        var dx = firstTouch.pageX - startX;
                        var dy = firstTouch.pageY - startY;

                        newElement.style.top = dy + 'px';
                        newElement.style.left = dx + 'px';

                        //highlight current target if any
                        var distance = Math.sqrt(dx * dx + dy * dy);
                        updateCallback(dx, dy, distance, width);
                    }
                    function handleFinish(event) {
                        var firstTouch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                        var dx = firstTouch.pageX - startX;
                        var dy = firstTouch.pageY - startY;
                        var dt = event.timestamp - startTime;

                        var distance = Math.sqrt(dx * dx + dy * dy);

                        //if long enough swipe
                        if (distance > width * 0.5) {
                            exitCallback(current, dx, dy, dt);
                            loadNew();
                        }
                        else {
                            //  - put back in the starting coordinates
                            $newElement.css({'transition-duration': '0.25s', 'transition-timing': 'ease',
                                top: 0, left: 0
                            });
                        }
                    }

                    $newElement.bind('touchstart', handleStart);
                    $newElement.bind('touchmove', handleMove);
                    $newElement.bind('touchend', handleFinish);
                    $newElement.bind('touchleave', handleFinish);
                };

                loadNew();
            };
        }
);
