function loginService(http,window){
	var checkEmail = function(event,target){
		var alertText,email;
		if(event != null){
			alertText = $(event.currentTarget).parent().find(".alert");
			email = $(event.currentTarget).val();
		}else if(target != null){
			alertText = target.parent().find(".alert");
			email = target.val();
		}else{
			return false
		}
		
		
		if (email.trim().length == 0) {
			alertText.empty();
			alertText.append("登录邮箱不为空");
			alertText.show();
			return false;
		} else if (!isEmail(email)) {
			alertText.empty();
			alertText.append("邮箱格式不正确");
			alertText.show();
			return false;
		}else{
			alertText.empty();
			alertText.hide();
		}
		return true;
	};
	
	var checkPasswd = function(event,target){
		var alertText,passwd;
		if(event != null){
			alertText = $(event.currentTarget).parent().find(".alert");
			passwd = $(event.currentTarget).val();
		}else if(target != null){
			alertText = target.parent().find(".alert");
			passwd = target.val();
		}else{
			return false
		}

		if (passwd.trim().length == 0) {
			alertText.empty();
			alertText.append("密码不能为空");
			alertText.show();
			return false;
		} else {
			alertText.empty();
			alertText.hide();
		}
		return true;
	};
	
	var checkVerifycode = function(event,target){
		var alertText,verifycode;
		if(event != null){
			alertText = $(event.currentTarget).parent().find(".alert");
			verifycode = $(event.currentTarget).val();
		}else if(target != null){
			alertText = target.parent().find(".alert");
			verifycode = target.val();
		}else{
			return false
		}

		if (!verifycode || verifycode.length != 4) {
			alertText.empty();
			alertText.append("请填写4位验证码");
			alertText.show();
			return false;
		} else {
			alertText.empty();
			alertText.hide();
			$.post("/user/noLogin/validator",{verifycode:verifycode},function(data){
				if(data.reply!=1){
					alertText.empty();
					alertText.append("验证码输入不正确");
					alertText.show();
					return false;
				}
			});
		}
		return true;
	};
	
	var doLogin = function(data){
		var url = "/user/noLogin/login";
		var request = {
		    "url": url,
		    "dataType": "json",
		    "method": "POST",
		    "data": JSON.stringify(data)
		}
		
		http(request).success(function(response){
			var reply = response.reply;
			if(reply == 1){
				sessionStorage.userName = response.data.userName;
				sessionStorage.userType = response.data.userType;
				sessionStorage.roleId  =  response.data.roleId;
				sessionStorage.initRoleMenu  =  response.data.initRoleMenu;
				sessionStorage.enterNameshow=sessionStorage.agentName;
				sessionStorage.appId =response.data.appId;
				/*try{
					if(response.data.cookieUrls){
						setCookies(response.data.cookieUrls,response.data.sessionId);
					}
				}catch(e){}*/
				
				window.location = "/op-portal/index.html";
			}else if(reply == 1001){
				layer.alert('用户不存在', {    	 
	 	    	  icon: 2
	 	    	});
			}else if(reply == 1002){
				layer.alert('密码不正确', {    	 
	 	    	  icon: 2
	 	    	});
			}else if(reply == 1003){
				layer.alert('验证码不正确', {    	 
	 	    	  icon: 2
	 	    	});
			}else if(reply == 1012){
				layer.alert('您无权限', {    	 
		 	    	  icon: 2
		 	    	});
			}else{
				layer.alert('登录失败', {    	 
	 	    	  icon: 2
	 	    	});
			}
		    
		}).error(function(error){
			layer.alert('登录失败', {    	 
 	    	  icon: 2
 	    	});
		});
	};
	
	var doResetPasswd = function(email){
		var url = "/user/noLogin/reset?email=" + email;
		var request = {
		    "url": url,
		    "dataType": "json",
		    "method": "GET"
		}
		
		http(request).success(function(response){
			var reply = response.reply;
			if(reply == 1){
				layer.alert('重置密码邮件已发送，请查收', {    	 
	 	    	  icon: 1
	 	    	});
			}else if(reply == 1004){
				layer.alert('email不存在', {    	 
	 	    	  icon: 2
	 	    	});
			}else{
				layer.alert('重置密码邮件发送失败', {    	 
	 	    	  icon: 2
	 	    	});
			}
		}).error(function(error){
		    layer.alert('重置密码邮件发送失败', {    	 
	 	    	icon: 2
	 	    });
		});
	};
	
	return {
		"checkEmail" : checkEmail,
		"checkPasswd" : checkPasswd,
		"checkVerifycode" : checkVerifycode,
		"doLogin" : doLogin,
		"doResetPasswd" : doResetPasswd
	}
}

function isEmail(email){
	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(email)) 
	return true;
	return false;
};

function setCookies(urls,sessionId){
	if(urls == null)
		return;
	for(var i=0;i<urls.length;i++){
		var u = urls[i];
		$.ajax({
	       type : "get",
	       async:false,
	       url : u+"?BAOYUN_SESSION_ID="+sessionId,
	       dataType : "jsonp",
	       timeout:2000,
	       success : function(json){
	       },
	       error:function(){
	       }
	   });
	}
}
   
login.factory('loginService', ['$http', '$window',loginService]);