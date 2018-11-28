linker.directive("pagination", function() {
	return {
		templateUrl: './templates/directives/pagination.html',
		replace: true,
		restrict: 'AECM',
		scope: {
			present: '=',
			length: '=',
			total:'=',
			pageSize:'=',
		},
		link: function(scope) {
			//侦听present，反向计算组成present的相对位置和绝对位置
			scope.$watch('present', function(newValue, oldValue, scope) {
				if (scope.present < 5 || scope.present > scope.length - 5) {
					if (scope.present < 5) {
						scope.middle = 5;
						var po = scope.choose.indexOf(true);
						scope.choose[po] = false;
						scope.choose[scope.present-1]=true;
					} else {
						if(scope.length>10){
						scope.middle = scope.length-5;
						var po = scope.choose.indexOf(true);
						scope.choose[po] = false;
						scope.choose[scope.present-(scope.length-5)+4]=true;
						}else{
							var po = scope.choose.indexOf(true);
							scope.choose[po] = false;
							scope.choose[scope.present-1]=true;
						}
						
					}
				} else {
					scope.middle = scope.present;
					var po = scope.choose.indexOf(true);
					scope.choose[po] = false;
					scope.choose[4] = true;
				}

			});
			scope.present = 1;
			scope.button_num = 10;
			scope.length = 0;
			scope.middle = 5;
			scope.choose = new Array(scope.button_num);
			for (var i = 1; i < scope.button_num; i++)
				scope.choose[i] = false;
			scope.choose[0] = true;
			//页面跳转判断
			scope.setpageSize=function(){
				var filter=/^[1-9]\d*$/;
				if(filter.test(scope.inputpageSize)){
					scope.pageSize=scope.inputpageSize;
					scope.inputpageSize="";
				}else{
					layer.alert('请输入正整数，不能小于1',{
						icon:0
					});
				}
			}
			scope.jump = function(type) {
				var po = scope.choose.indexOf(true);
				switch (type) {
					case "first":
						if (scope.present != 1) {
							scope.choose[po] = false;
							scope.choose[0] = true;
							scope.middle = 5;
						} else return;
						break;
					case "before":
						if (scope.present != 1) {
							if (scope.middle > 5) {
								if (po > 4 && scope.middle == (scope.length - 5)) {
									scope.choose[po] = false;
									scope.choose[po - 1] = true;
								} else
									scope.middle--;
							} else {
								if (po != 0) {
									scope.choose[po] = false;
									scope.choose[po - 1] = true;
								}
							}
						} else return;
						break;
					case "next":
						if (scope.present != scope.length) {
							if (scope.length >= 10) {
								if (scope.middle < (scope.length - 5)) {
									if (po < 4 && scope.middle == 5) {
										scope.choose[po] = false;
										scope.choose[po + 1] = true;
									} else
										scope.middle++;
								} else {
									if (po + 1 < scope.button_num) {
										scope.choose[po] = false;
										scope.choose[po + 1] = true;
									}
								}
							} else {
								if (po != scope.length - 1) {
									scope.choose[po] = false;
									scope.choose[po + 1] = true;
								} else return;
							}
						} else return;
						break;
					case "end":
						if (scope.present != scope.length) {
							scope.choose[po] = false;
							if (scope.length > scope.button_num) {
								scope.middle = scope.length - 5;
								scope.choose[scope.button_num - 1] = true;
							} else {
								scope.choose[scope.length - 1] = true;
							}
						} else return;
						break;
					default:
					//点击数字按钮
						if (scope.length > 10) {
							if (po == 4) {
								if (scope.middle + type >= 5 && scope.middle + type < scope.length - 5) {
									scope.middle = scope.middle + type;
									if (scope.present == scope.middle) return;
								} else {
									if (scope.middle + type < 5) {
										scope.choose[scope.middle - 1 + type] = true;
										scope.middle = 5;
									} else {
										scope.choose[type - scope.length + 9 + scope.middle] = true;
										scope.middle = scope.length - 5;
									}
									if (scope.choose.lastIndexOf(true) != scope.choose.indexOf(true)) {
										scope.choose[po] = false;
									} else return;
								}
							}
							if (po < 4) {
								if (type < 0) {
									scope.choose[type + 4] = true;
								} else {
									scope.choose[4] = true;
									scope.middle = type + 5;
								}
								if (scope.choose.lastIndexOf(true) != scope.choose.indexOf(true)) {
									scope.choose[po] = false;
								} else return;
							}
							if (po > 4) {
								if (type < 0) {
									scope.choose[4] = true;
									scope.middle = scope.middle + type;
								} else {
									scope.choose[type + 4] = true;
								}
								if (scope.choose.lastIndexOf(true) != scope.choose.indexOf(true)) {
									scope.choose[po] = false;
								} else return;
							}
						} else {
							scope.choose[type + 4] = true;
							if (scope.choose.lastIndexOf(true) != scope.choose.indexOf(true)) {
								scope.choose[po] = false;
							} else return;
						}
						break;
				};
				//由相对位置和绝对位置计算出present
				scope.present = scope.choose.indexOf(true) + scope.middle - 4;
			}
		},

	}
});