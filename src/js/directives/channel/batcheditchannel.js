linker.directive('batcheditchannel', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/batcheditchannel.html',
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
				$scope.data.state = "";
				$scope.data.cost = "";
				$scope.data.spec = "";
				$scope.data.shardRate = "";
				$scope.data.needSms = "";
			}
			$scope.check = new Object();
			$scope.check.spec = function() {
				if(!$scope.data.spec){
					$scope.alert.spec=false;
					$scope.alertInfo.spec="";
					return;
				}
				var check_data = $scope.data.spec.split(',');
				if ($scope.control.data[0].bizType != "voice") {
					var filterNum = /^[1-9]\d*$/;
					var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
					var hash = {};
					var changeUnit = /^[1-9]\d+[m|M]{1}$/;
					var changeUnitg = /^[1-9]\d+[g|G]{1}$/;
					for (var i in check_data) {
						if (changeUnit.test(check_data[i])) {
							check_data[i] = check_data[i].substring(0, check_data[i].length - 1);
							if (check_data[i] > 1048576) {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "范围：1-1024G";
								return;
							}
						}
						if (filterNum.test(check_data[i])) {
							if (check_data[i] > 1048576) {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "范围：1-1024G";
								return;
							}
						}
						if (changeUnitg.test(check_data[i])) {
							check_data[i] = check_data[i].substring(0, check_data[i].length - 1);
							if (check_data[i] > 1024) {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "范围：1-1024G";
								return;
							}
							check_data[i] = check_data[i] + 'G';
						}
						if (hash[check_data[i]]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "有重复项";
							return;
						}
						hash[check_data[i]] = true;
					}
					for (var i in check_data) {
						if (parseInt(i) == check_data.length - 1 && !check_data[i]) {
							$scope.alert.spec = false;
							$scope.alertInfo.spec = "";
							break;
						}
						if (!check_data[i]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "有空没填";
							break;
						} else if (filterUnit.test(check_data[i]) || filterNum.test(check_data[i])) {
							$scope.alert.spec = false;
							$scope.alertInfo.spec = "";
						} else {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "请按照正确格式输入，如10, 30M, 70m, 1G, 11g都是合法输入。";
							break;
						}
					}
				} else {
					var filterNum = /^[1-9]\d*$/;
					var hash = {};
					for (var i in check_data) {
						if (hash[check_data[i]]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "有重复项";
							return;
						}
						hash[check_data[i]] = true;
					}
					for (var i in check_data) {
						if (parseInt(i) == check_data.length - 1 && !check_data[i]) {
							$scope.alert.spec = false;
							$scope.alertInfo.spec = "";
							break;
						}
						if (!check_data[i]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "有空没填";
							break;
						} else if (filterNum.test(check_data[i]) || check_data[i] == "*") {
							if(check_data[i]!='*'){
								if (parseInt(check_data[i]) > 0 && parseInt(check_data[i]) <= 100000) {
									$scope.alert.spec = false;
									$scope.alertInfo.spec = "";
								} else {
									$scope.alert.spec = true;
									$scope.alertInfo.spec = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格。";
								}
							}else{
								$scope.alert.spec = false;
								$scope.alertInfo.spec = "";
							}
						} else {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格。";
							break;
						}
					}
				}
			}
			$scope.check.cost = function() {
				var reg = /^([1-9]\d*)$/;
				if ($scope.data.cost < 1 || $scope.data.cost > 10000 || !reg.test($scope.data.cost)) {
					if (!$scope.data.cost) {
						$scope.alertInfo.cost = "";
						$scope.alert.cost = false;
						return;
					}
					$scope.alertInfo.cost = "必须是1-10000的整数";
					$scope.alert.cost = true;
				} else {
					$scope.alertInfo.cost = "";
					$scope.alert.cost = false;
				}
			}
			$scope.check.shardRate = function() {
				var reg = /^([1-9]\d*)$/;
				if ($scope.data.shardRate < 1 || $scope.data.shardRate > 999 || !reg.test($scope.data.shardRate)) {
					if (!$scope.data.shardRate) {
						$scope.alertInfo.shardRate = "";
						$scope.alert.shardRate = false;
						return;
					}
					$scope.alertInfo.shardRate = "必须是1-999的整数";
					$scope.alert.shardRate = true;
				} else {
					$scope.alertInfo.shardRate = "";
					$scope.alert.shardRate = false;
				}
			}
			$scope.send = function() {
				for (var i in $scope.check) {
					$scope.check[i]();
					if ($scope.alert[i] == true) return;
				}
				var channelId = "";
				for (var i in $scope.control.data) {
					channelId += "," + $scope.control.data[i].channelId;
				}
				channelId = channelId.substr(1);
				webService.get_data("/op/channel/updateBranchChannel?channelIds=" + channelId + 
						"&state=" + $scope.data.state + 
						"&spec=" + $scope.data.spec + 
						"&cost=" + $scope.data.cost + 
						"&smsState=" + $scope.data.needSms + 
						"&shardRate="+$scope.data.shardRate).then(function(data) {
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
						responseService.errorResponse(error);
					});
			};
			$scope.back = function() {
				$scope.control.show = false;
				$scope.reset();
			};
		},
	}
})