linker.directive('addgoods', function($filter, $location, webService, responseService) {
	return {
		templateUrl: './templates/directives/addgoods.html',
		scope: {
			control: "=",
			refresh: '&refreshFn',
			positioninfo: '=',
		},
		restrict: 'ACEM',
		link: function($scope) {
			$scope.chkAll = function(checked) {
				angular.forEach($scope.sourceProvincelist, function(value, key) {
					value.checked = checked;
				});
			};
			var logoffwatch = new Object();
			$scope.goods = new Object();
			$scope.init = function() {
				$scope.chkall = new Object();
				$scope.chkall.checked = false;
				$scope.alert = new Object();
				$scope.alertInfo = new Object();
				$scope.goods = new Object();
				$scope.goods.scopeCity = "";
				$scope.goods.sourceCity = "";
				$scope.provincelist = new Array();
				$scope.goods.bizType = $scope.$parent.bizType;
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
				$scope.sourceProvincelist = $scope.provincelist;
				$scope.scopeCityList = new Array();
				$scope.sourceCityList = new Array();
				initWatch();
			};
			$scope.packageTypeDisabled = function() {
				return $scope.goods.bizType == "voice" ? true : false;
			};
			$scope.check = new Object();
			$scope.check.bizType = function() {
				if (!$scope.goods.bizType) {
					$scope.alert.bizType = true;
					$scope.alertInfo.bizType = "请选择";
				} else {
					$scope.alert.bizType = false;
					$scope.alertInfo.bizType = "";
				}
				if (typeof($scope.goods.spec) != "undefined") {
					$scope.check.spec();
				}
			};
			$scope.check.spec = function() {
				if (!$scope.goods.spec) $scope.goods.spec = "";
				var check_data = $scope.goods.spec.split(',');
				if (check_data == "") {
					$scope.alert.spec = true;
					$scope.alertInfo.spec = "请填写规格";
					return;
				}
				if ($scope.goods.bizType != "voice") {
					var filterNum = /^[1-9]\d*$/;
					var filterUnit = /^[1-9][0-9]*[m|M|g|G]{1}$/;
					var hash = {};
					var changeUnit = /^[1-9]\d+[m|M]{1}$/;
					var changeUnitg = /^[1-9]\d+[g|G]{1}$/;
					for (var i in check_data) {
						if (changeUnit.test(check_data[i])) {
							check_data[i] = check_data[i].substring(0, check_data[i].length - 1);
							if (check_data[i] > 1048576) {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "输入有错误。范围：1-1024G，以逗号分隔，正确格式如10, 30M, 70m, 1G, 11g";
								return;
							}
						}
						if (filterNum.test(check_data[i])) {
							if (check_data[i] > 1048576) {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "输入有错误。范围：1-1024G，以逗号分隔，正确格式如10, 30M, 70m, 1G, 11g";
								return;
							}
						}
						if (changeUnitg.test(check_data[i])) {
							check_data[i] = check_data[i].substring(0, check_data[i].length - 1);
							if (check_data[i] > 1024) {
								$scope.alert.spec = true;
								$scope.alertInfo.spec = "输入有错误。范围：1-1024G，以逗号分隔，正确格式如10, 30M, 70m, 1G, 11g";
								return;
							}
							check_data[i] = check_data[i] + 'G';
						}
						if (hash[check_data[i]]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "有重复项";
							return;
						}
						hash[check_data[i]] = true;
					}
					for (var i in check_data) {
						if (parseInt(i) == check_data.length - 1 && !check_data[i]) {
							$scope.alert.spec = false;
							$scope.alertInfo.spec = "";
							break;
						}
						if (!check_data[i]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-1024G，以逗号分隔，正确格式如10, 30M, 70m, 1G, 11g";
							break;
						} else if (filterUnit.test(check_data[i]) || filterNum.test(check_data[i])) {
							$scope.alert.spec = false;
							$scope.alertInfo.spec = "";
						} else {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-1024G，以逗号分隔，正确格式如10, 30M, 70m, 1G, 11g";
							break;
						}
					}
				} else {
					var filterNum = /^[1-9]\d*$/;
					var filterString = /^[*]$/;
					var hash = {};
					for (var i in check_data) {
						if (hash[check_data[i]]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "有重复项";
							return;
						}
						hash[check_data[i]] = true;
					}
					for (var i in check_data) {
						if (parseInt(i) == check_data.length - 1 && !check_data[i]) {
							$scope.alert.spec = false;
							$scope.alertInfo.spec = "";
							break;
						}
						if (!check_data[i]) {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-10万，以逗号分隔，单位不填,*号表示任意规格";
							break;
						} else if (filterNum.test(check_data[i]) || filterString.test(check_data[i])) {
							if (check_data[i] != '*') {
								if (parseInt(check_data[i]) > 0 && parseInt(check_data[i]) <= 100000) {
									$scope.alert.spec = false;
									$scope.alertInfo.spec = "";
								} else {
									$scope.alert.spec = true;
									$scope.alertInfo.spec = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格";
								}
							} else {
								$scope.alert.spec = false;
							}
						} else {
							$scope.alert.spec = true;
							$scope.alertInfo.spec = "输入有错误。范围：1-10万，以逗号分隔，单位不填，*号表示任意规格";
							break;
						}
					}
				}

			};

			$scope.check.packageType = function() {
				if ($scope.goods.bizType == "flow") {
					if (!$scope.goods.packageType) {
						$scope.alert.packageType = true;
						$scope.alertInfo.packageType = "请选择";
					} else {
						$scope.alert.packageType = false;
						$scope.alertInfo.packageType = "";
					}
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
			$scope.check.sourceProvince = function() {
				if (!$scope.goods.sourceProvince) {
					$scope.alert.sourceProvince = true;
					$scope.alertInfo.sourceProvince = "请选择归属地省份";
				} else {
					$scope.alert.sourceProvince = false;
					$scope.alertInfo.sourceProvince = "";
				}
			}

			$scope.check.officialPrice = function() {
				if ($scope.goods.bizType == "voice") {
					$scope.alert.officialPrice = false;
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
				if (!$scope.goods.appendCount) {
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
				webService.get_data("/op/goods/addGoods?spec=" + $scope.goods.spec +
					"&mo=" + $scope.goods.mo +
					"&packageType=" + $scope.goods.packageType +
					"&sourceProvince=" + $scope.goods.sourceProvince +
					"&sourceCity=" + $scope.goods.sourceCity +
					"&scopeProvince=" + $scope.goods.scopeProvince +
					"&scopeCity=" + $scope.goods.scopeCity +
					"&officialPrice=" + Math.round($scope.goods.officialPrice * 100) +
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
			$scope.get_bizType = function(bizType) {
				if (bizType == "voice") {
					$scope.goods.officialPrice = "";
					return true;
				} else {
					return false;
				}
			};
			var initWatch = function() {
				logoffwatch.bizType = $scope.$watch('goods.bizType', function(nv, ov) {
					if (nv == ov) return;
					if ($scope.goods.bizType) {
						$scope.goods.packageType = "append";
					}
				}, true)
				logoffwatch.scopeProvince = $scope.$watch('goods.scopeProvince', function(nv, ov) {
					if (nv == ov) return;
					if ($scope.goods.scopeProvince == "" && $scope.goods.sourceProvince && !$scope.goods.sourceCity) {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					} else {
						if ($scope.goods.sourceCity.indexOf(',') == -1 && $scope.goods.scopeProvince == "") {
							for (var i in $scope.citylist[$scope.goods.sourceProvince]) {
								if ($scope.citylist[$scope.goods.sourceProvince][i].text == $scope.goods.sourceCity) {
									$scope.scopeCityList = new Array();
									var temp = new Object();
									angular.copy($scope.citylist[$scope.goods.sourceProvince][i], temp);
									$scope.scopeCityList[0] = new Object();
									$scope.scopeCityList[0] = temp;
									break;
								}
							}
						} else
							$scope.scopeCityList = new Array();
					}
					//					var sourceProvince = $scope.goods.sourceProvince;
					//					if (nv && nv == sourceProvince) {
					//						angular.copy($scope.citylist[$scope.goods.scopeProvince], $scope.scopeCityList);
					//					} else {
					//						$scope.scopeCityList = new Array();
					//					}
				});
				logoffwatch.scopeCityList = $scope.$watch('scopeCityList', function(nv, ov) {
					if (nv == ov) return;
					$scope.goods.scopeCity = "";
					angular.forEach(
						$filter('filter')(nv, {
							checked: true
						}), function(v) {
							if ($scope.goods.scopeCity == "")
								$scope.goods.scopeCity = v.text;
							else
								$scope.goods.scopeCity = $scope.goods.scopeCity + "," + v.text;
						}
					);
				}, true)
				logoffwatch.sourceProvincelist = $scope.$watch('sourceProvincelist', function(nv, ov) {
					if (nv == ov) {
						return;
					}
					$scope.goods.sourceProvince = "";
					angular.forEach(
						$filter('filter')(nv, {
							checked: true
						}), function(v) {
							if ($scope.goods.sourceProvince == "")
								$scope.goods.sourceProvince = v.text;
							else $scope.goods.sourceProvince = $scope.goods.sourceProvince + ',' + v.text;
						});
					$scope.check.sourceProvince();
					var chosenlength = $scope.goods.sourceProvince.split(',').length;
					if (chosenlength == 1) {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.sourceCityList);
					} else $scope.sourceCityList = new Array();
					$scope.chkall.checked = chosenlength == $scope.sourceProvincelist.length;
					if ($scope.goods.scopeProvince == "" && $scope.goods.sourceProvince && !$scope.goods.sourceCity) {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					} else {
						if ($scope.goods.sourceCity.indexOf(',') == -1 && $scope.goods.scopeProvince == "") {
							for (var i in $scope.citylist[$scope.goods.sourceProvince]) {
								if ($scope.citylist[$scope.goods.sourceProvince][i].text == $scope.goods.sourceCity) {
									$scope.scopeCityList = new Array();
									var temp = new Object();
									angular.copy($scope.citylist[$scope.goods.sourceProvince][i], temp);
									$scope.scopeCityList[0] = new Object();
									$scope.scopeCityList[0] = temp;
									break;
								}
							}
						} else
							$scope.scopeCityList = new Array();
					}
					//					var scopeProvince = $scope.goods.scopeProvince;
					//					var sourceProvince = $scope.goods.sourceProvince;
					//					if (sourceProvince && sourceProvince == scopeProvince) {
					//						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					//					} else {
					//						$scope.scopeCityList = new Array();
					//					}
				}, true);
				logoffwatch.sourceCityList = $scope.$watch('sourceCityList', function(nv, ov) {
					if (nv == ov) {
						return;
					}
					$scope.goods.sourceCity = "";
					angular.forEach(
						$filter('filter')(nv, {
							checked: true
						}), function(v) {
							if ($scope.goods.sourceCity == "")
								$scope.goods.sourceCity = v.text;
							else $scope.goods.sourceCity = $scope.goods.sourceCity + ',' + v.text;

						});
					if ($scope.goods.scopeProvince == "" && $scope.goods.sourceProvince && !$scope.goods.sourceCity) {
						angular.copy($scope.citylist[$scope.goods.sourceProvince], $scope.scopeCityList);
					} else {
						if ($scope.goods.sourceCity.indexOf(',') == -1 && $scope.goods.scopeProvince == "") {
							for (var i in $scope.citylist[$scope.goods.sourceProvince]) {
								if ($scope.citylist[$scope.goods.sourceProvince][i].text == $scope.goods.sourceCity) {
									$scope.scopeCityList = new Array();
									var temp = new Object();
									angular.copy($scope.citylist[$scope.goods.sourceProvince][i], temp);
									$scope.scopeCityList[0] = new Object();
									$scope.scopeCityList[0] = temp;
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