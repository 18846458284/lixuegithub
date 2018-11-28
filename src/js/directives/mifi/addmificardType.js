linker.directive('addmificardType', function(check,$filter, $http, webService, responseService) {
	return {
		templateUrl: './templates/directives/addmificardType.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			positioninfo: '=',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.mificardType = new Object();
				
			$scope.check = new Object();
			$scope.check.cardType = function() {
				var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
				if (!$scope.mificardType.cardType) {
					$scope.alert.cardType = true;
					$scope.alertInfo.cardType = "不能为空";
					return;
				} else if($scope.mificardType.cardType.length>16 ){
					$scope.alert.cardType = true;
					$scope.alertInfo.cardType = "长度不超过16位";
					return;
				} else if(!filter.test($scope.mificardType.cardType)){
					$scope.alert.cardType = true;
					$scope.alertInfo.cardType = "请输入汉字,数字,字母或下划线";
					return;
				} else {
					$scope.alert.cardType = false;
					$scope.alertInfo.cardType = "";
				}
/*
				webService.get_data("/mifi/admin/v2/cardtype/validate?cardType=" + $scope.mificardType.cardType)
					.then(function(data) {
							if (data.data) {
								$scope.alert.cardType = false;
								$scope.alertInfo.cardType = "";
								return;
							} else {
								$scope.alert.cardType = true;
								$scope.alertInfo.cardType = "卡类型输入有错误。输入已存在的卡类型";
							}
						},
						function(error) {
							responseService.errorResponse("操作失败。" + error);
						});*/
			};
			$scope.check.maxQuota = function() {
				if (!$scope.mificardType.maxQuota) {
					$scope.alert.maxQuota = true;
					$scope.alertInfo.maxQuota = "请输入每月最大使用量";
					return;
				}
				if($scope.mificardType.maxQuota == 0){
					$scope.alert.maxQuota = false;
					$scope.alertInfo.maxQuota = "";
					return;
				}
				if(check.nan($scope.mificardType.maxQuota)){
					$scope.alert.maxQuota = true;
					$scope.alertInfo.maxQuota = "必须是0-999999的整数";
					return;
				}
				if(!check.integer($scope.mificardType.maxQuota)){
					$scope.alert.maxQuota = true;
					$scope.alertInfo.maxQuota = "必须是0-999999的整数";
					return;
				}
				if(!check.compare_size($scope.mificardType.maxQuota,999999)){
					$scope.alert.maxQuota = true;
					$scope.alertInfo.maxQuota = "必须是0-999999的整数";
					return;
				}
				else {
					$scope.alert.maxQuota = false;
					$scope.alertInfo.maxQuota = "";
					return;
				}
			};
			
			$scope.check.monthFee = function() {
				if(!$scope.mificardType.monthFee){
					$scope.alert.monthFee = true;
					$scope.alertInfo.monthFee = "请输入每月费用";
					return false;
				}
				var monthFeestr = $scope.mificardType.monthFee;
				var amount = monthFeestr.replace(/(^\s*)|(\s*$)/g,"");
				//金额为空时
				if (amount.length == 0) {
					$scope.alert.monthFee = true;
					$scope.alertInfo.monthFee = "请输入每月费用";
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
							$scope.alert.monthFee = true;
							$scope.alertInfo.monthFee = "请输入每月费用,最多999999.99";
							return false;
						}
						//超过两位小数的数
						if (dotCnt.length > 2) {
							$scope.alert.monthFee = true;
							$scope.alertInfo.monthFee = "请输入每月费用,最多两位小数";
							return false;
						}
						//两位小数以内的数
						else {	
							$scope.alert.monthFee = false;
							$scope.alertInfo.monthFee = "";
							return true;
						}
					} else {
						if (amount >= 1000000) {
							$scope.alert.monthFee = true;
							$scope.alertInfo.monthFee = "请输入每月费用,最多999999.99";
							return false;
						} else {
							$scope.alert.monthFee = false;
							$scope.alertInfo.monthFee = "";
							return true;
						}
					}
				}
				//金额不是数字时
				else {
					$scope.alert.monthFee = true;
					$scope.alertInfo.monthFee = "数字不合法";
					return false;
				}

			};

			$scope.send = function() {
				for (var i in $scope.check) {
					$scope.check[i]();
					if ($scope.alert[i] == true)
						return;
				}

				webService.get_data("/mifi/admin/v2/cardtype/add?cardType=" + $scope.mificardType.cardType +
					"&maxQuota=" + $scope.mificardType.maxQuota * 1024 * 1024 + "&monthFee=" + $scope.mificardType.monthFee).then(function(data) {
						if(data.code == 200){
							$scope.back();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						} else {
							$scope.mificardType.cardType = "";
							responseService.errorResponse("操作失败。" + data.desc);
						}
					},
					function(error) {
						responseService.errorResponse("操作失败。" + error);
					});

			}

			$scope.back = function() {
				$scope.control = false;
			};
		}
		},
	}
})