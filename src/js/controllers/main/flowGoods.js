linker.controller('flowGoodsController', function($scope, $state, $location, responseService, webService) {
	$scope.page = 1;
	$scope.pageSize = 10;
	$scope.totalPage = 1;
	$scope.ProvinceAndCity = "";
	$scope.goodsName = _.isUndefined($state.params.bygoodsName) ? "" : $state.params.bygoodsName;
	$scope.mo = _.isUndefined($state.params.bymo) ? "" : $state.params.bymo;
	$scope.sourceProvince = _.isUndefined($state.params.bysourceProvince) ? "" : $state.params.bysourceProvince;
	$scope.spec = _.isUndefined($state.params.byspec) ? "" : $state.params.byspec;
	$scope.bizType = "flow";
	$scope.officialPrice = "";
	$scope.timeStamp = new Date().getTime();
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
			$scope.getPagesAndRecords();
			$scope.getProvinceAndCity();
		}
	};
	$scope.addgoods = function() {
		$scope.add_control = true;
		$scope.name = "flow";
	};
	$scope.editgoods = function(data) {
		$scope.edit_control = true;
		$scope.goods = data;
	};
	$scope.getProvinceAndCity = function() {
		webService.get_data("/op/province/getAllProvince").then(function(data) {
			$scope.ProvinceAndCity = data.data;
		}, function(error) {
			responseService.errorResponse("读取省市失败");
		});
	}
	var checkName = function() {
		var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
		if (!filter.test($scope.goodsName)&&($scope.goodsName!="")) {
			layer.alert('请输入汉字,数字或者字母', {
				icon: 0
			});
			$scope.goodsName = "";
			return false;
		} else {
			return true;
		}
	}
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
	$scope.getPagesAndRecords = function() {
		webService.get_data("/op/goods/queryGoods?goodsName=" + $scope.goodsName +
			"&mo=" + $scope.mo +
			"&sourceProvince=" + $scope.sourceProvince +
			"&spec=" + $scope.spec +
			"&bizType=flow" +
			"&pageIndex=" + $scope.page +
			"&pageSize=" + $scope.pageSize +
			"&timeStamp=" + $scope.timeStamp
		).then(function(data) {
				$scope.total = data.pagedListDTO.total;
				$scope.datas = data.pagedListDTO.records;
				$scope.totalPage = data.pagedListDTO.totalPage;
				if ($scope.totalPage < $scope.page && $scope.page > 1) {
					$scope.page = $scope.totalPage;
					$scope.getPagesAndRecords();
					return;
				}
				for (var i in $scope.datas) {
					if ($scope.datas[i].officialPrice != "ALL") {
						$scope.datas[i].officialPrice = $scope.datas[i].officialPrice / 100;
					}

				}
				if ($scope.datas.spec == (-1)) {
					$scope.datas.spec == "*";
				}

			},
			function(error) {
				responseService.errorResponse("读取商品失败");
			});

	};
	$scope.searchgoods = function() {
		if (test() && checkName()) {
			$scope.timeStamp = new Date().getTime();
			$location.path("/admin/flowGoods/" + $scope.goodsName + "/" + $scope.mo + "/" + $scope.sourceProvince + "/" + $scope.spec + "/" + $scope.bizType + "/" + $scope.timeStamp);
		}
	};
	initial();
});