linker.directive('addgroup', function(check, webService, $compile, responseService, $filter) {
	return {
		templateUrl: './templates/directives/addmifigroup.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function(){
				
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.groupobj = new Object();
				$scope.check = new Object();
				
				$scope.check.groupName = function() {
					var groupNameLen = $scope.groupobj.groupName;
					var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
					if (!$scope.groupobj.groupName) {
						$scope.alert.groupName = true;
						$scope.alertInfo.groupName = "不能为空";
					} else if(groupNameLen.length > 32){
						$scope.alert.groupName = true;
						$scope.alertInfo.groupName = "最多32位";
					} else if(!filter.test(groupNameLen)){
						$scope.alert.groupName = true;
						$scope.alertInfo.groupName = "请输入汉字,数字,字母或下划线";
					} else {
						$scope.alert.groupName = false;
						$scope.alertInfo.groupName = "";
					}
				};
				$scope.check.state = function() {
					if (!$scope.groupobj.state) {
						$scope.alert.state = true;
						$scope.alertInfo.state = "请选择";
					} else {
						$scope.alert.state = false;
						$scope.alertInfo.state = "";
					}
				};
				$scope.send = function() {
					
					for (var i in $scope.check) {
						$scope.check[i]();
						if ($scope.alert[i] == true)
							return;
					}
					
						webService.get_data("/mifi/admin/v2/usergroup/add?groupName=" + $scope.groupobj.groupName +
								"&state=" + $scope.groupobj.state).then(function(data) {
									if(data.code == 200){
										$scope.back();
										$scope.refresh();
										layer.alert('操作成功', {
											icon: 1
										});
									}else{
										$scope.groupobj.groupName="";
										responseService.errorResponse("操作失败。" + data.desc);
									}
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