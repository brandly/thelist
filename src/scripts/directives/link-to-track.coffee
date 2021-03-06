angular.module('sc2.directives')

.directive('linkToTrack', [ ->
    return {
        replace: true
        scope: true
        templateUrl: 'views/link-to-track.html'
        controller: ['$scope', '$sc', ($scope, $sc) ->
            $scope.error = null
            $scope.search =
                url: ''

            setError = (error) ->
                $scope.error = error?.message or true

                # until the search.url changes
                initial = $scope.search.url
                getOff = $scope.$watch 'search.url', (url) ->
                    unless url is initial
                        $scope.error = null
                        getOff()

            $scope.loading = false
            $scope.addTrackFromLink = (link) ->
                $scope.loading = true
                $sc.resolve(link).then (sound) ->
                    if sound?.kind isnt 'track'
                        setError
                            message: 'Not a track'
                    else if not sound.streamable
                        setError
                            message: "Can't stream track :("
                    else
                        $scope.playlist.add sound
                        $scope.search.url = ''
                , setError
                .finally ->
                    $scope.loading = false
        ]
    }
])
