angular.module('sc2')

.controller('MainCtrl', ['$scope', ($scope) ->
    Mousetrap.bind 'space', (e) ->
        e.preventDefault()
        $scope.$apply -> $scope.player.togglePause()

    Mousetrap.bind 'shift+right', ->
        $scope.$apply -> $scope.player.next()

    Mousetrap.bind 'shift+left', ->
        $scope.$apply -> $scope.player.prev()

    $scope.$on 'dragToReorder.reordered', (e, move) ->
        $scope.playlist.save()
        current = $scope.player.current
        return unless current.index?

        # moved currently-playing track
        if move.from is current.index
            current.index = move.to

        # moved from below current to above current
        else if move.to <= current.index < move.from
            current.index += 1

        # moved from above current to below current
        else if move.to >= current.index > move.from
            current.index -= 1

    $scope.$on '$destroy', ->
        Mousetrap.unbind 'space'
        Mousetrap.unbind 'shift+right'
        Mousetrap.unbind 'shift+left'

])
