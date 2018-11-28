linker.controller('flowQueueController', ['$scope', '$window', '$state', '$location', 'flowQueueService', 'responseService', 'webService',
	function($scope, $window, $state, $location, flowQueueService, responseService, webService) {
		$scope.page = 1;
		$scope.num = 10;
		$scope.totalPage = 1;
		
		$scope.province = _.isUndefined($state.params.byProvince) ? "" : $state.params.byProvince;
		$scope.mo = _.isUndefined($state.params.byMo) ? "" : $state.params.byMo;
		$scope.timeStamp=new Date().getTime();
		
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
				webService.get_province().then(function(data) {
					$scope.SelectProvince = data;
				},
				function(error) {
					responseService.errorResponse("读取省份失败");
				});
				
				$scope.$watch('batch', function(nv, ov) {
					if (nv == ov) {
						return;
					}
					for (var i = 0; i < $scope.maeorders.length; i++) {
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
		
		$scope.batchReset = function() {
			$scope.batch = new Array();
		}
		
		$scope.select_all = function() {
			$scope.batchReset();
			for (var i = 0; i < $scope.maeorders.length; i++) {
				$scope.batch[i] = $scope.selectAll;
			}
		}
		
		
		$scope.batchEditQueue = function() {
			var index = $scope.batch.indexOf(true, 0);
			if (index == -1) {
				layer.alert('请选择缓存队列', {
					icon: 0
				});
				return;
			}
			$scope.batchQueue = new Object();
			$scope.batchQueue.show = true;
			$scope.batchQueue.data = [];
			while (index != -1) {
				if ($scope.batch.indexOf(true, index + 1) == -1) {
					$scope.batchQueue.data.push($scope.maeorders[index]);
					break;
				};
				$scope.batchQueue.data.push($scope.maeorders[index]);
				var index = $scope.batch.indexOf(true, index + 1);
			}
		};
		
		
		$scope.batchSetFail = function() {
			var index = $scope.batch.indexOf(true, 0);
			if (index == -1) {
				layer.alert('请选择缓存队列', {
					icon: 0
				});
				return;
			}
			$scope.batchFailQueue = new Object();
			$scope.batchFailQueue.show = true;
			$scope.batchFailQueue.data = [];
			while (index != -1) {
				if ($scope.batch.indexOf(true, index + 1) == -1) {
					$scope.batchFailQueue.data.push($scope.maeorders[index]);
					break;
				};
				$scope.batchFailQueue.data.push($scope.maeorders[index]);
				var index = $scope.batch.indexOf(true, index + 1);
			}
		};
		
		
		
		$scope.getPagesAndRecords = function() {
			flowQueueService.getQueueInfo({
					mo:$scope.mo,
					province:$scope.province,
					page: $scope.page,
					num: $scope.num,
					bizType:"flow",
					timeStamp: $scope.timeStamp
				}).then(function(response) {
					if (responseService.successResponse(response)) {
						$scope.maeorders = response.pagedListDTO.records;
						$scope.totalPage = response.pagedListDTO.totalPage;
						$scope.total = response.pagedListDTO.total;
						if($scope.totalPage<$scope.page && $scope.page > 1){
							$scope.page=$scope.totalPage;
							$scope.getPagesAndRecords();
							return;
						}
					}
				}, function(errorMessage) {
					responseService.errorResponse("读取订单缓存池信息失败");
				});
		};
		
		$scope.filterOrderQueue = function() {
				$scope.timeStamp=new Date().getTime();
				$location.path("/admin/flowqueue/" + $scope.mo + "/"+$scope.province +"/"+ "flow" + "/" +$scope.timeStamp);
		};
		
		$scope.service = function(data,operation) {
			$scope.edit_service = true;
			$scope.passed_data = data;
			$scope.name = operation;
		};	
		initial();
	}
]);