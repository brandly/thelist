angular.module('sc2.directives')

.directive('seek', [ ->
    return {
        link: (scope, element, attrs) ->
            element.on 'click', (e) ->
                progress = e.offsetX / e.target?.offsetWidth
                if progress
                    scope.player.seek progress
    }
])
