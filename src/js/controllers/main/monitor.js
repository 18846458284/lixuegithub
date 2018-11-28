var monitor = angular.module('monitor', []);
monitor.service('webService', function($http, $q) {
	
	var get_data = function(url) {
		var deferred = $q.defer();
		$http.get(url).success(function(data) {
			if (!data.reply || data.reply == 1) {
				try {
					if (typeof(data) == "string" && data.indexOf("<!DOCTYPE html>" != -1)) {
						//重定向到登录界面
						location.href = "/op-portal/login.html";
					}
				} catch (e) {}
				deferred.resolve(data);
			} else {
				deferred.reject(data.replyDesc);
			}
		}).error(function(error) {
			deferred.reject(error.responseText);
		});
		return deferred.promise;
	}
	return {
		'get_data': get_data,
	}
});
monitor.factory('responseService', function() {
	var successResponse = function(response) {
		if (_.isString(response) && response.indexOf("<!DOCTYPE html>") != -1) {
			$window.location = "/op-portal/login.html";
			return false;
		} else if (response.reply != 1) {
			layer.alert(response.replyDesc, {
				icon: 2
			});
			return false;
		} else {
			return true;
		}
	};

	var errorResponse = function(message) {
		layer.alert(message, {
			icon: 2
		});
	};
	return {
		"successResponse": successResponse,
		"errorResponse": errorResponse
	}
});
monitor.controller('MonitorController', function($scope, responseService, webService) {
	var initial = function() {
		$scope.getTodaySale();
		$scope.getSaleAmount();
		$scope.getTopByAgent();
		$scope.getTopByProvince();
	};
	$scope.getTodaySale = function() {
		webService.get_data("/op/report/getTodaySale").then(function(data) {
				$scope.monitor_getTodaySale = data.data;
			},
			function(error) {
				responseService.errorResponse("读取失败");
			})

	};
	$scope.getTopByAgent = function() {
		webService.get_data("/op/report/getTopByAgent").then(function(data) {
				if (data.data == null) {
					data.data = "";
				}
				$scope.monitor_getTopByAgent = data.data;
				for (var i = 0; i < 5; i++) {
					$scope.monitor_getTopByAgent[i].percent = $scope.monitor_getTopByAgent[i].percent / 100;
					$scope.monitor_getTopByAgent[i].percent = $scope.monitor_getTopByAgent[i].percent.toFixed(2);

				}
			},
			function(error) {
				responseService.errorResponse("读取失败");
			})

	};
	$scope.getTopByProvince = function() {
		webService.get_data("/op/report/getTopByProvince").then(function(data) {
				if (data.data == null) {
					data.data = "";
				}
				$scope.monitor_getTopByProvince = data.data;
				for (var i = 0; i < 10; i++) {
					$scope.monitor_getTopByProvince[i].percent = $scope.monitor_getTopByProvince[i].percent / 100;
					$scope.monitor_getTopByProvince[i].percent = $scope.monitor_getTopByProvince[i].percent.toFixed(2);

				}
			},
			function(error) {
				responseService.errorResponse("读取失败");
			})
	};

	$scope.getSaleAmount = function() {
		webService.get_data("/op/report/getSaleAmount").then(function(data) {
				$scope.monitor_getSaleAmount = data.data;
				var flow = document.getElementById("completePercentFlow");
				var voice = document.getElementById("completePercentVoice");
				$scope.monitor_getSaleAmount.completePercentFlow = $scope.monitor_getSaleAmount.completePercentFlow.toFixed(2);
				$scope.monitor_getSaleAmount.completePercentVoice = $scope.monitor_getSaleAmount.completePercentVoice.toFixed(2);
				if ($scope.monitor_getSaleAmount.completePercentFlow > 100) {
					flow.style.width = 100 + "%";
				} else {
					flow.style.width = $scope.monitor_getSaleAmount.completePercentFlow + "%";
				}
				if ($scope.monitor_getSaleAmount.completePercentVoice > 100) {
					voice.style.width = 100 + "%";
				} else {
					voice.style.width = $scope.monitor_getSaleAmount.completePercentVoice + "%";
				}
			},
			function(error) {
				responseService.errorResponse("读取失败");
			})

	};
	initial();
	setInterval(function() {
		initial();
	}, 300000);
});