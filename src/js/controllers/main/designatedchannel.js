linker.controller('DesignatedchannelController', function($scope, popupService, $window, $state, $location, check, responseService, webService) {

	$scope.page = 1;
	$scope.pageSize = 10;
	$scope.timeStamp = new Date().getTime();
	$scope.agentId = _.isUndefined($state.params.byagentId) ? "" : $state.params.byagentId;
	$scope.mo = _.isUndefined($state.params.bymo) ? "" : $state.params.bymo;
	$scope.province = _.isUndefined($state.params.byprovince) ? "" : $state.params.byprovince;
	$scope.channelId = _.isUndefined($state.params.bychannelId) ? "" : $state.params.bychannelId;
	$scope.channelName = _.isUndefined($state.params.bychannelName) ? "" : $state.params.bychannelName;
	$scope.spec = _.isUndefined($state.params.byspec) ? "" : $state.params.byspec;
	$scope.bizType = _.isUndefined($state.params.bybizType) ? "" : $state.params.bybizType;

	webService.get_province().then(function(data) {
			$scope.SelectProvince = data;
		},
		function(error) {
			responseService.errorResponse("读取省份失败");
		});
	$scope.batch = new Array();

	var initial = function() {
		if (responseService.checkSession()) {
			$scope.$watch('page', function(newvalue, oldvalue) {
				if (newvalue === oldvalue) {
					return;
				}
				$scope.get_data();
			});
			$scope.$watch('pageSize', function(newvalue, oldvalue) {
				if (newvalue === oldvalue) {
					return;
				}
				$scope.get_data();
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
			}, true)
			$scope.get_data();
		}
	};
	$scope.select_all = function() {
		$scope.batchReset();
		for (var i = 0; i < $scope.datas.length; i++) {
			$scope.batch[i] = $scope.selectAll;
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
	$scope.addchannel = function() {
		webService.get_data("/op/agentChannel/getAgentChannel?agentId=" + $scope.agentId +
			"&mo=&province=&channelId=&channelName=&spec=&bizType=" +
			"&pageSize=1000&pageIndex=1").then(function(data) {
				var datas = data.pagedListDTO.records;
				$scope.addchanneldata = new Object();
				$scope.addchanneldata.show = true;
				$scope.addchanneldata.data = $scope.agentId;
				$scope.addchanneldata.had = new Array();
				for (var i in datas) {
					$scope.addchanneldata.had.push(datas[i].channelId);
				};
			},
			function(error) {
				responseService.errorResponse("读取渠道失败");
			});
	};
	$scope.deletechannel = function(data) {
		$scope.popupdata = popupService.set("删除渠道", true, "/op/agentChannel/delAgentChannel?agentId=" + $scope.agentId + "&channelId=" + data.channelId);
		$scope.control = false;
		$scope.popupdata.showname = data.channelName;
		$scope.popupdata.datas = [];
	};
	$scope.batchDeleteChannel = function() {
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
			$scope.batchChannel.data.push($scope.datas[index]);
			var index = $scope.batch.indexOf(true, index + 1);
			if (index == -1) break;
		}
	};
	$scope.batchReset = function() {
		$scope.batch = new Array();
	}
	$scope.get_data = function() {
		webService.get_data("/op/agentChannel/getAgentChannel?agentId=" + $scope.agentId +
			"&mo=" + $scope.mo +
			"&province=" + $scope.province +
			"&channelId=" + $scope.channelId +
			"&channelName=" + $scope.channelName +
			"&spec=" + $scope.spec +
			"&bizType=" + $scope.bizType +
			"&pageSize=" + $scope.pageSize +
			"&pageIndex=" + $scope.page).then(function(data) {
				$scope.batchReset();
				$scope.datas = data.pagedListDTO.records;
				$scope.totalPage = data.pagedListDTO.totalPage;
				$scope.total = data.pagedListDTO.total;
				if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
					$scope.page = $scope.totalPage;
					$scope.get_data();
					return;
				}
			},
			function(error) {
				responseService.errorResponse("读取渠道失败");
			});

	};
	var checkSpec = function() {
		var filterNum = /^[1-9]\d*$/;
		var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
		if (filterUnit.test($scope.spec) || filterNum.test($scope.spec) || !$scope.spec || $scope.spec == "*") {
			return true;
		} else {
			layer.alert('请输入正确规格，单位M或G(大小写都可),或者任意规格*', {
				icon: 0
			});
			$scope.spec = "";
			return false
		}
	}
	$scope.searchchannel = function() {
		$scope.timeStamp = new Date().getTime();
		if (check() && checkName() && checkSpec()) {
			$location.path("/admin/agent/designatedchannel/" + $scope.agentId + "/" + $scope.mo + "/" + $scope.province + "/" + $scope.channelId + "/" + $scope.channelName + "/" + $scope.spec + "/" + $scope.bizType + "/" + $scope.timeStamp);
		}
	};
	initial();
});