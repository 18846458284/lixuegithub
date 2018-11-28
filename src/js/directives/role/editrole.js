linker.directive('editrole', function(check, webService, $compile, $filter, responseService) {
	return {
		templateUrl: './templates/directives/editrole.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			editcontroldata: "=",
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
				console.info($scope);
				//alert($scope.editcontroldata);
				
				var roleId =$scope.editcontroldata.id;
				var url = "/user/role/getMenu?roleId="+roleId;
				console.info(url);
				webService.get_data(url).then(function(data) {
					var zTreeNodes = eval(data.data);
					$scope.molist = $.fn.zTree.init($("#edittree"),setting, zTreeNodes);
				},
				function(error) {
					responseService.errorResponse("读取菜单失败");
				});
				$scope.role = new Object();
				angular.copy($scope.editcontroldata, $scope.role);
				$scope.roleId = $scope.editcontroldata.id;
			}
			$scope.send = function() {
				console.log($scope.newrole);
				if($scope.check('empty', false, $scope.role.roleName)){
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
				webService.get_data("/user/role/editRole?roleId="+$scope.roleId+"&reRoleName=" + $scope.role.roleName +"&menuId=" + ids)
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
				var target = new Object();
				if (event) {
					target = event.currentTarget;
				} else {
					if (data) target.value = data;
					else {
						target.value = null;
					}
				}
				if (check.not_null(target.value)) $scope.alertData = false;
				else{
					$scope.alertData = true;
					$scope.alertMess = "不能为空";
					return true;
				}
			};
		},
	}

})