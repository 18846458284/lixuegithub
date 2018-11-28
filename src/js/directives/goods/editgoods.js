linker.directive('editgoods', function($filter, webService, responseService) {
	return {
		templateUrl: './templates/directives/editgoods.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			positioninfo: '=',
			goodsinit: '='
		},
		restrict: 'ACEM',
		link: function($scope) {
			var logoffwatch = new Object();
			$scope.init = function() {
				$scope.goods = new Object();
				angular.copy($scope.goodsinit, $scope.goods);
				if ($scope.goods.spec == 'ALL') {
					$scope.goods.spec = '*';
				}
				if ($scope.goods.bizType == 'flow') {
					if (!($scope.goods.spec % 1024)) {
						$scope.goods.spec = $scope.goods.spec / 1024 + 'G';
					} else {
						$scope.goods.spec = $scope.goods.spec + 'M';
					}
				}
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.provincelist = new Array();
				$scope.citylist = new Object();
				for (var i = 0; i < $scope.positioninfo.length; i++) {
					$scope.provincelist[i] = new Object();
					$scope.provincelist[i].text = $scope.positioninfo[i].provinceName;
					$scope.provincelist[i].checked = false;
					$scope.citylist[$scope.positioninfo[i].provinceName] = new Array();
					for (var j = 0; j < $scope.positioninfo[i].citys.length; j++) {
						if ($scope.positioninfo[i].citys[j] == "" || $scope.positioninfo[i].citys[j] == null) {
							$scope.citylist[$scope.positioninfo[i].provinceName] = "";
							break;
						}
						$scope.citylist[$scope.positioninfo[i].provinceName][j] = new Object();
						$scope.citylist[$scope.positioninfo[i].provinceName][j].text = $scope.positioninfo[i].citys[j];
						$scope.citylist[$scope.positioninfo[i].provinceName][j].checked = false;
					}
				}
				$scope.packageTypeDisabled = function() {
					return $scope.goods.bizType == "voice" ? true : false;
				};
				$scope.sourceProvincelist = $scope.provincelist;
				$scope.scopeCityList = new Array();
				if ($scope.goods.scopeProvince != "全国") {
					angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					var initscopeCity = $scope.goods.scopeCity.split(',');
					for (var i in $scope.scopeCityList) {
						if (initscopeCity.length == 0 || initscopeCity[0] == "") break;
						var index = -1;
						for (var j in initscopeCity) {
							if (initscopeCity[j] == $scope.scopeCityList[i].text) {
								index = j;
								break;
							}
						}
						if (index != -1) {
							$scope.scopeCityList[i].checked = true;
							initscopeCity.splice(index, 1);
						}
					}
				}
				$scope.sourceCityList = new Array();
				angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.sourceCityList);
				initWatch();
			};

			$scope.check = new Object();
			$scope.check.goodsName = function() {
				if (!$scope.goods.goodsName) {
					$scope.alert.goodsName = true;
					$scope.alertInfo.goodsName = "请填写名称";
				} else {
					var l = $scope.goods.goodsName.length;

					if (l > 64) {
						$scope.alert.goodsName = true;
						$scope.alertInfo.goodsName = "超出长度64位";
					} else {
						var filter = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
						if (filter.test($scope.goods.goodsName)) {
							$scope.alert.goodsName = false;
							$scope.alertInfo.goodsName = "";
						} else {
							$scope.alert.goodsName = true;
							$scope.alertInfo.goodsName = "仅可以输入汉字,字母和数字";
						}
					}
				}
			}
			$scope.check.bizType = function() {
				if (!$scope.goods.bizType) {
					$scope.alert.bizType = true;
					$scope.alertInfo.bizType = "请选择";
				} else {
					$scope.alert.bizType = false;
					$scope.alertInfo.bizType = "";
				}
				if (typeof($scope.goods.spec) != "undefined")
					$scope.check.spec();
			};
			$scope.check.spec = function() {
				if (!$scope.goods.spec) $scope.goods.spec = "";
				var check_data = $scope.goods.spec;
				if (check_data == "") {
					$scope.alert.spec = true;
					$scope.alertInfo.spec = "请填写规格";
					return;
				}
				if ($scope.goods.bizType != "voice") {
					var filterNum = /^[1-9]\d*$/;
					var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
					var changeUnit = /^[1-9]\d+[m|M]{1}$/;
					var changeUnitg = /^[1-9]\d+[g|G]{1}$/;
					if (changeUnit.test(check_data)) {
						check_data = check_data.substring(0, check_data.length - 1);
						if (check_data > 1048576) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-1024G，正确格式如10, 30M, 70m, 1G, 11g";
							return;
						}
					}
					if (filterNum.test(check_data)) {
						if (check_data > 1048576) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-1024G，正确格式如10, 30M, 70m, 1G, 11g";
							return;
						}
					}
					if (changeUnitg.test(check_data)) {
						check_data = check_data.substring(0, check_data.length - 1);
						if (check_data > 1024) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-1024G，正确格式如10, 30M, 70m, 1G, 11g";
							return;
						}
						check_data = check_data + 'G';
					}
					if (filterUnit.test(check_data) || filterNum.test(check_data)) {
						$scope.alert.spec = false;
						$scope.alertInfo.spec = "";
					} else {
						$scope.alert.spec = true;
						$scope.alertInfo.spec = "输入有错误。范围：1-1024G，正确格式如10, 30M, 70m, 1G, 11g";
					}
				} else {
					var filterNum = /^[1-9]\d*$/;
					if (check_data != '*') {
						if (filterNum.test(check_data)) {
							if (parseInt(check_data) > 0 && parseInt(check_data) <= 100000) {
								$scope.alert.spec = false;
								$scope.alertInfo.spec = "";
							} else {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "输入有错误。请输入1-10万之间的数字，单位不填,*号代表任意规格";
							}
						} else {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。请输入1-10万之间的数字，单位不填,*号代表任意规格";
						}
					} else {
						$scope.alert.spec = false;
					}
				}
			};
			$scope.check.packageType = function() {
				if (!$scope.goods.packageType) {
					$scope.alert.packageType = true;
					$scope.alertInfo.packageType = "请选择";
				} else {
					$scope.alert.packageType = false;
					$scope.alertInfo.packageType = "";
				}
			};
			$scope.check.mo = function() {
				if (!$scope.goods.mo) {
					$scope.alert.mo = true;
					$scope.alertInfo.mo = "请选择";
				} else {
					$scope.alert.mo = false;
					$scope.alertInfo.mo = "";
				}
			};

			$scope.check.officialPrice = function() {
				if ($scope.goods.bizType == "voice") {
					$scope.alert.officialPrice = false;
					$scope.alertInfo.officialPrice = "";
				} else {
					var filter = /^(([1-9]+\d*)|([1-9]+\d*\.\d{1,2})|(0\.\d?[1-9]{1,1}))$/;
					if (!$scope.goods.officialPrice) {
						$scope.alert.officialPrice = true;
						$scope.alertInfo.officialPrice = "请填写官方价";
					} else if (!filter.test($scope.goods.officialPrice)) {
						$scope.alert.officialPrice = true;
						$scope.alertInfo.officialPrice = "输入有错误。请输入1-1000之间的整数，至多保留两位小数";
					} else {
						if (eval($scope.goods.officialPrice) > 0 && eval($scope.goods.officialPrice) <= 1000) {
							$scope.alert.officialPrice = false;
							$scope.alertInfo.officialPrice = "";
						} else {
							$scope.alert.officialPrice = true;
							$scope.alertInfo.officialPrice = "输入有错误。请输入1-1000之间的整数，至多保留两位小数";
						}
					}
				}
			}

			$scope.check.appendCount = function() {
				var filter = /^([1-9]\d*)$/;
				if (!$scope.goods.appendCount && $scope.goods.appendCount != 0) {
					$scope.alert.appendCount = true;
					$scope.alertInfo.appendCount = "请填写叠加次数";
				} else if (!filter.test($scope.goods.appendCount) && parseInt($scope.goods.appendCount) != 0) {
					$scope.alert.appendCount = true;
					$scope.alertInfo.appendCount = "输入有错误。请输入0-999之间的整数";
				} else if (0 <= parseInt($scope.goods.appendCount) && parseInt($scope.goods.appendCount) <= 999) {
					$scope.alert.appendCount = false;
					$scope.alertInfo.appendCount = "";
				} else {
					$scope.alert.appendCount = true;
					$scope.alertInfo.appendCount = "输入有错误。请输入0-999之间的整数";
				}
			}
			$scope.send = function() {
				for (var i in $scope.check) {
					$scope.check[i]();
					if ($scope.alert[i] == true)
						return;
				}

				webService.get_data("/op/goods/editGoods?id=" + $scope.goods.id +
					"&goodsName=" + $scope.goods.goodsName +
					"&spec=" + $scope.goods.spec +
					"&mo=" + $scope.goods.mo +
					"&packageType=" + $scope.goods.packageType +
					"&sourceProvince=" + $scope.goods.sourceProvince +
					"&sourceCity=" + $scope.goods.sourceCity +
					"&scopeProvince=" + $scope.goods.scopeProvince +
					"&scopeCity=" + $scope.goods.scopeCity +
					"&officialPrice=" + $scope.goods.officialPrice * 100 +
					"&appendCount=" + $scope.goods.appendCount +
					"&bizType=" + $scope.goods.bizType).then(function(data) {
						$scope.back();
						$scope.refresh();
						layer.alert('操作成功', {
							icon: 1
						});
					},
					function(error) {
						responseService.errorResponse("操作失败。" + error);
					});
			};
			$scope.back = function() {
				for (var i in logoffwatch) {
					logoffwatch[i]();
				}
				$scope.control = false;
			};
			$scope.get_bizType = function(type) {
				if (type == "voice") {
					$scope.goods.officialPrice = "";
					return true;
				} else {
					return false;
				}
			}
			var initWatch = function() {
				//				logoffwatch.bizType=$scope.$watch('goods.bizType',function(nv,ov){
				//								$scope.goods.packageType="append";
				//							},true);
				logoffwatch.scopeProvince = $scope.$watch('goods.scopeProvince', function(nv, ov) {
					if (nv == ov) return;
					if ($scope.goods.scopeProvince != "全国" && $scope.goods.sourceProvince && $scope.goods.sourceCity == "ALL") {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					} else {
						if ($scope.goods.scopeProvince == "省内") {

							for (var i in $scope.citylist[$scope.goods.sourceProvince]) {
								if ($scope.citylist[$scope.goods.sourceProvince][i].text == $scope.goods.sourceCity) {
									$scope.scopeCityList = new Array();
									var temp = new Object();
									angular.copy($scope.citylist[$scope.goods.sourceProvince][i], temp);
									$scope.scopeCityList[0] = new Object();
									$scope.scopeCityList[0] = temp;
									$scope.scopeCityList[0].checked = true;
									break;
								}
							}
						} else
							$scope.scopeCityList = new Array();
					}
				});
				logoffwatch.scopeCityList = $scope.$watch('scopeCityList', function(nv, ov) {
					if (nv == ov) return;
					$scope.goods.scopeCity = "";
					angular.forEach(
						$filter('filter')(nv, {
							checked: true
						}),
						function(v) {
							if ($scope.goods.scopeCity == "")
								$scope.goods.scopeCity = v.text;
							else
								$scope.goods.scopeCity = $scope.goods.scopeCity + "," + v.text;
						}
					);
				}, true)
				logoffwatch.sourceProvince = $scope.$watch('goods.sourceProvince', function(nv, ov) {
					if (nv == ov) return;
					angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.sourceCityList);
					if ($scope.goods.scopeProvince != "全国" && $scope.goods.sourceProvince && $scope.goods.sourceCity == "ALL") {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					} else {
						if ($scope.goods.scopeProvince == "省内") {
							$scope.scopeCityList = new Array();
							for (var i in $scope.citylist[$scope.goods.sourceProvince]) {
								if ($scope.citylist[$scope.goods.sourceProvince][i].text == $scope.goods.sourceCity) {

									var temp = new Object();
									angular.copy($scope.citylist[$scope.goods.sourceProvince][i], temp);
									$scope.scopeCityList[0] = new Object();
									$scope.scopeCityList[0] = temp;
									$scope.scopeCityList[0].checked = true;
									break;
								}
							}
						} else
							$scope.scopeCityList = new Array();
					}
				}, true);
				logoffwatch.sourceCityList = $scope.$watch('sourceCityList', function(nv, ov) {
					if (nv == ov) return;
					$scope.goods.sourceCity = "";
				}, true);
				logoffwatch.sourceCity = $scope.$watch('goods.sourceCity', function(nv, ov) {
					if ($scope.goods.scopeProvince != "全国" && $scope.goods.sourceProvince && $scope.goods.sourceCity == "ALL") {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					} else {
						if ($scope.goods.scopeProvince == "省内") {
							for (var i in $scope.citylist[$scope.goods.sourceProvince]) {
								if ($scope.citylist[$scope.goods.sourceProvince][i].text == $scope.goods.sourceCity) {
									$scope.scopeCityList = new Array();
									var temp = new Object();
									angular.copy($scope.citylist[$scope.goods.sourceProvince][i], temp);
									$scope.scopeCityList[0] = new Object();
									$scope.scopeCityList[0] = temp;
									$scope.scopeCityList[0].checked = true;
									break;
								}
							}
						} else
							$scope.scopeCityList = new Array();
					}
				}, true);
			};
		},
	}
})