# shoutout to @jxnblk
# https://github.com/jxnblk/plangular
angular.module('sc2.filters')

.filter 'playTime', ->
    return (ms) ->
        hours = Math.floor(ms / 36e5)
        mins = '' + Math.floor((ms % 36e5) / 6e4)
        secs = '0' + Math.floor((ms % 6e4) / 1000)
        mins = mins.substr(mins.length - 2)
        secs = secs.substr(secs.length - 2)

        if isNaN secs
            '0:00'
        else if hours
            "#{hours}:#{mins}:#{secs}"
        else
            "#{mins}:#{secs}"
