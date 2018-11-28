linker.controller('MifiCardTypeController', function($scope, $window, $state, $location, check, responseService, webService) {

	$scope.page = 1;
	$scope.pageSize = 10;
	$scope.totalPage = 1;
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
		}
	};

	$scope.addMifiCardType = function() {
		$scope.add_control = true;
	};

	$scope.editMifiCardType = function(data) {
		$scope.edit_control = true;
		$scope.mificardType = data;
	};

	$scope.getPagesAndRecords = function(arg) {
		webService.get_data("/mifi/admin/v2/cardtype/query?&pageNo=" + $scope.page +
				"&pageCount=" + $scope.pageSize + "&timeStamp=" + $scope.timeStamp
		).then(function(data) {
				$scope.total = data.pagedListDTO.total;
				$scope.datas = data.pagedListDTO.records;
				$scope.totalPage = data.pagedListDTO.totalPage;
				if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
					$scope.page = $scope.totalPage;
					$scope.getPagesAndRecords();
					return;
				}
			},
			function(error) {
				responseService.errorResponse("读取卡类型失败");
			});

	};


	initial();
});