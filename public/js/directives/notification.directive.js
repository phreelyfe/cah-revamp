app.directive('notifySys', [function(){
    
    return {
        restrict: 'A',
        // transclude: true,
        link: function(scope, elem, attrs) {
            toastr.options.onShown = function() { console.log('hello'); }
            toaster.info('yo nigga, its me!');
            // // console.log("PLAYER CONTROLLER VARS ", scope);
            // // console.log("Socket ", socket);
            
            // // var cards = new Array(attrs.$$element[0].children);
            // // console.log(["Card Array", cards], ['is Array', Array.isArray(cards), cards.length]);
            // console.log(["Scope", scope, elem, attrs])

            // scope.prev = function(idx) {
            //     console.log("Card ID To Change To", idx);

            //     // console.log(["Scope.Cards.length", scope.cards.whiteCards.length], ["obj", scope.cards.whiteCards])
            //     // Transition Card From Current To Next
            //     transitionCards( cards[idx], cards[idx -1], {direction: 'rotate-left', delay: 400}, cards[scope.cards.whiteCards.length -1]);

            // };

            // scope.next = function(idx) {
            //     console.log("Card ID To Change To", idx);
                
            //     transitionCards( cards[idx], cards[idx +1], {direction: 'rotate-right', delay: 400}, cards[0] );
            // };

            // function transitionCards(prev, next, rotation, loopStart) {
            //     // console.log(["Previous Card", prev], ["Next Card", next], ["Loop Start", loopStart]);

            //     if (!next) var next = loopStart;
            //     if (!prev) var next = loopStart;
                
            //     $(prev).addClass(rotation.direction).delay(rotation.delay).fadeOut(1, function(){
            //         $(prev).css("display", "none");
            //     });

            //     $(next).removeClass('rotate-left rotate-right').fadeIn(400, function(){
            //         $(next).css("display", "block");
            //     });

            // }
        }
    }

}]);