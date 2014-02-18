angular.module('sc2.directives')

.directive('playlist', ['$sc', '$interval', '$rootScope', ($sc, $interval, $rootScope) ->
    states = ['uninitialised', 'loading', 'error', 'loaded']
    store = window.localStorage
    location = 'the-list-track-ids'

    save = ->
        trackIds = playlist.map (track) -> track.id
        store[location] = JSON.stringify trackIds

    load = ->
        trackIds = JSON.parse store[location]

        if trackIds?.length
            trackIds.forEach (id, index) ->
                $sc.getTrackById(id).then (track) ->
                    playlist[index] = track
                , (e) ->
                    playlist[index] =
                        error: e

    playlist = []
    playlist.add = (track) ->
        return unless track.streamable
        @push track
        save()

    playlist.remove = (index, e) ->
        if player.current.index is index
            player.stop()
        else if player.current.index > index
            player.current.index -= 1

        @splice index, 1
        e.stopPropagation() if e
        save()

    playlist.clear = ->
        @length = 0
        player.stop()
        save()

    player =
        current: {}
        play: ->
            if @current.sound?
                if @current.sound.paused
                    @current.sound.play()
            else if playlist.length
                @playTrack 0

        togglePause: ->
            @current.sound?.togglePause()

        playTrack: (index) ->
            if index is @current.index
                return @seek 0

            @stop()
            @current =
                track: playlist[index]
                index: index
            $rootScope.trackTitle = @current.track.title
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
            return unless @current.sound?

            position = progress * @current.sound.duration
            @current.position = position
            @current.sound.setPosition position

        stop: ->
            $interval.cancel @current.interval
            @current.sound?.stop()
            @current = {}
            $rootScope.trackTitle = null

    return {
        link: (scope, element, attrs) ->
            scope.playlist = playlist
            scope.player = player
            load()
    }
])
