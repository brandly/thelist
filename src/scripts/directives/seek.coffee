angular.module('sc2.directives')

.directive('seek', [ ->
    return {
        link: (scope, element, attrs) ->
            element.on 'click', (e) ->
                x = e.offsetX or e.layerX
                progress = x / e.target?.offsetWidth
                if progress
                    scope.player.seek progress
    }
])
