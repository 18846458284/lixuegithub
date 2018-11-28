linker.factory('checkEmail',function(){
	//验证是否是邮箱
	function isEmail(email){
         var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		 if (filter.test(email)) 
			 return true;
		 return false;
   	};
   
	return function(event){
		var alertText = $(event.currentTarget).parent().find(".alert");
		var email = $(event.currentTarget).val();
		
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
	}
});