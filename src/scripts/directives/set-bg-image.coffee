angular.module('sc2.directives')

.directive('setBgImg', [ ->
    return {
        link: (scope, element, attrs) ->
            element.css 'background-image', "url('#{attrs.setBgImg}')"
    }
])
