angular.module('sc2')

.controller('MainCtrl', ['$scope', ($scope) ->
    Mousetrap.bind 'space', (e) ->
        e.preventDefault()
        $scope.player.togglePause()

    Mousetrap.bind 'shift+right', ->
        $scope.player.next()

    Mousetrap.bind 'shift+left', ->
        $scope.player.prev()

    $scope.$on '$destroy', ->
        Mousetrap.unbind 'space'
        Mousetrap.unbind 'shift+right'
        Mousetrap.unbind 'shift+left'

])
