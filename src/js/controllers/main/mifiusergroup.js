linker.controller('MifiUserGroupController', function($scope, $window, $state, $location, check, responseService, webService) {
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
	
	$scope.editgroup = function(data) {
		$scope.edit_group_control = true;
		$scope.edit_group_control_data = data;
	}
	$scope.addgroup = function() {
		$scope.add_group_control = true;
	}
	$scope.getPagesAndRecords = function(arg) {
		webService.get_data("/mifi/admin/v2/usergroup/query?pageNo=" + $scope.page +
			"&pageCount=" + $scope.pageSize +"&timeStamp=" + $scope.timeStamp
		).then(function(data) {
				$scope.total = data.pagedListDTO.total;
				$scope.usergroups = data.pagedListDTO.records;
				$scope.totalPage = data.pagedListDTO.totalPage;
				if ($scope.totalPage < $scope.page && $scope.page > 1 && $scope.totalPage != 0) {
					$scope.page = $scope.totalPage;
					$scope.getPagesAndRecords();
					return;
				}
			},
			function(error) {
				responseService.errorResponse("读取用户来源失败");
			});

	};
	initial();
});