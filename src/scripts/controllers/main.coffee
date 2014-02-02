angular.module('sc2')

.controller('MainCtrl', ['$scope', '$sc', ($scope, $sc) ->
    $scope.tracks = []
    $scope.search =
        query: 'omg'

    $scope.$watch 'search.query', _.debounce(->
        if $scope.search.query.length is 0
            return $scope.tracks = []

        $sc.searchTracks $scope.search.query, 10
        .then (tracks) ->
            console.log 'TRACKS', tracks
            $scope.tracks = tracks
    , 300)

    $scope.queue = []

])
