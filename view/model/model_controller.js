/**
 * @author
 * @date 2015-1-16
 */
define([
    __uri('../../resource/model.js'),
    __uri('../../resource/other_model.js'),
    __uri('../../service/errorService.js'),
    __uri('../../filter/encode.js')
], function () {
    angular.module('ngdemo').register.controller('ModelController', [
        '$scope',
        '$location',
        '$route',
        '$rootScope',
        'ForumManage',
        'AdSwitch',
        '$routeParams',
        'ErrorHandler',
        function ($scope, $location, $route, $rootScope, Model, AdSwitch, $routeParams, ErrorHandler) {
            $scope.errHandler = new ErrorHandler();

            $scope.backUrl = '#/first_catalog_list';
            switch ($rootScope.curResourceName) {
                case 'ForumManage':
                    if ($rootScope.firstCatalogName) {
                        $scope.backUrl = '#/second_catalog_list?firstCatalogName=' + encodeURIComponent($rootScope.firstCatalogName);
                        if ($rootScope.secondCatalogName) {
                            $scope.backUrl = '#/forum_manage?firstCatalogName=' + encodeURIComponent($rootScope.firstCatalogName) + '&secondCatalogName=' + encodeURIComponent($rootScope.secondCatalogName);
                        }
                    }
                    break;
                case 'CatalogManage':
                    $scope.backUrl = '#/catalog_manage';
                    break;
                case 'AuditManage':
                    $scope.backUrl = '#/audit_manage';
                    break;
            }
			$scope.$watch('status', function (newValue, oldValue, scope) {
                $location.search();
            });

            $rootScope.curResourceName = 'ForumManage';
            $rootScope.firstCatalogName = $location.search()['firstCatalogName'];
            $rootScope.secondCatalogName = $location.search()['secondCatalogName'];
            $rootScope.forumName = $location.search()['forumName'];

            $scope.editting = {model: null};
            $scope.oldPropertyObj = {}; // 使用旧拷贝对象，用于用户操作取消（取消编辑）或未实时数据(如搜索词不通过url传递时)变更后的恢复
            $scope.editDialogUrl = __uri('./../_adswitch_dialog.html');

            /**
             * 查询条件
             * @type {Object}
             */
            $scope.urlSearch = $location.search();

            /**
             * 列表数据
             * @type Object { list: [{}], page: {total_pn: int, current_pn:int} }
             */
            $scope.forumManageList = ForumManage.queryByPagination($scope.urlSearch);
            // TODO test data
            $scope.forumManageList = {
                list: [
                    {
                        name: 'name',
                        number: 2,
                        select: 2,
                        array: ['arr_str1', 'arr_str2'],
                        array1: [0, 1],
                        bool: 1
                    }
                ],
                page: {
                    page_num: 2,		// 当前页码
                    total_pn: 10,			// 页面数量
                    total_num: 200			// 总数据量
                }
            };

            /**
             * 获取吧类型
             * @param forumManage
             * @returns {string}
             */
            $scope.getForumType = function (forumManage) {
                var forumType = '非普通吧';
                switch (forumManage.type) {
                    case 0:
                        forumType = '企业官方吧';
                        break;
                    case 1:
                        forumType = '明星官方吧';
                        break;
                    case 2:
                        forumType = '小微企业吧';
                        break;
                    case 3:
                        forumType = '地方吧';
                        break;
                    case 4:
                        forumType = '地方商业吧';
                        break;
                }
                return '该吧属于' + forumType + '，请在' + forumType + '后台操作';
            };

			/**
             * 搜索
             * @param pageNumber 页码
             */
			$rootScope.search = function () {
				$location.path('/forum_manage/').search({forumName: $rootScope.searchForumName});
			};
		
            /**
             * 翻页
             * @param pageNumber 页码
             */
            $scope.changePage = function (pageNumber) {
                $location.search(angular.extend($scope.urlSearch, {pn: pageNumber}));
            };

			/**
			 * 新建
			 */
			$scope.create = function () {
				$scope.editting.model = new Model();
			};
			
            /**
             * 编辑
             */
            $scope.edit = function (model) {
                $scope.editting.model = model;
                new AdSwitch().$get({
                    'forumId': forumManage.forumId,
                    'firstCatalogName': forumManage.firstCatalogName,
                    'secondCatalogName': forumManage.secondCatalogName
                }).then(function (obj) {
                    $scope.editting.adSwitch = obj;
                    $scope.oldPropertyObj = $.extend(true, {}, obj);
                }, function (obj) {
                    $scope.errHandler.handle({}, obj);
                });
            };

            $scope.change = function (obj, firstCatalogName, secondCatalogName) {
                console.log(obj.editing.model.bool);
            };

            /**
             * 操作
             * @param forumManage
             * @param isOnline
             */
            $scope.action = function (model, param) {
                if (confirm('此次操作将会发起审批流程，确认吗？')) {
                    new Model().$online({
                        forumId: forumManage.forumId,
                        forumName: forumManage.forumName,
                        status: isOnline
                    }).then(function () {
                        alert('保存成功！');
                        $route.reload();
                    }, function (obj) {
                        $scope.errHandler.handle({}, obj);
                    });
                }
                /*
                 model.$save().then(function(){},function(){});

                 new Model(postObj).$setSwitch().then(function () {
                 alert('保存成功！');
                 $scope.editting.model = null;
                 $route.reload();
                 }, function (obj) {
                 $scope.errHandler.handle({}, obj);
                 });

                 // 会将postObj中数组变为字符串
                 new Model().$setSwitch(postObj).then(function () {
                 alert('保存成功！');
                 $scope.editting.model = null;
                 $route.reload();
                 }, function (obj) {
                 $scope.errHandler.handle({}, obj);
                 });

                 Model.setSwitch().$promise.then();
                 */
            };

            /**
             * 取消编辑
             */
            $scope.cancelEdit = function () {
                $scope.editting.adSwitch = $scope.oldPropertyObj;
                $scope.editting = null;
            };
        }
    ]);

});
