
linker.controller('RoleController', function($scope, $window, $state, $location, responseService, webService) {
	$scope.roleName = _.isUndefined($state.params.byroleName) ? "" : $state.params.byroleName;
	$scope.addrole = function() {
		$scope.add_control = true;
	};
	$scope.editrole = function(data) {
		$scope.edit_control = true;
		$scope.edit_control_data=data;
	};
	$scope.deleterole = function(data) {
		$scope.delete_control = true;
		$scope.delete_data=data;
	}
	
	$scope.get_data = function() {
		var url = "/user/role/getRole";
		webService.get_data(url).then(function(data) {
				$scope.datas = data.data;
			},
			function(error) {
				responseService.errorResponse("读取角色失败");
			});
		
	};
	$scope.get_data();
});