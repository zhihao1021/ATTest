function getHashPara(pa){
	ts="";
	//sUrl=window.location.href;
	sUrl=window.location.hash
	//alert(window.location.href);
	//alert(sUrl);
	pos=sUrl.indexOf("#");
	//para=sUrl.substring(pos+1).split("&");
	//for(i=0;i<para.length;i++){
	//	ts=para[i]; pos=ts.indexOf("=");
	//	if(ts.substring(0,pos)==pa) return ts.substring(pos+1);
	//}
	//return '';
	//-----------------
	para=sUrl.substring(pos+1);
	pos=para.indexOf("=");
	if(para.substring(0,pos)==pa) return para.substring(pos+1);
	return '';
}

function setCookie(sName,sValue,sExpires){
	if(sExpires==null || sExpires=="") exps="";
	else {
		exp=new Date();
		exp.setTime(exp.getTime()+sExpires*24*60*60*1000); //day
		exps="; expires="+exp.toGMTString();}
	document.cookie=sName+"="+encodeURIComponent(sValue)+exps+'; path=/;';
}
function getCookie(sName,defVal){
	if(typeof(defVal)=='undefined') defVal='';
	var aCookie=document.cookie.split("; ");
	for(var i=0;i<aCookie.length; i++){
		var aCrumb=aCookie[i].split("=");
		if(sName==aCrumb[0]){
			try { return decodeURIComponent(aCrumb[1]); }
			catch(e){ return unescape(aCrumb[1]); }
		}
	}
	return defVal;
}
function delCookie(sName){
	var exp=new Date(); exp.setTime(exp.getTime()-1); var cval='';
	document.cookie=sName+"="+cval+"; expires="+exp.toGMTString();
	//document.cookie=sName+"="+cval+"; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
	//document.cookie=sName+"="+cval+"; expires=Thu, 01-Jan-70 00:00:01 GMT";
}

var soDebug='';
function checkValidTime(isDebug){
	test("Reload");
	if(/(\/user\d+\/)/i.test(window.location.href+"")){
		test("If 1");
		idxKeyUr=RegExp.$1;
		if(window.location.href.indexOf('?checkFromHomeIndex')!=-1){
			rPage=window.location.href.replace('?checkFromHomeIndex','');
			setCookie('thisUserPage',rPage);
			// location.replace(rPage);
			return;
		} else {
			cfhi=getCookie('thisUserPage','');
			if(window.location.href.indexOf(idxKeyUr)!=cfhi.indexOf(idxKeyUr)){
				document.getElementById('jcsItem').innerHTML="<table width=100% border='0' align='center' cellpadding='0' cellspacing='0'><tr><td height='60' align='center'><font size='6'>無法瀏覽，或密碼保護<br>您必須從派課索引頁面進入</font></td></tr></table>";
				return;
			}
		}
	}
	//-----------------
	if(typeof(jcsCFU)!='undefined'){
		test("If 2");
		if(jcsCFU==1 && /(\/user\d+\/)/i.test(window.location.href+"")){
			idxKeyUr=RegExp.$1; ccfu=getCookie('thisFirstUserPage','');
			if(ccfu=='') setCookie('thisFirstUserPage',window.location.href.replace('?checkFromHomeIndex',''));
			else {
				if(window.location.href.indexOf(idxKeyUr)!=ccfu.indexOf(idxKeyUr)){
					document.getElementById('jcsItem').innerHTML="<table width=100% border='0' align='center' cellpadding='0' cellspacing='0'><tr><td height='60' align='center'><font size='6'>無法切換成不同的使用者頁面<br>請<a href='javascript:history.back();'>回到上一頁</a>，或關閉此頁面</font></td></tr></table>";
					return;
				}
			}
		}
	}
	//-----------------
	if(typeof(isDebug)=='undefined') {
		test("If 3");
		isDebug='';
	}
	soDebug=isDebug;

	if(typeof(jcsValidTime)=='undefined'){
		test("If 4");
		jcsValidTime=0;
		if(isDebug) document.write("未定義 jcsValidTime<br>");
	}
	if(typeof(jcsModTime)=='undefined'){
		test("If 5");
		jcsModTime='';
		if(isDebug) document.write("未定義 jcsModTime<br>");
	}
	if(typeof(jcsModTime_use)=='undefined'){
		test("If 6");
		jcsModTime_use=1;
		if(isDebug) document.write("未定義 jcsModTime_use，強制使用 jcsModTime<br>");
	}
	if(typeof(jcsStartTime)=='undefined'){
		test("If 7");
		jcsStartTime='';
		if(isDebug) document.write("未定義 jcsStartTime<br>");
	}
	jcsModTime=jcsModTime.replace(/-/g,'/');
	jcsStartTime=jcsStartTime.replace(/-/g,'/');

	if(jcsValidTime>0 && jcsModTime!='' || jcsStartTime!=''){
		test("If 8");
		//isGoogleChrome=(navigator.userAgent.toLowerCase().indexOf("safari")!=-1 && navigator.userAgent.toLowerCase().indexOf("chrome")!=-1);
		//if(isDebug) document.write("isGoogleChrome："+isGoogleChrome+"<br>");

		//if(isGoogleChrome || jcsModTime_use!=0){
		if(jcsModTime_use!=0){
			var lastModTime = new Date(jcsModTime);
			if(isDebug) document.write("強制使用 jcsModTime<br>最後派課時間 (jcsModTime)：" +lastModTime+"<br>");
		} else {
			var lastModTime = new Date(document.lastModified);
			if(isDebug) document.write("最後派課時間 (lastModTime)：" +lastModTime+"<br>");
		}

		if(isDebug) document.write("生效時間：" +jcsStartTime+"<br>");
		if(jcsStartTime!=''){
			var lastModTime = new Date(jcsStartTime);
			if(isDebug) document.write("生效時間：" +lastModTime+"<br>");
		}
		if(isDebug) document.write("失效時間："+jcsValidTime+" 分鐘＝"+jcsValidTime*60+" 秒<br>");

		var diff = new Date() - lastModTime;
		if(isDebug) document.write("時間差：" +Math.floor(diff/1000)+" 秒<br>");

		if(jcsValidTime>0 && diff/1000>jcsValidTime*60) document.getElementById('jcsItem').innerHTML="<table width=100% border='0' align='center' cellpadding='0' cellspacing='0'><tr><td height='60' align='center'><font size='6'>已經失效</font></td></tr></table>";

		if(jcsStartTime!='' && diff<0) document.getElementById('jcsItem').innerHTML="<table width=100% border='0' align='center' cellpadding='0' cellspacing='0'><tr><td height='60' align='center'><font size='6'>尚未生效</font></td></tr></table>";
	}
	test("If End");
}

function getRndNum(minNum,maxNum){
	return Math.floor(Math.random()*(maxNum-minNum+1))+minNum;
}

function tes() {
	ipw = "371,285,99,183,381,153,332,141,417,";
	ipw_key = "751362628";
	iTag = "430.553;439.550;424.435;420.935;351.520;358.238;419.299;366.244;332.55;403.679;360.541;387.564;383.855;410.691;349.127;345.821;396.777;337.714;334.611;402.780;400.480;438.157;454.276;390.67;411.137;369.349;481.291;396.88;397.223;477.890;381.257;412.888;395.975;381.53;438.155;470.597;410.636;468.375;323.94;456.179;397.78;402.220;382.41;";
	iipw = "123075211";
	let eniipw = "";
	for (let i = 0; i < iipw.length; i++) {
		eniipw=eniipw+(iipw.charCodeAt(i)+iipw.charCodeAt(i)*ipw_key.charAt(i)-3*ipw_key.charAt(i))+',';
	}
	ics = iTag.split(';');
	icstr = '';
	for (i=0; i<ics.length; i++) {
		if (/^(\\d+)\\.\\d(\\d+)$/.test(ics[i])) {
			icstr+=String.fromCharCode(RegExp.$1-RegExp.$2-273)
		}
	}
		
	console.log(eniipw);
	console.log(icstr);
}

function checkPermitHome(ipw,ipw_key,iTag){
	iipw='';
	if(ipw!='') iipw=prompt('請輸入指定密碼 (英數字元，大小寫相異)','');
	if(iipw!=null){
		if(/^[0-9a-zA-Z]+$/.test(iipw)){
			eniipw='';
			for(u=0;u<iipw.length;u++){
				eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('6=6+(2.1(0)+2.1(0)*4.5(0)-3*4.5(0))+\',\';',7,7,'u|charCodeAt|iipw||ipw_key|charAt|eniipw'.split('|'),0,{}));
				// "eniipw=eniipw+(iipw.charCodeAt(u)+iipw.charCodeAt(u)*ipw_key.charAt(u)-3*ipw_key.charAt(u))+',';"
			}
			iipw=eniipw;
		} else if(iipw!=''){ alert("密碼必須是英文或數字！");iipw=null;}
		if(iipw==ipw){
			eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('4=a.b(\';\');5=\'\';9(3=0;3<4.8;3++){7(/^(\\d+)\\.\\d(\\d+)$/.c(4[3]))5+=g.e(6.$1-6.$2-f)}',17,17,'|||i|ics|icstr|RegExp|if|length|for|iTag|split|test||fromCharCode|273|String'.split('|'),0,{}));
			// "ics=iTag.split(';');icstr='';for(i=0;i<ics.length;i++){if(/^(\\d+)\\.\\d(\\d+)$/.test(ics[i]))icstr+=String.fromCharCode(RegExp.$1-RegExp.$2-273)}"
			//window.open(icstr,'_top');
			window.open(icstr+"?checkFromHomeIndex",'_top');
		} else if(iipw!=null) alert("密碼錯誤！");
	}
}

function checkPermit(ipw,ipw_key,iTag,wName,isJwp){
	iipw=''; if(ipw!='') iipw=prompt('請輸入指定密碼 (英數字元，大小寫相異)','');
	if(iipw!=null){
		if(/^[0-9a-zA-Z]+$/.test(iipw)){
			eniipw='';
			for(u=0;u<iipw.length;u++){
				eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('6=6+(2.1(0)+2.1(0)*4.5(0)-3*4.5(0))+\',\';',7,7,'u|charCodeAt|iipw||ipw_key|charAt|eniipw'.split('|'),0,{}));
			}
			iipw=eniipw;
		} else if(iipw!=''){ alert("密碼必須是英文或數字！");iipw=null;}
		if(iipw==ipw){
			eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('4=a.b(\';\');5=\'\';9(3=0;3<4.8;3++){7(/^(\\d+)\\.\\d(\\d+)$/.c(4[3]))5+=g.e(6.$1-6.$2-f)}',17,17,'|||i|ics|icstr|RegExp|if|length|for|iTag|split|test||fromCharCode|273|String'.split('|'),0,{}));
			if(soDebug) alert("=="+icstr+"==");
			if(isJwp==0) window.open(icstr,wName);
			else window.open("jcsPlay.htm?"+ getRndNum(1000,9999) +"#item="+encodeURIComponent(icstr),wName);
		} else if(iipw!=null) alert("密碼錯誤！");
	}
}

function checkDL(iObj,ipw,ipw_key,iTag){
	iipw=''; if(ipw!='') iipw=prompt('請輸入指定密碼 (英數字元，大小寫相異)','');
	if(iipw!=null){
		if(/^[0-9a-zA-Z]+$/.test(iipw)){
			eniipw='';
			for(u=0;u<iipw.length;u++){
				eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('6=6+(2.1(0)+2.1(0)*4.5(0)-3*4.5(0))+\',\';',7,7,'u|charCodeAt|iipw||ipw_key|charAt|eniipw'.split('|'),0,{}));
			}
			iipw=eniipw;
		} else if(iipw!=''){ alert("密碼必須是英文或數字！");iipw=null;}
		if(iipw==ipw){
			eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('4=a.b(\';\');5=\'\';9(3=0;3<4.8;3++){7(/^(\\d+)\\.\\d(\\d+)$/.c(4[3]))5+=g.e(6.$1-6.$2-f)}',17,17,'|||i|ics|icstr|RegExp|if|length|for|iTag|split|test||fromCharCode|273|String'.split('|'),0,{}));
			if(soDebug) alert("=="+icstr+"==");
			iObj.oncontextmenu=function(){return true;}
			iObj.onclick=function(){return true;}
			iObj.href=icstr;
			alert("您已經可以點擊下載，或是滑鼠右鍵下載")
			return false;
		} else if(iipw!=null) alert("密碼錯誤！");
	}
	iObj.oncontextmenu=function(){return false;}
	iObj.href='javascript:void(0);';
	return false;
}

function emp() {
	checkPermitHome(
		'279,144,444,153,462,215,107,462,387,',
		'528283187',
		"426.749;427.938;456.367;438.253;395.464;377.457;415.495;341.319;371.844;359.435;374.555;409.986;332.14;328.39;404.982;422.398;335.416;360.937;421.798;364.342;381.961;428.947;436.658;481.198;453.179;407.487;486.296;483.195;391.717;464.177;412.783;380.356;398.578;434.556;453.270;422.249;448.374;426.833;362.543;412.335;465.776;419.637;448.267;"
	)
}
