/**
 * @author 
 * @date 2015-1-16
 */
define([

], function () {
	angular.module('normalForum')
		.register.factory('ForumManage', [ 'commonResource', function (commonResource) {
			/**
			 * @class ForumManage
			 */
			var ForumManage = commonResource('', {
					ie: 'utf-8' //给本resource所有请求加ie=utf-8参数，若不需要请自行去除
				},
				{
					query: {
						method: 'GET',
						url: '/gconforum/pt/show',/*请自己修改*/
						isArray: false //认为会通过queryByPagination方法调用，故接口返回为对象而非数组
					},
					online: {
						method: 'POST',
						url: '/gconforum/pt/updateForumStatus'
					}
				});

			return ForumManage;
		}]);
});
