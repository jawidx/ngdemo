(function () {

    var commonServiceModule = angular.module('ngCommon');

    commonServiceModule.factory('commonResource', ['$resource', function ($resource) {
        /**
         * transform Tieba response format to Restful.
         * @param {Object} data response data.
         */
        function transformResponseToRestful(data) {
            data = JSON.parse(data);

            if (data.no == 0 || data.errno == 0) {
                return data.data;
            } else {
                throw data;
            }
        }

        return function (url, paramDefaults, actions) {
			
            angular.forEach(actions, function (action) {
                if (!action.transformResponse) {
                    action.transformResponse = [];
                }
                action.transformResponse.unshift(transformResponseToRestful);

                if (!action.isArray) {
                    action.isArray = false;
                }
            });

            // 生成resource类
            var CommonResource = $resource(url, paramDefaults, actions);

            // 增加类的queryByPagination方法
            // 详细描述见文件头部
            CommonResource.queryByPagination = function () {
                var self = this;

                // 在类上调用，所以resource的query的返回是一个带有$promise的数组或对象
                var returnValueOfQuery = self.query.apply(self, arguments);
                var promiseOfQuery = returnValueOfQuery.$promise;

                var newPromise = promiseOfQuery.then(function (response) {
                    var list = response.list;

                    //本来约定rd返回值中list字段存放resource数组，但在工具平台这个项目里，rd返回值中数组字段不是'list'
                    //这里为了兼容，尝试着自己去找到一个为数组的字段作为list
                    //@add by lvsheng at 14.4.30
                    if (!list) { //使用list字段没有找到
                        angular.forEach(response, function (possibleList) {
                            if (angular.isArray(possibleList)) {
                                list = possibleList;
                            }
                        });
                    }

                    angular.forEach(list, function (item, i) {
                        list[i] = new CommonResource(item);
                    });
                });
                returnValueOfQuery.$promise = newPromise;

                return returnValueOfQuery;
            };

            return CommonResource;
        };
    }]);
})();
