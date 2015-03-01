/**
 * @author: baowenbin on 15-1-26.
 */
define([

], function () {
    angular.module('normalForum').register.filter('encode', [
        function () {
            return window.encodeURIComponent;
        }]);
});