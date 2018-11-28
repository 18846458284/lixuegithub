linker.controller('DepositController', ['$scope', 'depositService', 'responseService', function($scope, depositService, responseService) {
	$scope.rechargeAmount = "";
	$scope.deposit_agent = "";
	$scope.rechargeMessage = "";
	$scope.name = "";
	responseService.checkSession();
	$scope.agents = "";
	$scope.copy = {};
	$scope.alert = false;
	$scope.alertInfo = "";
	$scope.control = false;

	$scope.getAgents = function() {
		depositService.getAgents().then(function(response) {
			if (responseService.successResponse(response)) {
				$scope.agents = response.data;
				$scope.copy = response.data;
				$scope.length = $scope.agents.length;
			}
		}, function(errorMessage) {
			responseService.errorResponse("读取代理商信息失败");
		});
	};
	$scope.getAgents();
	$scope.makeId = function() {
		var time = new Date().toLocaleDateString();
		$scope.name = "";
		$scope.name = $scope.getName();
		var dateInfo = time.split("/");
		var month =parseInt(dateInfo[1]) > 9 ? dateInfo[1] : ("0"+dateInfo[1]);
		var date =parseInt(dateInfo[2]) > 9 ? dateInfo[2]: ("0"+dateInfo[2]);
//		$scope.rechargeMessage = time.split("/")[0] + time.split("/")[1] + time.split("/")[2] + $scope.name + "预存" + $scope.rechargeAmount + "元";
		$scope.rechargeMessage = time.split("/")[0] + month + date + $scope.name + "预存" + $scope.rechargeAmount + "元";
		return $scope.rechargeMessage;
	}
	$scope.checkMessage = function() {
		if ($scope.rechargeMessage.length > 32) {
			$scope.alert = true;
			$scope.alertInfo = "长度不大于32位";
			return false;
		} else {
			var filter = /^[a-zA-Z0-9-\u4e00-\u9fa5]+$/;
			if (filter.test($scope.rechargeMessage)) {
				$scope.alert = false;
				$scope.alertInfo = "";
			} else {
				$scope.alert = true;
				$scope.alertInfo = "仅可以输入汉字,字母和数字";
				return true;
			}
		}
	}
	$scope.getName = function() {
		var name = "";
		for (var i = 0; i < $scope.length; i++) {
			$scope.arr = {};
			$scope.arr = $scope.copy[i];
			if ($scope.arr.appId == $scope.deposit_agent) {
				name = $scope.arr.agentName;
				break;
			}
		}
		return name;
	}
	$scope.$watch("deposit_agent", function() {
		$scope.makeId();
	});
	$scope.$watch('rechargeAmount', function() {
		$scope.makeId();
	});
	$scope.deposit = function() {
		$scope.control = true;
		var agentPassed = depositService.checkAgent();
		var amountPassed = depositService.checkrechargeAmount();
		$scope.checkMessage();
		if (amountPassed && agentPassed && $scope.rechargeMessage != "" && (!$scope.alert)) {
			var data = {
				appid: $scope.deposit_agent,
				rechargeAmount: $scope.rechargeAmount,
				rechargeMessage: $scope.rechargeMessage
			};

			depositService.deposit(data).then(function(response) {
				if (responseService.successResponse(response)) {
					$scope.control = false;
					$scope.rechargeAmount = "";
					$scope.deposit_agent = "";
					$scope.rechargeMessage = "";
					layer.alert('预存成功', {
						icon: 1
					});
				}else{
					$scope.control = false;
				}
			}, function(errorMessage) {
				$scope.control = false;
				responseService.errorResponse("预存失败");
			});
		}else{
			$scope.control = false;
		}
	};

	$scope._checkAgent = function() {
		depositService.checkAgent();
	};

	$scope._checkrechargeAmount = function() {

		depositService.checkrechargeAmount();

	};
}]);