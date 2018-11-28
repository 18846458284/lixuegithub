linker.directive('batchdeletestorage', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/batchdeletestorage.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			reset:'&reset',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.send = function() {
				var Id="";
				for(var i in $scope.control.data){
					Id+=","+$scope.control.data[i].id;
				}
				Id=Id.substr(1);
				webService.get_data("/op/shelf/delShelfBranch?id="+Id).then(function(data) {
						$scope.refresh();
						$scope.back();
					},
					function(error) {
						responseService.errorResponse("批量删除货架失败");
					});
			};
			$scope.back = function() {
				$scope.control.show = false;
				$scope.reset();
			};
		},
	}
})