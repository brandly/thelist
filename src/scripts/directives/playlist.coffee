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
                        @_setTrack 0

                playTrack: (index) ->
                    @current.sound?.pause()
                    @_setTrack index

                _setTrack: (index) ->
                    @current =
                        track: playlist[index]
                        index: index
                    $sc.streamTrack(@current.track.id).then (sound) =>
                        console.log 'GOT SOUND', sound
                        sound.play()
                        @current.sound = sound

                pause: ->
                    @current.sound.pause()

                skip: ->
                    if @current.sound?
                        @current.sound.pause()
                        next = @current.index + 1
                        unless next is playlist.length
                            return @_setTrack next

                    @_setTrack 0

                prev: ->
                    if @current.sound?
                        @current.sound.pause()
                        prev = @current.index - 1
                        if prev >= 0
                            return @_setTrack prev

                    @_setTrack playlist.length - 1
    }
])
