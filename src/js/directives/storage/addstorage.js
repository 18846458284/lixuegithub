linker.directive('addstorage', function($compile, webService, responseService, storageService) {
	return {
		templateUrl: './templates/directives/storage/addstorage.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
		},
		restrict: 'ACEM',
		link: function($scope) {
			webService.get_province().then(function(data) {
					$scope.SelectProvince = data;
				},
				function(error) {
					responseService.errorResponse("读取省份失败");
				});
			$scope.init = function() {
				$scope.priority = "";
				$scope.initWaitTime = "";
				$scope.goodsId = "";
				$scope.appId = "";
				$scope.timeoutMinute = "";
				$scope.priorityStrategy = "shard";
				$scope.discount = "";
				$scope.page = 1;
				$scope.num = 10;
				$scope.filtermo = "";
				$scope.filterspec = "";
				$scope.filterpro = "";
				webService.get_data('/op/agent/getAgents').then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.agents = response.data;
					};
				}, function(errorMessage) {
					responseService.errorResponse("读取代理商信息失败");
				});
				webService.get_data('/op/goods/allGoods?bizType=' + $scope.$parent.bizType).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.goodsList = response.data;
						$scope.order = response.goodsName;
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取商品信息失败");
				});
			}
			$scope._checkgoodsName = function() {
				storageService.checkgoodsName();
			}
			$scope._checkstate = function() {
				storageService.checkstate();
			}
			$scope._checktimeoutMinute = function() {
				storageService.checktimeoutMinute();
			}
			$scope._checkdiscount = function() {
				storageService.checkdiscount();
			}
			$scope._checkinitWaitTime = function() {
				$('#initWaitTime_state').empty();
				var initWaitTime = $('#storage_initWaitTime').val();
				var reg = /^(0|[1-9]\d*)$/;
				if (initWaitTime < 0 || initWaitTime > 10000 || isNaN(initWaitTime) || !reg.test(initWaitTime)) {
					$('#initWaitTime_state').append("必须是0~10000的整数");
					$('#initWaitTime_state').show();
					return false;
				}
				return true;
			}
			$scope._checkpriority = function() {
				$('#priority_state').empty();
				var priority = $('#storage_priority').val();
				var reg = /^(0|-1|[1-9]\d*)$/;
				if (priority < -1 || priority > 1000 || isNaN(priority) || !reg.test(priority)) {
					$('#priority_state').append("必须是-1~1000的整数 -1表示不显示");
					$('#priority_state').show();
					return false;
				}
				return true;
			}
			$scope._checkgoodsspec = function() {
				var filterNum = /^[1-9]\d*$/;
				var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
				if (filterUnit.test($scope.filterspec) || filterNum.test($scope.filterspec) || !$scope.filterspec || $scope.filterspec == "*")
					$scope.filter_pro();
				else {
					layer.alert('请输入正确规格，单位M或G(大小写都可),或者任意规格*', {
						icon: 0
					});
				}
			}

			$scope.filter_pro = function() {
				var leg = 0;
				webService.get_data("/op/goods/queryGoods?goodsName=&mo=" +$scope.filtermo + 
					"&bizType=" + $scope.$parent.bizType +
					"&sourceProvince=" + $scope.filterpro +
					"&spec=" + $scope.filterspec +
					"&pageIndex=1" +
					"&pageSize=1000" + $scope.page).then(function(data) {
					$scope.goodsList = data.pagedListDTO.records;
				});
			}
			$scope.filter_mo = function() {
				$scope.filter_pro();
			}
			$scope.filter_spec = function() {
				$scope.filter_pro();
			}
			$scope.send = function() {
				var checkgoodsName = storageService.checkgoodsName();
				var checktimeoutMinute = storageService.checktimeoutMinute();
				var checkstate = storageService.checkstate();
				var checkdiscount = storageService.checkdiscount();
				var priority = $scope._checkpriority();
				var initWaitTime = $scope._checkinitWaitTime();
				if (checkgoodsName && checktimeoutMinute && checkstate && checkdiscount && initWaitTime && priority) {
					var data = {
						goodsId: $scope.goodsId,
						appId: $scope.appId,
						state: $scope.state,
						timeoutMinute: $scope.timeoutMinute,
						priorityStrategy: $scope.priorityStrategy,
						discount: $scope.discount,
						priority: $scope.priority,
						initWaitTime: $scope.initWaitTime,
					};
					storageService.commit(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.goodsId = "";
							$scope.appId = "";
							$scope.state = "";
							$scope.timeoutMinute = "";
							$scope.priorityStrategy = "";
							$scope.discount = "";
							$scope.priority = "";
							$scope.initWaitTime = "";
							$scope.back();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});

						}
					}, function(errorMessage) {
						responseService.errorResponse("操作失败");
						$scope.back();
					});
				}

			}
			$scope.back = function() {
				$scope.control = false;
			}
		}
	}



})