linker.directive('channelswitch', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/channelswitch.html',
		scope: {
			channelswitchdata: "=",
			control: "=",
			refresh: '&refreshFn',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.initDateComponent = function(param) {
				laydate({
					elem: '#' + param,
					format: 'YYYY-MM-DD hh:mm:ss',
					istime: true,
					isclear: false,
					istoday: false,
					choose: function(date) {
						$scope[param] = date;
					}
				});
			};
			var checkDate = function() {
				if ($scope.fromDate != null && $scope.toDate != null) {
					var d1 = new Date($scope.fromDate.replace(/\-/g, "\/"));
					var d2 = new Date($scope.toDate.replace(/\-/g, "\/"));
					if (d1 < $scope.currentdate || d2 < $scope.currentdate) {
						if (d1 < $scope.currentdate) {
							layer.alert('自动开启时间不能小于当前时间', {
								icon: 0
							});
							return false;
						}
						if(d2 < $scope.currentdate){
							layer.alert('自动关闭时间不能小于当前时间', {
								icon: 0
							});
							return false;
						}	
					} else {
						return true;
					};
				} else {
					if ($scope.fromDate == null && $scope.toDate != null) {
						$scope.fromDate = "";
						var d2 = new Date($scope.toDate.replace(/\-/g, "\/"));
						if (d2 < $scope.currentdate) {
							layer.alert('自动关闭时间不能小于当前时间', {
								icon: 0
							});
							return false;
						} else {
							return true;
						}
					}
					if ($scope.fromDate != null && $scope.toDate == null) {
						$scope.toDate = "";
						var d1 = new Date($scope.fromDate.replace(/\-/g, "\/"));
						if (d1 < $scope.currentdate) {
							layer.alert('自动开启时间不能小于当前时间', {
								icon: 0
							});
							return false;
						} else {
							return true;
						}
					}
					return false;
				}
			};
			$scope.init = function() {
				$scope.currentdate = new Date();
				$scope.data = [];
				$scope.data[0] = $scope.channelswitchdata.state;
				$scope.data[1] = $scope.channelswitchdata.autoState;
				$scope['toDate'] = $filter('date')($scope.channelswitchdata.autoCloseTime, "yyyy-MM-dd HH:mm:ss");
				$scope['fromDate'] = $filter('date')($scope.channelswitchdata.autoStartTime, "yyyy-MM-dd HH:mm:ss");
			}

			$scope.send = function() {
				if ($scope.data[1] == "on") {
					if (checkDate()) {
						webService.get_data("/op/channel/editState?channelId=" + $scope.channelswitchdata.channelId +
							"&state=" + $scope.data[0] +
							"&autoState=" + $scope.data[1] +
							"&autoStartTime=" + $scope.fromDate +
							"&autoCloseTime=" + $scope.toDate).then(function(data) {
								$scope.back();
								$scope.refresh();
								layer.alert('操作成功', {
									icon: 1
								});
							},
							function(error) {
								responseService.errorResponse("操作失败。" + error);
							});
					} else {
						if ($scope.fromDate == null && $scope.toDate == null) {
							layer.alert('请选择时间', {
								icon: 0
							});
						}
					}
				} else {
					webService.get_data("/op/channel/editState?channelId=" + $scope.channelswitchdata.channelId +
						"&state=" + $scope.data[0] +
						"&autoState=" + $scope.data[1] +
						"&autoStartTime=" + $scope.fromDate +
						"&autoCloseTime=" + $scope.toDate).then(function(data) {
							$scope.back();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						},
						function(error) {
							responseService.errorResponse("操作失败。" + error);
						});
				}
			}
			$scope.back = function() {
				$scope.control = false;
				$scope.fromDate = null;
				$scope.toDate = null;
			};

		}
	}
})