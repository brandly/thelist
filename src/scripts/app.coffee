# Initialize other modules
angular.module('sc2.services', [])
angular.module('sc2.filters', [])
angular.module('sc2.directives', [])

dependencies = [
    'sc2.services'
    'sc2.filters'
    'sc2.directives'
    'ui.router'
]

angular.module('sc2', dependencies).config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) ->
    $stateProvider

        .state 'app',
            url: '/'
            templateUrl: 'views/app.html'
            controller: 'MainCtrl'

        $urlRouterProvider.otherwise '/'

])
