var login = angular.module('login', ['ngRoute']);
var linker = angular.module('linker', ['ngRoute', 'ui.router']);
login.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/login/signin.html',
			controller: 'LoginController'
		})
		.when('/forgetpwd', {
			templateUrl: 'templates/login/forgetpwd.html',
			controller: 'LoginController'
		})
		.otherwise({
			redirectTo: '/'
		});
});
linker.run(['$rootScope', '$state', '$stateParams',
	function($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
	}
]);
linker.config(function($stateProvider, $urlRouterProvider) {
	// 直接关闭连接后, 再次打开页面无反应
	if (!sessionStorage) {
		sessionStorage = new Object();
	}
	if (!sessionStorage.userType) {
		sessionStorage.userType = "app";
	}
	if (sessionStorage.userType == "admin") {
		$urlRouterProvider.otherwise(sessionStorage.initRoleMenu);
		$stateProvider
			.state("admin", {
				url: '/admin',
				views: {
					'left_content': {
						templateUrl: 'templates/leftcontent.html',
						controller: 'LeftcontentadminController',
					},
					'user_show': {
						templateUrl: 'templates/usershowadmin.html',
					},
				},
			})
			.state("monitor", {
				url: '/monitor', 
				views: {
					'left_content': {
						templateUrl: 'templates/leftcontent.html',
						controller: 'LeftcontentadminController',
					},
					'user_show': {
						templateUrl: 'templates/usershowadmin.html',
					},
				},
			})
			.state("admin.agent", {
				url: '/agent',
				views: {
					'right_content@': {
						templateUrl: "templates/main/agent.html",
						controller: 'AgentController',
					},
				},
			})
			.state("admin.user", {
				url: '/user',
				views: {
					'right_content@': {
						templateUrl: "templates/main/user.html",
						controller: 'UserController',
					},
				},
			})
			.state("admin.role", {
				url: '/role',
				views: {
					'right_content@': {
						templateUrl: "templates/main/role.html",
						controller: 'RoleController',
					},
				},
			})
			.state("admin.agent.finance", {
				url: '/finance/{byorderId}/{byfromDate}/{bytoDate}/{byTranscationType}/{timeStamp}',
				views: {
					'right_content@': {
						templateUrl: "templates/main/finance.html",
						controller: 'FinanceController',
					},
					'user_show@': {
						templateUrl: 'templates/test.html',
					},
//					'left_content@': {
//						templateUrl: 'templates/leftcontent.html',
//						controller: 'LeftcontentadminController',
//					},
				}
			})
			.state("admin.agent.designatedchannel", {
				url: "/designatedchannel/{byagentId}/{bymo}/{byprovince}/{bychannelId}/{bychannelName}/{byspec}/{bybizType}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/designatedchannel.html',
						controller: 'DesignatedchannelController'
					},
					'user_show@': {
						templateUrl: 'templates/test.html',
					},
//					'left_content@': {
//						templateUrl: 'templates/leftcontent.html',
//						controller: 'LeftcontentadminController',
//					},
				}
			})
			.state("admin.deposit", {
				url: '/deposit',
				views: {
					'right_content@': {
						templateUrl: 'templates/main/deposit.html',
						controller: 'DepositController',
					}
				},
			})
			.state("admin.monitor", {
				url: '/monitor',
				views: {
					'right_content@': {
						templateUrl: 'templates/main/monitor.html',
						controller: 'MonitorController',
					}
				},
			})
			.state("admin.account", {
				url: "/account",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/account.html',
						controller: 'AccountController',
					}
				}
			})
			.state("admin.ordermenuflow", {
				url: "/ordermenuflow/{byAppId}/{byMO}/{byProvince}/{byStatus}/{byFromDate}/{byToDate}/{byCustomerOrderId}/{byphoneNo}/{byspec}/{byresourceId}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/ordermenuflow.html',
						controller: 'OrdermenuFlowController',
					}
				}
			})
			
			.state("admin.maeorderflow", {
				url: "/maeorderflow/{byMO}/{byphoneNo}/{byFromDate}/{byToDate}/{byspec}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/maeorderflow.html',
						controller: 'MaeOrderFlowController',
					}
				}
			})
			.state("admin.maeordervoice", {
				url: "/maeordervoice/{byMO}/{byphoneNo}/{byFromDate}/{byToDate}/{byspec}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/maeordervoice.html',
						controller: 'MaeOrderVoiceController',
					}
				}
			})
			
			.state("admin.flowqueue", {
				url: "/flowqueue/{byMo}/{byProvince}/{byBizType}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/orderstatusmonitor.html',
						controller: 'flowQueueController',
					}
				}
			})
			
			.state("admin.kpirecords", {
				url: "/kpirecords/{byUserName}/{byPhoneNo}/{byCustomerOrderId}/{byStartDate}/{byEndDate}/{byKpiType}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/kpirecords.html',
						controller: 'KpiRecordsController',
					}
				}
			})
			.state("admin.ordermenuvoice", {
				url: "/ordermenuvoice/{byAppId}/{byMO}/{byProvince}/{byStatus}/{byFromDate}/{byToDate}/{byCustomerOrderId}/{byphoneNo}/{byspec}/{byresourceId}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/ordermenuvoice.html',
						controller: 'OrdermenuVoiceController',
					}
				}
			})
			.state("admin.fund", {
				url: "/fund/{byAppId}/{byFromDate}/{byToDate}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/fund.html',
						controller: 'FundController',
					}
				}
			})
			.state("admin.voiceChannel", {
				url: "/voiceChannel/{bychannelId}/{byState}/{bychannelName}/{bymo}/{byprovince}/{byspec}/voice/{byNeedSms}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/channel.html',
						controller: 'voiceChannelController',
					}
				}
			})
			.state("admin.flowChannel", {
				url: "/flowChannel/{bychannelId}/{byState}/{bychannelName}/{bymo}/{byprovince}/{byspec}/flow/{byNeedSms}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/channel.html',
						controller: 'flowChannelController',
					}
				}
			})
			.state("admin.voiceGoods", {
				url: "/voiceGoods/{bygoodsName}/{bymo}/{bysourceProvince}/{byspec}/voice/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/goods.html',
						controller: 'voiceGoodsController'
					}
				}
			})
			.state("admin.flowGoods", {
				url: "/flowGoods/{bygoodsName}/{bymo}/{bysourceProvince}/{byspec}/flow/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/goods.html',
						controller: 'flowGoodsController'
					}
				}
			})
			.state("admin.email", {
				url: "/email",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/adminEmail.html',
						controller: 'adminEmailController'
					}
				}
			})
			.state("admin.voiceStorage", {
				url: "/voiceStorage/{byAppId}/{byappendState}/{bygoodsName}/{bydiscount}/{bymo}/{byspec}/{bystate}/{bysourceProvince}/voice/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/storage.html',
						controller: 'voiceStorageController'
					}
				}
			})
			.state("admin.flowStorage", {
				url: "/flowStorage/{byAppId}/{byappendState}/{bygoodsName}/{bydiscount}/{bymo}/{byspec}/{bystate}/{bysourceProvince}/flow/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/storage.html',
						controller: 'flowStorageController'
					}
				}
			})
			.state("admin.maeforcompare", {
				url: "/maeforcompare/{byChannelId}/{byFromDate}/{byToDate}/{byState}/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/maeforcompare.html',
						controller: 'MaeOrderForCompareController',
					}
				}
			})
			.state("admin.channelqualityflow", {
				url: "/channelqualityflow/{byMO}/{byProvince}/{byFromDate}/{byToDate}/{byresourceId}/flow/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/channelqualityflow.html',
						controller: 'ChannelQualityFlowController',
					}
				}
			})
			.state("admin.channelqualityvoice", {
				url: "/channelqualityvoice/{byMO}/{byProvince}/{byFromDate}/{byToDate}/{byresourceId}/voice/{timeStamp}",
				views: {
					'right_content@': {
						templateUrl: 'templates/main/channelqualityvoice.html',
						controller: 'ChannelQualityVoiceController',
					}
				}
			})
			.state("admin.channeltradeflow", {
			url: "/channeltradeflow/{byMO}/{byProvince}/{byFromDate}/{byToDate}/{byresourceId}/flow/{timeStamp}",
			views: {
				'right_content@': {
					templateUrl: 'templates/main/channeltradeflow.html',
					controller: 'ChannelTradeFlowController',
				}
			}
			})
			.state("admin.channeltradevoice", {
			url: "/channeltradevoice/{byMO}/{byProvince}/{byFromDate}/{byToDate}/{byresourceId}/voice/{timeStamp}",
			views: {
				'right_content@': {
					templateUrl: 'templates/main/channeltradevoice.html',
					controller: 'ChannelTradeVoiceController',
				}
			}
			})
			.state("admin.mifiuser", {
			url: "/mifiuser/{bymifiNo}/{bymifiPhoneNo}/{bygroupName}/{bystartTime}/{byendTime}/{timeStamp}",
			views: {
				'right_content@': {
					templateUrl: 'templates/main/mifiUserInfo.html',
					controller: 'MifiUserInfoController',
				}
			}
			})
			.state("admin.mifiresource", {
			url: "/mifiresource/{bymifiNo}/{bymifiPhoneNo}/{bycardType}/{byprovince}/{byactiveState}/{timeStamp}",
			views: {
				'right_content@': {
					templateUrl: 'templates/main/mifiresource.html',
					controller: 'MifiResourceController',
				}
			}
			})
			.state("admin.mifiusergroup", {
			url: "/mifiusergroup",
			views: {
				'right_content@': {
					templateUrl: 'templates/main/mifiusergroup.html',
					controller: 'MifiUserGroupController',
				}
			}
			})
			.state("admin.mificardtype", {
			url: "/mificardtype",
			views: {
				'right_content@': {
					templateUrl: 'templates/main/mificardType.html',
					controller: 'MifiCardTypeController',
				}
			}
			})

	} else if (sessionStorage.userType == "app") {
		$urlRouterProvider.otherwise("/app/ordersflow/////////");
		$stateProvider
			.state("app", {
				url: '/app',
				views: {
					'left_content': {
						templateUrl: 'templates/leftappcontent.html',
						controller: 'LeftcontentappController',
					},
					'user_show': {
						templateUrl: 'templates/usershowapp.html',
					},
				}
			})
			.state("app.ordersflow", {
				url: '/ordersflow/{byMO}/{byProvince}/{byStatus}/{byFromDate}/{byToDate}/{byCustomerOrderId}/{byphoneNo}/{byspec}/{timeStamp}',
				views: {
					'right_content@': {
						templateUrl: "templates/main/ordersflow.html",
						controller: 'OrdersFlowController',
					},
				},
			})
			.state("app.email", {
				url: '/email',
				views: {
					'right_content@': {
						templateUrl: "templates/main/appEmail.html",
						controller: 'EmailController',
					},
				},
			})
			.state("app.ordersvoice", {
				url: '/ordersvoice/{byMO}/{byProvince}/{byStatus}/{byFromDate}/{byToDate}/{byCustomerOrderId}/{byphoneNo}/{byspec}/{timeStamp}',
				views: {
					'right_content@': {
						templateUrl: "templates/main/ordersvoice.html",
						controller: 'OrdersVoiceController',
					},
				},
			})
			.state("app.finance", {
				url: '/finance/{byorderId}/{byfromDate}/{bytoDate}/{byTranscationType}/{timeStamp}',
				views: {
					'right_content@': {
						templateUrl: "templates/main/finance.html",
						controller: 'FinanceController',
					},
				},
			})
			.state("app.account", {
				url: '/account',
				views: {
					'right_content@': {
						templateUrl: 'templates/main/account.html',
						controller: 'AccountController',
					}
				},

			})
			.state("app.manualflow", {
				url: '/manualflow',
				views: {
					'right_content@': {
						templateUrl: 'templates/main/manualflow.html',
						controller: 'ManualFlowController',
					}
				},
			})
			.state("app.manualvoice", {
				url: '/manualvoice',
				views: {
					'right_content@': {
						templateUrl: 'templates/main/manualvoice.html',
						controller: 'ManualVoiceController',
					}
				},
			})
	}
});
