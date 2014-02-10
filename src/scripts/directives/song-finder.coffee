angular.module('sc2.directives')

.directive('songFinder', ['$sc', ($sc) ->
    return {
        replace: true
        scope: true
        templateUrl: 'views/song-finder.html'
        controller: ['$scope', ($scope) ->
            $scope.tracks = []
            $scope.search =
                query: ''

            $scope.$watch 'search.query', _.debounce(->
                if $scope.search.query.length is 0
                    return $scope.$apply ->
                        $scope.tracks = []


                $scope.$apply ->
                    $scope.loading = true
                $sc.searchTracks $scope.search.query, 10
                .then (tracks) ->
                    console.log 'TRACKS', tracks
                    $scope.tracks = tracks
                .finally ->
                    $scope.loading = false
            , 300)
        ]
    }
])
