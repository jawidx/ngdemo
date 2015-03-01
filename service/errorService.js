/**
 * Created by baowenbin on 14-8-25.
 */
define([

], function () {
    angular.module('normalForum').register.factory('ErrorHandler', [
        function () {
            /**
             * @object customErrorMap
             */
            function ErrorHandler(customErrorMap) {
                this.errorMap = {
                    // 通用错误
                };
            }

            ErrorHandler.prototype = {
                constructor: ErrorHandler(),
                handle: function (errMsgMap, errObj) {
                    angular.extend(this.errorMap, errMsgMap);
                    alert(errMsgMap[errObj.no] || errObj.errmsg);
                }
            };
            return ErrorHandler;
        }]);
});