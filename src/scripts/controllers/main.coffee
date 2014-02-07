angular.module('sc2')

.controller('MainCtrl', ['$scope', '$sc', ($scope, $sc) ->
    $scope.tracks = []
    $scope.search =
        query: ''

    $scope.$watch 'search.query', _.debounce(->
        if $scope.search.query.length is 0
            return $scope.$apply ->
                $scope.tracks = []

        $sc.searchTracks $scope.search.query, 10
        .then (tracks) ->
            console.log 'TRACKS', tracks
            $scope.tracks = tracks
    , 300)

    $scope.getBiggerArt = (url, size) ->
        return '' unless url
        url.replace 'large.jpg', "t#{size}x#{size}.jpg"

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
