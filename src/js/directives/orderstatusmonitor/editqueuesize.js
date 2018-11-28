linker.directive('editqueueservice', function(responseService, flowQueueService) {
	return {
		templateUrl: './templates/directives/editqueue.html',
		scope: {
			type: "=",
			control: "=",
			refresh: '&refreshFn',
			original: "=",
		},

		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				$scope.alert = new Object();
				$scope.customer_Service = new Object();
				angular.copy($scope.original, $scope.customer_Service);
				$scope.reset = false;
				$scope.tofail = false;
				
			if($scope.type == "editqueue"){
				$scope.reset = true;
			}
			if($scope.type == "waittofail"){
				$scope.tofail = true;
			}
			
			
			$scope.checkQueueSize = function() {
				var reg = /^([1-9]\d*)$/;
				$('#reason2').empty();
				var responseCode = $('#edit_response').val();
				if(!responseCode){
					$('#reason2').append("请输入1-10000的整数");
					$('#reason2').show();
					return false;
				}
				if(responseCode < 1 ||  !reg.test(responseCode) || responseCode > 10000){
					$('#reason2').append("请输入1-10000的整数");
					$('#reason2').show();
					return false;
				}
				return true;
			}
			
			var thischeckQueueSize = function() {
				var reg = /^([1-9]\d*)$/;
				$('#reason2').empty();
				var responseCode = $('#edit_response').val();
				if(!responseCode){
					$('#reason2').append("请输入1-10000的整数");
					$('#reason2').show();
					return false;
				}
				if(responseCode < 1 ||  !reg.test(responseCode) || responseCode > 10000){
					$('#reason2').append("请输入1-10000的整数");
					$('#reason2').show();
					return false;
				}
				return true;
			}
			
			
			$scope.commit = function() {
				if ($scope.type == "editqueue" && thischeckQueueSize()) {
					var data = {
						"province": $scope.customer_Service.province,
						"mo": $scope.customer_Service.mo,
						"id": $scope.customer_Service.id,
						"queueSize": $scope.customer_Service.queueSize,
					};
					flowQueueService.editqueue(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.customer_Service.queueSize = "";
					});
				}
				if ($scope.type == "waittofail") {
					var data = {
						"id": $scope.customer_Service.id,
					};
					flowQueueService.waitToFail(data).then(function(response) {
						if (responseService.successResponse(response)) {
							$scope.close();
							$scope.refresh();
							console.log($scope.operateReason);
							layer.alert('操作成功', {
								icon: 1
							});
						}

					}, function(errorResponse) {
						$scope.close();
						$scope.refresh();
						layer.alert('操作失败', {
							icon: 2
						});
					});
				}
			}
			$scope.close = function() {
				$scope.control = false;
			}
		}
	  }
	}
})