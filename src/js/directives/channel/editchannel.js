linker.directive('editchannel', function(check, webService, $compile, $filter, responseService) {
	return {
		templateUrl: './templates/directives/editchannel.html',
		scope: {
			"control": "=",
			refresh: '&refreshFn',
			"editcontroldata": "=",
		},
		restrict: 'ACEM',
		link: function($scope) {
			var logoffwatch = new Object();
			$scope.changepro = function() {
				for (var i in $scope.firstlist) {
					if ($scope.data[9].province[0] == $scope.firstlist[i].text) {
						$scope.firstlist[i].checked = true;
					} else {
						$scope.firstlist[i].checked = false;
					}
				}
			}
			$scope.init = function() {
				$scope.scopelist = [{
					text: "全国",
					checked: false
				}, {
					text: "省内",
					checked: false
				}]
				$scope.data = [];
				$scope.data[9] = new Object();
				$scope.data[10] = [false, false];
				$scope.molist = [{
					text: "中国移动",
					value: "CMCC",
					checked: false
				}, {
					text: "中国电信",
					value: "ChinaNet",
					checked: false
				}, {
					text: "中国联通",
					value: "ChinaUnicom",
					checked: false
				}];
				$scope.selectmo = "";
				$scope.firstlist = new Array();
				$scope.secondlist = new Object();
				webService.get_data("/op/province/getAllProvince").then(function(data) {
						for (var i = 0; i < data.data.length; i++) {
							$scope.firstlist[i] = new Object();
							$scope.firstlist[i].text = data.data[i].provinceName;
							$scope.firstlist[i].checked = false;
							$scope.secondlist[data.data[i].provinceName] = new Array();
							for (var j = 0; j < data.data[i].citys.length; j++) {
								if (data.data[i].citys[j] == "" || data.data[i].citys[j] == null) {
									$scope.secondlist[data.data[i].provinceName] = "";
									break;
								}
								$scope.secondlist[data.data[i].provinceName][j] = new Object();
								$scope.secondlist[data.data[i].provinceName][j].text = data.data[i].citys[j];
								$scope.secondlist[data.data[i].provinceName][j].checked = false;
							}
						}
						if ($scope.editcontroldata.province.indexOf(',') == -1) {
							var temp_pro = "";
							for (var i in $scope.firstlist) {
								if ($scope.firstlist[i].text == $scope.editcontroldata.province) {
									$scope.firstlist[i].checked = true;
									temp_pro = $scope.firstlist[i].text;
								}
							}
							$scope.secondshowlist = $scope.secondlist[temp_pro];
							for (var i in $scope.secondshowlist) {
								if ($scope.secondshowlist[i].text == $scope.editcontroldata.city) {
									$scope.secondshowlist[i].checked = true;
								}
							}


						} else {
							var temp_pro = $scope.editcontroldata.province;
							for (var i in $scope.firstlist) {
								if (temp_pro == "") break;
								if (temp_pro.indexOf($scope.firstlist[i].text) != -1) {
									$scope.firstlist[i].checked = true;
									temp_pro.replace($scope.firstlist[i].text, "");
								}
							}
						}
						$scope.chkall = new Object();
						$scope.chkall.checked = false;
						$scope.chkAll = function(checked) {
							angular.forEach($scope.firstlist, function(value, key) {
								value.checked = checked;
							});
						};
						logoffwatch.bizType = $scope.$watch('data[24]', function() {
							$scope.check('spec', "", [$scope.data[3 * 7], 7]);
						});
						logoffwatch.scopelist = $scope.$watch('scopelist', function(nv, ov) {
							if (nv == ov) {
								return;
							}
							if ($scope.scopelist[0].checked && $scope.scopelist[1].checked) {
								$scope.data[18] = "全国,省内";
							} else {
								$scope.data[19] = false;
								$scope.data[20] = "";
								if ($scope.scopelist[0].checked) {
									$scope.data[18] = "全国";
									return;
								};
								if ($scope.scopelist[1].checked) {
									$scope.data[18] = "省内";
									return;
								};
								$scope.data[18] = "";
								$scope.data[19] = true;
								$scope.data[20] = "请选择适用范围";
							}
						}, true);
						logoffwatch.firstlist = $scope.$watch('firstlist', function(nv, ov) {
							$scope.firstchoseArr = [];
							var simple_check = "";
							var count = 0;
							for (var i in ov) {
								if (nv[i].checked == true)
									count++;
							}
							if (count > 1) {
								angular.forEach(
									$filter('filter')(ov, {
										checked: true
									}),
									function(v) {
										simple_check = v.text;
									});
								angular.forEach(
									$filter('filter')(nv, {
										checked: true
									}),
									function(v) {
										if (simple_check == v.text) {
											v.checked = false;
										} else {
											$scope.firstchoseArr[0] = v.text;
										}

									});
							} else {
								angular.forEach(
									$filter('filter')(nv, {
										checked: true
									}),
									function(v) {
										$scope.firstchoseArr[0] = v.text;
									});
							}

							if ($scope.firstchoseArr.length == 0) {
								$scope.data[10][0] = true;
							} else {
								$scope.data[10][0] = false;
							}
							if ($scope.firstchoseArr.length == 1) {
								$scope.secondshowlist = $scope.secondlist[$scope.firstchoseArr];
							} else {
								angular.forEach(
									$scope.secondshowlist,
									function(v) {
										v.checked = false;
									});
								$scope.secondshowlist = "";
							}
							$scope.chkall.checked = $scope.firstchoseArr.length == $scope.firstlist.length;
							$scope.data[9].province = $scope.firstchoseArr;
							$scope.data[9].city = $scope.secondchoseArr;
						}, true);
						logoffwatch.secondshowlist = $scope.$watch('secondshowlist', function(nv, ov) {
							$scope.secondchoseArr = [];
							angular.forEach(
								$filter('filter')(nv, {
									checked: true
								}),
								function(v) {
									$scope.secondchoseArr.push(v.text);
								});
							if (!$scope.secondshowlist)
								$scope.data[10][1] = false;
							else {
								if ($scope.secondchoseArr.length == 0) {
									$scope.data[10][1] = true;
								} else {
									$scope.data[10][1] = false;
								}
							}
							$scope.data[9].province = $scope.firstchoseArr;
							$scope.data[9].city = $scope.secondchoseArr;
						}, true);
					},
					function(error) {
						responseService.errorResponse("读取代理商失败");
					});
				$scope.allchannel = [];
				logoffwatch.molist = $scope.$watch('molist', function(nv, ov) {
					var count = 0;
					for (var i in ov) {
						if (nv[i].checked == true)
							count++;
					}
					if (count > 1) {
						angular.forEach(
							$filter('filter')(ov, {
								checked: true
							}),
							function(v) {
								simple_check = v.text;
							});
						angular.forEach(
							$filter('filter')(nv, {
								checked: true
							}),
							function(v) {
								if (simple_check == v.text) {
									v.checked = false;
								}
							});
					}
					var temp = false;
					for (var i in $scope.molist) {
						temp = temp || $scope.molist[i].checked;
					}
					$scope.data[1] = !temp;
				}, true);
				logoffwatch.data = $scope.$watch('data[3]', function(nv, ov) {
					if (nv == ov) return;
					if ($scope.data[3]) $scope.data[4] = false;
				});
				logoffwatch.bizType = $scope.$watch('data[24]', function(nv, ov) {
					if (nv == ov) return;
					if (nv == "voice") {
						$scope.scopelist = [{
							text: "全国",
							checked: true
						}, {
							text: "省内",
							checked: false
						}];
					} else {
						$scope.scopelist = [{
							text: "全国",
							checked: false
						}, {
							text: "省内",
							checked: false
						}];
					}
				})
				webService.get_data("/op/channelResource/getChannelResource").then(function(data) {
						$scope.allchannel = data.data;
					},
					function(error) {
						responseService.errorResponse("读取代理商失败");
					});
				if ($scope.editcontroldata.mo.indexOf('CMCC') != -1) {
					$scope.selectmo = "中国移动";
				}
				if ($scope.editcontroldata.mo.indexOf('ChinaNet') != -1) {
					$scope.selectmo = "中国电信";
				}
				if ($scope.editcontroldata.mo.indexOf('ChinaUnicom') != -1) {
					$scope.selectmo = "中国联通";
				}
				$scope.data[3] = $scope.editcontroldata.channelName;
				$scope.data[6] = $scope.editcontroldata.cost;

				$scope.data[12] = $scope.editcontroldata.shardRate;
				$scope.data[15] = $scope.editcontroldata.state;
				$scope.data[16] = $scope.editcontroldata.needSms;
				if ($scope.editcontroldata.scope == "全国") {
					$scope.scopelist[0].checked = true;
				}
				if ($scope.editcontroldata.scope == "省内") {
					$scope.scopelist[1].checked = true;
				}
				if ($scope.editcontroldata.scope == "全国,省内") {
					$scope.scopelist[0].checked = true;
					$scope.scopelist[1].checked = true;
				}
				$scope.data[18] = $scope.editcontroldata.scope;
				$scope.data[21] = $scope.editcontroldata.spec;
				while ($scope.data[21].indexOf("元") != -1) {
					$scope.data[21] = $scope.data[21].replace("元", "");
				}
				$scope.data[24] = $scope.editcontroldata.bizType;
			}
			$scope.checkdata = function() {
				if (!$scope.data[3]) {
					$scope.data[4] = true;
					$scope.data[5] = "请填写名称";
				} else {
					var l = $scope.data[3].length;
					if (l > 64) {
						$scope.data[4] = true;
						$scope.data[5] = "超出长度64位";
					} else {
						var filter = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
						if (filter.test($scope.data[3])) {
							$scope.data[4] = false;
							$scope.data[5] = "";
						} else {
							$scope.data[4] = true;
							$scope.data[5] = "仅可以输入汉字,字母和数字";
						}
					}
				}
			}
			$scope.send = function() {
				$scope.data[0] = "";
				if ($scope.selectmo == "中国移动") {
					$scope.data[0] = "CMCC";
				}
				if ($scope.selectmo == "中国电信") {
					$scope.data[0] = "ChinaNet";
				}
				if ($scope.selectmo == "中国联通") {
					$scope.data[0] = "ChinaUnicom";
				}
				$scope.data[1] = false;
				$scope.checkdata();
				$scope.check('number_tenthousand', "", [$scope.data[3 * 2], 2]);
				$scope.check('proselect', "", [$scope.data[3 * 3], 3]);
				$scope.check('number_thousand', "", [$scope.data[3 * 4], 4])
				$scope.check('spec', "", [$scope.data[3 * 7], 7]);
				if (!$scope.data[24]) {
					$scope.data[25] = true;
				} else {
					$scope.data[25] = false;
				}
				if (!$scope.data[18]) {
					$scope.data[19] = true;
					$scope.data[20] = "请选择适用范围";
				} else {
					$scope.data[19] = false;
					$scope.data[20] = "";
				}
				if ($scope.data.indexOf(true) == -1 && $scope.data[10][0] == false) {
					webService.get_data("/op/channel/editChannel?channelId=" + $scope.editcontroldata.channelId +
						"&channelName=" + $scope.data[3] +
						"&mo=" + $scope.data[0] +
						"&resourceId=" + $scope.editcontroldata.resourceId +
						"&cost=" + $scope.data[6] +
						"&province=" + $scope.data[9].province +
						"&cityArray=" + $scope.data[9].city +
						"&shardRate=" + $scope.data[12] +
						"&state=" + $scope.data[15] +
						"&smsState=" + $scope.data[16] +
						"&scope=" + $scope.data[18] +
						"&spec=" + $scope.data[21] +
						"&bizType=" + $scope.data[24]).then(function(data) {
							$scope.back();
							$scope.refresh();
							layer.alert('操作成功', {
								icon: 1
							});
						},
						function(error) {
							responseService.errorResponse(error);
						});
				}

			}
			$scope.back = function() {
				$scope.control = false;
				for (var i in logoffwatch) {
					logoffwatch[i]();
				}
			}

			$scope.check = function(type, event, data) {
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
					position = data[1] * 3;
				}
				selecttype[type](target, position);
			};
			var selecttype = new Object();
			selecttype.spec = function(target, position) {
				if (check.not_null(target.value)) {
					var check_data = $scope.data[21].split(',');
					if ($scope.data[24] != "voice") {
						var filterNum = /^[1-9]\d*$/;
						var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
						var hash = {};
						var changeUnit = /^[1-9]\d+[m|M]{1}$/;
						var changeUnitg = /^[1-9]\d+[g|G]{1}$/;
						for (var i in check_data) {
							if (changeUnit.test(check_data[i])) {
								check_data[i] = check_data[i].substring(0, check_data[i].length - 1);
								if (check_data[i] > 1048576) {
									$scope.data[position + 1] = true;
									$scope.data[position + 2] = "范围：1-1024G";
									return;
								}
							}
							if (filterNum.test(check_data[i])) {
								if (check_data[i] > 1048576) {
									$scope.data[position + 1] = true;
									$scope.data[position + 2] = "范围：1-1024G";
									return;
								}
							}
							if (changeUnitg.test(check_data[i])) {
								check_data[i] = check_data[i].substring(0, check_data[i].length - 1);
								if (check_data[i] > 1024) {
									$scope.data[position + 1] = true;
									$scope.data[position + 2] = "范围：1-1024G";
									return;
								}
								check_data[i] = check_data[i] + 'G';
							}
							if (hash[check_data[i]]) {
								$scope.data[position + 1] = true;
								$scope.data[position + 2] = "有重复项";
								return;
							}
							hash[check_data[i]] = true;
						}
						for (var i in check_data) {
							if (parseInt(i) == check_data.length - 1 && !check_data[i]) {
								$scope.data[position + 1] = false;
								$scope.data[position + 2] = "";
								break;
							}
							if (!check_data[i]) {
								$scope.data[position + 1] = true;
								$scope.data[position + 2] = "请按照正确格式输入，如10, 30M, 70m, 1G, 11g都是合法输入。";
								break;
							} else if (filterUnit.test(check_data[i]) || filterNum.test(check_data[i])) {
								$scope.data[position + 1] = false;
								$scope.data[position + 2] = "";
							} else {
								$scope.data[position + 1] = true;
								$scope.data[position + 2] = "请按照正确格式输入，如10, 30M, 70m, 1G, 11g都是合法输入。";
								break;
							}
						}
					} else {
						var filterNum = /^[1-9]\d*$/;
						var hash = {};
						for (var i in check_data) {
							if (hash[check_data[i]]) {
								$scope.data[position + 1] = true;
								$scope.data[position + 2] = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格。";
								return;
							}
							hash[check_data[i]] = true;
						}
						for (var i in check_data) {
							if (parseInt(i) == check_data.length - 1 && !check_data[i]) {
								$scope.data[position + 1] = false;
								$scope.data[position + 2] = "";
								break;
							}
							if (!check_data[i]) {
								$scope.data[position + 1] = true;
								$scope.data[position + 2] = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格。";
								break;
							} else if (filterNum.test(check_data[i]) || check_data[i] == "*") {
								if (check_data[i] != '*') {
									if (parseInt(check_data[i]) > 0 && parseInt(check_data[i]) <= 100000) {
										$scope.data[position + 1] = false;
										$scope.data[position + 2] = "";
									} else {
										$scope.data[position + 1] = true;
										$scope.data[position + 2] = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格。";
									}
								} else {
									$scope.data[position + 1] = false;
									$scope.data[position + 2] = "";
								}
							} else {
								$scope.data[position + 1] = true;
								$scope.data[position + 2] = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格。";
								break;
							}
						}
					}
				} else {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "不能为空";
					return;
				}
			}
			selecttype.empty = function(target, position) {
				if (check.not_null(target.value)) $scope.data[position + 1] = false;
				else $scope.data[position + 1] = true;
				$scope.data[position + 2] = "不能为空";
				return;
			};
			selecttype.proselect = function(target, position) {
				var province = target.value["province"];
				if (!province) province = "";
				var city = target.value["city"];
				$scope.data[position + 1] = [true, true];
				if (province.length != 0) {
					$scope.data[position + 1][0] = false;
					if (province.length == 1 && city.length == 0) {
						if (province[0] == "北京市" || province[0] == "天津市" || province[0] == "重庆市" || province[0] == "上海市")
							$scope.data[position + 1][1] = false;
					} else $scope.data[position + 1][1] = false;
				} else {
					$scope.data[position + 1][1] = false;
				}
				return;
			}
			selecttype.number_tenthousand = function(target, position) {
				if (!check.not_null(target.value)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "不能为空";
					return;
				}
				if (check.nan(target.value)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "必须是1-10000的整数";
					return
				}
				if (!check.integer(target.value)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "必须是1-10000的整数";
					return
				}
				if (!check.compare_size(target.value, 10000)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "必须是1-10000的整数";
				} else $scope.data[position + 1] = false;
				return;
			}
			selecttype.number_thousand = function(target, position) {
				if (!check.not_null(target.value)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "不能为空";
					return;
				}
				if (check.nan(target.value)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "必须是1-999的整数";
					return
				}
				if (!check.integer(target.value)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "必须是1-999的整数";
					return
				}
				if (!check.compare_size(target.value, 999)) {
					$scope.data[position + 1] = true;
					$scope.data[position + 2] = "必须是1-999的整数";
				} else $scope.data[position + 1] = false;
				return;
			}
		},
	}
})