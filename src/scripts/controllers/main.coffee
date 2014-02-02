angular.module('sc2')

.controller('MainCtrl', ['$scope', '$sc', ($scope, $sc) ->
    $scope.tracks = []
    $scope.search =
        query: ''

    $scope.$watch 'search.query', _.debounce(->
        $sc.searchTracks $scope.search.query, 5
        .then (tracks) ->
            console.log 'TRACKS', tracks
            $scope.tracks = tracks
    , 300)

    $scope.queue = []

])
