linker.filter('showall', function() {
	return function(input) {
		var temp = input;
		temp = temp.replace(/[*]/, "ALL元")
		return temp;
	}
});
linker.controller('voiceChannelController', function($scope, $window, $state, $location, check, responseService, webService) {
	$scope.page = 1;
	$scope.pageSize = 10;
	$scope.totalPage = 1;
	$scope.timeStamp = new Date().getTime();

	$scope.orderBy = "channelId";
	$scope.orderByValue = "-1";
	$scope.state = _.isUndefined($state.params.byState) ? "" : $state.params.byState;
	$scope.needSms = _.isUndefined($state.params.byNeedSms) ? "" : $state.params.byNeedSms;
	$scope.channelId = _.isUndefined($state.params.bychannelId) ? "" : $state.params.bychannelId;
	$scope.channelName = _.isUndefined($state.params.bychannelName) ? "" : $state.params.bychannelName;
	$scope.mo = _.isUndefined($state.params.bymo) ? "" : $state.params.bymo;
	$scope.province = _.isUndefined($state.params.byprovince) ? "" : $state.params.byprovince;
	$scope.spec = _.isUndefined($state.params.byspec) ? "" : $state.params.byspec;
	$scope.bizType = "voice";

	webService.get_province().then(function(data) {
			$scope.SelectProvince = data;
		},
		function(error) {
			responseService.errorResponse("读取省份失败");
		});
	$scope.batch = new Array();
	var test = function() {
		var filterNum = /^[1-9]\d*$/;
		var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
		if (filterUnit.test($scope.spec) || filterNum.test($scope.spec) || !$scope.spec || $scope.spec == "*") {
			return true;
		} else {
			layer.alert('请输入正确规格，单位M或G(大小写都可),或者任意规格*', {
				icon: 0
			});
			$scope.spec="";
			return false
		}
	}
	var checkName = function() {
		var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
		if (!filter.test($scope.channelName)&&($scope.channelName!="")) {
			layer.alert('请输入汉字,数字或者字母', {
				icon: 0
			});
			$scope.channelName = "";
			return false;
		} else {
			return true;
		}
	}
	var check = function() {
		var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
		if (!filter.test($scope.channelId)&&($scope.channelId!="")) {
			layer.alert('请输入汉字,数字或者字母', {
				icon: 0
			});
			$scope.channelId = "";
			return false;
		} else {
			return true;
		}
	}
	$scope.batchEditChannel = function() {
		var index = $scope.batch.indexOf(true, 0);
		if (index == -1) {
			layer.alert('请选择渠道', {
				icon: 0
			});
			return;
		}
		$scope.batchChannel = new Object();
		$scope.batchChannel.show = true;
		$scope.batchChannel.data = [];
		$scope.batchChannel.agentId = $scope.agentId;
		while (index != -1) {
			if ($scope.batch.indexOf(true, index + 1) == -1) {
				$scope.batchChannel.data.push($scope.datas[index]);
				break;
			};
			if ($scope.datas[index].bizType != $scope.datas[$scope.batch.indexOf(true, index + 1)].bizType) {
				layer.alert('请选择相同业务类型的渠道', {
					icon: 0
				});
				$scope.batchChannel.show = false;
				return;
			}
			$scope.batchChannel.data.push($scope.datas[index]);
			var index = $scope.batch.indexOf(true, index + 1);

		}
	};
	$scope.batchReset = function() {
		$scope.batch = new Array();
	}

	var initial = function() {
		if (responseService.checkSession()) {
			$scope.$watch('page', function(newvalue, oldvalue) {
				if (newvalue === oldvalue) {
					return;
				}
				$scope.getPagesAndRecords();
			});
			$scope.$watch('pageSize', function(newvalue, oldvalue) {
				if (newvalue === oldvalue) {
					return;
				}
				$scope.getPagesAndRecords();
			});
			$scope.$watch('batch', function(nv, ov) {
				if (nv == ov) {
					return;
				}
				for (var i = 0; i < $scope.datas.length; i++) {
					if ($scope.batch[i] != true) {
						$scope.selectAll = false;
						return;
					} else {
						$scope.selectAll = true;
					}
				}
			}, true);
			$scope.getPagesAndRecords();
		}
	};
	$scope.select_all = function() {
		$scope.batchReset();
		for (var i = 0; i < $scope.datas.length; i++) {
			$scope.batch[i] = $scope.selectAll;
		}
	}
	$scope.addchannel = function() {
		$scope.add_control = true;
		$scope.name = "voice";
	};
	$scope.editchannel = function(data) {
		$scope.edit_control = true;
		$scope.edit_control_data = data;
	};
	$scope.channelswitch = function(data) {
		$scope.channel_switch = true;
		$scope.channel_switch_data = data;
	}
	$scope.getPagesAndRecords = function(arg) {
		webService.get_data("/op/channel/queryChannel?channelId=" + $scope.channelId +
			"&channelName=" + $scope.channelName +
			"&bizType=" + $scope.bizType +
			"&mo=" + $scope.mo +
			"&state=" + $scope.state +
			"&smsState=" + $scope.needSms +
			"&province=" + $scope.province +
			"&spec=" + $scope.spec +
			"&orderBy=" + $scope.orderBy + ":" + $scope.orderByValue +
			"&pageIndex=" + $scope.page +
			"&pageSize=" + $scope.pageSize +
			"&timeStamp=" + $scope.timeStamp
		).then(function(data) {
				$scope.batchReset();
				$scope.total = data.pagedListDTO.total;
				$scope.datas = data.pagedListDTO.records;
				$scope.totalPage = data.pagedListDTO.totalPage;
				if ($scope.totalPage < $scope.page && $scope.page > 1) {
					$scope.page = $scope.totalPage;
					$scope.getPagesAndRecords();
					return;
				}
			},
			function(error) {
				responseService.errorResponse("读取渠道失败");
			});

	};
	$scope.searchchannel = function() {
		if (test() && check()&&checkName()) {
			$scope.timeStamp = new Date().getTime();
			$location.path("/admin/voiceChannel/" + $scope.channelId + "/" + $scope.state + "/" + $scope.channelName + "/" + $scope.mo + "/" + $scope.province + "/" + $scope.spec + "/" + $scope.bizType + "/" + $scope.needSms + "/" + $scope.timeStamp);
		}
	};
	initial();
});