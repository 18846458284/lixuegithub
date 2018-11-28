linker.directive('batchdeletechannel', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/batchdeletechannel.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			reset:'&reset',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.send = function() {
				var channelId="";
				for(var i in $scope.control.data){
					channelId+=","+$scope.control.data[i].channelId;
				}
				channelId=channelId.substr(1);
				webService.get_data("/op/agentChannel/delBranchAgentChannel?agentId="+$scope.control.agentId+"&channelId="+channelId).then(function(data) {
						$scope.refresh();
						$scope.back();
						 layer.alert('操作成功', {
						        icon: 1
						       });
					},
					function(error) {
						responseService.errorResponse("批量删除渠道失败");
					});
			};
			$scope.back = function() {
				$scope.control.show = false;
				$scope.reset();
			};
		},
	}
})