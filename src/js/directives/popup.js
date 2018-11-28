linker.directive('popup', function(check, webService, $compile, responseService) {
	return {
		templateUrl: './templates/directives/popup.html',
		scope: {
			control: '=',
			refresh: '&refreshFn',
			sendfn: '&sendFn',
		},
		restrict: 'ACEM',
		link: function(scope) {
			scope.init = function(index) {
				if (index != 0) return;
				if (scope.control.default) {
					for (var i = 0; i < scope.control.default.length; i++) {
						scope.data[3 * i] = scope.control.default[i];
					}
				}
			}
			scope.back = function() {
				scope.data = [];
				scope.control.show = !scope.control.show;
			}
			scope.data = [];
			scope.send = function() {
				if (!scope.control.datas) {
					scope.control.datas = new Object();
				}
				for (var i = 0; i < scope.control.datas.length; i++) {
					scope.check(scope.control.datas[i].blur, "", [scope.data[3 * i], i]);
				}
				if (scope.data.indexOf(true) == -1) {
					if (!scope.control.url) {
						scope.sendfn({
							data: scope.data
						});
					} else {
						var url = "";
						if (!scope.control.datas.length) url = scope.control.url;
						else {
							var temp = scope.control.url.split('=');
							for (var i = 0; i < temp.length - 1; i++) {
								if (scope.control.datas[i].blur != "passwd")
									url = url + temp[i] + "=" + encodeURIComponent(scope.data[i * 3]);
								else {
									var hash = md5(scope.data[i * 3]);
									url = url + temp[i] + "=" + hash;
									if (i + 1 < temp.length - 1 && scope.control.datas[i + 1].blur == "passwdcheck")
										i++;
								}
							}
						}
						webService.get_data(url).then(function(data) {
								scope.back();
								scope.refresh();
								layer.alert('操作成功', {
									icon: 1
								});
							},
							function(error) {
								responseService.errorResponse("操作失败。" + error);
							});
					}
				}
			};
			scope.check = function(type, event, data) {
				var target = new Object(),
					position;
				if (event) {
					target = event.currentTarget;
					position = parseInt(target.name) * 3;
				} else {
					if (data[0]) target.value = data[0];
					else {
						target.value = null;
					}
					if (data[0] == '0' && type == 'checkcredit') target.value = data[0];
					position = data[1] * 3;
				}

				switch (type) {
					case "integer":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.nan(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不是数字格式";
							break;
						}
						if (!check.integer(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不是正整数";
							break;
						} else {
							scope.data[position + 1] = false;
						}
						break;
					case "ten_thousand":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.nan(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不是数字格式";
							break;
						}
						if (!check.integer(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不是整数";
							break;
						}
						if (!check.ten_thousand(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "必须是1-10000的整数";
						} else scope.data[position + 1] = false;
						break;
					case "checkcredit":
						if (target.value == '0') {
							scope.data[position + 1] = false;
							break;
						}
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.nan(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "必须是0-999999的整数";
							break;
						}
						if (!check.integer(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "必须是0-999999的整数";
							break;
						}
						if (!check.credit_check(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "必须是0-999999的整数";
						} else scope.data[position + 1] = false;
						break;
					case "nan":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.nan(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不是数字格式";
							break;
						} else {
							scope.data[position + 1] = false;
						}
						break;
					case "agentName":
						var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
						if (!filter.test(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "请输入汉字,数字或者字母";
							break;
						} else {
							scope.data[position + 1] = false;
						}
						break;
					case "email":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.email(target.value))
							scope.data[position + 1] = false;
						else {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "邮箱格式为xx@xx.xx";
						}
						break;
					case "empty":
						if (check.not_null(target.value)) scope.data[position + 1] = false;
						else scope.data[position + 1] = true;
						scope.data[position + 2] = "不能为空";
						break;
					case "proselect":
						var province = target.value["province"];
						if (!province) province = "";
						var city = target.value["city"];
						scope.data[position + 1] = [true, true];
						if (province.length != 0) {
							scope.data[position + 1][0] = false;
							if (province.length == 1 && city.length == 0) {
								if (province[0] == "北京" || province[0] == "天津" || province[0] == "重庆" || province[0] == "上海")
									scope.data[position + 1][1] = false;
							} else scope.data[position + 1][1] = false;
						} else {
							scope.data[position + 1][1] = false;
						}
						break;
					case "select":
						if (check.not_null(target.value)) scope.data[position + 1] = false;
						else scope.data[position + 1] = true;
						scope.data[position + 2] = "请选择";
						break;
					case "selectEdit":
						if (check.not_null(target.value)) scope.data[position + 1] = false;
						else scope.data[position + 1] = true;
						scope.data[position + 2] = "未做修改";
						break;
					case "port":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.port(target.value))
							scope.data[position + 1] = false;
						else {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "端口号的范围从0到65535";
						}
						break;
					case "ip":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.ip(target.value))
							scope.data[position + 1] = false;
						else {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "ip格式为xx.xx.xx.xx";
						}
						break;
					case "num":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.num(target.value))
							scope.data[position + 1] = false;
						else {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "请全部填写数字";
						}
						break;
					case "passwd":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (check.passwd(target.value))
							scope.data[position + 1] = false;
						else {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "密码格式错误,6-20位数字+字母";
						}
						break;
					case "passwdcheck":
						if (!check.not_null(target.value)) {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "不能为空";
							break;
						}
						if (target.value == scope.data[position - 3])
							scope.data[position + 1] = false;
						else {
							scope.data[position + 1] = true;
							scope.data[position + 2] = "密码不相等";
						}
						break;

				}
			};
		},
	}
})