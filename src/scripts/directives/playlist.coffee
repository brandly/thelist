angular.module('sc2.directives')

.directive('playlist', ['$sc', ($sc) ->
    return {
        link: (scope, element, attrs) ->
            scope.playlist = playlist = []
            scope.player =
                current: {}
                play: ->
                    if @current.sound?.paused
                        @current.sound.play()
                    else if playlist.length
                        @playTrack 0

                playTrack: (index) ->
                    @current.sound?.pause()
                    @current =
                        track: playlist[index]
                        index: index
                    $sc.streamTrack(@current.track.id).then (sound) =>
                        console.log 'GOT SOUND', sound
                        if @current.track is playlist[index]
                            sound.play()
                            @current.sound = sound
                    , (error) ->
                        playlist[index].error = error

                pause: ->
                    @current.sound?.pause()

                skip: ->
                    if @current.sound?
                        next = @current.index + 1
                        unless next is playlist.length
                            return @playTrack next

                    @playTrack 0

                prev: ->
                    if @current.sound?
                        prev = @current.index - 1
                        if prev >= 0
                            return @playTrack prev

                    @playTrack playlist.length - 1
    }
])
