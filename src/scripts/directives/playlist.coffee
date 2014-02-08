angular.module('sc2.directives')

.directive('playlist', ['$sc', '$interval', ($sc, $interval) ->
    states = ['uninitialised', 'loading', 'error', 'loaded']

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

                togglePause: ->
                    @current.sound?.togglePause()

                playTrack: (index) ->
                    @stop()
                    @current =
                        track: playlist[index]
                        index: index
                    $sc.streamTrack(@current.track.id).then (sound) =>
                        console.log 'GOT SOUND', sound
                        # maybe we've moved on already
                        return unless @current.track is playlist[index]

                        sound.play()
                        @current.sound = sound

                        # update @current.position every second
                        @current.interval = $interval =>
                            @current.position = @current.sound.position
                            if states[@current.sound.readyState] is 'loading'
                                # display loading indicator?
                                return
                            else if states[@current.sound.readyState] is 'error'
                                @current.track.error = true
                                @next()
                            else if @current.sound.position is @current.sound.duration
                                @next()
                        , 1000
                    , (error) ->
                        playlist[index].error = error

                pause: ->
                    @current.sound?.pause()

                next: ->
                    if @current.sound?
                        next = @current.index + 1
                        if next < playlist.length
                            return @playTrack next

                    @playTrack 0

                prev: ->
                    if @current.sound?
                        prev = @current.index - 1
                        if prev >= 0
                            return @playTrack prev

                    @playTrack playlist.length - 1

                seek: (progress) ->
                    position = progress * @current.sound.duration
                    @current.position = position
                    @current.sound?.setPosition position

                stop: ->
                    $interval.cancel @current.interval
                    @current.sound?.stop()
                    @current = {}
    }
])
