linker.directive('updateagentchannel', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/updateagentchannel.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
		},
		restrict: 'ACEM',
		link: function($scope) {
			webService.get_province().then(function(data) {
				$scope.SelectProvince=data;
			},
			function(error) {
				responseService.errorResponse("读取省份失败");
			});
			$scope.getChannel = function() {
				if ($scope.alert.spec == true) {
					return true;
				}
				webService.get_data("/op/channel/queryChannel?bizType=" + $scope.select.bizType +
					"&mo=" + $scope.select.mo +
					"&province=" + $scope.select.province +
					"&spec=" + $scope.select.spec +
					"&pageIndex=1&pageSize=1000"
				).then(function(data) {
						$scope.channels = [];
						for (var i in data.pagedListDTO.records) {
							if ($scope.control.had.indexOf(data.pagedListDTO.records[i].channelId) == -1)
								$scope.channels.push(data.pagedListDTO.records[i]);
						}
					},
					function(error) {
						responseService.errorResponse("读取渠道失败");
					});
			};
			$scope.init = function() {
				$scope.channels = [];
				$scope.select = new Object();
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.select.spec="";
				$scope.select.mo = "";
				$scope.select.province = "";
				$scope.select.bizType = "";
				$scope.select.channelId = "";
				$scope.info = false;
				$scope.getChannel();
			};
			$scope.check = function() {
				if ($scope.select.channelId.length != 0) {
					$scope.info = false;
				} else {
					$scope.info = true;
				}
			};
			$scope.send = function() {
				if ($scope.select.channelId.length != 0) {
					$scope.info = false;
					webService.get_data("/op/agentChannel/addAgentChannel?agentId=" + $scope.control.data + "&channelId=" + $scope.select.channelId).then(function(data) {
							$scope.refresh();
							$scope.back();
							 layer.alert('操作成功', {
							        icon: 1
							       });
						},
						function(error) {
							responseService.errorResponse("指定渠道失败");
						});
				} else {
					$scope.info = true;
				}
			};
			$scope.back = function() {
				$scope.control.show = false;
			};
			$scope.checkspec = function() {
				var filterNum = /^[1-9]\d*$/;
				var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
				if (filterUnit.test($scope.select.spec) || filterNum.test($scope.select.spec) || !$scope.select.spec||$scope.select.spec=="*")
				{
					$scope.alert.spec = false;
					$scope.alertInfo.spec = "";
					$scope.getChannel();	
				}
				else {
					$scope.alert.spec = true;
					$scope.alertInfo.spec = "请输入正确规格，单位M或G(大小写都可)或者任意规格*";
				}
			}
		},
	}
})