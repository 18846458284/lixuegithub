linker.controller('MifiResourceController', ['$scope', '$window', '$state', '$location', 'mifiUserInfoService', 'responseService', 'webService',
	function($scope, $window, $state, $location, mifiUserInfoService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;

		$scope.timeStamp = new Date().getTime();
		
		$scope.mifiNo = _.isUndefined($state.params.bymifiNo) ? "" : $state.params.bymifiNo;
		$scope.mifiPhoneNo = _.isUndefined($state.params.bymifiPhoneNo) ? "" : $state.params.bymifiPhoneNo;
		$scope.cardType = _.isUndefined($state.params.bycardType) ? "" : $state.params.bycardType;
		$scope.province = _.isUndefined($state.params.byprovince) ? "" : $state.params.byprovince;
		$scope.activeState = _.isUndefined($state.params.byactiveState) ? "" : $state.params.byactiveState;
		
		$scope.batch = new Array();
		
		var initial = function() {
			if (responseService.checkSession()) {
				$scope.$watch('page', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getPagesAndRecords();
				});
				$scope.$watch('num', function(newvalue, oldvalue) {
					if (newvalue === oldvalue) {
						return;
					}
					$scope.getPagesAndRecords();
				});
				$scope.$watch('batch', function(nv, ov) {
					if (nv == ov) {
						return;
					}
					for (var i = 0; i < $scope.mifiresources.length; i++) {
						if ($scope.batch[i] != true) {
							$scope.selectAll = false;
							return;
						} else {
							$scope.selectAll = true;
						}
					}
				}, true);
//				获取套餐类型
				webService.get_data("/mifi/admin/v2/cardtype/queryall").then(function(data) {
						$scope.list = data.data;
					},
					function(error) {
						responseService.errorResponse("读取套餐类型失败");
					});
//				获取省份
				webService.get_data("/mifi/admin/v2/province/query").then(function(data) {
					$scope.provinces = data.data;
				},
				function(error) {
					responseService.errorResponse("读取套餐类型失败");
				});
				$scope.getPagesAndRecords();
			}
		};
		
		$scope.getPagesAndRecords = function() {
			if(checkMifiPhoneNo() && checkMifiNo()){
				mifiUserInfoService.getMifiRes({
					mifiNo: $scope.mifiNo,
					mifiPhoneNo: $scope.mifiPhoneNo,
					cardType: $scope.cardType,
					province: $scope.province,
					activeState: $scope.activeState,
					page: $scope.page,
					num: $scope.num,
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (response.code == 200) {
						$scope.mifiresources = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
							$scope.page = $scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}else{
						responseService.errorResponse(response.desc);
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取MIFI资源失败");
				});
			}
		};
//		编辑单个
		$scope.editMifi = function(data){
			$scope.edit_control = true;
			$scope.edit_control_data = data;
		};
//		新增
		$scope.addMifiRes = function(){
			$scope.add_control = true;
		}
		
		$scope.batchReset = function() {
			$scope.batch = new Array();
		}
		$scope.select_all = function() {
			$scope.batchReset();
			for (var i = 0; i < $scope.mifiresources.length; i++) {
				$scope.batch[i] = $scope.selectAll;
			}
		}
		$scope.batchEditMifi = function() {
			var index = $scope.batch.indexOf(true, 0);
			if (index == -1) {
				layer.alert('请选择要修改的项', {
					icon: 0
				});
				return;
			}
			$scope.batcheditcontrol = new Object();
			$scope.batcheditcontrol.show = true;
			$scope.batcheditcontrol.data = [];
			while (index != -1) {
				if ($scope.batch.indexOf(true, index + 1) == -1) {
					$scope.batcheditcontrol.data.push($scope.mifiresources[index]);
					break;
				};
				$scope.batcheditcontrol.data.push($scope.mifiresources[index]);
				var index = $scope.batch.indexOf(true, index + 1);
			}
		};
		var checkMifiNo = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.mifiNo)&&($scope.mifiNo!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.mifiNo = "";
				return false;
			} else {
				return true;
			}
		}
		var checkMifiPhoneNo = function() {
			var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
			if (!filter.test($scope.mifiPhoneNo)&&($scope.mifiPhoneNo!="")) {
				layer.alert('请输入汉字,数字或者字母', {
					icon: 0
				});
				$scope.mifiPhoneNo = "";
				return false;
			} else {
				return true;
			}
		}
		$scope.filterMifiRes = function() {
			if(checkMifiPhoneNo() && checkMifiNo()){
				$scope.timeStamp = new Date().getTime();
				$location.path("/admin/mifiresource/" + $scope.mifiNo + "/" +
						$scope.mifiPhoneNo + "/" + $scope.cardType + "/" + 
						$scope.province + "/" + $scope.activeState + "/" + $scope.timeStamp);
			}
		};

		$scope.exportMifiRes = function() {
			if(checkMifiPhoneNo() && checkMifiNo()){
				$scope.filterMifiRes();
				$window.location = "/mifi/admin/v2/mificard/export?mifiNo=" + $scope.mifiNo + "&mifiPhoneNo=" + $scope.mifiPhoneNo + "&cardType=" + $scope.cardType +
				"&province=" + $scope.province + "&activeState=" + $scope.activeState +"&filename="+"mifi资源";
			}
		};
		initial();
	}
]);