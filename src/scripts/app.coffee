# Initialize other modules
angular.module('sc2.services', [])
angular.module('sc2.filters', [])
angular.module('sc2.directives', [])

dependencies = [
    'sc2.services'
    'sc2.filters'
    'sc2.directives'
    'ui.router'
    'mb-adaptive-backgrounds'
    'mb-dragToReorder'
]

angular.module('sc2', dependencies).config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->
    $stateProvider

        .state 'app',
            url: '/'
            templateUrl: 'views/app.html'
            controller: 'MainCtrl'

        $urlRouterProvider.otherwise '/'

]).run(['$rootScope', ($rootScope) ->
    $rootScope.$watch 'trackTitle', (title) ->
        suffix = if title? then " | #{title}" else ''
        $rootScope.pageTitle = "the list#{suffix}"
])
