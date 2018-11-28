linker.controller('AgentController', function($scope, $location, $http, responseService, webService, popupService) {
	$scope.select = function(type, data) {
		if (type == "add") {
			$scope.control = false;
			$scope.popupdata = popupService.set("新增账号", true, "/user/agent/setUser?appId=&userName=&passwd=");
			$scope.popupdata.default = [
				data.appId, "", "", ""
			];
			$scope.popupdata.datas = [{
				"name": "代理商ID",
				"blur": "num",
				"url":"<input style=\"display: block;width: 100%;\" disabled=\"disabled\" ng-model=\"data[3*$index]\" name=\"{{$index}}\" />"
			}, {
				"name": "登陆邮箱",
				"blur": "email",
			}, {
				"name": "登陆密码",
				"url": "<input type=\"password\" name=\"{{$index}}\" style=\"display: block;width: 100%; \" ng-blur=\"check(item.blur,$event) \" ng-model=\"data[3*$index] \">",
				"blur": "passwd",
			}, {
				"name": "确认密码",
				"url": "<input type=\"password\" name=\"{{$index}}\" style=\"display: block;width: 100%; \" ng-blur=\"check(item.blur,$event) \" ng-model=\"data[3*$index] \">",
				"blur": "passwdcheck",
			}];
		} else if (type == "delete") {
			if (!data.users) responseService.errorResponse("没有账户可删除");
			else {
				$scope.popupdata = popupService.set("删除账号", true);
				$scope.control = false;
				$scope.popupdata.datas = [{
					"name": "删除账号",
					"blur": "select",
					"url": "<select name=\"{{$index}}\" tabindex=\"1\" style=\"display: block;width: 100%;\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\">" +
						"<option value=\"\">请选择</option>",
				}];
				var users = data.users.split(',') || data.users;
				if (users.length == 1){
					$scope.popupdata.datas[0].url="<input style=\"display: block;width: 100%;\" disabled=\"disabled\" ng-model=\"data[3*$index]\" name=\"{{$index}}\" />";
				$scope.popupdata.default = [users];
				}
				else {
					for (var i = 0; i < users.length; i++) {
						$scope.popupdata.datas[0].url += "<option value=" + users[i] + ">" + users[i] + "</option>";
					}
					$scope.popupdata.datas[0].url += "</select>";
				}
				$scope.url = "/user/agent/delUser?appId=" + data.appId + "&userName=";
				$scope.send = function(data) {
					var url = $scope.url + data[0];
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
			}
		} else if (type == "addAgent") {
			$scope.popupdata = popupService.set("添加代理商", true, "/op/agent/newAgent?appId=&agentName=&publicKey=&cmcc=&chinanet=&chinaUnicom=&maeAppId=&maePromotionId=&maeVoicePromotionId=&maePlatformKey=&maePasswd=&credit=");
			$scope.popupdata.default = [
				"", "", "", "", "", "", "", "", "", "",""
			];

			$scope.popupdata.datas = [{
				"name": "代理商ID",
				"blur": "nan",
			}, {
				"name": "代理商名称",
				"blur": "agentName",
			}, {
				"name": "公钥",
				"blur": "empty",
				"url": "<textarea  name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \" />"
			}, {
				"name": "移动折扣率(万分比)",
				"blur": "ten_thousand",
			}, {
				"name": "电信折扣率(万分比)",
				"blur": "ten_thousand",
			}, {
				"name": "联通折扣率(万分比)",
				"blur": "ten_thousand",
			}, {
				"name": "maeAppId",
				"blur": "empty",
				"url": "<input maxlength=32 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\"  style=\"display: block;width: 100%; \"/>"
			}, {
				"name": "maePromotionId",
				"blur": "integer",
				"url": "<input maxlength=8 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \" />"
			},{
				"name": "maeVoicePromotionId",
				"blur": "integer",
				"url": "<input maxlength=8 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \" />"
			},{
				"name": "maePlatformKey",
				"blur": "empty",
				"url": "<textarea name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \" />"
			}, {
				"name": "maePasswd",
				"blur": "empty",
				"url": "<input  name=\"{{$index}}\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\" style=\"display: block;width: 100%; \" />"
			},{
				"name": "信用额度(元)",
				"blur": "checkcredit",
				"url": "<input  name=\"{{$index}}\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\" style=\"display: block;width: 100%; \" />"
			}]
		} else if (type == "editAgent") {
			$scope.popupdata = popupService.set("修改代理商", true, "/op/agent/updateAgent?appId=&agentName=&publicKey=&cmcc=&chinanet=&chinaUnicom=&maeAppId=&maePromotionId=&maeVoicePromotionId=&maePlatformKey=&maePasswd=&credit=");
			$scope.popupdata.default = [
				data.appId, data.agentName, data.publicKey, data.cmcc, data.chinanet, data.chinaunicom, data.maeAppId, data.maePromotionId,data.maeVoicePromotionId, data.maePlatformKey, data.maePasswd, data.credit
			];
			$scope.popupdata.datas = [{
				"name": "代理商ID",
				"url": "<input style=\"display: block;width: 100%;\" disabled=\"disabled\" ng-model=\"data[3*$index]\" name=\"{{$index}}\" />"
			}, {
				"name": "代理商名称",
				"blur": "agentName",
			}, {
				"name": "公钥",
				"blur": "empty",
				"url": "<textarea name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \"/>"
			}, {
				"name": "移动折扣率(万分比)",
				"blur": "ten_thousand",
			}, {
				"name": "电信折扣率(万分比)",
				"blur": "ten_thousand",
			}, {
				"name": "联通折扣率(万分比)",
				"blur": "ten_thousand",
			}, {
				"name": "maeAppId",
				"blur": "nan",
				"url": "<input maxlength=32 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \" />"
			}, {
				"name": "maePromotionId",
				"blur": "integer",
				"url": "<input maxlength=8 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \"/>"
			}, {
				"name": "maeVoicePromotionId",
				"blur": "integer",
				"url": "<input maxlength=8 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \"/>"
			},{
				"name": "maePlatformKey",
				"blur": "empty",
				"url": "<textarea maxlength=128 name=\"{{$index}}\" ng-model=\"data[3*$index]\" ng-blur=\"check(item.blur,$event)\" style=\"display: block;width: 100%; \"/>"
			}, {
				"name": "maePasswd",
				"blur": "empty",
				"url": "<input maxlength=128  name=\"{{$index}}\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\" style=\"display: block;width: 100%; \"/>"
			},{
				"name": "信用额度(元)",
				"blur": "checkcredit",
				"url": "<input maxlength=128  name=\"{{$index}}\" ng-blur=\"check(item.blur,$event)\" ng-model=\"data[3*$index]\" style=\"display: block;width: 100%; \"/>"
			}]
		}
	};
	$scope.designatedChannel=function(appId,name){
		sessionStorage.enterNameshow = name;
		$scope.currentUser.enterNameshow = name;
		sessionStorage.appId = appId;
		$location.path("/admin/agent/designatedchannel/"+appId+"///////");
	}
	$scope.jump = function(appId, location, name) {
		sessionStorage.enterNameshow = name;
		$scope.currentUser.enterNameshow = name;
		sessionStorage.appId = appId;
		$location.path("/admin/agent/" + location+'/////');
	}
	$scope.popupdata = popupService.init();
	$scope.get_data = function() {
		var url = "/op/agent/getAgents";
		webService.get_data(url).then(function(data) {
				$scope.datas = data.data;
			},
			function(error) {
				responseService.errorResponse("读取代理商失败");
			});
	};
	$scope.get_data();
})