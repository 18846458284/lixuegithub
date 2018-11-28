linker.controller('UserController', function($scope, $location, $http, responseService, webService, popupService) {
	$scope.select = function(type, data) {
		if (type == "addAdminUser") {
			$scope.control = false;
			$scope.popupdata = popupService.set("新增用户", true, "/user/user/addAdminUser?userName=&passwd=&passwdcheck=&roleId=");
			$scope.popupdata.default = [
				"", "", "", ""
			];
			$scope.popupdata.datas = [ {
				"name": "用户名",
				"url": "<input maxlength=32 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \" />",
				"blur": "email",
			}, {
				"name": "登陆密码",
				"url": "<input type=\"password\" name=\"{{$index}}\" style=\"display: block;width: 100%; \" ng-blur=\"check(item.blur,$event) \" ng-model=\"data[3*$index] \">",
				"blur": "passwd",
			}, {
				"name": "确认密码",
				"url": "<input type=\"password\" name=\"{{$index}}\" style=\"display: block;width: 100%; \" ng-blur=\"check(item.blur,$event) \" ng-model=\"data[3*$index] \">",
				"blur": "passwdcheck",
			},{
				"name": "选择角色",
				"blur": "select",
				"url": "<select name=\"{{$index}}\" tabindex=\"1\" style=\"display: block;width: 100%;\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\">" +
					"<option value=\"\">请选择</option>",
			}];
			var roles = $scope.roleDatas;
			for (var i = 0; i < roles.length; i++) {
				$scope.popupdata.datas[3].url += "<option value=" + roles[i].id + ">" + roles[i].roleName + "</option>";
			}
			$scope.popupdata.datas[3].url += "</select>";
		} else if (type == "delete") {
			$scope.popupdata = popupService.set("删除账号", true);
			$scope.control = false;
			$scope.popupdata.default = [data.userName];
			$scope.popupdata.datas = [{
				"name": "删除账号",
				"blur": "select",
				"url": "<input style=\"display: block;width: 100%;\" disabled=\"disabled\" ng-model=\"data[3*$index]\" name=\"{{$index}}\" />",
			}];
			$scope.url = "/user/user/deleteUser?userName="+data.userName;
			$scope.send = function(data) {
				var url = $scope.url;
				webService.get_data(url).then(function(data) {
						$scope.popupdata = popupService.set("", false);
						$scope.get_data();
						layer.alert('操作成功', {
							icon: 1
						});
					},
					function(error) {
						responseService.errorResponse("操作失败。" + error);
					});
			}
		} else if (type == "edituser") {
			var roles = $scope.roleDatas;
			var initRoleId;
			for (var i = 0; i < roles.length; i++) {
				if(data.userRole == roles[i].roleName){
					initRoleId = roles[i].id;
					break;
				}
			}
			$scope.popupdata = popupService.set("修改用户", true, "/user/user/editUser?userName=&roleId=");
			$scope.popupdata.default = [
				data.userName,"",initRoleId
			];
			$scope.popupdata.datas = [{
				"name": "用户名称",
				"url": "<input style=\"display: block;width: 100%;\" disabled=\"disabled\" ng-model=\"data[3*$index]\" name=\"{{$index}}\" />"
			},{
				"name": "编辑角色",
				"blur": "selectEdit",
				"url": "<select name=\"{{$index}}\" tabindex=\"1\" style=\"display: block;width: 100%;\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\">" +
						"<option ng-model=\"data[3*$index]\" value=\"\">"+data.userRole+"</option>",
			} ];
			
			for (var i = 0; i < roles.length; i++) {
				if(data.userRole == roles[i].roleName){
					continue;
				}
				$scope.popupdata.datas[1].url += "<option value=" + roles[i].id + ">" + roles[i].roleName + "</option>";
			}
			$scope.popupdata.datas[1].url += "</select>";
		}
	};
	$scope.popupdata = popupService.init();
	$scope.get_data = function() {
		var url = "/user/user/getUsers";
		webService.get_data(url).then(function(data) {
				$scope.datas = data.data;
			},
			function(error) {
				responseService.errorResponse("读取用户失败");
			});
		var roleurl = "/user/role/getRole";
		webService.get_data(roleurl).then(function(data) {
			$scope.roleDatas = data.data;
		},
		function(error) {
			responseService.errorResponse("读取角色失败");
		});
	};
	
	
	$scope.get_data();
})