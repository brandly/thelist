angular.module('sc2')

.controller('MainCtrl', ['$scope', '$sc', ($scope, $sc) ->
    $scope.tracks = []
    $scope.search =
        query: 'flume'

    $scope.$watch 'search.query', _.debounce(->
        if $scope.search.query.length is 0
            return $scope.tracks = []

        $sc.searchTracks $scope.search.query, 10
        .then (tracks) ->
            console.log 'TRACKS', tracks
            $scope.tracks = tracks
    , 300)

    $scope.queue = []
    $scope.currentTrack = null
    $scope.sound = null
    $scope.setCurrent = (track) ->
        $scope.currentTrack = track
        $sc.streamTrack(track.id).then (sound) ->
            setSound sound

    setSound = (sound) ->
        console.log 'SOUND', sound
        if $scope.sound?.playState is 1
            $scope.sound.stop()
        sound.play()
        $scope.sound = sound

    $scope.getBiggerArt = (url) ->
        url.replace 'large.jpg', 't300x300.jpg'

])
