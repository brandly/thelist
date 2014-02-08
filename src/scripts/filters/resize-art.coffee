angular.module('sc2.filters')

.filter 'resizeArt', ->
    return (url, size) ->
        console.log 'SUP', url, size
        return '' unless url
        url.replace 'large.jpg', "t#{size}x#{size}.jpg"
