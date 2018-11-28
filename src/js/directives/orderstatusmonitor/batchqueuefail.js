linker.directive('batchsetfail', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/batchqueuefail.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			reset: '&reset',
		},
		restrict: 'ACEM',
		link: function($scope) {
//			$scope.init = function() {
//				$scope.data = new Object();
//			}
			$scope.send = function() {
				var queueId = "";
				for (var i in $scope.control.data) {
					queueId += "," + $scope.control.data[i].id;
				}
				queueId = queueId.substr(1);
				webService.get_data("/op/queue/setWaitToFail?id=" + queueId).then(function(data) {
						if(data.data==true){
							layer.alert('释放成功', {
								icon: 1
							});
						}else{
							responseService.errorResponse(data.replyDesc);
						}
						$scope.refresh();
						$scope.back();
					},
					function(error) {
						responseService.errorResponse("批量释放失败");
					});
			};
			$scope.back = function() {
				$scope.control.show = false;
				$scope.reset();
			};
		},
	}
})
