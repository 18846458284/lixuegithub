linker.directive('editgroup', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/editmifigroup.html',
		scope: {
			editcontroldata: "=",
			control: "=",
			refresh: '&refreshFn',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function(){
				
				$scope.mifiGroup = new Object();
				angular.copy($scope.editcontroldata, $scope.mifiGroup);
				
				$scope.send = function() {
					webService.get_data("/mifi/admin/v2/usergroup/edit?id=" + $scope.mifiGroup.id +
						"&state=" + $scope.mifiGroup.state).then(function(data) {
							$scope.back();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						},
						function(error) {
							responseService.errorResponse("操作失败。" + error);
						});
				}
			$scope.back = function() {
				$scope.control = false;
			};
			}
			}
		}
})