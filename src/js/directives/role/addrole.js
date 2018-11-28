linker.directive('addrole', function(check, webService, $compile, $filter, responseService) {
	return {
		templateUrl: './templates/directives/addrole.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.init = function() {
				var zTree;
				var selectList = "";
				var setting = {
					data: {
						simpleData: {
							enable: true
						}
					},
					check: {
						enable: true,
						autoCheckTrigger: true,
					     "Y" : "ps", 
					     "N" : "ps"
					}
				};
				webService.get_data("/user/role/getMenu").then(function(data) {
					var zTreeNodes = eval(data.data);
					$scope.molist = $.fn.zTree.init($("#tree"),setting, zTreeNodes);
				},
				function(error) {
					responseService.errorResponse("读取菜单失败");
				});
				$scope.role = new Object();
			}
			$scope.send = function() {
				console.log($scope.role.newrole);
				if($scope.check('empty', false, $scope.role.newrole)){
					return;
				}
				
				var nodes = $scope.molist.getCheckedNodes(true);
				var tmpNode;
				var ids = "";
				for(var i=0; i<nodes.length; i++){
					tmpNode = nodes[i];
					if(i!=nodes.length-1){
						ids += tmpNode.id+",";
					}else{
						ids += tmpNode.id;
					}
				}
				webService.get_data("/user/role/addRole?roleName=" + $scope.role.newrole +"&menuId=" + ids)
						.then(function(data) {
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
				console.log("222");
			}
			
			$scope.check = function(type, event, data) {
				var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
				var target = new Object();
				if (event) {
					target = event.currentTarget;
				} else {
					if (data) target.value = data;
					else {
						target.value = null;
					}
				}
				if (check.not_null(target.value) && filter.test(target.value)){
					$scope.role.alertData = false;
				} else if(!filter.test(target.value) && check.not_null(target.value)){
					$scope.role.alertData = true;
					$scope.role.alertMess = "请输入汉字,数字或者字母";
					return true;
				} else {
					$scope.role.alertData = true;
					$scope.role.alertMess = "不能为空";
					return true;
				}
			};
		},
	}

})
