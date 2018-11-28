linker.directive('editstorage', function(responseService, storageService) {
	return {
		templateUrl: './templates/directives/storage/editstorage.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			original: "=",
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.edit = new Object();
				angular.copy($scope.original, $scope.edit);
			}
			$scope._checkstate = function() {
				storageService.checkstate();
			}
			$scope._checktimeoutMinute = function() {
				storageService.checktimeoutMinute();
			}
			$scope._checkdiscount = function() {
				storageService.checkdiscount();
			}
			$scope._checkinitWaitTime = function() {
				$('#initWaitTime_state').empty();
				var initWaitTime = $('#storage_initWaitTime').val();
				var reg = /^(0|[1-9]\d*)$/;
				if (initWaitTime < 0 || initWaitTime > 10000 || isNaN(initWaitTime) || !reg.test(initWaitTime)) {
					$('#initWaitTime_state').append("必须是0~10000的整数");
					$('#initWaitTime_state').show();
					return false;
				}
				return true;
			}
			$scope._checkpriority = function() {
				$('#priority_state').empty();
				var priority = $('#storage_priority').val();
				var reg = /^(0|-1|[1-9]\d*)$/;
				if (priority < -1 || priority > 1000 || isNaN(priority) || !reg.test(priority)) {
					$('#priority_state').append("必须是-1~1000的整数 -1表示不显示");
					$('#priority_state').show();
					return false;
				}
				return true;
			}
			$scope.commit = function() {
				var checktimeoutMinute = storageService.checktimeoutMinute();
				var checkstate = storageService.checkstate();
				var checkdiscount = storageService.checkdiscount();
				var priority=$scope._checkpriority();
				var initWaitTime=$scope._checkinitWaitTime();
				if (checktimeoutMinute && checkstate && checkdiscount&&priority&&initWaitTime) {
					var data = {
						"id": $scope.edit.id,
						"appId": $scope.edit.appId,
						"state": $scope.edit.state,
						"timeoutMinute": $scope.edit.timeoutMinute,
						"priorityStrategy": $scope.edit.priorityStrategy,
						"discount": $scope.edit.discount,
						"priority":$scope.edit.priority,
						"initWaitTime":$scope.edit.initWaitTime,
					};
					storageService.editshelf(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.cancel_edit();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						}
					}, function(errorMessage) {
						responseService.errorResponse("操作失败");
						$scope.cancel_edit();
					});
				}
			}
			$scope.cancel_edit = function() {
				$scope.control = false;
			}
		}
	}
})