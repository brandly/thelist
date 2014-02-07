angular.module('sc2.services')

.service('$sc', ['$q', ($q) ->
    SC.initialize
        client_id: '7f5d27e4fc4e7c52527da9a5ebda2668'
    return {
        get: (path, params={}) ->
            deferred = $q.defer()

            SC.get path, params, (res, err) ->
                if err?
                    deferred.reject err
                else
                    deferred.resolve res

            deferred.promise

        getTracks: (params) ->
            @get '/tracks', params

        searchTracks: (query, limit) ->
            @getTracks
                q: query
                limit: limit

        streamTrack: (id) ->
            deferred = $q.defer()

            SC.stream "/tracks/#{id}", (res, err) ->
                if err?
                    deferred.reject err
                else
                    deferred.resolve res

            deferred.promise

        resolve: (url) ->
            deferred = $q.defer()

            SC.get '/resolve', {url}, (res, err) ->
                if err?
                    deferred.reject err
                else
                    deferred.resolve res

            deferred.promise
    }
])
