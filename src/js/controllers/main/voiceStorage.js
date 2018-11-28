linker.controller('voiceStorageController', ['$scope', '$window', '$state', '$location', 'storageService', 'responseService', 'webService',
	function($scope, $window, $state, $location, storageService, responseService, webService) {
		$scope.page = 1;
		$scope.pageSize = 10;
		$scope.timeStamp = new Date().getTime();
		$scope.storage_appId = _.isUndefined($state.params.byAppId) ? "" : $state.params.byAppId;
		$scope.goodsName = _.isUndefined($state.params.bygoodsName) ? "" : $state.params.bygoodsName;
		$scope.discount = _.isUndefined($state.params.bydiscount) ? "" : $state.params.bydiscount;
		$scope.spec = _.isUndefined($state.params.byspec) ? "" : $state.params.byspec;
		$scope.mo = _.isUndefined($state.params.bymo) ? "" : $state.params.bymo;
		$scope.state = _.isUndefined($state.params.bystate) ? "" : $state.params.bystate;
		$scope.appendState = _.isUndefined($state.params.byappendState) ? "" : $state.params.byappendState;
		$scope.sourceProvince = _.isUndefined($state.params.bysourceProvince) ? "" : $state.params.bysourceProvince;
		$scope.bizType = _.isUndefined($state.params.bybizType) ? "" : $state.params.bybizType;
		$scope.bizType = "voice";
		webService.get_province().then(function(data) {
				$scope.SelectProvince = data;
			},
			function(error) {
				responseService.errorResponse("读取省份失败");
			});
		$scope.batch = new Array();

		//	responseService.checkSession();
		$scope.getAgents = function() {
			storageService.getAgents().then(function(response) {
				if (responseService.successResponse(response)) {
					$scope.agents = response.data;
				}
			}, function(errorMessage) {
				responseService.errorResponse("读取代理商信息失败");
			});
		};
		$scope.setColor = function(data) {
			if (data.goods.bizType == "流量") {
				return {
					color: 'red'
				};
			} else {
				return {
					color: 'green'
				};
			}
		}
		$scope.getStorage = function() {
			storageService.getStorage({
				goodsName: $scope.goodsName,
				spec: $scope.spec,
				mo: $scope.mo,
				state: $scope.state,
				discount: $scope.discount,
				appendState: $scope.appendState,
				appId: $scope.storage_appId,
				sourceProvince: $scope.sourceProvince,
				pageSize: $scope.pageSize,
				pageIndex: $scope.page,
				bizType: "voice",
			}).then(function(response) {
				if (responseService.successResponse(response)) {
					$scope.batchReset();
					$scope.storage = response.pagedListDTO.records;
					$scope.totalPage = response.pagedListDTO.totalPage;
					$scope.total = response.pagedListDTO.total;
					if ($scope.totalPage < $scope.page && $scope.page > 1) {
						$scope.page = $scope.totalPage;
						$scope.getStorage();
						return;
					}
					for (var i = 0; i < response.pagedListDTO.records.length; i++) {
						var moName = response.pagedListDTO.records[i].goods.mo;
						var appendsts = response.pagedListDTO.records[i].goods.appendCount;
						if (appendsts == 0) {
							response.pagedListDTO.records[i].goods.appendCount = "无限制";
						}
						if (moName == "CMCC") {
							response.pagedListDTO.records[i].goods.mo = "中国移动"
						}
						if (moName == "ChinaNet") {
							response.pagedListDTO.records[i].goods.mo = "中国电信"
						}
						if (moName == "ChinaUnicom") {
							response.pagedListDTO.records[i].goods.mo = "中国联通"
						}
					}
				}
			}, function(errorMessage) {
				responseService.errorResponse("读取货架信息失败");
			});
		}
		var test = function() {
			var filterNum = /^[1-9]\d*$/;
			var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
			var filter = /[/#_+%&]/;
			if (filterUnit.test($scope.spec) || filterNum.test($scope.spec) || !$scope.spec || $scope.spec == "*") {
				return true;
			} else {
				layer.alert('请输入正确规格，单位M或G(大小写都可),或者任意规格*', {
					icon: 0
				});
				$scope.spec = "";
				return false;
			}
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
		var check = function() {
			var filter = /^[1-9]\d*$/;
			if($scope.discount==""){
				return true;
			}
			if (!filter.test($scope.discount)) {
				layer.alert('请输入1-10000的数字', {
					icon: 0
				});
				$scope.discount = "";
				return false;
			} else {
				if ($scope.discount > 10000 || $scope.discount < 1) {
					layer.alert('请输入1-10000的数字', {
						icon: 0
					});
					$scope.discount = "";
					return false;
				} else {
					return true;
				}
			}
		}
		$scope.filterStorage = function() {
			$scope.timeStamp = new Date().getTime();
			if (test() && check() && checkName()) {
				$location.path("/admin/voiceStorage/" + $scope.storage_appId + "/" + $scope.appendState + "/" + $scope.goodsName + "/" + $scope.discount + "/" + $scope.mo + "/" + $scope.spec + "/" + $scope.state + "/" + $scope.sourceProvince + "/" + "voice" + "/" + $scope.timeStamp);
			}
		};
		$scope.editstorage = function(data) {
			$scope.edit_show = true;
			$scope.original_data = data;
		};
		$scope.addstorage = function() {
			$scope.add_show = true;
		};
		$scope.delete = function(data) {
			$scope.delete_show = true;
			$scope.delete_data = data;
		}
		$scope.batchEditStorage = function() {
			var index = $scope.batch.indexOf(true, 0);
			if (index == -1) {
				layer.alert('请选择货架', {
					icon: 0
				});
				return;
			}
			$scope.batchStorage = new Object();
			$scope.batchStorage.show = true;
			$scope.batchStorage.data = [];
			while (index != -1) {
				$scope.batchStorage.data.push($scope.storage[index]);
				var index = $scope.batch.indexOf(true, index + 1);
				if (index == -1) break;
			}
		};
		$scope.batchDeleteStorageClick = function() {
			var index = $scope.batch.indexOf(true, 0);
			if (index == -1) {
				layer.alert('请选择货架', {
					icon: 0
				});
				return;
			}
			$scope.batchDeleteStorage = new Object();
			$scope.batchDeleteStorage.show = true;
			$scope.batchDeleteStorage.data = [];
			while (index != -1) {
				$scope.batchDeleteStorage.data.push($scope.storage[index]);
				var index = $scope.batch.indexOf(true, index + 1);
				if (index == -1) break;
			}
		};
		$scope.batchReset = function() {
			$scope.batch = new Array();
		};
		$scope.select_all = function() {
			$scope.batchReset();
			for (var i = 0; i < $scope.storage.length; i++) {
				$scope.batch[i] = $scope.selectAll;
			}
		}
		var initial = function() {
			if (responseService.checkSession()) {
				$scope.$watch('page', function() {
					$scope.getStorage();
				});
				$scope.$watch('pageSize', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getStorage();
				});
				$scope.$watch('batch', function(nv, ov) {
					if (nv == ov) {
						return;
					}
					for (var i = 0; i < $scope.storage.length; i++) {
						if ($scope.batch[i] != true) {
							$scope.selectAll = false;
							return;
						} else {
							$scope.selectAll = true;
						}
					}
				}, true);
				$scope.getAgents();
			}
		};
		initial();
	}
])