linker.directive('batcheditqueue', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/batcheditqueue.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			reset: '&reset',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.data = new Object();
				$scope.alertInfo = new Object();
				$scope.alert = new Object();
				$scope.data.queueSize = "";
			}
			$scope.check = new Object();
			$scope.check.queueSize = function() {
				var reg = /^([1-9]\d*)$/;
				if ($scope.data.queueSize < 1 || !reg.test($scope.data.queueSize) || !$scope.data.queueSize || $scope.data.queueSize > 10000) {
					$scope.alertInfo.queueSize = "请输入1-10000的整数";
					$scope.alert.queueSize = true;
				} else {
					$scope.alertInfo.queueSize = "";
					$scope.alert.queueSize = false;
				}
			}
			$scope.send = function() {
				for (var i in $scope.check) {
					$scope.check[i]();
					if ($scope.alert[i] == true) return;
				}
				var queueId = "";
				for (var i in $scope.control.data) {
					queueId += "," + $scope.control.data[i].id;
				}
				queueId = queueId.substr(1);
				webService.get_data("/op/queue/updateBranchQueueSize?ids=" + queueId + "&queueSize=" + $scope.data.queueSize).then(function(data) {
						if(data.data==true){
							layer.alert('修改成功', {
								icon: 1
							});
						}else{
							responseService.errorResponse("修改失败");
						}
						$scope.refresh();
						$scope.back();
					},
					function(error) {
						responseService.errorResponse("批量编辑状态阈值失败");
					});
			};
			$scope.back = function() {
				$scope.control.show = false;
				$scope.reset();
			};
		},
	}
})