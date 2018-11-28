linker.directive('addservice', function(responseService, ordersService) {
	return {
		templateUrl: './templates/directives/addservice.html',
		scope: {
			type: "=",
			control: "=",
			refresh: '&refreshFn',
			original: "=",
		},

		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.alert = new Object();
				$scope.operate = "";
				$scope.operateReason = "";
				$scope.operateComment = "";
				$scope.customer_Service = new Object();
				angular.copy($scope.original, $scope.customer_Service);
				if ($scope.type == "voice") {
					
					if($scope.customer_Service.status=="成功"){
						$scope.tk=true;
					}
					else{
						$scope.tk=false;
					}
					if($scope.customer_Service.status=="成功" && ($scope.customer_Service.reverseStatus =="fail" || $scope.customer_Service.reverseStatus =="none") && $scope.customer_Service.resourceReverse == "on"){
						$scope.cz=true;
					}
					else if($scope.customer_Service.status=="失败" && $scope.customer_Service.failType!=null && ($scope.customer_Service.reverseStatus =="fail" || $scope.customer_Service.reverseStatus =="none") && $scope.customer_Service.resourceReverse == "on"){
						$scope.cz=true;
					}else{
						$scope.cz=false;
					}
				}
				if ($scope.type == "flow") {
					$scope.cz = false;
					$scope.tk = true;
				}
			}
			$scope.reason = function() {
				if ($scope.operate == "冲正处理") {
					return true;
				} else return false;
			}
			$scope.check = new Object();
			$scope.check.operateComment = function() {
				if (!$scope.operateComment) {
					return true;
				} else {
					var l = $scope.operateComment.length;
					if (l > 64) {
						$scope.alert.operateComment = true;
						return false;
					} else {
						$scope.alert.operateComment = false;
						return true;
					}
				}
			}
			$scope._checkReason = function() {
				ordersService.checkReason();
			}
			$scope._checkOperation = function() {
				ordersService.checkOperation();
			}
			$scope.commit = function() {
				var checkReason = "";
				if (($scope.type == "voice") && $scope.operate == "失败退款") {
					$scope.operate = "failRefund";
				};
				if (($scope.type == "voice") && $scope.operate == "冲正处理") {
					$scope.operate = "reverseFee";
					checkReason = true;
				} else {
					checkReason = ordersService.checkReason();
				}
				var checkOperation = ordersService.checkOperation();
				if (checkReason && checkOperation && $scope.check.operateComment() && ($scope.type == "flow")) {
					var data = {
						"id": $scope.customer_Service.orderId,
						"operate": $scope.operate,
						"operateReason": $scope.operateReason,
						"operateComment": $scope.operateComment,
					};
					ordersService.customer(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.operate = "";
						$scope.operateReason = "";
						$scope.operateComment = "";

					});
				}
				if (checkReason && checkOperation && $scope.check.operateComment() && ($scope.type == "voice")) {
					var data = {
						"id": $scope.customer_Service.orderId,
						"operate": $scope.operate,
						"operateReason": $scope.operateReason,
						"operateComment": $scope.operateComment,
					};
					ordersService.customerVoice(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						responseService.errorResponse("操作失败");
						$scope.close();
					});
				}
			}
			$scope.close = function() {
				$scope.control = false;
			}
		}
	}
})