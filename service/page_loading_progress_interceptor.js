(function () {
    angular.module('ngCommon').factory("pageLoadingProgressInterceptor", ['$q', 'pageProgressBar', function ($q, pageProgressBar) {
        return {
            request: function (config) {
                pageProgressBar.addTask();
                return config;
            },

            response: function (response) {
                pageProgressBar.finishTask();
                return response;
            }
        }
    }]);
})();