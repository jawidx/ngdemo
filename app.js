/**
 * @author
 * @date 2015-1-16
 */
require([

], function () {
    var module = angular.module('ngdemo', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'ngCommon'
    ]);
    var NavBarController = function ($scope, $location, $route, $rootScope) {
        $scope.tag = '音乐 > 内地流行乐';
        $scope.searchForumName = '';

        $scope.nav = function () {
            $location.path('#forum_manage').search({forumName: searchForumName});
        };
    };
    module.config([
        '$routeProvider',
        'routeResolverProvider',
        '$httpProvider',
        function ($routeProvider, routeResolverProvider, $httpProvider) {
            var route = routeResolverProvider.route;
            $routeProvider
                .when('/first_catalog_list', route.resolve({
                    templateUrl: __uri('./view/first_catalog_list/first_catalog_list.html'),
                    controllerUrl: __uri('./view/first_catalog_list/first_catalog_list_controller.js')
                }))
                .when('/second_catalog_list', route.resolve({
                    templateUrl: __uri('./view/second_catalog_list/second_catalog_list.html'),
                    controllerUrl: __uri('./view/second_catalog_list/second_catalog_list_controller.js')
                }))
                .when('/catalog_manage', route.resolve({
                    templateUrl: __uri('./view/catalog_manage/catalog_manage.html'),
                    controllerUrl: __uri('./view/catalog_manage/catalog_manage_controller.js')
                }))
                .when('/forum_manage', route.resolve({
                    templateUrl: __uri('./view/forum_manage/forum_manage.html'),
                    controllerUrl: __uri('./view/forum_manage/forum_manage_controller.js')
                }))
                .when('/forum_manage/:first_catalog_name/:second_catalog_name', route.resolve({
                    templateUrl: __uri('./view/forum_manage/forum_manage.html'),
                    controllerUrl: __uri('./view/forum_manage/forum_manage_controller.js')
                }))
                .when('/audit_manage', route.resolve({
                    templateUrl: __uri('./view/audit_manage/audit_manage.html'),
                    controllerUrl: __uri('./view/audit_manage/audit_manage_controller.js')
                }))
                .otherwise({ redirectTo: '/first_catalog_list' });

            $httpProvider.interceptors.push('pageLoadingProgressInterceptor');
        }
    ]);

    module.run(["$rootScope", "pageProgressBar", "$location", function ($rootScope, pageProgressBar, $location) {
        $rootScope.searchForumName = '';
        $rootScope.search = function () {
            $location.path('/forum_manage/').search({forumName: $rootScope.searchForumName});
        };
        $rootScope.encode = function (str) {
            return encodeURIComponent(str);
        };
        pageProgressBar.init($rootScope);
    }]);

    // Dynamic loading controller register setup.
    angular.module('ngCommon').setupRegister(module);

    angular.bootstrap(document, [module.name]);
});
