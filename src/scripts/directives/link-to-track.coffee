angular.module('sc2.directives')

.directive('linkToTrack', [ ->
    return {
        replace: true
        scope: true
        templateUrl: 'views/link-to-track.html'
        controller: ['$scope', '$sc', ($scope, $sc) ->
            $scope.search =
                url: ''

            $scope.loading = false
            $scope.addTrackFromLink = (link) ->
                $scope.loading = true
                $sc.resolve(link).then (sound) ->
                    if sound.kind is 'track'
                        $scope.playlist.push sound
                        $scope.search.url = ''
                .finally ->
                    $scope.loading = false
        ]
    }
])
