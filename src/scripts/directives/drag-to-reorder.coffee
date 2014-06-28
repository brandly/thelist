angular.module('sc2.directives')

.directive('dragToReorder', [ ->
    return {
        link: (scope, element, attrs) ->
            ###
                drag stuff
            ###

            draggingClassName = 'dragging'
            element.attr 'draggable', true

            element.on 'dragstart', (e) ->
                element.addClass draggingClassName
                e.dataTransfer.setData 'text/plain', scope.$index

             element.on 'dragend', ->
                element.removeClass draggingClassName

            ###
                drop stuff
            ###

            droppingClassName = 'dropping'
            droppingAboveClassName = 'dropping-above'
            droppingBelowClassName = 'dropping-below'

            dragOverHandler = (e) ->
                e.preventDefault()

                # above halfway
                if e.offsetY < (e.toElement.offsetHeight / 2)
                    element.removeClass droppingBelowClassName
                    element.addClass droppingAboveClassName
                # below
                else
                    element.removeClass droppingAboveClassName
                    element.addClass droppingBelowClassName

            dropHandler = (e) ->
                e.preventDefault()
                droppingData = parseInt e.dataTransfer.getData('text/plain'), 10

                side = null
                if element.hasClass droppingAboveClassName
                    side = 'above'
                else
                    side = 'below'

                # TODO: rearrange the array
                console.log droppingData, 'dropping', side, scope.$index

                # cleanup
                element.removeClass droppingClassName
                element.removeClass droppingAboveClassName
                element.removeClass droppingBelowClassName

            element.on 'dragenter', (e) ->
                # make sure we're not dropping on the dragged element
                return if element.hasClass draggingClassName

                element.addClass droppingClassName
                element.on 'dragover', dragOverHandler
                element.on 'drop', dropHandler

            element.on 'dragleave', (e) ->
                element.removeClass droppingClassName
                element.off 'dragover', dragOverHandler
                element.off 'drop', dropHandler

    }
])
