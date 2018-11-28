linker.controller('adminEmailController', ['$scope', 'responseService', 'webService', function($scope, responseService, webService) {
	$scope.overTime = "";
	$scope.threshold = "";
	$scope.email = "";
	$scope.alertEm = false;
	$scope.alert = false;
	$scope.alertOv = false;
	var initial = function() {
		$scope.getRecords();
	}

	$scope.getRecords = function() {
		webService.get_data("/op/overTime/getOverTimeAlarm").then(function(data) {
				$scope.overTime = data.data.overTime;
				$scope.threshold = data.data.threshold;
				$scope.email = data.data.email;
			},
			function(error) {
				responseService.errorResponse("读取失败");
			});

	};
	$scope.checkOvertime = function() {
		var reg = /^[0-9]*$/;
		if ($scope.overTime > 2147483647 || $scope.overTime < 6) {
			$scope.alertOv = true;
			$scope.alertOvInfo = "请输入6-2147483647之间的整数";
		} else {
			if (!$scope.overTime) {
				$scope.alertOv = true;
				$scope.alertOvInfo = "请输入6-2147483647之间的整数";
			} else {
				if (reg.test($scope.overTime)) {
					$scope.alertOv = false;
					$scope.alertOvInfo = "";
				} else {
					$scope.alertOv = true;
					$scope.alertOvInfo = "请输入6-2147483647之间的整数";
				}
			}
		}
	}
	$scope.checkThreshold = function() {
		var reg = /^[0-9]*$/;
		var filter = /^(([1-9][0-9]+)|([0-9]+\.[0-9]{1,2}))$/;
		if (!$scope.threshold) {
			$scope.alert = true;
			$scope.alertInfo = "请输入0.01-99.99之间的数，至多两位小数";
		} else {
			if ($scope.threshold <100 && $scope.threshold > 0) {
				var num = {};
				num = $scope.threshold.split(".");
				if ($scope.threshold.split(".").length == 1) {
					if (!reg.test($scope.threshold)) {
						$scope.alert = true;
						$scope.alertInfo = "请输入0.01-99.99之间的数，至多两位小数";
					} else {
						$scope.alert = false;
						$scope.alertInfo = "";
						return;
					}
				} else {
					if (filter.test($scope.threshold)) {
						$scope.alert = false;
						$scope.alertInfo = "";
					} else {
						$scope.alert = true;
						$scope.alertInfo = "请输入0.01-99.99之间的数，至多两位小数";
					}
				}
			} else {
				$scope.alert = true;
				$scope.alertInfo = "请输入0.01-99.99之间的数，至多两位小数";
			}
		}
	}


	$scope.checkEmail = function() {
		var email = {};
		email = $scope.email.split(",");
		var len = email.length;
		if (email[len - 1] == "") {
			len = len - 1;
		}
		if ($scope.email.length > 128) {
			$scope.alertEm = true;
			$scope.alertEmInfo = "最多128字符";
		} else {
			if (len == 0) {
				$scope.alertEm = true;
				$scope.alertEmInfo = "至少一个正确邮箱";
			} else if (len > 3) {
				$scope.alertEm = true;
				$scope.alertEmInfo = "最多三个正确邮箱";
			} else {
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				for (var i = 0; i < len; i++) {
					if (filter.test(email[i])) {
						$scope.alertEm = false;
						$scope.alertEmInfo = "";
					} else {
						$scope.alertEm = true;
						$scope.alertEmInfo = "请输入正确格式的邮箱";
						break;
					}
				}
			}
		}
	};
	$scope.deposit = function() {
		if ($scope.alertEm == false && $scope.alert == false && $scope.alertOv == false) {
			webService.get_data("/op/overTime/setOverTimeAlarm?overTime=" + $scope.overTime + "&threshold=" + $scope.threshold + "&email=" + $scope.email).then(function(data) {
					layer.alert('操作成功', {
						icon: 1
					});
				},
				function(error) {
					responseService.errorResponse("操作失败。" + error);
				});
		}
	};
	initial();
}]);