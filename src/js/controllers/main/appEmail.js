linker.controller('EmailController', ['$scope', 'responseService', 'webService', function($scope, responseService, webService) {
	$scope.alert = false;
	$scope.alertInfo = "";
	$scope.copy = "";
	$scope.id = sessionStorage.getItem("appId");
	var initial = function() {
		$scope.defThreshold();
	};
	$scope.checkThreshold = function() {
		var reg = /^[0-9]*$/;
		var filter = /^(([1-9][0-9]+)|([0-9]+\.[0-9]{1,2}))$/;
		if (!$scope.threshold) {
			$scope.alert = true;
			$scope.alertInfo = "请输入0到10000000之间，至多两位小数的数字";
		} else {
			var num = {};
			num = $scope.threshold.split(".");
			if (num.length == 1) {
				if (!reg.test($scope.threshold)||$scope.threshold>10000000||$scope.threshold<0) {
					$scope.alert = true;
					$scope.alertInfo = "请输入0到10000000之间，至多两位小数的数字";
				} else {
					$scope.alert = false;
					$scope.alertInfo = "";
					return;
				}
			} else {
				if (filter.test($scope.threshold)&&num[0]<=9999999) {
					$scope.alert = false;
					$scope.alertInfo = "";
				} else {
					$scope.alert = true;
					$scope.alertInfo = "请输入0到10000000之间，至多两位小数的数字";
				}
			}
		}
	};
	$scope.defThreshold = function() {
		webService.get_data("/op/threshold/getAppIdThreshold?appId=" + $scope.id).then(function(data) {
			$scope.threshold = data.data.threshold / 1000;
			$scope.copy = $scope.threshold;
		}, function(error) {
			responseService.errorResponse("读取默认值失败");
		});
	};
	$scope.deposit = function() {
		if ($scope.alert == false) {
			webService.get_data("/op/threshold/updateThreshold?appId=" + $scope.id + "&threshold=" + $scope.threshold * 1000).then(function(data) {
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