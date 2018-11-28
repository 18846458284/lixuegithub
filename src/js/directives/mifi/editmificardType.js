linker.directive('editmificardType', function(check, $filter, webService, responseService) {
	return {
		templateUrl: './templates/directives/editmificardType.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			positioninfo: '=',
			control: "=",
			refresh: '&refreshFn',
			mificardtypeinit: '='

		},
		restrict: 'ACEM',

		link: function($scope) {
			$scope.init = function() {
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.mificardType = new Object();
				angular.copy($scope.mificardtypeinit, $scope.mificardType);
				$scope.mificardType.editmaxQuota = $scope.mificardType.maxQuota/1024/1024;
				$scope.mificardType.editmonthFee = $scope.mificardType.monthFee.toFixed(2);
			};

			$scope.check = new Object();
			
			$scope.check.editmaxQuota = function() {
				if (!$scope.mificardType.editmaxQuota) {
					$scope.alert.editmaxQuota = true;
					$scope.alertInfo.editmaxQuota = "请输入每月最大使用量";
					return;
				}
				if($scope.mificardType.editmaxQuota == 0){
					$scope.alert.editmaxQuota = false;
					$scope.alertInfo.editmaxQuota = "";
					return;
				}
				if(check.nan($scope.mificardType.editmaxQuota)){
					$scope.alert.editmaxQuota = true;
					$scope.alertInfo.editmaxQuota = "必须是0-999999的整数";
					return;
				}
				if(!check.integer($scope.mificardType.editmaxQuota)){
					$scope.alert.editmaxQuota = true;
					$scope.alertInfo.editmaxQuota = "必须是0-999999的整数";
					return;
				}
				if(!check.compare_size($scope.mificardType.editmaxQuota,999999)){
					$scope.alert.editmaxQuota = true;
					$scope.alertInfo.editmaxQuota = "必须是0-999999的整数";
					return;
				}
				else {
					$scope.alert.editmaxQuota = false;
					$scope.alertInfo.editmaxQuota = "";
					return;
				}
			};
			$scope.check.editmonthFee = function() {
				var monthFeestr = $scope.mificardType.editmonthFee;
				var amount = monthFeestr.replace(/(^\s*)|(\s*$)/g,"");
				//金额为空时
				if (amount.length == 0) {
					$scope.alert.editmonthFee = true;
					$scope.alertInfo.editmonthFee = "请输入每月费用";
					return false;
				}
				//金额为数字时，分为整数和小数两种情况。
				if (!isNaN(amount)) {
					var dot = amount.indexOf(".");
					//小数
					if (dot != -1) {
						var dotCnt = amount.substring(dot + 1, amount.length);
						var mm=amount.split(".")[0];
						if (mm > 999999 || mm <= 0) {
							$scope.alert.editmonthFee = true;
							$scope.alertInfo.editmonthFee = "请输入每月费用,最多999999.99";
							return false;
						}
						//超过两位小数的数
						if (dotCnt.length > 2) {
							$scope.alert.editmonthFee = true;
							$scope.alertInfo.editmonthFee = "请输入每月费用,最多两位小数";
							return false;
						}
						//两位小数以内的数
						else {
							$scope.alert.editmonthFee = false;
							$scope.alertInfo.editmonthFee = "";
							return true;
						}
					} else {
						if (amount >= 1000000) {
							$scope.alert.editmonthFee = true;
							$scope.alertInfo.editmonthFee = "请输入每月费用,最多999999.99";
							return false;
						} else {
							$scope.alert.editmonthFee = false;
							$scope.alertInfo.editmonthFee = "";
							return true;
						}
					}
				}
				//金额不是数字时
				else {
					$scope.alert.editmonthFee = true;
					$scope.alertInfo.editmonthFee = "数字不合法";
					return false;
				}

			};

			$scope.send = function() {
				$scope.check.editmaxQuota();
				$scope.check.editmonthFee();
				if ($scope.alert.editmaxQuota == true) {
					return;
				}
				if ($scope.alert.editmonthFee == true) {
					return;
				}
				webService.get_data("/mifi/admin/v2/cardtype/edit?cardType=" + $scope.mificardType.cardType +
					"&maxQuota=" + $scope.mificardType.editmaxQuota * 1024 * 1024 + "&monthFee=" + $scope.mificardType.editmonthFee
				).then(function(data) {
					if(data.code == 200){
						$scope.back();
						$scope.refresh();
						layer.alert('操作成功', {
							icon: 1
						});
					} else{
						responseService.errorResponse("操作失败。" + data.desc);
					}
						
					},
					function(error) {
						responseService.errorResponse("操作失败。" + error);
					});
			};

			$scope.back = function() {
				$scope.control = false;
			};
		},
	}
})