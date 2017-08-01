var enq = {};
var imesh_obj = {}; 
imesh_obj = new userDataCookie();
function isValidateLibrary(){
var _libraryObject = {};
var errorMessages = {
	e1:'Please enter mobile number.',  
	e2:'Please enter 10 digit mobile number.',  
	e3:'Please enter correct mobile number.',
	e4:'Please enter your name.',
	e5:'Please enter your email.',
	e6:'Invalid email id. Please enter the correct email id.',
	e7:'Please provide product name.',
};
var customErrorMessages = {
	c1:'Please select unit of quantity.',
	c2:'Please provide estimated quantity.',
	c3:'Please select currency.',
	c4:'Please select order value.',
	c5:'Please enter '
};
_libraryObject.number = function(phoneNumber,iso){
	var result = {};
	result['key'] = 'number';
	result['type'] = false;
	result['error'] = '';
	phoneNumber = phoneNumber.replace(/^\s*|\s*$/g,'');
	var mobrRegex = /^[0-9-+()./ ]*$/;
	if (((phoneNumber == '') || (phoneNumber.length == 0))) 
	{
		result['error'] = errorMessages.e1; 
		return result;
	}
	else if (mobrRegex.test(phoneNumber))
	{
		if(iso=='IN')
		{
			if(phoneNumber.length > 10 || phoneNumber.length<10)
			{
				phoneNumber = phoneNumber.replace(/^((91){0,1}0{0,})/g,'');
				if(phoneNumber.length != 10)
				{
					result['error'] = errorMessages.e2;
					return result;
				}
			}
			var filter = /^(?:(?:\+|0{0,2})(91|910)(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
			if (!filter.test(phoneNumber))
			{ 
				result['error'] = errorMessages.e3;
				return result;
			}
			result['type'] = true;
		}
		result['type'] = true;
		return result;
	}
	else
	{
		result['error'] = errorMessages.e3;
	}
	return result;
};
_libraryObject.name = function(name){
	var result = {};
	result['key'] = 'name';
	result['type'] = false;
	result['error'] = '';
	if(name == ''){
		result['error'] = errorMessages.e4;
		return result;
	}
	result['type'] = true;
	return result;
};
_libraryObject.email = function(email){
	var result = {};
	result['key'] = 'email';
	result['type'] = false;
	result['error'] = '';
	if(email == ''){
		result['error'] = errorMessages.e5;
}
else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email))) { 
		result['error'] = errorMessages.e6;
	}
else
{
		result['type'] = true;
}
return result;
};
_libraryObject.product = function(product){
	var result = {};
	result['key'] = 'email';
	result['type'] = false;
	result['error'] = '';
	product=product.trim();
	if(product==null || product=="")
	{	
			result['error'] = errorMessages.e7;
	}
	else
	{
			result['type'] = true;
	}
	return result;
};
_libraryObject.custom = function(jsonObj){ 
	//String {City, value Filled or not}
	var result = {};
	result['key'] = jsonObj.key;
	result['type'] = false;
	result['error'] = '';
	if(jsonObj.key == "nonempty")
	{    
		if(jsonObj.value == '')
			result['error'] = customErrorMessages.c5 + jsonObj.field;
		else
			result['type'] = true;
	}
	else if(jsonObj.key == "quantity")
	{
		var qtyVal=jsonObj.qtyVal;
		var estQty=jsonObj.estQty;
		var checkPrice=(typeof jsonObj.checkPrice == 'undefined')? 0: jsonObj.checkPrice;
		var qty_index = jsonObj.qty_index;
		estQty = estQty.replace(/\s/g, "");
		if(estQty != '' && qty_index==0)
		{
				result['error'] = customErrorMessages.c1;
				result['errorId']='quantityList';
		}  
		else if(((qtyVal!='Other' && estQty =='' && qty_index!=0) || (qtyVal=='Other' && estQty =='')) && checkPrice!=1)
		{
			result['error'] = customErrorMessages.c2;
			result['errorId']='quantity';
		} 
		else
			result['type'] = true;
	}
	else if(jsonObj.key == "aov")
	{
		var currency_index=jsonObj.currency_index;
		var aov = jsonObj.aov;
		if(aov != '' && currency_index==0)
		{
			result['error'] = customErrorMessages.c3;
			result['errorId'] = 'Currency';
		} 
		else if(aov == '' && currency_index!=0)
		{
			result['error'] = customErrorMessages.c4;
			result['errorId'] = 'aov';
		}   
		else
			result['type'] = true;
	}
	return result;
};
return _libraryObject;
}
function functionality(){ 
    var _centralizeBlEnqFunc = {};

    var developmentURL = {
                utilsHostName:'dev-utils.imimg.com',
                mapiHostName:'stg-mapi.indiamart.com',
                appHostName:'dev-apps.imimg.com'
    };
    var stageURL = {
                utilsHostName:'stg-utils.imimg.com',
                mapiHostName:'stg-mapi.indiamart.com',
                appHostName:'stg-apps.imimg.com'
    };
    var liveURL = {
                utilsHostName:'utils.imimg.com',
                mapiHostName:'mapi.indiamart.com',
                appHostName:'apps.imimg.com'
    };
    var serviceName ={
        sendBlEnq:'/wservce/rfq/add/',
        userLogin:'/wservce/users/login/',
        getISQ:'/index.php?r=postbl/getISQ/',
        setISQ:'/wservce/buyleads/setISQ/',
        otp:'/wservce/users/OTPverification/',
        userUpdate:'/wservce/users/edit/',
        intentGeneration:'/wservce/enquiry/iminterest/',
		amazonData: '/wservce/products/tolexostrip/'
    };
    functionality.prototype.setter = function(key,value)
    {
        this.key = value;
    } 
    functionality.prototype.getter = function(key)
    {
        return this.key;
    }
    _centralizeBlEnqFunc.getDomainURL = function(){
        if(window.location.href.match(/(\/\/dev-|\/\/dev.|file:\/\/)/ig))
        {
            return developmentURL;
        }
        else if(window.location.href.match(/(\/\/stg-|\/\/stg.|file:\/\/)/ig))
        {
            return stageURL;
        }
        return liveURL;
    }
    var host_nm = _centralizeBlEnqFunc.getDomainURL();
    _centralizeBlEnqFunc.getResponse = function(key,jsonObj,callback1,callback2){
		var url_request = (key == 'getISQ') ? '//'+host_nm.appHostName+serviceName[key] : (key == 'amazonData' ? '//mapi.indiamart.com/wservce/products/tolexostrip/' : '//'+host_nm.mapiHostName+serviceName[key]);
        if(jsonObj!=null && jsonObj.length!==0)
        {
			$.ajax({
				url:url_request,
				data:jsonObj,
				type:"POST",
				dataType:"json",
				crossDomain:true,
			}).done(callback1).fail(callback2);
        }
    }
    return _centralizeBlEnqFunc;
}
if(typeof(window.rfqfunc) === 'undefined'){
    window.rfqfunc = functionality();
}
if(typeof(window.isValid) === 'undefined'){
    window.isValid = isValidateLibrary();
}
function showEnquiryForm(rData)
{
	if($('#queryID').length > 0 && $('#queryID').val() != "")
	{
		$('#queryID').val('');
	}
	if($("#C_Thank_msg").css("display","block") || $("#CEF_EnqThnx").css("display","block") || $("#CEF_OthThank_msg").css("display","block"))
	{
		if($('#CEF_EMFHtmlID').html() != ''){
			$('#CEF_EMFHtmlID').html('');	      
		}
		$('#CEF_EnqThnx,#C_Thank_msg,#CEF_OthThank_msg,#CEF_Enrich_Forsecond').css("display", "none");
		$("#CEF_EnqPart,#CEF_EMFHtmlID").hide();
		$('#CEF_EnqForm').show();
		$("#enq_form_enrichmt").trigger('reset');               
	}
	$('#isImage').show();
	cef_update_isq = false;
	showFirstEnrich=0;
	if(rData.CEF_form_type!=="enq_inline" && rData.CEF_form_type!=="enq_rhs")
	{
		$('#enqhtml').show();
	}
	$('#enquiryOtp_second,#otpValue_errMsg,#isq_step,#default_icon,#usrLst').hide();
	$('#otpValue').val('');
	$('#Enqprice_txt,#pop_msg_enq,#small_enrich_bar').html('');
	$("#blacklayer").css({width:"890px"});
	$('#small_image').removeAttr('style'); 
	$('#small_image,#big_img').attr('src', '');
	formvalidationreset();
	enq = rData;
	enq.againUIS = false;
	otp_status=0;otp_failure=0;otp_hit = ''; verified = 0; prodType = 'P'; txtchk = 0; txtrad = 0; callIsqFlag = false;
	var qstring = rData.query;
	var category = getQueryStringParsedData(qstring, "ctg");
	var locality = getQueryStringParsedData(qstring, "locality");
	var city = getQueryStringParsedData(qstring, "city");
	var state = getQueryStringParsedData(qstring, "state");
	enq.category = category;
	enq.locality = locality;
	enq.city = city;
	enq.state = state;
	cefSetFormIDS(enq);
	checkCCnCN();
	if(typeof(enq.more_images)!=='undefined' && enq.more_images !== '')
	{
		$("#arrow-hover").css("display","block");
		$(".thumbnail_pos").removeClass('top_p1 top_p2 top_p3');
	}
	if(typeof(enq.R_title)!=='undefined' && enq.R_title!=='' && nxtprevflag==0)
	{
		history.pushState(null,null);
	}
	if((typeof(did.lastDid) === 'undefined') && rData.CEF_form_type !== "enq_inline" && rData.CEF_form_type !== "enq_rhs")
	{
		did.lastDid = rData.displayId;
		$('#C_S_countryname_enq').val(page.country);
		$('#C_S_country_iso').val(page.countryCode);
		cefCountrySuggester();            
	}
	if(industry_questions_found==1 && glmodid != 'FCP' && glmodid != 'MDC')
	{
		enq.industry_ques='|ISQ';
		$('#inputTab').html('');
		$('#C_Desc_Prod').val('');
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-industry-ques-avail.mp');
	}
	else{
		enq.industry_ques='';
	}
	did.lastDid = rData.displayId;
	$('html').css({overflow:"hidden"});
	$('body').css({"overflow-y":"scroll","width":"100%"});
	$('#C_ProdPrice').hide();	
	var zoom_image = getQueryStringParsedData(qstring, "zoom_img"); 
	var display_image = getQueryStringParsedData(qstring, "display_image");
	var ss = getQueryStringParsedData(qstring, "ss");	
	var R_modref_type = getQueryStringParsedData(qstring, "modreftype");
	var val_imesh = imesh_obj.get();
	var S_glusr_id = "";
	var val_v4iilex= readCookie('v4iilex');
	var is_admin = getparamVal(val_v4iilex, "admln") || '';
	var glid_v4cookie = getparamVal(val_v4iilex, "id") || '';
	enq.ss = ss;
	enq.R_modref_type = R_modref_type;
	enq.is_admin = is_admin;
	if(typeof(enq.display_message)!=='undefined' && enq.display_message!=='')
	{
		$('#pop_msg_enq').html(enq.display_message);
	}
	if(typeof(enq.login_heading)!=='undefined' && enq.login_heading !=='')
	{
		$('#new-usr-msg').text(enq.login_heading);
	}
	else
	{
		if(val_imesh == "")
		{
			$('#new-usr-msg').text('Lets Get Started');
		}
		else
		{
			$('#new-usr-msg').text('Contact Information');
		}
	}
	if(val_v4iilex != "" && val_imesh != "" && glid_v4cookie != "")
	{
		enq.userStatus = 1;
	}
	else if((val_imesh != "") && (typeof(val_imesh.glid) != 'undefined' && val_imesh.glid != ''))
	{
		enq.userStatus = 2;
	}
	if(val_imesh != "") 
	{	
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-form.mp');
		try{
			if((typeof(rData.enq_enquiry_sent) == 'undefined' || rData.enq_enquiry_sent == undefined || enq.enq_enquiry_sent==='') && (typeof(rData.R_title) != 'undefined' && rData.R_title != ""))
			{
				if(cefImIntFlag == 0)
				{	
					getInterestRecordId({'R_glusr_id':rData.R_glusr_id,'displayId':rData.displayId,'modreftypflag':R_modref_type,'modid':rData.modid, 'is_admin':is_admin});
				}	
			}
		}catch(e){}
		var full_name = (typeof(val_imesh.fn) != 'undefined' && val_imesh.fn != 'undefined') ? val_imesh.nm : '' ;
		var email = (typeof(val_imesh.em) != 'undefined' && val_imesh.em != 'undefined') ? val_imesh.em : '' ;
		var country = (typeof(val_imesh.cn) != 'undefined' && val_imesh.cn != 'undefined') ? val_imesh.cn : '';
		var city = (typeof(val_imesh.ct) != 'undefined' && val_imesh.ct != 'undefined') ? val_imesh.ct : '';
		var company = (typeof(val_imesh.co) != 'undefined' && val_imesh.co != 'undefined') ? val_imesh.co : '';
		var isd =  (typeof(val_imesh.phcc) != 'undefined' && val_imesh.phcc != 'undefined') ? val_imesh.phcc : '';
		var ph_area = (typeof(val_imesh.phac) != 'undefined' && val_imesh.phac != 'undefined') ? val_imesh.phac : '';		
		var mobile = (typeof(val_imesh.mb1) != 'undefined' && val_imesh.mb1 != 'undefined') ? val_imesh.mb1 : '';
		var phone = (typeof(val_imesh.ph1) != 'undefined' && val_imesh.ph1 != 'undefined') ? val_imesh.ph1 : '';
		var state = (typeof (val_imesh.st) != 'undefined' && val_imesh.st != 'undefined') ? val_imesh.st : '';
		var country_iso = (typeof (val_imesh.iso) != 'undefined' && val_imesh.iso != 'undefined') ? val_imesh.iso : '' ;
		var city_id = (typeof(val_imesh.ctid) != 'undefined' && val_imesh.ctid != 'undefined') ? val_imesh.ctid : '';
		var state_id = (typeof (val_imesh.stid) != 'undefined' && val_imesh.stid != 'undefined') ? val_imesh.stid : '';
		isd = isd.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\+/,'');
		full_name ? $('#C_S_name').val(full_name) : $('#C_S_name').val("");
		country ? $('#C_S_countryname_enq').val(country) : $('#C_S_countryname_enq').val(page.country);
		country_iso ? $('#C_S_country_iso').val(country_iso) : $('#C_S_country_iso').val(page.countryCode);
		company ? $('#C_S_organization').val(company) : $('#C_S_organization').val("");
		isd ? $('#C_S_cmobile_enq').val('+'+isd) : $('#C_S_cmobile_enq').val("");
		isd ?  $('#C_S_ccode').val(isd) : $('#C_S_ccode').val("");
		city ? $('#C_S_city_enq').val(city) : $('#C_S_city_enq').val("");
		state ? $('#C_S_state_enq').val(state) : $('#C_S_state_enq').val("");
		city_id ? $('#C_S_city_id').val(city_id) : $('#C_S_city_id').val("");
		state_id ? $('#C_S_state_id').val(state_id) : $('#C_S_state_id').val("");
		if(isd=="91")
		{
			$('#C_S_email_In').val(email);
			$('#C_S_mobile').val(mobile);
			if(email == ''){$('#C_S_email_mobile_div').css('display','block');cefEmailSuggester('#C_S_email_In');}else{$('#C_S_email_mobile_div').css('display','none');}
		}
		else
		{
			$('#C_S_email').val(email);
			$('#C_S_mobile_F').val(mobile);
			if(mobile ==''){$('#C_S_email_mobile_div').css('display','block');}else{$('#C_S_email_mobile_div').css('display','none');}
		}
		if((typeof(rData.R_title) == 'undefined' || rData.R_title == "") && (rData.CEF_form_type=="enq_inline" || rData.CEF_form_type=="enq_rhs"))
		{
			var sbmt = false;
			sbmt = productV();
			$('#'+enq.CEF_S_mobile).attr("onblur","mobileV('"+enq.CEF_S_mobile+"','"+enq.CEF_S_mobile_errMsg+"')");
			$('#'+enq.CEF_S_email).attr("onblur","emailV('"+enq.CEF_S_email+"','"+enq.CEF_S_email_errMsg+"')");
			$('#'+enq.CEF_EnqProduct).attr("onblur","productV()");
			if(sbmt)
			{
				var nprod_name = $("#"+enq.CEF_EnqProduct).val();
				nprod_name=nprod_name.trim();
				enq.prd_name=nprod_name;
			}
			else
			{
				$('html').css({overflow:"auto"});
				$('body').css({"overflow-y":"auto","width":"100%"});
				return false;
			}
			if(($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91" )&& typeof(val_imesh.uv) !== 'undefined' && val_imesh.uv !== "V" )
			{
				var count = countEnquirySent();
				if(!count){return false;}
			}
			if((cef_EMFDownloadHtml != '') && ($('#CEF_EMFHtmlID').html() == ''))
			{
				$('#CEF_EMFHtmlID').html(cef_EMFDownloadHtml);
				$('#CEF_EMFHtmlID').html($('#CEF_EnrichSection').html());
			}
			try{
				if(($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") || ($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && $('#C_S_name').val() !== ""))
				{
					cefGetUserInfo();
					processSendEnquiry();
				}else{}
			}catch(e){}
		}
		else{
			if(($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91" )&& typeof(val_imesh.uv) !== 'undefined' && val_imesh.uv !== "V" )
			{
				var count = countEnquirySent();
				if(!count){return false;}    
			}
		}
		S_glusr_id = val_imesh.glid;
		enq.S_glusr_id = S_glusr_id;
		$("#q-new-usr").hide();
		if(isd !== '91' && (val_imesh.mb1 == '' || typeof(val_imesh.mb1) === 'undefined')){
			$("#remain_info").show();
			$("#remain_info").find('#C_S_mobile_F').css('display','block');
			$('#C_S_mobile_F').attr('tabIndex', 145);
			$('#C_S_mobile_F').css({"width": "90%","padding-left": "32px"});
			$("#icon_enq_email").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
			$("#icon_enq_email").css({"left": "9px"});
		}
		else{
			$("#remain_info").hide();            
		}
		if(mobile == '' && phone != '') 
		{
			cefSetProdCompName(enq,'C_Prodname','C_Compname');
			cefSetLocalityName(enq,'C_Localityname','C_CityName','C_StateName');
			$("#CEF_EnqPart,#q-new-usr").show();
			cefEmailSuggester(enq.CEF_S_email);
			setFocusUser();
		}
		else if((($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") && mobile != '' && (full_name == '' || email == '' || city == '')) || ($('#'+enq.CEF_S_cmobile_enq).val() != "+91" && $('#'+enq.CEF_S_cmobile_enq).val() != "91" && email != '' && (full_name == '' || mobile == '')))
		{
			cefSetProdCompName(enq,'C_Prodname','C_Compname');
			cefSetLocalityName(enq,'C_Localityname','C_CityName','C_StateName');
			$("#q-new-usr").hide();
			if(typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && enq.CEF_form_type!="enq_inline" && enq.CEF_form_type!="enq_rhs")
			{
				enq.prd_name_email=1;
				askproductname();
				remainInfoFieldDecider();
			}
			else
			{
				remainInfoFieldDecider();
				$('#prod_name').hide();
				setFocusUser();
			}     		
			$("#CEF_EnqPart").show();
			try
			{
				if((typeof(rData.enq_enquiry_sent)!== 'undefined' && rData.enq_enquiry_sent!== "") && (nxtprevflag==0) && typeof(rData.R_title)!== 'undefined' && rData.R_title!=="" && enq.R_modref_type==2 && (($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") || ($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && $('#C_S_name').val() !== "")))
				{
					cefGetUserInfo();
					processSendEnquiry();
				}else{}
			}catch(e){}
		}
		else
		{
			cefSetProdCompName(enq,'C_Prodname','C_Compname');
			cefSetLocalityName(enq,'C_Localityname','C_CityName','C_StateName');
			if((cef_EMFDownloadHtml != '') && ($('#CEF_EMFHtmlID').html() == ''))
			{
				$('#CEF_EMFHtmlID').html(cef_EMFDownloadHtml);
				$('#CEF_EMFHtmlID').html($('#CEF_EnrichSection').html());
			}
			callGetIsqService();
			$("#CEF_EnqPart").hide();
			htmlDecideForUser(isd,country,country_iso);
			estQtyUnitPreffiled('C_Est_Qty_List');
			if(typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && enq.CEF_form_type!="enq_inline" && enq.CEF_form_type!="enq_rhs")
			{
				$('#productnamediv').show();
				$('#q-second').css("display", "none");
				$(".cenq-bar-line").css({width:"20%" });
				$('#iprd-msg').text('I want to buy');
				setTimeout(function(){
						if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
						$('#C_S_productname').focus();
						}
						}, 500);
			}
			else
			{
				$(".cenq-bar-line").css({width:"20%" });
				$('#productnamediv,#sprod_name').hide();
				if(showFirstEnrich!=1){showFirstEnrichQues();}
				CEF_dynamicISQ();
				$('#q-second').css("display", "block");
				changeBtnColor();
				if(isd=="91")
				{
					if(val_imesh.uv !== "V" && typeof(val_imesh.uv) !== 'undefined')
					{
						$('#enquiryOtp').css({'display':'block','width':'310px'});
						$('.cenq-form-block3').removeClass("mt30");$('.veri-help').show();
						if(nxtprevflag != 1 && otp_generated != 1){otpGenerate();}
						ENQGATrack('ENQ_Otpform_Unverified_User','Onclick');
						imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-open-enrichment.mp'); 
					}
					else
					{
						ENQGATrack('ENQ_Otpform_Verified_User','Onclick');
					}
				}
				setTimeout(function(){
						if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
						$('#C_Est_Qty').focus();
						}
						}, 500);
			}
			try
			{
				if((typeof(rData.enq_enquiry_sent)!== 'undefined' && rData.enq_enquiry_sent!== "") && (nxtprevflag==0) && typeof(rData.R_title)!== 'undefined' && rData.R_title!=="" && enq.R_modref_type==2)
				{
					cefGetUserInfo();
					processSendEnquiry();
				}else{}
			}catch(e){}

		}
		cefIdentifiedInfo();
	} 
	else 
	{
		var user_name='';
		cefSetProdCompName(enq,'C_Prodname','C_Compname');
		cefSetLocalityName(enq,'C_Localityname','C_CityName','C_StateName');
		selectDataListEle('C_country_dropdown',page.country);
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-form-new.mp');
		if((typeof(rData.R_title) == 'undefined' || rData.R_title == "") && (rData.CEF_form_type=="enq_inline" || rData.CEF_form_type=="enq_rhs"))
		{
			var sbmt = false;
			$('#'+enq.CEF_S_mobile).attr("onblur","mobileV('"+enq.CEF_S_mobile+"','"+enq.CEF_S_mobile_errMsg+"')");
			$('#'+enq.CEF_S_email).attr("onblur","emailV('"+enq.CEF_S_email+"','"+enq.CEF_S_email_errMsg+"')");
			$('#'+enq.CEF_EnqProduct).attr("onblur","productV()");
			var mobile_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? enq.CEF_S_mobile : 'C_S_mobile_F';
			var mobile_err_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? enq.CEF_S_mobile_errMsg : 'C_S_mobile_F_errMsg';
			var email_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? 'C_S_email_In' : enq.CEF_S_email;
			var email_err_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? 'C_S_email_In_errMsg' : enq.CEF_S_email_errMsg ;
			if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
			{
				sbmt = productV() & mobileV(mobile_id,mobile_err_id);
				user_name =$('#'+enq.CEF_S_mobile).val();
			}
			else
			{
				sbmt = productV() & emailV(email_id,email_err_id);
				user_name = $('#'+enq.CEF_S_email).val();
			}
			if(sbmt)
			{
				$('#'+enq.CEF_img_process).show();
				$('#b_sub').hide();   
				var nprod_name = $("#"+enq.CEF_EnqProduct).val();
				nprod_name=nprod_name.trim();
				enq.prd_name=nprod_name;
				userDetailsAutoFetch(user_name);      
			}
			else
			{
				$('html').css({overflow:"auto"});
				$('body').css({"overflow-y":"auto","width":"100%"});
			}
		}
		else if(($('#cefChkUser').val() == 'Not Exist') || ($("#cefChkUser").val() == 'Exist'))
		{
			$("#CEF_EnqPart,#remain_info").show();
			loginFieldDecider();
			setFocusUser();
			trackUserInfoStep();
		}
		else
		{
			$("#CEF_EnqPart,#q-new-usr").show();
			cefEmailSuggester(enq.CEF_S_email);
			if(typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && enq.CEF_form_type!="enq_inline" && enq.CEF_form_type!="enq_rhs")
			{
				askproductname();
			}
			else
			{
				setFocuslogin();
				$('#prod_name').hide();
			}
			$("#remain_info").hide();
			loginFieldDecider();
		}
	}
	$("#CEF_NoImg").removeClass("q-don").addClass("q-soff"); 
	var smallBlurImg = display_image || enq.small_image;
	decideFormSize();$(".cenq-bar-line").css({width:"20%" });
	if(display_image || zoom_image || enq.zoom_img || enq.small_image)
	{
		var img = new Image(); var img_width=''; var img_height='';
		img.src = display_image || enq.small_image;
		$('.BlrImg').removeAttr('style'); $("#blackBlr").removeAttr("background"); $('.Eqbg5').css('background','#fff');
		img.onload = function(){
			img_width = (this.width)*2;
			img_height = (this.height)*2;
			$(".BlrImg").css("background-image",'url('+smallBlurImg+')');
			$('.Eqbg5').css('background','#000');
			$("#small_image").attr("src",img.src);
			$('.blrBackgrnd').show();
			$('#small_image').css({"height":img_height+"px","width":img_width+"px"});
		}
		document.getElementById('big_img').src =  zoom_image || enq.zoom_img;
		$("#titleBar").addClass("grad");
		img_form = 1;
	} 
	else if(enq.R_title == "")
	{
		$('#default_icon').show();    
		$('#q-load_img').hide();
		$('.blrBackgrnd').hide();
		$("#titleBar").removeClass("grad");
		img_form = 0;
	}
	else
	{
		$('#default_icon').show();    
		$('#q-load_img').hide();
		$('.blrBackgrnd').hide();
		$("#titleBar").addClass("grad");
		img_form = 0;
	}
	try{
		if(typeof(enq.prev) != "undefined" && typeof(enq.prev) === "function")
		{
			$('#qpre').show();				
		}
		else
		{
			$('#qpre').hide();
		}
		if(typeof(enq.next) != "undefined" && typeof(enq.next) === "function")
		{
			$('#qnext').show();
			$('#view_next').removeClass('doff').addClass('don');
			if(zoom_image.match(/500x500/ig) || enq.zoom_img.match(/500x500/ig))
			{
				var img = new Image();  var img_width=''; var img_height='';
				img.src = display_image || enq.small_image;
				img.onload = function(){
					img_width = (this.width)*2;
					img_height = (this.height)*2;
					$('.BlrImg').removeAttr('style');
					$(".BlrImg").css("background-image",'url('+smallBlurImg+')');
					$('.blrBackgrnd').show();
					$('#small_image').css({"height":img_height+"px","width":img_width+"px"});
				}
			}
			else
			{
				$('.BlrImg').removeAttr('style');
				$(".BlrImg").css("background-image",'url('+smallBlurImg+')');
				$('.blrBackgrnd').show();
				$('#small_image').removeAttr('style');
			}
		}
		else
		{
		$('#qnext').hide();
		$('#view_next').removeClass('don').addClass('doff');	
		}
	}catch(e){}
	try{
	if(typeof(enq.enq_item_price) != "undefined" && enq.enq_item_price != '')
	{
		$('#Enqprice_txt').html( enq.enq_item_price);
		$('#C_ProdPrice').show();
		enq.enq_item_price = enq.enq_item_price.replace(/Approx(.*?)Rs/,'');
		enq.enq_item_price = enq.enq_item_price.trim();
		$('.TIN').html('Rs '+enq.enq_item_price);
	}
	}catch(e){}
	if(typeof(enq.R_title) !== 'undefined' && enq.R_title !== "")
	{
		$('#'+enq.CEF_img_process).hide();
		$('#b_sub').show();
	}
	$("#enquiry,#cefPopup").show();
	$("#CEF_EMFHtmlID").css("display", "none");
	if((typeof(rData.R_title) == 'undefined' || rData.R_title == "") && (rData.CEF_form_type=="enq_inline" || rData.CEF_form_type=="enq_rhs") && (val_imesh.fn == '' || typeof(val_imesh.fn) === 'undefined' || val_imesh.mb1 == '' || typeof(val_imesh.mb1) === 'undefined' || val_imesh.em == '' || typeof(val_imesh.em) === 'undefined' || (($("#"+enq.CEF_S_cmobile_enq).val() == '+91' || $("#"+enq.CEF_S_cmobile_enq).val() == '91') && (val_imesh.ct == '' || typeof(val_imesh.ct) === 'undefined'))))
	{
		$("#CEF_EMFHtmlID").css("display", "none");
	}
	else if(val_imesh == "" || isqAvail == 1 || prodType == 'S' || (typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && enq.CEF_form_type!=="enq_inline" && enq.CEF_form_type!=="enq_rhs"))
	{
		$("#CEF_EMFHtmlID").css("display", "block");
	}
	else
	{	
		$('#enrch-loader').show();
		var waitIsq = setInterval(function(){ 
		if(isqAvail == 1)
		{
			$('#enrch-loader').hide();
			$("#CEF_EMFHtmlID").css("display", "block");
			clearInterval(waitIsq);
		}
		}, 500);
	}
	$("#option_text1").focus();
	if((rData.CEF_form_type=="enq_inline" || rData.CEF_form_type=="enq_rhs") && val_imesh == "")
	{
		$("#enquiry").hide();
		$("#cefPopup").hide();
	}
	if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
		$('#C_Est_Qty').focus();
	}
	changeBtnColor();
}
function changeBtnColor()
{
	if(typeof(enq.enqBtnClr) != "undefined" && enq.enqBtnClr != undefined && enq.enqBtnClr !='')
	{
		$("input[type='button']").css({'background-color':enq.enqBtnClr,'border':'1px solid'+ enq.enqBtnClr});
	}
	else
	{
		$("input[type='button']").css({'background-color':'#45a241','border':'1px solid #45a241'});
	}
}
function CEF_dynamicISQ()
{
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	if((prodType == 'P' || prodType == 'C') && cef_isq_html!='')
	{
		$("#q-second-ISQ").html(cef_isq_html);
		cef_IsqDesign();
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-industry-ques-show.mp');
		ENQGATrack('ENQ_ISQShowEnrich1','Onshow');
	}
	else
	{
		if((prodType == 'P' || prodType == 'C') && cef_EMFDownloadHtml != '')
		{
			$('#CEF_EMFHtmlID').html(cef_EMFDownloadHtml);
			$('#CEF_EMFHtmlID').html($('#CEF_EnrichSection').html());
			showFirstEnrichQues();
			htmlDecideForUser($('#'+enq.CEF_S_cmobile_enq).val(),$('#'+enq.CEF_S_countryname_enq).val(),$('#'+enq.CEF_S_country_iso).val());
			$(".cenq-bar-line").css({width:"50%" });
			cefIdentifiedInfo();
		}
	}
}
function cef_IsqDesign()
{
	var val_imesh = imesh_obj.get();
	var countChk = 0;
	var countRad = 0;
	$("#q-second-ISQ").find('input[type=text],select,input[type=radio],input[type=checkbox]').each(function()
		{
		var type= $(this).attr('type');
		if(typeof(type)!=='undefined' && type=='text')
		{
		if($(this).attr('placeholder')=='Quantity')
		{
		$('#'+$(this).attr('id')).parent().parent().addClass('FlA WdH');
		$('#'+$(this).attr('id')).css({width:"100%",'box-sizing':"border-box",height:'42px'});
		$('#'+$(this).attr('id')).addClass('BrF2');
		}
		}
		else if(typeof(type)==='undefined')
		{
		if($('#'+$(this).attr('id')+' option:selected').text() == "Unit")
		{
		$('#'+$(this).attr('id')).parent().addClass('WdH FlA');
		$('#'+$(this).attr('id')).addClass('Bp1 FlA WdF BrF');
		estQtyUnitPreffiled($(this).attr('id'));
		}
		if($('#'+$(this).attr('id')+' option:selected').text() =="Approximate Order Value")
		{
			if(($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') == '91'))
			{
				$('#'+$(this).attr('id')).addClass('WdF Bp2');
				$('#'+$(this).attr('id')).parent().addClass('WdF FlA');
				$('#'+$(this).attr('id')+' option:first').text("Approximate Order Value (Rs)");
			}
			else
			{
				$('#'+$(this).attr('id')).addClass('WdF');
				$('#'+$(this).attr('id')).parent().addClass('wd70 FlA');
			}
		}
		if($('#'+$(this).attr('id')+' option:selected').text() =="Currency")
		{
			if(($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') !== '91'))
			{
				$('#'+$(this).attr('id')).parent().addClass('Wd30 FlA');
				$('#'+$(this).attr('id')).addClass('WdF Bp3 BrF');
			}
		}
		if($('#'+$(this).attr('id')+' option:selected').text()=="INR" && ($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') == '91'))
		{
			$('#'+$(this).attr('id')).css({display:'none'});
		}
		}
		else if(typeof(type)!=='undefined' && type=='checkbox')
		{
			countChk++;
		}
		else if(typeof(type)!=='undefined' && type=='radio')
		{
			countRad++;
		}
	});
	if((txtchk == 1 || txtrad == 1) && (countChk == 4 || countChk == 6 || countRad == 4 || countRad == 6))
	{
		$('.CEFisqStyle.vat-enq.dsp-inl.chkEnq').prev().css('padding-top','5px');
	}
	else if((txtchk == 1 || txtrad == 1) && (countChk == 3 || countChk == 5 || countRad == 3 || countRad == 5))
	{
		$('.Otr-frst').css('width','295px');
	}
} 
function decideFormSize()
{
   if(typeof(enq.istdw)=='undefined' || enq.istdw=='')
   {
	   if(enq.enq_item_price || enq.locality || enq.state || enq.city || enq.R_title || enq.company)
		{
			enq_largeForm();
		}
		else
		{
			enq_smallForm();
		}
   }
   else
   {
	   if(enq.enq_item_price || enq.locality || enq.state || enq.city || enq.R_title)
		{
			enq_largeForm();
		}
		else
		{
			enq_smallForm();
		}
   }
	
}
function enq_smallForm()
{
	$('#new-usr-line,#titleBar').hide();
	$('#blacklayer').addClass('ht_5');
	$('.verif-box').css('margin-top','60px');
	$('#isq_step,#C_Thank_msg,#enquiryOtp_second').removeClass('bgwh');
	$('#isq_step,#C_Thank_msg,#enquiryOtp_second').addClass('ht_5');
	$('#isq_submit_btn').css('top','293px');
	$('#inline_enq_control').addClass('IPoS');
	$('.cBtn').addClass('TP29');
	$('.container-isq').css('height','345px');
	if($("#new-usr-msg").find("#small_enrich_bar").length==0)
	{$('#new-usr-msg').append('<div id="small_enrich_bar"><p class="cenq-bdrd pbt18"></p><p class="cenq-bar-line"></p></div>');}
	if($("#enrich-bar").find("#small_enrich_bar").length==0)
	{$('#enrich-bar').append('<div id="small_enrich_bar"><p class="cenq-bdrd pbt18"></p><p class="cenq-bar-line"></p></div>');}
	$('.Oapx').css('height','300px');
	$("#industry_ques").attr('style','margin-top:20px;margin-bottom: 30px;');
	$('.enqFormConatiner').css('padding-top','35px');
	$('.cenq-enmtelement2').css('min-height','287px');
	$('.veri-help').css('margin-top','-10px');
	$('#prd_btn').css('margin-top','219px');
}
function enq_largeForm()
{
	$('#inline_enq_control').removeClass('IPoS');
	$('#blacklayer').removeClass('ht_5');
	$('.sml_prgrs_br').html('');
	$('#new-usr-line,#titleBar').show();
	$('.verif-box').css('margin-top','0px');
	$('#isq_step,#C_Thank_msg,#enquiryOtp_second').removeClass('ht_5');
	$('#isq_step,#C_Thank_msg,#enquiryOtp_second').addClass('bgwh');
	$('#isq_step,#C_Thank_msg').css('height','575px');
	$('#isq_submit_btn').css('top','295px');
	$('#enquiryOtp_second').addClass('ht500');
	$('.cBtn').removeClass('TP29');
	$('.Oapx').css('height','335px');
	$('.container-isq').css('height','412px');
	$('.enqFormConatiner').css('padding-top','10px');
	$('.cenq-enmtelement2').css('min-height','315px');
	$('.veri-help').css('margin-top','30px');
	$('#prd_btn').css('margin-top','245px');
}
function cenqPreProd()
{
	resetimage();
	cefImIntFlag = 1;
	nxtprevflag=1;
	enq.prev.apply();
	imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-form-pre.mp');
	ENQGATrack('ENQ_ClickPrevBtn','Onclick');
}
function cenqNxtProd()
{
	resetimage();
	cefImIntFlag = 1;  
	nxtprevflag=1;
	enq.next.apply();
	imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-form-nxt.mp');
	ENQGATrack('ENQ_ClickNextBtn','Onclick'); 
}
function loadImg()
{
	$('#img-spinner').css("display", "none");
	$('#q-load_img').attr("class","q-soff q-image-container");
	$('#q-image_div').attr("class","q-don q-image-container");
}
function cefQtyValidate(evt)
{
	var charCode = (evt.which);
	if(charCode == 118 && evt.ctrlKey === true)
		return true;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}
function checkCCnCN()
{
	setTimeout(function()
	{
		if(!(page.country && page.countryCode)){
			var enq_isIndia= (-(new Date).getTimezoneOffset()/60==5.5) ? 1 : 0;
			if(enq_isIndia){
				page.country = 'India';   
				page.countryCode = 'IN';
			}
	}},2500);
}
function countEnquirySent()
{
	enquiry_count=0;
	changeBtnColor();
	var cookieData = (readCookie('imEqGl')) ? readCookie('imEqGl') : 'undef';
	var val_imesh = imesh_obj.get();
	if ( cookieData != null && cookieData != '' && cookieData != 'undef' ) 
	{
		var cookieDataArray = cookieData.split(",");
		for (i=0; i<cookieDataArray.length; i++) 
		{    var imEqGl_val = cookieDataArray[i];
			if(imEqGl_val!='' && typeof(imEqGl_val) !== 'undefined' && imEqGl_val != null && imEqGl_val !='undef')
			{
				enquiry_count++;
			}
		}
	}
	if(enquiry_count>=1)
	{    
		if(otp_generated != 1){otpGenerate();}
		ENQGATrack('ENQ_OTPShowAfter3Enq','OnShowOTP');
		$(".not-icon").hide();
		$('#skipOtp').css('display','none');
		((val_imesh != "") && (typeof(val_imesh.fn) != 'undefined' && val_imesh.fn != '')) ? $("#aftr4msg").html("Dear "+val_imesh.fn+", You are just one step away from getting the best price") : $("#aftr4msg").html("You are just one step away from getting the best price");
		decideFormSize();
		(typeof(is_FCP) != "undefined" && is_FCP != '' && is_FCP != "1") ? $('.vrf-txt').css('color','#45a241') : $('.vrf-txt').css('color','#00a699');
		$('#enquiry,#enquiryOtp_second,#nwtxt').show();
		$("#cefPopup,#CEF_EnqForm").hide();
		$('.cBtn').removeClass('TP29');
		$('#otpValue').focus(); 
		return false;
	}
	else{
		return true;
	}

}
function ViewNexttrack()
{
	ENQGATrack('ENQ_OnClickViewMore','OnClick'); 
}
function resetimage() 
{
	$('#img-spinner').css("display", "block");  
	$('#q-load_img').attr("class","q-don q-image-container");
	$('#q-image_div').attr("class","q-soff q-image-container");
}
function cefSetProdCompName(data,CEF_Prodname,CEF_Compname)
{
	$("#"+CEF_Prodname).html('');
	$("#"+CEF_Compname).html('');
	if(typeof(enq.is_catalog_enq)!=='undefined' && enq.is_catalog_enq==1)
	{
		if(typeof(data.R_title != undefined) && data.R_title != "")
		{
			$("#"+CEF_Prodname).html(data.R_title);
			$("#"+CEF_Prodname).show();
		}
	}
	else
	{
		if(data.R_data_type == 'company')
		{
			$("#"+CEF_Prodname).html(data.company);
			$("#"+CEF_Compname).html('');
		}else if(typeof(data.R_title != undefined) && data.R_title != "")
		{	
			$("#"+CEF_Prodname).html(data.R_title);
			$("#"+CEF_Prodname).show();
			$("#"+CEF_Compname).html(data.company);
		}
		else if(data.R_title == "" && data.company !='')
		{	
			if($("#"+enq.CEF_EnqProduct).val() != '')
			{
				$("#"+CEF_Prodname).html($("#"+enq.CEF_EnqProduct).val());
				$("#"+CEF_Compname).html(data.company);
			}
			else
			{
				$("#"+CEF_Prodname).hide();
				$("#"+CEF_Compname).html(data.company);
			}
		}
	}
}
function htmlDecideForUser(isdCode,countryName,countryISO)
{
	if((isdCode == '+91' || isdCode == '91') && (countryName == 'India' || countryISO == 'IN'))
	{
		$('#q_fr_units').hide();
		$("#C_Approx_Order_Val").empty();
		$("#C_Approx_Order_Val").html('<option value="">Approximate order value (Rs)</option><option value="100">Upto 1,000</option><option value="200">1,000 to 3,000</option><option value="300">3,000 to 10,000</option><option value="400">10,000 to 20,000</option><option value="500">20,000 to 50,000</option><option value="600">50,000 to 1 Lakh</option><option value="700">1 to 2 Lakh</option><option value="800">2 to 5 Lakh</option><option value="900">5 to 10 Lakh</option><option value="1000">10 to 20 Lakh</option><option value="1100">20 to 50 Lakh</option><option value="1200">50 Lakh to 1 Crore</option><option value="1300">More than 1 Crore</option>');
		$('#C_Approx_Order_Val').css({'background-position':319+'px '+-196+'px' ,'width':'99%'});
		$("#C_india_loc").css("display", "block");
		$('#C_Spec_Loc1_id').val('');
	}
	else
	{
		$("#C_india_loc").css("display", "none");
		$('#q_fr_units').show();
		$("#C_Approx_Order_Val").empty();
		$("#C_Approx_Order_Val").html('<option value="">Approximate order value</option><option value="100">Upto 1000</option><option value="200">1000 to 3000</option><option value="300">3000 to 10000</option><option value="400">10000 to 20000</option><option value="500">20000 to 50000</option><option value="600">50000 to 0.1 Million</option><option value="700">0.1 to 0.2 Million</option><option value="800">0.2 to 0.5 Million</option><option value="900">0.5 to 1 Million</option><option value="1000">1 to 2 Million</option><option value="1100">2 to 5 Million</option><option value="1200">5 to 10 Million</option><option value="1300">More than 10 Million</option>');
		$("#C_foreign_loc").css("display", "block");	
		$("#q_country_span").text("In "+countryName+ " only");   
	}
}
function hideEnquiryForm()
{
	$('#small_image').attr('src', '');$('#big_img').attr('src', '');
	$('#cefPopup').attr("class","q-soff");
	$('#q-load_img').attr("class","q-don q-image-container");
	$('#q-image_div').attr("class","q-soff q-image-container");
	$('#enquiry').hide();
	$("#arrow-down,#arrow-up").css("display","none");
	$("#arrow-hover,#slider_li,#opa_bx").hide();
	$('#CEF_EMFHtmlID').html('');
	$('html').css({overflow:"auto"});
	$('body').removeAttr('style'); 
}
function mobileV(mobile_id,mobile_err_id)
{
	var mobVal = $("#"+mobile_id).val();
	var iso='';
	if($("#"+enq.CEF_S_cmobile_enq).val() == '+91' || $("#"+enq.CEF_S_cmobile_enq).val() == '91' || $("#"+enq.CEF_S_country_iso).val() == 'IN')
	{
		iso='IN';
	}
	var resp = isValid.number(mobVal,iso);
	if(resp.type)
	{
		$("#"+mobile_err_id).html('');
		$('#'+mobile_id).removeClass("invalid").addClass("valid");
		return true;
	}
	else
	{
		$('#C_S_mobile,#C_S_mobile_F').focus();
		$("#"+mobile_err_id).html(resp.error);
		$('#'+mobile_id).removeClass("valid").addClass("invalid");
		return false;

	}
}
function nameV()
{
	$("#C_S_name_errMsg").html('');
	var name = $('#C_S_name').val().trim();
	var resp = isValid.name(name);
	if(resp.type)
	{
		$("#C_S_name_errMsg").html('');
		$('#C_S_name').removeClass("invalid").addClass("valid");
		return true;
	}
	else
	{
		$('#C_S_name').focus();
		$("#C_S_name_errMsg").html(resp.error);
		$('#C_S_name').removeClass("valid").addClass("invalid");
		return false;

	}
}
function emailV(email_id,email_err_id)
{
	var emailVal = $("#"+email_id).val();
	var resp = isValid.email(emailVal);
	if(resp.type)
	{
		$("#"+email_err_id).html('');
		$('#'+email_id).removeClass("invalid").addClass("valid");
		return true;
	}
	else
	{
		$('#C_S_email,#C_S_email_In').focus();
		$("#"+email_err_id).html(resp.error);
		$('#'+email_id).removeClass("valid").addClass("invalid");
		return false;

	}
}

function quantityV(quant_id,quant_err_id,quant_list_id,prntId)
{
	var quantJson = {};  
	var qty_index = $('#'+quant_list_id,prntId).prop('selectedIndex');
	quantJson.key='quantity';
	quantJson.qtyVal = $('#'+quant_list_id,prntId).find(':selected').val();
	quantJson.estQty=$("#"+quant_id).val();
	quantJson.qty_index = qty_index;
	quantJson.checkPrice=check_price;
	var resp = isValid.custom(quantJson);
	if(resp.type)
	{
		
		$("#"+quant_err_id).html('');
		$('#'+quant_id).removeClass("invalid").addClass("valid");
		$('#'+quant_list_id).removeClass("invalid").addClass("valid");
		return true;
	}
	else
	{
		if(resp.errorId == 'quantity') 
		{
			$('#'+quant_id).focus();
			$('#'+quant_id).removeClass("valid").addClass("invalid");
		}
		else if(resp.errorId == 'quantityList')
		{
			$('#'+quant_list_id).focus();
			$('#'+quant_list_id).removeClass("valid").addClass("invalid");
		}
		$("#"+quant_err_id).html(resp.error);
		return false;
	}
}
function aovV(id,aov_id,error_id,curr_id)
{
	var aovJson = {};
	aovJson.key='aov';
	aovJson.currency_index = document.getElementById(curr_id).selectedIndex;
	aovJson.aov = $(id).find("#"+aov_id).val();
	var resp = isValid.custom(aovJson);
	if(resp.type)
	{
		
		$("#"+error_id).html('');
		$('#'+aov_id).removeClass("invalid").addClass("valid");
		$('#'+curr_id).removeClass("invalid").addClass("valid");
		return true;
	}
	else
	{
		if(resp.errorId == 'aov') 
		{
			$('#'+aov_id).focus();
			$('#'+aov_id).removeClass("valid").addClass("invalid");
		}
		else if(resp.errorId == 'Currency')
		{
			$('#'+curr_id).focus();
			$('#'+curr_id).removeClass("valid").addClass("invalid");
		}
		$("#"+error_id).html(resp.error);
		return false;
	}
}
function productV() 
{
	var nprod_name = $("#"+enq.CEF_EnqProduct).val();
	var resp = isValid.product(nprod_name);
	$('#'+enq.CEF_EnqProduct_errMsg).removeClass("invalid").addClass("valid");
	if(resp.type)
	{
		$("#"+enq.CEF_EnqProduct_errMsg).html('');
		$('#'+enq.CEF_EnqProduct_errMsg).removeClass("invalid").addClass("valid");
		return true;
	}
	else
	{
		$("#"+enq.CEF_EnqProduct).focus();
		$("#"+enq.CEF_EnqProduct_errMsg).html(resp.error);
		$("#"+enq.CEF_EnqProduct).removeClass("valid").addClass("invalid");
		if(enq.CEF_form_type == "enq_inline" || enq.CEF_form_type == "enq_rhs")
		{
			$('html').css({overflow:"auto"});
		}
		return false;
	}
}
function  firstStepV(id,qty_err,aov_err,aov_pid)
{
	var q_id = '';
	var q_l_id='';
	var aov_id='';
	var aov_l_id='';
	for(var i=0;i<=4;i++)
	{
		$(id+i).find('input[type=text],select').each(function()
				{
					var type= $(this).attr('type');
					if(typeof(type)!=='undefined' && type=='text')
					{
						if($(this).attr('placeholder').match(/Quantity/ig))
						{
							q_id = $(this).attr('id');
						}
					}
					else if(typeof(type)==='undefined')
					{
						if($('#'+$(this).attr('id'),aov_pid).attr('name') == "Quantity Unit")
						{
							q_l_id = $(this).attr('id');
						}
						if($('#'+$(this).attr('id'),aov_pid).attr('name') == "Approximate Order Value")
						{
							aov_id = $(this).attr('id');
						}
						if($('#'+$(this).attr('id'),aov_pid).attr('name') == "Currency")
						{
							aov_l_id = $(this).attr('id');
						}
					}
				});
	}
	if(q_id!='' && q_l_id!='')
	{
		var valPassQty = quantityV(q_id,qty_err,q_l_id,aov_pid);
		if(!valPassQty){return false;}
	}
	if($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') != '91' && aov_id!='' && aov_l_id!='')
	{
		var valPassQtyAov =  aovV(aov_pid,aov_id,aov_err,aov_l_id);
		if(!valPassQtyAov){return false;}
	}
	return true;	
}
function cefValidate()
{
	if(typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1)
	{
		var sbmit= false;
		sbmit= productV();
		if(sbmit){enq.prd_name=$("#"+enq.CEF_EnqProduct).val();enq.prd_name=enq.prd_name.trim();}else{return false;}
	}
	if($('#C_S_name').val() || $('#C_S_email_In').val() || $('#C_S_city_enq').val() || $('#C_S_mobile_F').val())
	{
		ENQGATrack('ENQ_Submit_ContactDetails','OnClick');
	}
	var sbmt = false;
	var mobile_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? 'C_S_mobile' : 'C_S_mobile_F';
	var mobile_err_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? 'C_S_mobile_errMsg' : 'C_S_mobile_F_errMsg';
	var email_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? 'C_S_email_In' : 'C_S_email';
	var email_err_id = (($('#'+enq.CEF_S_cmobile_enq).val() == "+91") || ($("#"+enq.CEF_S_cmobile_enq).val() == '91')) ? 'C_S_email_In_errMsg': 'C_S_email_errMsg' ;
	var imesh_cook_val = imesh_obj.get();
	if(imesh_cook_val != "") 
	{
		if((typeof(imesh_cook_val.ph1) != 'undefined' && imesh_cook_val.ph1 != '') && (typeof(imesh_cook_val.mb1) === 'undefined' || imesh_cook_val.mb1 == ''))
		{ 
			sbmt = mobileV(mobile_id,mobile_err_id);
			if(sbmt)
			{
				$('#C_ProcessImg').show();
				$('#b_sub').hide();
				cefUserUpdateService();
			}
		}
		else if((typeof(imesh_cook_val.nm) === 'undefined' || imesh_cook_val.nm == '') || (typeof(imesh_cook_val.em) === 'undefined' || imesh_cook_val.em == '') || (typeof(imesh_cook_val.mb1) === 'undefined' || imesh_cook_val.mb1 == '') || (typeof(imesh_cook_val.ct) === 'undefined' || imesh_cook_val.ct == ''))
		{ 
			if($('#C_S_mobile_F').val()!=='')
			{
				if($('#C_S_name').val()!=='')
				{
					sbmt = mobileV(mobile_id,mobile_err_id) & nameV();
					if(sbmt)
					{
						$('#C_ProcessImg').show();
						$('#b_sub').hide();
						cefUserUpdateService();
					}
				}
				else
				{
					nameV();
				}
			}
			else if($('#C_S_email_In').val()!=='')
			{
				if($('#C_S_name').val()!=='')
				{
					sbmt = emailV(email_id,email_err_id) & nameV();
					if(sbmt)
					{
						$('#C_ProcessImg').show();
						$('#b_sub').hide();
						cefUserUpdateService();
					}
				}
				else
				{
					sbmt = emailV(email_id,email_err_id);
					if(sbmt)
					{
						$('#C_ProcessImg').show();
						$('#b_sub').hide();
						cefUserUpdateService();
					}
				}
			}
			else if($('#C_S_name').val()!=='')
			{
				sbmt=nameV();
				if(sbmt)
				{
					$('#C_ProcessImg').show();
					$('#b_sub').hide();
					cefUserUpdateService();
				}
			}
			else if($('#C_S_city_enq').val()!=='')
			{
				if($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && imesh_obj.get().nm == "")
				{
					sbmt=nameV();
					if(sbmt)
					{
						$('#C_ProcessImg').show();
						$('#b_sub').hide();
						cefUserUpdateService();
					}
				}
				else
				{
					$('#C_ProcessImg').show();
					$('#b_sub').hide();
					cefUserUpdateService(); 
				}
			}
			else
			{
				if($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && imesh_obj.get().nm == "")
				{
					sbmt=nameV();
					if(sbmt)
					{
						$('#C_ProcessImg').show();
						$('#b_sub').hide();
						cefUserUpdateService();
					}
				}
				else
				{
					cefShowEnqEMTForm();
					try{
						if((typeof(enq.enq_enquiry_sent)==='undefined' || enq.enq_enquiry_sent== "" || nxtprevflag==1) && (enq.CEF_form_type!=="enq_inline" && enq.CEF_form_type!=="enq_rhs") && (typeof(enq.enq_sent)=='undefined' || enq.enq_sent=='') && (typeof(enq.R_title)!== 'undefined' && enq.R_title != ""))
						{
							processSendEnquiry();
						}
					}catch(e){}
				}
			}
		}
		else
		{ 

		}
	}
	else
	{ 
		var user_name='';
		if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
		{
			sbmt = mobileV(mobile_id,mobile_err_id);
			user_name = $("#"+enq.CEF_S_mobile).val();
		}
		else 
		{
			sbmt = emailV(email_id,email_err_id);
			user_name = $("#"+enq.CEF_S_email).val();
		}
		if(sbmt)
		{
			$('#C_ProcessImg').show();
			$('#b_sub').hide();
			userDetailsAutoFetch(user_name);			      
		}else{}
	}
	try
	{
		if(typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && typeof(enq.prd_name_email)!=='undefined' && enq.prd_name_email==1 && (typeof(enq.enq_sent)=='undefined' || enq.enq_sent=='') && (($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") || ($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && $('#C_S_name').val() !== "")))
		{
			processSendEnquiry();
			enq.sent=1;
		}
		else{}
	}catch(e){}
}

function getQueryStringParsedData(qstr,key) {
	var queryStringDictionary = {};
	var querystring = unescape(qstr);
	if (!querystring) { return {}; }
	var pairs = querystring.split("&");
	for (var i = 0; i < pairs.length; i++) {
		var keyValuePair = pairs[i].split("=");
		queryStringDictionary[keyValuePair[0]] = keyValuePair[1];
	}
	if (queryStringDictionary[key] != 'undefined') {
		return queryStringDictionary[key];
	} else {
		return '';
	}
}
function getparamVal(cookieStr, key)
{
	if( cookieStr > "")	
	{
		var val = "|"+cookieStr+"|";
		var pattern = new RegExp(".*?\\|"+key+"=([^|]*).*|.*");
		return val.replace(pattern, "$1");
	}
	else 
	{
		return "";
	}
}
function onfocusErrMsg(Id) 
{
	$("#"+Id+"_errMsg").html('');
	$("#q-error").html('');
	$("#C_Est_Qty_errMsg").html('');
	$("#C_aov_errMsg").html('');
	$("#"+Id).removeClass("invalid").addClass("valid");
	$("#q-error-qty").html('');
}
function getFirstLastName()
{
	var name_string = $('#C_S_name').val();
	name_string = $.trim(name_string);
	var name_array = name_string.split(/\s+/);
	if(name_array.length == 1) {
		var first_name = name_array[0];
		var last_name = "";
	} 
	else 
	{
		var first_name = name_array.shift();
		var last_name = name_array.join(" ");
	}
	return {'first_name':first_name, 'last_name':last_name};
}
function onSelectCityEnq(event, ui) {
	if (typeof (ui) != "undefined") {
		if (typeof (ui.item.data) != "undefined") {
			this.value = ui.item.value;
			$('#C_S_state_enq').val(ui.item.data.state);
			$('#C_S_city_id').val(ui.item.data.id);
			$('#C_S_state_id').val(ui.item.data.stateid);
		}
	}
}
function onExplicitChangeCityEnq(event, ui) {
	if (typeof (ui) != "undefined") {
		if (typeof (ui.item.data) != "undefined") {
			$('#C_S_state_enq').val(ui.item.data.state);
		}
	}
}
function cefSetFormIDS(enqData)
{
	enq = enqData;
	enq.CEF_form_id = $('#'+enq.CEF_form_id).length > 0 ? enq.CEF_form_id : 'CEF_EnqForm';
	enq.CEF_country_dropdown = $('#'+enq.CEF_form_id+' #'+enq.CEF_country_dropdown).length > 0 ? enq.CEF_country_dropdown :'C_country_dropdown';
	enq.CEF_EnqProduct = $('#'+enq.CEF_form_id+' #'+enq.CEF_EnqProduct).length > 0 ? enq.CEF_EnqProduct :'C_S_product'; 
	enq.CEF_EnqProduct_errMsg = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_description_errMsg).length > 0 ? enq.CEF_S_description_errMsg : 'C_S_product_errMsg';
	enq.CEF_S_cmobile_enq = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_cmobile_enq).length > 0 ? enq.CEF_S_cmobile_enq : 'C_S_cmobile_enq';
	enq.CEF_S_ccode = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_ccode).length > 0 ? enq.CEF_S_ccode : 'C_S_ccode';
	enq.CEF_S_mobile = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_mobile).length > 0 ? enq.CEF_S_mobile : 'C_S_mobile';
	enq.CEF_S_mobile_errMsg = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_mobile_errMsg).length > 0 ? enq.CEF_S_mobile_errMsg : 'C_S_mobile_errMsg';
	enq.CEF_S_email = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_email).length > 0 ? enq.CEF_S_email : 'C_S_email';
	enq.CEF_S_email_errMsg = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_email_errMsg).length > 0 ? enq.CEF_S_email_errMsg : 'C_S_email_errMsg'; 
	enq.CEF_S_organization = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_organization).length > 0 ? enq.CEF_S_organization : 'C_S_organization';
	enq.CEF_S_countryname_enq = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_countryname_enq).length > 0 ? enq.CEF_S_countryname_enq : 'C_S_countryname_enq';
	enq.CEF_S_country_iso = $('#'+enq.CEF_form_id+' #'+enq.CEF_S_country_iso).length > 0 ? enq.CEF_S_country_iso : 'C_S_country_iso';            
	enq.CEF_img_process = $('#'+enq.CEF_form_id+' #'+enq.CEF_img_process).length > 0 ? enq.CEF_img_process : 'C_ProcessImg';
	enq.CEF_chk_usr = $('#'+enq.CEF_form_id+' #'+enq.CEF_chk_usr).length > 0 ? enq.CEF_chk_usr : 'cefChkUser';
	enq.CEF_form_disp_id = $('#'+enq.CEF_form_disp_id).length > 0 ? enq.CEF_form_disp_id : 'CEF_EnqForm';
	if(glmodid=='FCP' || glmodid=='PRODDTL'){enq.CEF_form_type = enq.CEF_form_type.length > 0 ? enq.CEF_form_type : '';}
	enq.CEF_mcat_id = (typeof(enq.enq_mcat_id) != 'undefined' && enq.enq_mcat_id != '') ? enq.enq_mcat_id : (typeof(page.mcatIds) != 'undefined' && page.mcatIds[0] != '' ? page.mcatIds[0] : '');
	enq.CEF_cat_id = (typeof(enq.enq_cat_id) != 'undefined' && enq.enq_cat_id != '') ? enq.enq_cat_id : (typeof(enq.category) != 'undefined' && enq.category != '' ? enq.category : '');
}
function cefCountrySuggester()
{
	var userCountryISO = page.countryCode;
	if(typeof(imesh_obj.get().iso) != 'undefined' && imesh_obj.get().iso != '')
	{
		userCountryISO = imesh_obj.get().iso;
	}
	var sugg_isd = new Suggester({"type":"isd","element":enq.CEF_country_dropdown,"onSelect":cefSelectCountry, fields: "cname,iso,icon_order",displayFields:"cname,value",displaySeparator:'  +','defaultValue':userCountryISO});
}
function cefEmailSuggester(id)
{
	var sugg_domain = new Suggester({"element":id,"match":"fuzzy","onSelect":cefSelectEmail,type: "domain", minStringLengthToFetchSuggestion:0, "url":'',"recentData":false,rowsToDisplay:5});
}
function cefSelectEmail(event,ui)
{
	if (ui.item) {
		this.value = ui.item.value;
	}
	else{}
	ENQGATrack('ENQ_EmailSuggester','AutoSuggest');
}
function cefSelectCountry(event, ob)
{
	var imesh_cook_val = imesh_obj.get();
	$("#"+enq.CEF_S_email_errMsg).html('');
	if(imesh_cook_val != "") 
	{
		if((typeof(imesh_cook_val.ph1) != 'undefined' && imesh_cook_val.ph1 != '') && (typeof(imesh_cook_val.mb1) === 'undefined' || imesh_cook_val.mb1 == '') && (typeof(imesh_cook_val.iso) != 'undefined' || imesh_cook_val.iso != page.countryCode))
		{
			$("#"+enq.CEF_country_dropdown+" dt a span").attr('style','background-position:0px -'+ob.data.icon_order*11+'px');
			$("#"+enq.CEF_country_dropdown+" dt span.value").html('+'+ob.value);
			$('#'+enq.CEF_S_countryname_enq).val(ob.data.cname);
			$('#'+enq.CEF_S_country_iso).val(ob.data.iso);
			$('#'+enq.CEF_S_cmobile_enq).val('+' + ob.value);
			$('#'+enq.CEF_S_ccode).val(ob.value);
			loginFieldDecider();
			setFocuslogin();
		}
	}
	else
	{
		$("#"+enq.CEF_country_dropdown+" dt a span").attr('style','background-position:0px -'+ob.data.icon_order*11+'px');
		$("#"+enq.CEF_country_dropdown+" dt span.value").html('+'+ob.value);
		$('#'+enq.CEF_S_countryname_enq).val(ob.data.cname);
		$('#'+enq.CEF_S_country_iso).val(ob.data.iso);
		$('#'+enq.CEF_S_cmobile_enq).val('+' + ob.value);
		$('#'+enq.CEF_S_ccode).val(ob.value);
		setFocuslogin();
		if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" && enq.CEF_country_dropdown !== 'inline_cntry_drpdwn' && enq.CEF_country_dropdown !== 'ovr_cntry_drpdwn')
		{
			$("#C_S_email").hide();
			$("#C_S_mobile").show();
			$('#C_country_dropdown .value').show();
			$("#icon_enq").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
			$("#icon_enq").removeAttr('style');
		}
		else if($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && enq.CEF_country_dropdown !== 'inline_cntry_drpdwn' && enq.CEF_country_dropdown !== 'ovr_cntry_drpdwn')
		{
			$("#C_S_mobile").hide();
			$("#C_S_email").show();
			$('#C_country_dropdown .value').hide();
			$("#C_S_email").css({"padding-left":"66px","width":"282px"});
			$("#icon_enq").removeClass("cef_bg miconP").addClass("cef_bg eq-email-icon");
			$("#icon_enq").css({"left":"45px","top":"1px"});
		}
		else if(typeof changeFieldForeign !== 'undefined' && (enq.CEF_country_dropdown == 'inline_cntry_drpdwn' || enq.CEF_country_dropdown == 'ovr_cntry_drpdwn'))
		{
			changeFieldForeign();
		}
	}
	var q_sugg_city = new Suggester({
			"element": 'C_S_city_enq',
			"onSelect": onSelectCityEnq,
			"onExplicitChange": onExplicitChangeCityEnq,
			minStringLengthToFetchSuggestion: 1,
			type: "city",
			fields: "state,id,stateid",
			minStringLengthToDisplaySuggestion: 1,
			displaySeparator: " >> ",
			displayFields: "value,state",
			autocompleteClass: "",
			filters: "iso:" + ob.data.iso,
			recentData:"false"
			});
}
function eraseCookieEnq(name) {
	createCookieEnq(name,"undef",-1);
}
function activateEnqConversionTracking(){
	var img1 = document.createElement("img");
	var img2 = document.createElement("img");
	img1.onload = function() { return; };
	img2.onload = function() { return; };
	img1.src = "//www.googleadservices.com/pagead/conversion/1067418746/?value=1.00&label=qPViCN7MqQkQ-oj-_AM&guid=ON&script=0";
	img2.src = "//www.googleadservices.com/pagead/conversion/975765630/?value=1.00&label=RDmqCJq2uAkQ_oCk0QM&guid=ON&script=0";
}
function imInvokeRequestForGaCode( trackScript ){
	//<!--google analytics async code start-->
	var script = trackScript;
	_gaq.push(['_trackPageview', script]);
	//<!--google analytics async code end-->
}
function processSendEnquiry()
{  
	cefGetUserInfo();
	var cef_user_IP = '';
	var lt='';
	var lg='';
	try{
	var user_loc = readCookie('GeoLoc');
	if(typeof(user_loc)!='undefined' && user_loc!='')
	{
		lt= getparamVal(user_loc, "lt");
		lg = getparamVal(user_loc, "lg");
	}
	}catch(e){}
	var isd = $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'');
	enq.enq_sent=1;
	if((typeof(enq.country_iso) != 'undefined' && enq.country_iso != "" && enq.country_iso.length > 2) || (typeof(enq.C_S_country) != 'undefined' && enq.C_S_country != "" && enq.C_S_country == 'Asia/Pacific Region'))
	{
		enq.country_iso = 'IN';
		enq.C_S_country = 'India';
		cef_user_IP = 'India';
	}     
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	var s_email = imesh_obj.get().em ? imesh_obj.get().em : (enq.C_S_email ? enq.C_S_email : enq.C_S_email_In);
	var s_mobile = imesh_obj.get().mb1 ? imesh_obj.get().mb1 : (enq.C_S_mobile ? enq.C_S_mobile : enq.C_S_mobile_F);
	var params_request = {};
	params_request  = {   
		"rfq_s_name": enq.C_S_name,
		"rfq_s_mobile":s_mobile,
		"rfq_s_country_ip":page.countryIp,
		"rfq_sender_id":enq.S_glusr_id,
		"rfq_s_company":enq.C_S_organization,
		"rfq_s_ip_country":cef_user_IP || page.country,
		"rfq_s_country_name":page.country,
		"rfq_S_referrer": enq.query_ref_cur_url,
		"rfq_Send_mail_to_receiver":"defer",
		"rfq_mod_id":enq.modid,
		"rfq_s_city": enq.C_S_city,
		"rfq_s_state_id":enq.C_S_state_id,
		"rfq_s_state":enq.C_S_state,
		"rfq_r_glusr_usr_id":enq.R_glusr_id,
		"rfq_s_city_id":enq.C_S_city_id,
		"rfq_s_last_name":enq.S_last_name,
		"token":"imartenquiryprovider",
		"rfq_s_first_name":enq.S_first_name,
		"rfq_query_ref_text":"",
		"rfq_r_email":"qhhome@indiamart.com",
		"rfq_S_country": enq.C_S_country,
		"rfq_s_ccode":enq.C_S_cmobile,
		"rfq_s_email":s_email,
		"rfq_s_country_iso":enq.C_S_country_iso,
		"rfq_s_username":enq.C_S_name,
		"rfq_modref_id":enq.displayId,
		"rfq_mcat_id":enq.CEF_mcat_id,
		"rfq_IamInterested_id":enq.interestId,
		"rfq_modref_type":enq.R_modref_type,
		"rfq_login_mode":"",
		"rfq_ref_actual_url":"",
		"rfq_current_url":enq.query_ref_cur_url,
		"rfq_ref_url":document.referrer,
		"rfq_search_keyword":"",
		"rfq_cat_id":enq.CEF_cat_id,
		"rfq_from_refer":"search",
		"rfq_s_latitude":lt,
		"rfq_s_longitude":lg
	};
	try{
		if(typeof(enq.sbmtDesc) !== "undefined" && enq.sbmtDesc == "Yes")
		{
			params_request.rfq_desc = enq.prd_name;
			$('#C_Desc_Prod').val(enq.prd_name);
		}
		else if(enq.R_modref_type == 2)
		{
			params_request.rfq_product_name = enq.R_title;
		}
		else if(typeof(enq.prd_name)!=='undefined' && enq.prd_name!=='')
		{
			params_request.rfq_product_name=enq.prd_name;	
		}
	}catch(e){}	
	var custtyp_paid = {1399:0, 1299:-1, 1879:0, 1890:0, 1999:0, 4299:0, 149:-1, 2199:-1, 199:-1, 1199:-1, 1899:0, 3299:0, 699:-1, 1499:-1, 2399:-1, 1869:0, 179:-1, 700:-1, 750:-1 };
	var category_type = 'p';	
	if(typeof(custtyp_paid[enq.R_custtype_weight]) != "undefined" )
	{
		if(custtyp_paid[enq.R_custtype_weight] == 0)
		{
			category_type = "f";
		} else 
		{
			category_type = "p";
		}
	}	
	params_request.category_type = category_type;
	try
	{
		if(typeof(enq.industry_ques)!=='undefined' && enq.industry_ques !==''){
			if(typeof(imjsv) == "object" && typeof(imjsv) !== "undefined" && imjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js'][0] != "undefined")
			{
				params_request.rfq_query_ref_text = enq.query_text+enq.industry_ques+'|'+prodType+'|'+imjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js'][0];
			}
			else
			{
				params_request.rfq_query_ref_text = enq.query_text+enq.industry_ques+'|'+prodType;
			}
		}
		else{
			if(typeof(imjsv) == "object" && typeof(imjsv) !== "undefined" && imjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js'][0] != "undefined")
			{
				params_request.rfq_query_ref_text = enq.query_text+'|'+prodType+'|'+imjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js'][0];
			}
			else
			{
				params_request.rfq_query_ref_text = enq.query_text+'|'+prodType;
			}
		}
	}catch(e){}
	try
	{
		if(typeof(enq.traffic_source)!=='undefined' && enq.traffic_source!=='')
		{
			if(typeof(imjsv) == "object" && typeof(imjsv) !== "undefined" && imjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js'][0] != "undefined")
			{
				params_request.rfq_query_ref_text=enq.traffic_source+'|'+params_request.rfq_query_ref_text+'|'+prodType+'|'+imjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js'][0];
			}
			else
			{
				params_request.rfq_query_ref_text=enq.traffic_source+'|'+params_request.rfq_query_ref_text+'|'+prodType;
			}
			var val_adcamp= readCookie('adcamp');
			var adcmp_name = getparamVal(val_adcamp, "adcmp") || '';
			params_request.traffic_source_name = adcmp_name;
		}
		else{}
	}catch(e){}
	var imesh_cookie_val = imesh_obj.get();
	if(typeof(params_request.rfq_sender_id) === 'undefined' || params_request.rfq_sender_id == '')
	{
		params_request.rfq_sender_id = imesh_cookie_val.glid;
	}	
	var loginMode =  usrLoginMode();
	params_request.rfq_login_mode = loginMode;	
	var cookie_site_entry_page = readCookie('site-entry-page');
	var entrypagecookie = (cookie_site_entry_page) ? cookie_site_entry_page.substr(0, 500) : '';
	params_request.rfq_ref_actual_url = cookie_site_entry_page;	
	params_request.rfq_search_keyword = enq.ss;	
	var imEqGlCookie_value = readCookie('imEqGl');
	var imEqGlCookie_flag = (!imEqGlCookie_value) ? 1 : 0;
	var in_force_destination = '';
	if(imEqGlCookie_flag){
		in_force_destination = 2;
	}	
	if(params_request.rfq_sender_id!='')
	{	
		rfqfunc.getResponse('sendBlEnq',params_request,function(response){
					cefEnqBtnDisable();
					var s_mobile = imesh_obj.get().mb1 ? imesh_obj.get().mb1 : (enq.C_S_mobile ? enq.C_S_mobile : enq.C_S_mobile_F);
					response.S_mobile = s_mobile;
					response.modid = enq.modid;
					response.country= enq.C_S_country;
					if(response.queryid != -2 && response.queryid != '')
					{
					$('#queryID').val(response.queryid);
					$('#query_type').val(response.query_destination);
					$('#modid').val(response.modid);
					if((typeof(enq.enq_enquiry_sent)==='undefined' || enq.enq_enquiry_sent== "" || nxtprevflag==1) && (enq.CEF_form_type!=="enq_inline" && enq.CEF_form_type!=="enq_rhs") && (typeof(enq.R_title)!== 'undefined' && enq.R_title != "") && loginMode!=3 && $('#remain_info').css('display') == 'none' && cef_isq_html=='')
					{
					cefCallFirstEMTFormService();
					}
				}
				else
				{
					$('#queryID').val('');
					imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-senderid-blank.mp');
					cefServiceError(response,params_request);
				}
			},function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-enquiry-error.mp');});} 
else
{
	imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-sender-id-blank.mp');
}
}
function usrLoginMode()
{
	var usr_login_mode=0;
	if(typeof(enq.userStatus) != 'undefined' && enq.userStatus == 1)
	{
		usr_login_mode=1;
		ENQGATrack('ENQ_Sent_LoggedIn','OnClick');
	}
	else if(typeof(enq.userStatus) != 'undefined' && enq.userStatus == 2)
	{
		usr_login_mode=2;
		ENQGATrack('ENQ_Sent_Identified','OnClick');
	}
	else if(typeof(enq.userStatus) != 'undefined' && enq.userStatus == 3)
	{
		usr_login_mode=3;
		ENQGATrack('ENQ_Sent_Unidentified_New','OnClick');
	}
	else if(typeof(enq.userStatus) != 'undefined' && enq.userStatus == 4)
	{
		usr_login_mode=4;
		ENQGATrack('ENQ_Sent_Unidentified_Existing','OnClick');
	}
	return usr_login_mode;
}
function userDetailsAutoFetch(user_name)
{
	var isd_code = $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'');
	var cefCountryName = $('#'+enq.CEF_S_countryname_enq).val();
	var cefCountryISO = $('#'+enq.CEF_S_country_iso).val();	
	var v4iilex_val= readCookie('v4iilex');
	var usrName = user_name;
	var params_request = {  
		'user_name':usrName,
		'country_iso':cefCountryISO,
		'identified':1,
		'modid':glmodid,
		'token':'imobile@15061981',
		'format':'JSON',
		'cu':1,
		'original_referer':window.location.href,
		'updated_using':'Enquiry Form on '+glmodid
	};
	if(otp_status == 1 && v4iilex_val == "")
	{
		params_request.auto_login =1;
		params_request.av = false;
	} 
	if(usrupdate == 1 && v4iilex_val !== "" && otp_status == 0)
	{
		params_request.auto_login = 1;
		params_request.av = false;
	}
	rfqfunc.getResponse('userLogin',params_request,userLoginSuccess,function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-userlogin-service-error.mp');});
} 
function userLoginSuccess(jsonResult)
{
	if(jsonResult != undefined && (jsonResult["code"] == '200' || jsonResult["access"] != 0))
	{
	login_response=1;
	$("#"+enq.CEF_S_mobile_errMsg).html('');
	var resultSet = jsonResult.DataCookie;
	var v4iilFlag = 0;
	var imeshVisrFlag = 0;
	if((jsonResult.LoginCookie !=undefined) && (jsonResult.LoginCookie !=''))
	{
	v4iilFlag=1;
	var cookie_data_string = '';
	var login_cookie = jsonResult.LoginCookie;
	for(var key1 in login_cookie)
	{
		cookie_data_string += key1+'='+login_cookie[key1]+'|';
	}
	createCookieEnq('v4iilex',escape(cookie_data_string),'180');
	createCookieEnq('IsGlMember',1,'730');
	}			  
	if((resultSet != undefined) && (resultSet !=''))
	{
		imeshVisrFlag = 1;
		imesh_obj.set(resultSet);
		imeshSet = 1;
	}
	if(v4iilFlag == 1 && imeshVisrFlag == 1)
	{
		if(typeof(enq.R_title) === 'undefined' || enq.R_title == "")
		{
			enq.other_form = 1;
		}
		enq.userStatus = 3;
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-newuser.mp');
	}
	else if(v4iilFlag == 0 && imeshVisrFlag == 1)
	{  
		if(typeof(enq.R_title) === 'undefined' || enq.R_title == "")
		{
			enq.other_form = 1;
		}
		enq.userStatus = 4;
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-existuser-uniden.mp');
	}
	if(glmodid!='FCP' && glmodid!='PRODDTL')
	{
		page.Identified();	
	}
	var name = '';
	if(typeof(resultSet.fn) != 'undefined' && resultSet.fn != null  && resultSet.fn != 'null'  && resultSet.fn != '')
	{
		name = typeof(resultSet.ln) === "undefined" || resultSet.ln === null  ? resultSet.fn : resultSet.fn+' '+resultSet.ln ;
	}						
	typeof(resultSet.fn) === 'undefined' || resultSet.fn === null || resultSet.fn === 'null' ? $('#C_S_name').val('') : $('#C_S_name').val(name);
	if(resultSet.phcc == '91'){
		typeof(resultSet.em) === 'undefined' || resultSet.em === null || resultSet.em === 'null' ? $('#C_S_email_In').val('') : $('#C_S_email_In').val(resultSet.em);
	}
	if(resultSet.phcc != '91'){
		typeof(resultSet.mb1) === 'undefined' || resultSet.mb1 === null || resultSet.mb1 === 'null' ? $('#C_S_mobile_F').val('') : $('#C_S_mobile_F').val(resultSet.mb1);	
	}
	typeof(resultSet.co) === 'undefined' || resultSet.co === null ? $('#'+enq.CEF_S_organization).val('') : $('#'+enq.CEF_S_organization).val(resultSet.co);					
	typeof(resultSet.cn) === 'undefined' || resultSet.cn === null ? $('#'+enq.CEF_S_countryname_enq).val() : $('#'+enq.CEF_S_countryname_enq).val(resultSet.cn);					
	typeof(resultSet.ct) === 'undefined' || resultSet.ct === null ? $('#C_S_city_enq').val('') : $('#C_S_city_enq').val(resultSet.ct);
	typeof(resultSet.ctid) === 'undefined' || resultSet.ctid === null ? $('#C_S_city_id').val('') : $('#C_S_city_id').val(resultSet.ctid);						
	typeof(resultSet.stid) === 'undefined' || resultSet.stid === null ? $('#C_S_state_id').val('') : $('#C_S_state_id').val(resultSet.stid);
	if (typeof(resultSet.mb1) != 'undefined' && (/\d+?/ig).test(resultSet.mb1))
	{
		if(resultSet.mb1.match(/\-/))
		{
			var ccode_mobile = resultSet.mb1.split(/-/);
			var S_mob = ccode_mobile.pop();
			var S_country_code = ccode_mobile.join("-");
			S_country_code = S_country_code.replace(/[^\w-]/ig, '');
			$('#'+enq.CEF_S_cmobile_enq).val('+'+S_country_code);
			$('#'+enq.CEF_S_ccode).val(S_country_code);
		}
	}
	if($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') !== resultSet.phcc)
	{
		$('#'+enq.CEF_S_cmobile_enq).val('+'+resultSet.phcc);
		$('#'+enq.CEF_S_country_iso).val(resultSet.iso);
		$('#'+enq.CEF_S_ccode).val(resultSet.phcc);
	}
	typeof(resultSet.st) === 'undefined' || resultSet.st === null ? $('#C_S_state_enq').val('') : $('#C_S_state_enq').val(resultSet.st);
	enq.user_glid = resultSet.glid;
	enq.S_glusr_id = enq.user_glid;
	enq.imurl = typeof(resultSet.imurl) === 'undefined' || resultSet.imurl === null ? '' : resultSet.imurl;
	enq.utyp = typeof(resultSet.utyp) === 'undefined' || resultSet.utyp === null ? '' : resultSet.utyp;                                        
	if((usrupdate == 0) && ((((otp_status == 0) && $('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") && ($('#C_S_email_In').val() == '' || $.trim(name).length == 0 || $('#C_S_city_enq').val() == '' ))|| (($('#'+enq.CEF_S_cmobile_enq).val() != "+91" && $('#'+enq.CEF_S_cmobile_enq).val() != "91") && ($.trim(name).length == 0  ||  $('#C_S_mobile_F').val() == ''))))
	{
		$('#new-usr-msg').text('Contact Information');
		$('#enquiry,#cefPopup,#CEF_EnqPart,#remain_info').show();
		$('#q-new-usr').hide();decideFormSize();
		$('#C_S_name').val()=='' ? $('#C_S_name_div').css('display','block') : $('#C_S_name_div').css('display','none');
		($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") && $('#C_S_city_enq').val()=='' ? $('#C_S_city_enq_div').css('display','block') : $('#C_S_city_enq_div').css('display','none');
		if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
		{

			$('#remain_info').show();
			if($('#C_S_email_In').val() == '')
			{
				$('#C_S_email_mobile_div').css('display','block');
				$('#remain_info').find('#C_S_email_In').css('display','block');
				cefEmailSuggester('C_S_email_In');
			}
			else{
				$('#C_S_email_mobile_div').css('display','none');
			}
			$("#icon_enq").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
			$("#icon_enq").css({"left":"98px","top":"10px"});

		}
		else if($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" || resultSet.mb1 == "")
		{
			$('#remain_info').show();
			if($('#C_S_mobile_F').val() == ''){
				$('#C_S_email_mobile_div').css('display','block');
				$('#remain_info').find('#C_S_mobile_F').css('display','block');
			}
			else{
				$('#C_S_email_mobile_div').css('display','none');
			}
			$('#C_S_mobile_F').attr('tabIndex', 145);
			$('#C_S_mobile_F').css({"width": "90%","padding-left": "32px"});
			$("#icon_enq_email").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
			$("#icon_enq_email").css({"left": "9px"});
		}
		try
		{
			if(($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") || ($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && $('#C_S_name').val() !== "") && (typeof(enq.enq_sent)=='undefined' || enq.enq_sent==''))
			{
				cefGetUserInfo();
				processSendEnquiry(); 
			}else{}
		}catch(e){}
		$('#prod_name').hide();
		setFocusUser();
		$('#'+enq.CEF_img_process).hide();
		$('#b_sub').show();
		$('#'+enq.CEF_chk_usr).val('Exist');
		trackUserInfoStep();
	}
	else
	{   
		$('#'+enq.CEF_chk_usr).val('');
		if(otp_status == 0 && (typeof(enq.enq_sent)=='undefined' || enq.enq_sent==''))
		{
			cefShowEnqEMTForm();
			processSendEnquiry();
		}
	}
	$(".q-errorMsg >p").html('');
	}
	else
	{
		if(jsonResult != undefined && jsonResult["code"] == '204' && jsonResult["access"] == 0 && jsonResult["message"].match(/ISO MisMatch/ig))
		{
			$("#"+enq.CEF_S_email_errMsg).html('Please select the correct country.');
		}
		else
		{       
			$("#"+enq.CEF_S_mobile_errMsg).html('Some error occurred. Please try after some time.');
		}
		$('html').css({overflow:"auto"});
		$('body').css({"overflow-y":"auto","width":"100%"});
		$('#C_S_name').val("");
		$('#'+enq.CEF_S_email).val("");
		$('#'+enq.CEF_S_organization).val("");
		$('#'+enq.CEF_S_countryname_enq).val();
		$('#C_S_city_enq').val("");
		$('#'+enq.CEF_S_cmobile_enq).val();
		$('#C_S_state_enq').val("");
		$('#'+enq.CEF_S_country_iso).val();	  
		$('#'+enq.CEF_img_process).hide();
		$('#b_sub').show();
		$('#'+enq.CEF_chk_usr).val('Not Exist');
		cefServiceError(jsonResult,params_request);		  
	}
}
function setAsEnqSent ( value ) {
	var cookieData = (readCookie('imEqGl')) ? readCookie('imEqGl') : '';
	var cookieDataArray = new Array();
	var cookieDataArrayNew = new Array();
	var cookieDataStr = '';
	if ( cookieData ) {
		cookieDataArray = cookieData.split(",");
		if ( cookieDataArray[0] == 'undef' ) {
			cookieDataArray.pop();
		} else if ( cookieDataArray.length >= 30 ) {
			cookieDataArray.pop();
		}
		cookieDataArray.unshift( value );
		cookieDataStr = cookieDataArray.toString();
	} else {
		cookieDataStr = value;
	}    
	createCookieEnq('imEqGl',cookieDataStr,1);
}
function createCookieEnq(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	if(typeof(enq.istdw)!='undefined' && enq.istdw!='' && enq.istdw.toLowerCase()=='yes' )
	{
		var dom = document.location.hostname;
		document.cookie = name+"="+value+expires+"; domain="+dom+";path=/";
	}
	else
	{
		document.cookie = name+"="+value+expires+"; domain=.indiamart.com;path=/";
	}
}
if ( readCookie('imEqGl') == null ) {
	createCookieEnq('imEqGl','undef',1);
}
function sendSecFormEnq()
{   
	var val_imesh= readCookie('ImeshVisitor');
	var coun_iso = getparamVal(val_imesh, "iso") || '';
	var uv_val = getparamVal(val_imesh, "uv") || '';
	showSecEnrichStep();
	if(typeof(enq.R_title) != 'undefined' && enq.R_title != "")
	{  
		if($("#queryID").val() != '')
		{
			cefCallFirstEMTFormService();
		}
	}
	else
	{ 
		if($("#queryID").val() == '')
		{
			var cefQueryFlag = 0;
			cefGetUserValues(cefQueryFlag,cefCallFirstEMTFormService);
		}
		else
		{
			cefCallFirstEMTFormService();
		}
	}
	checkUserInfo();
}
function showSecEnrichStep()
{
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	var val_imesh= readCookie('ImeshVisitor');
	var uv_val = getparamVal(val_imesh, "uv") || '';
	if($('#inputTab').html() == '' || $('#inputTab').html()==null)
	{
		$('#inputTab').append(industry_inputtabhtml);
	}
	if(industry_questions_found==1 && industry_inputtabhtml !== "" && industry_inputtabhtml!==null)
	{
		$('#cefPopup,#q-enrichment_form_start').hide();
		$('#enquiry,#isq_step').show();$('.cBtn').removeClass('TP29');
		if(typeof(enq.sbmtDesc) == "undefined")
		{ 
			$('#CEF_Enrich_Forsecond').find('#desc_box').html(''); 
		}
		$('#dttxtarea').removeClass('cenq-form-block2');
		$('#C_Desc_Prod').attr('placeholder','Enter additional details if any ex. good quality led lights with 2 years warranty and easy installation.');
		if(typeof(prod_serv) != 'undefined' && prod_serv == 'P')
		{
			if(enq.R_title.length <= 65)
			{
				$('#enrich-msg-isq').text('We can help you buy '+enq.R_title);
			}
		}
		if(typeof(prod_serv) != 'undefined' && prod_serv == 'S')
		{
			if(enq.R_title.length <= 60)
			{
				$('#enrich-msg-isq').text('We can help you reach '+enq.R_title+' providers');
			}
			else
			{
				$('#enrich-msg-isq').text('We can help you reach service providers');
			}
		}
		$('#option_text1.txtfcs').focus();
		$('#CEF_IdentifiedInfo').hide();
		$(".cenq-bar-line").css({width:"60%" });
		$('#blacklayer').css('width','890px');
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-industry-ques-show.mp');
	}
	else
	{
		if(typeof(enq.sbmtDesc) == "undefined" && (prodType == 'P' || prodType == 'C'))
		{
			standaloneDescStep();
		}
		else
		{
			if((uv_val == "V" && typeof(uv_val) !== 'undefined') || ($("#"+enq.CEF_S_cmobile_enq).val() !== '+91' && $("#"+enq.CEF_S_cmobile_enq).val() !== '91'))
			{
				showEnqLastStep();
			}
			else
			{
				$('#enrich_loader').show();
				$('#CEF_EMFBtn').hide();
				var myvar = setInterval(function(){ 
						if(otp_failure == 1 || verified == 1 || $('#otpValue').val() == '')
						{
							showEnqLastStep();
							$('#enrich_loader').hide();
							$('#CEF_EMFBtn').show();
							clearInterval(myvar);
						}
						}, 1000);
			}
		}
	}
}
function fillLaterTrack()
{
	ENQGATrack('ENQ_FillItLater','OnClick');
}
function standaloneDescStep()
{
	$('#CEF_Enrich_Forsecond').show();
	$("#CEF_IdentifiedInfo,#q-second").hide();
	if(typeof(enq.sbmtDesc) == "undefined")
	{
		$('#C_Desc_Prod').val('');
	}
	if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){$('#C_Desc_Prod').focus();}
	$(".cenq-bar-line").css({width:"80%" });
	$('#C_Desc_Prod').addClass('DesBxH165');
	$('#enrich-msg').text('Get more relevant suppliers');
	$('#C_Desc_Prod').attr('placeholder','Enter detailed specifications if any like size, color, type, material, pattern, variant, model, packaging details.'+"\n"+'Ex. 5W led lights with 2 years warranty for indoor lighting.');
	cefIdentifiedInfo();
}
function cefCallFirstEMTFormService()
{
	var val_imesh= readCookie('ImeshVisitor');
	var coun_iso = getparamVal(val_imesh, "iso") || '';
	var apprx_order_value = '';      
	var estimate_qty = '';
	if ($('#C_Est_Qty_List').val() !== '' && $('#C_Est_Qty').val() !== '')
	{
		estimate_qty = $('#C_Est_Qty').val() + " " + $('#C_Est_Qty_List').val(); 
	}
	var apprx_order_value = '';      
	if (($("#C_Approx_Order_Val").val() != '') && ($('input:radio[name=C_Approx_Currency]:checked').val() == '1') && $('#q_fr_units').css('display') == 'none')
	{
		apprx_order_value = $("#C_Approx_Order_Val option:selected").text() + " INR"; 
	}
	else if (($("#C_Approx_Order_Val").val() != '') && ($('#CEF_Select_Currency').val() != '' && $('#q_fr_units').css('display') == 'block'))
	{
		apprx_order_value = $("#C_Approx_Order_Val option:selected").text() + " "+$('#CEF_Select_Currency').val();
	}
	var params_request = {  
		'rfq_id':$('#queryID').val(),
		'rfq_order_value':apprx_order_value,
		'rfq_quantity':estimate_qty,
		'rfq_queryDestination':$('#query_type').val(),
		'rfq_mod_id':enq.modid,
		'rfq_r_glusr_usr_id':enq.R_glusr_id,
		'token':'imartenquiryprovider'
	};
	setHiddenParameter(params_request);
	if($('#C_Desc_Prod').val() != "")
	{
		params_request.rfq_desc = $('#C_Desc_Prod').val();
	}
	if(params_request.rfq_id!='' && (params_request.rfq_quantity !="" || params_request.rfq_order_value!="" || (params_request.rfq_desc !="" && params_request.rfq_desc != undefined)))
	{
		rfqfunc.getResponse('sendBlEnq',params_request,function(response){},function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-enrich-error.mp');});
	}
}
function setHiddenParameter(secondFormValues)
{
	$('#CEF_Enrich_Desc').val(secondFormValues.rfq_desc);
	$('#estimate_quantity').val(secondFormValues.rfq_quantity);
	$('#approx_val').val(secondFormValues.rfq_order_value);
}
function sendThirdFormEnq()
{
	var val_imesh= readCookie('ImeshVisitor');
	var uv_val = getparamVal(val_imesh, "uv") || '';
	if($('#C_Desc_Prod').val())
	{
		document.getElementById('C_Desc_Prod').value = document.getElementById('C_Desc_Prod').value.trim();
		if(document.getElementById('C_Desc_Prod').value.length > 2000) {
			alert("Describe product application/ usage should not be more than 2000 characters.");
			if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){$('#C_Desc_Prod').focus();}
			return false;
		} 
		ENQGATrack('ENQ_Submit_Second_EnrichForm','OnClick');
	}
	showEnqLastStep();
	var params_request = {  
		'rfq_id':$('#queryID').val(),
		'rfq_order_value':$('#approx_val').val(),
		'rfq_desc':$('#C_Desc_Prod').val(),
		'rfq_quantity':$('#estimate_quantity').val(),
		'rfq_queryDestination':$('#query_type').val(),
		'rfq_currency_other':$('#req_currency_other1').val(),
		'rfq_mod_id':enq.modid,
		'rfq_r_glusr_usr_id':enq.R_glusr_id,
		'token':'imartenquiryprovider'
	};
	if(params_request.rfq_id!='' && params_request.rfq_desc !='')
	{
		rfqfunc.getResponse('sendBlEnq',params_request,function(response){},function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-enrich-error.mp');});
	} 
}
function showEnqLastStep()
{
	var val_imesh= readCookie('ImeshVisitor');
	var uv_val = getparamVal(val_imesh, "uv") || ''; 
	var fnUsr = getparamVal(val_imesh, "fn") || ''; 
	$('.cenq-bar-line').hide();   
	$('#otpValue_errMsg').html('');
	$('#bar-line,#new-usr-msg,#bar-line-enrich,#enrich-msg,#cefPopup,#CEF_IdentifiedInfo').hide();
	if((($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") && ($('#C_S_email_In').val() == '' || $.trim($('#C_S_name').val()).length == 0 || $('#C_S_city_enq').val() == '' )) || (($('#'+enq.CEF_S_cmobile_enq).val() != "+91" && $('#'+enq.CEF_S_cmobile_enq).val() != "91") && ($.trim($('#C_S_name').val()).length == 0  ||  $('#C_S_mobile_F').val() == '')))
	{
		enq.againUIS = true;
		$("#isq_step,#prod_name,#default_icon").hide();
		$('#enquiry,#cefPopup,#CEF_EnqPart,#remain_info,#new-usr-msg,#bar-line,#usrLst').show();
		$('.cenq-bar-line').show();  
		$('#q-image_div').attr("class","q-soff q-image-container");
		remainInfoFieldDecider(); decideFormSize();
	}
	else if(uv_val !== "V" && typeof(uv_val) !== 'undefined' && ($("#"+enq.CEF_S_cmobile_enq).val() == '+91' || $("#"+enq.CEF_S_cmobile_enq).val() == '91'))
	{
		fnUsr != '' && fnUsr != "" ? $("#aftr4msg").html("<span class='not-icon'></span>Dear "+fnUsr+", Verify your mobile number to get quick response for your enquiry") : $("#aftr4msg").html("Verify your mobile number to get quick response for your enquiry");
		$('#C_Thank_msg,#CEF_Enrich_Forsecond,#nwtxt').hide();
		$('#enquiryOtp').html('');
		$('#enquiryOtp_second').show();
		$('.cBtn').removeClass('TP29');
		$('#otpValue').focus();
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-open.mp');
	}
	else
	{
		if((glmodid == 'MDC' ||glmodid == 'FCP') && (enq.CEF_form_type=="enq_inline" || enq.CEF_form_type=="enq_rhs") && (typeof(enq.CEF_enrichFormAction) != "undefined") && (typeof(enq.CEF_enrichFormAction) === "function") && (uv_val == "V" || ($("#"+enq.CEF_S_cmobile_enq).val() !== '+91' && $("#"+enq.CEF_S_cmobile_enq).val() !== '91')))
		{
			enq.CEF_enrichFormAction.apply();				
		}
		else
		{
			$("#CEF_EMFHtmlID,#CEF_Enrich_Forsecond").hide();
			$("#CEF_EnqPart,#C_Thank_msg").show();
			hidePayX();
			if($('#enquiry').css('display') == 'block')
			{
				ENQGATrack('ENQ_ShowThankyouStep','OnShowEnrichment');
				if($('#amazonStrip').css('display') == 'block')
				{
					ENQGATrack('ENQ-Amazon-Ad-Thankyou','ViewPort'); 
				} 
			}else{}
		}
	}
}   
function hidePayX()
{
	if($("#"+enq.CEF_S_cmobile_enq).val() !== '+91' && $("#"+enq.CEF_S_cmobile_enq).val() !== '91' || (enq.CEF_cat_id !=='' && enq.CEF_cat_id !== undefined && enq.CEF_mcat_id !=='' && enq.CEF_mcat_id != undefined && enq.CEF_cat_id == "750"))
	{
		$('#enqPayX').hide();
		$('.Tox_wr').css({bottom:'0px'});
		$("#Bg-thnk").css({'padding-top':'80px'});
	}
	if(enq.amazon == true)
	{
		$("#Bg-thnk").css({'padding-top':'15px'});
	}
}
function enq_City_Sugg(obj)
{
	var Id  = $(obj).attr('id');
	var sugg_city_1 = new Suggester({"element":Id,"onSelect":enq_city_enrich,"onExplicitChange":enq_onExplicitChangeCity_enrich,"type":"city",fields: "std,state,id,stateid", "minStringLengthToDisplaySuggestion":1,"autocompleteClass":"",displayFields:"value,state",displaySeparator:" >> ",filters:"iso:IN","recentData":false});
}
function enq_city_enrich(event, ui) 
{
	this.value = ui.item.value;
	var cityid = this.id;
	document.getElementById(cityid+"_id").value=ui.item.data.id;
}
function enq_onExplicitChangeCity_enrich(event, ui) {
	if (ui.item) {
		this.value = ui.item.value;
	}
	else{}
}
function cefEMFormvalidation()
{
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	if((prodType == 'P' || prodType == 'C') && industry_questions_found==1)
	{
		var sbmt =  firstStepV("#isqQues",'C_Est_Qty_errMsg','C_aov_errMsg','#q-second-ISQ');
		if(!sbmt){return false;}
		if(cef_only3isq ==1)
		{
			if(typeof(enq.sbmtDesc) !== "undefined" && enq.sbmtDesc == "Yes")
			{
				showEnqLastStep();
			}
			else
			{
				standaloneDescStep();
			}
		}
		else
		{
			showSecEnrichStep();
			ENQGATrack('ENQ_ISQShowEnrich2','Onshow');
		}
		try{
			if((typeof(enq.enq_enquiry_sent)==='undefined' || enq.enq_enquiry_sent== "" || nxtprevflag==1) && (enq.CEF_form_type!=="enq_inline" && enq.CEF_form_type!=="enq_rhs") && (typeof(enq.enq_sent)=='undefined' || enq.enq_sent=='') &&(typeof(enq.R_title)!== 'undefined' && enq.R_title != ""))
			{
				processSendEnquiry();
			}
		}catch(e){}
		var set_timer = setInterval(function(){if($('#queryID').val()!=''){if(cef_isq_html!=''){industry_ques_response('q-second-ISQ');}clearInterval(set_timer);}},500);
	}
	else
	{
		var qty_index=document.getElementById('C_Est_Qty_List').selectedIndex;
		var qty_val=document.getElementById('C_Est_Qty_List').options[qty_index].value;
		var est_qty = $("#C_Est_Qty").val();
		est_qty = est_qty.replace(/\s/g, "");
		var currency_index=document.getElementById('CEF_Select_Currency').selectedIndex;
		var currency_val=document.getElementById('CEF_Select_Currency').options[currency_index].value;
		$("#CEF_Select_Currency_errMsg,#C_Est_Qty_errMsg,#C_Approx_Order_Val_errMsg,#C_Est_Qty_List_errMsg").html('');
		$("#C_Est_Qty_List,#C_Est_Qty,#CEF_Select_Currency,#C_Approx_Order_Val").removeClass("invalid");
		if(est_qty != '' && qty_index==0)
		{
			$("#C_Est_Qty_List").focus();
			$("#C_Est_Qty_List_errMsg").html('Please select unit of quantity.');
			$("#C_Est_Qty_List").addClass("invalid"); 
			return false;
		}
		if(((qty_val!='Other' && est_qty =='' && qty_index!=0) || (qty_val=='Other' && est_qty =='')) && check_price!=1)
		{
			$("#C_Est_Qty").focus();
			$("#C_Est_Qty_errMsg").html('Please provide estimated quantity.');
			$("#C_Est_Qty").addClass("invalid");
			return false;
		}
		var val_imesh= readCookie('ImeshVisitor');
		var coun_iso = getparamVal(val_imesh, "iso") || '';
		if(($("#C_Approx_Order_Val").val() != '') && ((currency_index==0) && ($('#q_fr_units').css('display') == 'block')))
		{
			$("#CEF_Select_Currency").focus();
			$("#CEF_Select_Currency_errMsg").html('Please select currency.');
			$("#CEF_Select_Currency").addClass("invalid");
			return false;
		}
		if(($("#C_Approx_Order_Val").val() == '') && (currency_index!=0))
		{
			$("#C_Approx_Order_Val").focus();
			$("#C_Approx_Order_Val_errMsg").html('Please select order value.');
			$("#C_Approx_Order_Val").addClass("invalid");
			return false;
		}
		cefGetUserInfo();
		try{
			if((typeof(enq.enq_enquiry_sent)==='undefined' || enq.enq_enquiry_sent== "" || nxtprevflag==1) && 
					(enq.CEF_form_type!=="enq_inline" && enq.CEF_form_type!=="enq_rhs") && (typeof(enq.enq_sent)=='undefined' || enq.enq_sent=='') &&
					(typeof(enq.R_title)!== 'undefined' && enq.R_title != ""))
			{
				processSendEnquiry();
			}
		}catch(e){}
		if((est_qty != '' && qty_index!=0) || $("#C_Approx_Order_Val").val() || $("#C_Desc_Prod").val()){
			ENQGATrack('ENQ_Submit_First_EnrichForm','OnSubmit');
		}
		if(($("#C_Approx_Order_Val").val() || $("#C_Desc_Prod").val()) && prodType == 'S')
		{  
			ENQGATrack('ENQ_SubmitEnrichmentStep1_Service','OnSubmit');
		}
		sendSecFormEnq();
	}
	if($('#otpValue').val() != "")
	{
		otpVerify();
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-submit-enrichment.mp');
	}
	if(enq.CEF_cat_id !=='' && enq.CEF_cat_id !== undefined && enq.CEF_mcat_id !=='' && enq.CEF_mcat_id != undefined && enq.CEF_cat_id == "750")
	{
		params_request = {	
			"modid":glmodid,
			"token":"imobile@15061981",
			"mcatid":enq.CEF_mcat_id
		};
		rfqfunc.getResponse('amazonData',params_request,getAmazonStrip,function(message){ENQGATrack('ENQ_AmazonServiceErr','OnSubmit');});
	}
}
function setcompanyProduct()
{
	var pval_imesh = imesh_obj.get();
	var pcountry = (typeof(pval_imesh.cn) != 'undefined' && pval_imesh.cn != 'undefined') ? pval_imesh.cn : '';
	var pisd =  (typeof(pval_imesh.phcc) != 'undefined' && pval_imesh.phcc != 'undefined') ? pval_imesh.phcc : '';	
	pisd = pisd.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\+/,'');
	var pcountry_iso = (typeof (pval_imesh.iso) != 'undefined' && pval_imesh.iso != 'undefined') ? pval_imesh.iso : '' ;
	var prod_name=$('#C_S_productname').val();
	prod_name=prod_name.trim();
	enq.prd_name=prod_name;
	if(prod_name==null || prod_name=="")
	{	
		$("#C_S_productname_errMsg").html('Please provide product name.');
		$("#C_S_productname").removeClass("invalid").addClass("valid");
		if(enq.CEF_form_type == "enq_inline" || enq.CEF_form_type == "enq_rhs")
		{
			$('html').css({overflow:"auto"});
		}
		return false;	
	}
	CEF_dynamicISQ();
	decideFormSize();
	$('#q-second').css("display", "block");
	$("#option_text1").focus();
	setTimeout(function(){if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){ $('#C_Est_Qty').focus();}}, 800);
	htmlDecideForUser(pisd,pcountry,pcountry_iso);	
	showEnrichOtp();
	changeBtnColor();
	if(showFirstEnrich!=1){showFirstEnrichQues();}
	$(".cenq-bar-line").css({width:"50%" });
	$('#productnamediv').hide();
	processSendEnquiry();
}
function askproductname()
{
	$('#prod_name').show();
	$('#C_S_product').val('');
	$("#C_S_product_errMsg").html('');
	$("#C_S_product").removeClass("invalid").addClass("valid");
	$(".cenq-bar-line").css({width:"0%" });
	$('#prd-msg').text('I want to buy');
	setTimeout(function(){
			if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
			$('#C_S_product').focus();
			}
			}, 500);
}
function enqClose()
{
	if($('#queryID').length > 0 && $('#queryID').val() != "")
	{
		$('#queryID').val('');
	}
	if(typeof(enq.R_title) != 'undefined' && enq.R_title != "")
	{
		if(nxtprevflag ==0)
		{
			history.back();
		}
	}
	if($('#C_Thank_msg').css('display') == 'block')
	{
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-close-thnx.mp');
	}
	else if($('#'+enq.CEF_form_disp_id).css('display') == 'block' && $('#CEF_EMFHtmlID').css('display') == 'none' && $('#remain_info').css('display') == 'block')
	{
		ENQGATrack('ENQ_CloseUserInfoStep','OncloseUserInfoStep');
	}
	else if($('#'+enq.CEF_form_disp_id).css('display') == 'block' && $('#CEF_EMFHtmlID').css('display') == 'none')
	{
		ENQGATrack('ENQ_CloseLoginStep','OnClose');
	}
	else if($('#CEF_EMFHtmlID').css('display') == 'block' && $('#CEF_Enrich_Forsecond').css('display') == 'none' &&  $("#isq_step").css('display') == 'none' && $('#enquiryOtp_second').css('display') == 'none')
	{    
		ENQGATrack('ENQ_CloseFirstEnrichForm','OnClose');
	}
	else if($('#CEF_Enrich_Forsecond').css('display') == 'block')
	{
		ENQGATrack('ENQ_CloseSecondEnrichForm','OnClose');
	}
	else if($('#enquiryOtp_second').css('display') == 'block')
	{
		ENQGATrack('ENQ_OtpForm_Close','OnClose'); 
		if(enquiry_count>=1)
		{
			ENQGATrack('ENQ_OTPCloseAfter3Enq','OnCloseOTP'); 
		}
	}
	if((glmodid == 'MDC' || glmodid =='FCP') && enq.enq_sent == 1 && typeof(enq.CEF_enrichFormAction) != "undefined" && typeof(enq.CEF_enrichFormAction) === "function")
	{
		enq.CEF_enrichFormAction.apply();			
	}
	if(glmodid=='FCP' || glmodid=='MDC' || glmodid == 'PRODDTL')
	{
		page.Identified();	
	}
	nxtprevflag=0;
	cefImIntFlag = 0;
}
function estQtyUnitPreffiled(id)
{
	if(typeof(enq.enq_item_price)!='undefined' && enq.enq_item_price!='' )
	{
		var pric=enq.enq_item_price;
		var s=pric.match('/');
		if(s!=null){
			var get_unit=pric.split("/");
			get_unit[1]=get_unit[1].trim();
			$("#"+id).val(get_unit[1]);
			$("#"+id).css("color","black");
			check_price=1;
		}
		else
		{
			check_price=0;
		}
	}
	else
	{
		check_price=0;
	}
	if($('#CEF_EMFHtmlID').css('display') == 'block')
	{
		if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
			$('#C_Est_Qty').focus();
		}
	}
}
function cefIdentifiedInfo()
{
	$("#CEF_IdentifiedInfo").show();
	var val_v4iilex= readCookie('v4iilex');
	var val_imesh = imesh_obj.get();
	if(val_imesh != '')
	{
		$("#which_submit").val("submit_member");	
		var full_name = (typeof(val_imesh.fn) != 'undefined' && val_imesh.fn != 'undefined') ? val_imesh.nm : '' ;
		var isd =  (typeof(val_imesh.phcc) != 'undefined' && val_imesh.phcc != 'undefined') ? val_imesh.phcc : '';
		var mobile = (typeof(val_imesh.mb1) != 'undefined' && val_imesh.mb1 != 'undefined') ? val_imesh.mb1 : '';
		var email = (typeof(val_imesh.em) != 'undefined' && val_imesh.em != 'undefined') ? val_imesh.em : '';
		isd = isd.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\+/,'');
	}
	if(isd == '91' && otp_status == 0 && otp_hit === '')
	{
		info = '<p class="q-loggedInfo-col2"> <span class="f12">From:</span> <br> <strong>'+full_name+'</strong></p> <p class="q-loggedInfo-col3"> '+'+'+isd+'-'+mobile+'</p>';
	}
	else if(isd == '91' && (otp_hit == 0 || otp_hit == 1))
	{

		info = '<p class="q-loggedInfo-col2"> <span class="f12">From:</span> <br> <strong>'+full_name+'</strong></p> <p class="q-loggedInfo-col3 pl-rep"> '+'+'+isd+'-'+mobile+'<span class="spinner-loading"></span></p>';
		$("#CEF_IdentifiedInfo").html(info);
		var myvar = setInterval(function(){ 
				if(otp_hit == 1)
				{
				info = '<p class="q-loggedInfo-col2"> <span class="f12">From:</span> <br> <strong>'+full_name+'</strong></p> <p class="q-loggedInfo-col3 pl-rep"> '+'+'+isd+'-'+mobile+'<span class="vrfy-icon"></span><span class="ver-toltip"> <span class="toolarwenq"> </span> <span class="txt-tooltip">Your number is verified</span> </span></p>';
				$("#CEF_IdentifiedInfo").html(info);
				clearInterval(myvar);
				}
				else
				{
				info = '<p class="q-loggedInfo-col2"> <span class="f12">From:</span> <br> <strong>'+full_name+'</strong></p> <p class="q-loggedInfo-col3 pl-rep"> '+'+'+isd+'-'+mobile+'<span class="nvrfy-icon"></span><span class="ver-toltip"> <span class="toolarwenq"> </span> <span class="txt-tooltip"> </span>Your number is unverified</span></p>';
				$("#CEF_IdentifiedInfo").html(info);
				if(otp_failure == 1){
				clearInterval(myvar);
				}
				}

				}, 1000);
	}
	else
	{
		info = '<p class="q-loggedInfo-col2"> <span class="f12">From:</span> <br> <strong>'+full_name+'</strong></p> <p class="q-loggedInfo-col3">'+email+'</p>';
	}
	$("#CEF_IdentifiedInfo").html(info);
}
function cefGetUserValues(cefFlag,cefFn)
{
	if($("#queryID").val() != '')
	{
		cefFn.apply();
	}
	else
	{
		cefFlag = cefFlag +1;
		setTimeout(function(){cefGetUserValues(cefFlag,cefFn)},50);
	}
}
function cefUserUpdateService()
{
	cefGetUserInfo();
	cefShowEnqEMTForm();
	try
	{
		if(typeof(imesh_obj.get().iso))
		{
			updateEnquiry();
		}
		else if(typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && enq.CEF_form_type!="enq_inline" && enq.CEF_form_type!="enq_rhs" && typeof(imesh_obj.get().iso) != 'undefined' && imesh_obj.get().iso == 'IN' && typeof(enq.prd_name_email)!=='undefined' && enq.prd_name_email==1 && typeof(enq.sent)=='undefined')
		{
			processSendEnquiry();
		}
	}catch(e){}
	var userName = '';
	var getGlusr_ID = enq.user_glid || imesh_obj.get().glid;
	var isd_code = $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'');
	params_request = {
		"VALIDATION_KEY":'e27d039e38ae7b3d439e8d1fe870fc68',
		"USR_ID":getGlusr_ID,
		"UPDATEDBY":'User',
		"UPDATEDUSING":'Enquiry Form on '+glmodid,
		"MODID":glmodid
	};
	if(imesh_obj.get().fn == "" && $('#C_S_name').val() !== '')
	{
		params_request.FIRSTNAME = enq.S_first_name;
		params_request.LASTNAME = enq.S_last_name;
	}
	if(isd_code == "91" && imesh_obj.get().em == "" && $('#C_S_email_In').val() !== '')
	{
		params_request.EMAIL = $('#C_S_email_In').val();
	}
	if(isd_code !== "91" && imesh_obj.get().mb1 == "" && $('#C_S_mobile_F').val() !== '')
	{
		params_request.PH_MOBILE = $('#C_S_mobile_F').val();
	}
	if(imesh_obj.get().ct == "" && enq.C_S_city !=='')
	{
		params_request.CITY=enq.C_S_city;
		params_request.FK_GL_CITY_ID=enq.C_S_city_id;
		params_request.STATE=enq.C_S_state;
		params_request.FK_GL_STATE_ID=enq.C_S_state_id;
	}
	try
	{
		if((typeof(enq.enq_sent)=='undefined' || enq.enq_sent=='') && (($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") || ($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91" && $('#C_S_name').val() !== "")))
		{
			processSendEnquiry();
		}else{}
	}catch(e){}
	if((typeof(params_request.FIRSTNAME) !='undefined' && params_request.FIRSTNAME != '') || (typeof(params_request.EMAIL) !='undefined' && params_request.EMAIL != '') || (typeof(params_request.PH_MOBILE) !='undefined' && params_request.PH_MOBILE != '') || (typeof(params_request.CITY) !='undefined' && params_request.CITY != ''))
	{
		rfqfunc.getResponse('userUpdate',params_request,userUpdateSuccess,function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-user-update-err.mp');});
	}
}
function userUpdateSuccess(response)
{
	if(response.RESPONSE.CODE == '200' && response.RESPONSE.STATUS == 'SUCCESSFUL')
	{
		if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
		{
			userName = imesh_obj.get().mb1 || $('#'+enq.CEF_S_mobile).val();
		}
		else
		{
			userName = imesh_obj.get().em || $('#'+enq.CEF_S_email).val();
		}
		usrupdate = 1;
		userDetailsAutoFetch(userName);
		if(glmodid!='FCP' && glmodid!='PRODDTL')
		{
		page.Identified();	
		}
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-user-update.mp');
	}
	else
	{
		cefServiceError(response,params_request);
	}
}
function cefServiceError(errResponse,send_param)
{
	var params_request = {
		"ServiceError":errResponse,
		"Param":send_param
	};
	params_request.request_type = 'ServiceError';
	var url_request = "/serveEnquiry.php";
	$.ajax({
url: url_request,
data: params_request,
type: "POST",
dataType: "json",
success: function(response)
{ 
}
});
}

function cefGetUserInfo()
{
	var name_obj = getFirstLastName();
	enq.C_S_email = $('#'+enq.CEF_S_email).val();
	enq.C_S_name =  $('#C_S_name').val();
	enq.C_S_name =  $.trim(enq.C_S_name);
	enq.C_S_name = enq.C_S_name.replace(/\s+/ig,' ');
	enq.C_S_city =  $('#C_S_city_enq').val();
	enq.C_S_mobile = $('#'+enq.CEF_S_mobile).val();
	enq.C_S_mobile_F =  $('#C_S_mobile_F').val();
	enq.C_S_email_In =  $('#C_S_email_In').val();
	enq.C_S_organization = $('#'+enq.CEF_S_organization).val();
	enq.C_S_country = $('#'+enq.CEF_S_countryname_enq).val();
	enq.C_S_state = $('#C_S_state_enq').val();
	enq.which_submit = $('#which_submit').val();
	enq.C_S_cmobile = $('#'+enq.CEF_S_ccode).val();
	enq.C_S_country_iso = $('#'+enq.CEF_S_country_iso).val();
	enq.query_ref_cur_url = window.location.href;
	enq.C_S_city_id  = $('#C_S_city_id').val();
	enq.C_S_state_id  = $('#C_S_state_id').val();
	enq.S_first_name = name_obj.first_name;
	enq.S_last_name = name_obj.last_name;
	enq.IamInterested_id = '';
	enq.user_glusrid = '';
	if(typeof(enq.interestId) != 'undefined')
	{
		enq.IamInterested_id = enq.interestId;
	}
	if(typeof(enq.user_glid) != 'undefined')
	{
		enq.user_glusrid = enq.user_glid;
	}
}
function showEnrichOtp()
{
	var val_imesh = imesh_obj.get();
	var pisd =  (typeof(val_imesh.phcc) != 'undefined' && val_imesh.phcc != 'undefined') ? val_imesh.phcc : '';
	if(pisd=="91")
	{
		if(val_imesh.uv !== "V" && typeof(val_imesh.uv) !== 'undefined')
		{
			$('#enquiryOtp').css({'display':'block','width':'310px'});
			$('.cenq-form-block3').removeClass("mt30"); $('.veri-help').show(); otpGenerate();
			imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-open-enrichment.mp'); 
			ENQGATrack('ENQ_Otpform_Unverified_User','Onclick'); 
		}
		else
		{
			ENQGATrack('ENQ_Otpform_Verified_User','Onclick'); 
		}
	}

}
function cefShowEnqEMTForm()
{
	var val_imesh = imesh_obj.get();
	if(enq.againUIS == true)
	{
		var val_imesh= readCookie('ImeshVisitor');
		var uv_val = getparamVal(val_imesh, "uv") || ''; 
		var fnUsr = getparamVal(val_imesh, "fn") || ''; 
		$('.cenq-bar-line').hide();   
		$('#otpValue_errMsg').html('');
		$('#bar-line,#new-usr-msg,#bar-line-enrich,#enrich-msg,#cefPopup,#CEF_IdentifiedInfo').hide();
		if(uv_val !== "V" && typeof(uv_val) !== 'undefined' && ($("#"+enq.CEF_S_cmobile_enq).val() == '+91' || $("#"+enq.CEF_S_cmobile_enq).val() == '91'))
		{
			fnUsr != '' && fnUsr != "" ? $("#aftr4msg").html("<span class='not-icon'></span>Dear "+fnUsr+", Verify your mobile number to get quick response for your enquiry") : $("#aftr4msg").html("Verify your mobile number to get quick response for your enquiry");
			$('#C_Thank_msg,#CEF_Enrich_Forsecond,#nwtxt').hide();
			$('#enquiryOtp').html('');
			$('#enquiryOtp_second').show();
			$('.cBtn').removeClass('TP29');
			$('#otpValue').focus();
			imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-open.mp');
		}
		else
		{
			if((glmodid == 'MDC' ||glmodid == 'FCP') && (enq.CEF_form_type=="enq_inline" || enq.CEF_form_type=="enq_rhs") && (typeof(enq.CEF_enrichFormAction) != "undefined") && (typeof(enq.CEF_enrichFormAction) === "function") && (uv_val == "V" || ($("#"+enq.CEF_S_cmobile_enq).val() !== '+91' && $("#"+enq.CEF_S_cmobile_enq).val() !== '91')))
			{
				enq.CEF_enrichFormAction.apply();				
			}
			else
			{
				$("#CEF_EMFHtmlID,#CEF_Enrich_Forsecond").hide();
				$("#CEF_EnqPart,#C_Thank_msg,#b_sub").show();
				hidePayX();
				if($('#enquiry').css('display') == 'block')
				{
					ENQGATrack('ENQ_ShowThankyouStep','OnShowEnrichment');
					if($('#amazonStrip').css('display') == 'block')
					{
						ENQGATrack('ENQ-Amazon-Ad-Thankyou','ViewPort'); 
					} 
				}else{}
			}
		}
		if($('#C_S_name').val() || $('#C_S_email_In').val() || $('#C_S_city_enq').val() || $('#C_S_mobile_F').val())
		{
			if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
			{
				ENQGATrack('ENQ_SubmitLastUserInfoStep','SubmitUserInfoStepIndian'); 
			}
			else
			{
				ENQGATrack('ENQ_SubmitLastUserInfoStep','SubmitUserInfoStepForeign') 
			}
		}
	}
	else
	{
		if((cef_EMFDownloadHtml != '') && ($('#CEF_EMFHtmlID').html() == ''))
		{
			$('#CEF_EMFHtmlID').html(cef_EMFDownloadHtml);
			$('#CEF_EMFHtmlID').html($('#CEF_EnrichSection').html());
		}
		htmlDecideForUser($('#'+enq.CEF_S_cmobile_enq).val(),$('#'+enq.CEF_S_countryname_enq).val(),$('#'+enq.CEF_S_country_iso).val());
		if(callIsqFlag == false){callGetIsqService();}
		CEF_dynamicISQ();decideFormSize();
		$('#remain_info').hide();
		$("#blacklayer,#enquiry,#cefPopup,#b_sub").show();
		$("#CEF_EnqPart,#table_nxt").hide(); 
		$('#'+enq.CEF_img_process).hide();
		$('#CEF_EMFHtmlID').hide();
		if(isqAvail == 1 || prodType == 'S' || (typeof(enq.R_modref_type)!='undefined' && enq.R_modref_type==1 && enq.CEF_form_type!=="enq_inline" && enq.CEF_form_type!=="enq_rhs"))
		{
			$('#enrch-loader').hide();
			$("#CEF_EMFHtmlID,#enq_form_enrichmt,#q-second").css("display", "block");
		}
		else
		{
			$('#enrch-loader').show();
			var waitIsq = setInterval(function(){ 
			if(isqAvail == 1)
			{
				$('#enrch-loader').hide();
				$("#CEF_EMFHtmlID,#enq_form_enrichmt,#q-second").css("display", "block");
				clearInterval(waitIsq);
			}
			}, 500);

		}
		showEnrichOtp();estQtyUnitPreffiled('C_Est_Qty_List');cefIdentifiedInfo();changeBtnColor();
		if(showFirstEnrich!=1){showFirstEnrichQues();}
		$(".cenq-bar-line").css({width:"50%"});
		$("#option_text1").focus();
	}
}
function changeTxtSrvc()
{
	var isd_code = $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'');
	if((isd_code == '91' || isd_code == '+91') && (page.country == 'India' || page.countryCode == 'IN'))
	{
		$("#C_Approx_Order_Val").val($("#C_Approx_Order_Val option:first").text('Approximate budget (Rs)'));
	}
	else
	{
		$("#C_Approx_Order_Val").val($("#C_Approx_Order_Val option:first").text('Approximate budget'));
	}
}
function showFirstEnrichQues()
{
	showFirstEnrich=1;
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	if(prodType == 'S' && typeof(enq.sbmtDesc) == "undefined")
	{
		$('#q_enrich_qty_dv').hide();
		$('#step2').prepend($("#desc_box").html());
		$('#C_Desc_Prod').addClass('DesBxH45');
		setTimeout(function(){if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){$('#C_Desc_Prod').focus();}}, 500);
		$('#C_Desc_Prod').attr('placeholder','Enter preferences e.g.date & time, location, how often it is required');
		changeTxtSrvc();
	}
	else if(prodType == 'S' && typeof(enq.sbmtDesc) !== "undefined" && enq.sbmtDesc == "Yes")
	{
		$('#q_enrich_qty_dv').hide();
		changeTxtSrvc();
	}
	else
	{
		$('#q_enrich_qty_dv').show();
	}
	ENQGATrack('ENQ_ShowEnrichmentStep','OnShowEnrichment'); 
}
function cefEnqBtnDisable()
{
	try{
		if((typeof(enq.enquiryDivId) != 'undefined') && enq.enquiryDivId != '')
		{
			if(!(enq.enquiryDivId.match(/dispid/ig)))
			{
				enq.enquiryDivId = "dispid"+enq.enquiryDivId;
			}
			setAsEnqSent(enq.enquiryDivId);
			if(typeof enq.enq_sent_color === "function")
			{
				setTimeout(function(){
					enq.enq_sent_color.apply(null, [enq.enquiryDivId]);
				}, 800);
			}	
			try{
				if (typeof(enq.success) != 'undefined')
				{
					eval(enq.success + "("+enq.displayId+")");
				}
			}catch(e){
			}
		}else{setAsEnqSent("dispid"+enq.displayId);}
	}catch(e){}	
	try{
		activateEnqConversionTracking();
	}catch(e){
	}	
}

function cefSendFormInfo(formData)
{
	enq = formData;
	cefSetFormIDS(formData);
	checkCCnCN();
	cefCountrySuggester();
	cefEmailSuggester(enq.CEF_S_email);
	var qstring = enq.query;
	qstring = qstring.replace(/&amp;/g, '&');
	var ss = getQueryStringParsedData(qstring, "ss");	
	var category = getQueryStringParsedData(qstring, "ctg");
	var R_modref_type = getQueryStringParsedData(qstring, "modreftype");
	var zoom_image = getQueryStringParsedData(qstring, "zoom_img"); 
	var display_image = getQueryStringParsedData(qstring, "display_image");
	var val_imesh = imesh_obj.get();
	var S_glusr_id = "";
	var val_v4iilex= readCookie('v4iilex');
	var is_admin = getparamVal(val_v4iilex, "admln") || '';	
	var glid_v4cookie = getparamVal(val_v4iilex, "id") || '';
	enq.ss = ss;
	enq.category = category;
	enq.R_modref_type = R_modref_type;
	enq.is_admin = is_admin;
	enq.zoom_img = zoom_image;
	enq.small_image = display_image;
	if(val_v4iilex != "" && val_imesh != "" && glid_v4cookie != "")
	{
		enq.userStatus = 1;
	}
	else if((val_imesh != "") && (typeof(val_imesh.glid) != 'undefined' && val_imesh.glid != ''))
	{
		enq.userStatus = 2;
	}
}
function formvalidationreset()
{
	$('#bar-line,#new-usr-msg,#bar-line-enrich,#table_nxt').show();
	$('.cenq-bar-line').show();
	$("#C_S_city_errMsg,#C_S_quantity_errMsg,#C_S_quantityunit_errMsg,#C_Desc_errMsg,#CEF_Select_Currency_errMsg,#C_Approx_Order_Val_errMsg,#C_S_email_errMsg,#C_S_mobile_errMsg,#C_S_email_In_errMsg,#C_S_mobile_F_errMsg,#C_S_name_errMsg").html('');
	$("#C_S_mobile").removeAttr("readonly");
	$('#C_country_dropdown').removeAttr('disabled');  
	$("#C_Est_Qty_List,#C_Est_Qty,#C_Desc_Prod,#C_S_email,#C_S_name,#C_S_mobile,#C_Approx_Order_Val,#CEF_Select_Currency,#C_S_mobile_F,#CEF_S_email_In").removeClass("invalid");
}
function setFocuslogin()
{
	$(".cenq-bar-line").css({width:"0%" });
	$('#'+enq.CEF_S_mobile).removeClass("invalid");
	$('#'+enq.CEF_S_email).removeClass("invalid");
	setTimeout(function(){
			if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
			$('#C_S_mobile').focus();
			$('#C_S_email').focus();
			}
			}, 500);
}
function setFocusUser()
{
	$(".cenq-bar-line").css({width:"30%" });
	$('#C_S_name').removeClass("invalid");
	setTimeout(function(){
			if(!(!!navigator.userAgent.match(/Trident.*rv\:11\./))){
			$('#C_S_name').focus();
			}
			}, 200);
}
//industry specific questions functions
function getindustry_specific_ques(mcat_id,cat_type)
{
	mcat_setIsq = mcat_id;
	isqAvail = 0;
	if(typeof(old_isq_data) != undefined && typeof(old_isq_data)!='undefined' && old_isq_data!='' && old_isq_data.DATA.mcatid == mcat_id)
	{
		isqAvail = 1;
		createISQHash(old_isq_data);
	}
	else if(typeof(old_isq_data) != undefined && typeof(old_isq_data)!='undefined' && old_isq_data=='' && typeof(page.mcatIds)!='undefined' && page.mcatIds[0] == mcat_id)
	{
		isqAvail = 1;
		callIsqFlag = true;
		cefShowEnqEMTForm();
	}
	else
	{
		var params_request = {"modid":glmodid,"token":"imobile@15061981","mcatid":mcat_id,"cat_type":cat_type,"format":1,"fixed_attr":1,"flag":1};
		rfqfunc.getResponse('getISQ',params_request,function(json_obj){
			isqAvail = 1;
			if(json_obj != undefined && json_obj.CODE == '200')
			{
				createISQHash(json_obj);
			}         
			ENQGATrack('ENQ_GetIsq_Call','OnCall');},function(){});
	}
}
function createISQHash(json_obj)
{
	industry_inputtabhtml=''; cef_isq_html = ''; cef_only3isq=0; $('#inputTab').html('');
	industry_questions_found=1;
	var ques_arr = [];	
	var val_imesh = imesh_obj.get();
	var len = json_obj.DATA.length;
	for (var i = 0; i < len; i++) 
	{
		var option_arr=[]; 
		var option=[];
		var option_arr_id=[]; 
		var option_id=[];
		var question_master_id=[];
		var question_master_desc=[];
		var question_master_type=[];
		var question_priority_val=[];
		if(json_obj.DATA[i].IM_SPEC_OPTIONS_DESC !== null)
		{
			var question = json_obj.DATA[i].IM_SPEC_OPTIONS_DESC.split('#');
			option_arr.length = 0;
			for(var j=0;j<question.length;j++)
			{
				var arr=[];
				option = question[j].split(',');
				var option_length = option.length;
				for(var k=0; k< option_length; k++)
				{
					arr.push(option[k]);
				}
				option_arr.push(arr);
			}
		}
		if(json_obj.DATA[i].IM_SPEC_OPTIONS_ID !== null)
		{
			var question_id = json_obj.DATA[i].IM_SPEC_OPTIONS_ID.split('#');
			option_arr_id.length = 0;
			for(var j=0;j<question_id.length;j++)
			{
				var arr = [];
				option_id= question_id[j].split(',');
				var optionId_length = option_id.length;
				for(var k=0; k < optionId_length; k++)
				{
					arr.push(option_id[k]);
				}
				option_arr_id.push(arr);
			}
		}
		if(json_obj.DATA[i].IM_SPEC_MASTER_ID !== null)
		{
			var master_id = json_obj.DATA[i].IM_SPEC_MASTER_ID.split('#');
			question_master_id.length=0;
			for(var j=0;j<master_id.length;j++)
			{
				question_master_id.push(master_id[j]);
			}
		}
		if(json_obj.DATA[i].IM_SPEC_MASTER_DESC !== null)
		{
			var master_desc = json_obj.DATA[i].IM_SPEC_MASTER_DESC.split('#');
			question_master_desc.length=0;
			for(var j=0;j<master_desc.length;j++)
			{
				question_master_desc.push(master_desc[j]);
			}
		}
		if(json_obj.DATA[i].IM_SPEC_MASTER_TYPE !== null)
		{
			var master_type = json_obj.DATA[i].IM_SPEC_MASTER_TYPE.split('#');
			question_master_type.length=0;
			for(var j=0;j<master_type.length;j++)
			{
				question_master_type.push(master_type[j]);
			}
		}
		if(json_obj.DATA[i].IM_CAT_SPEC_PRIORITY !== null)
		{
			var priority_val = json_obj.DATA[i].IM_CAT_SPEC_PRIORITY.split('#');
			question_priority_val.length=0;
			for(var j=0;j<priority_val.length;j++)
			{
				question_priority_val.push(priority_val[j]);
			}
		}
		ques_arr.push({
				'question_id': question_master_id,
				'title': question_master_desc,
				'ques_type':question_master_type,
				'option_id':option_arr_id,
				'options':option_arr,
				'priority' : question_priority_val
				});
	}
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	var len = ques_arr.length;
	if(prodType == 'P' || prodType == 'C')
	{
		var temp_diff=len-8;
		if(temp_diff>0){
			for(i=0;i<temp_diff;i++)
			{
				ques_arr.pop();
			}
		}
		var splited_ISQ = splitISQHash(ques_arr);
		var first_ISQhash = splited_ISQ[0];
		var second_ISQhash = splited_ISQ[1];
		industry_ques_firstStep["questions"]=first_ISQhash;
		createFirstStepQuestions(industry_ques_firstStep);
		industry_ques["questions"]=second_ISQhash;
		createQuestions(industry_ques);
	}
	else
	{
		var temp_diff=len-5;
		if(temp_diff>0){
			for(i=0;i<temp_diff;i++)
			{
				ques_arr.pop();
			}
		}
		industry_ques["questions"]=ques_arr;
		createQuestions(industry_ques);
	}

	enq.industry_ques='|ISQ';
	imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-industry-ques-avail.mp');
}
function splitISQHash(ques_arr)
{
	var first_ques_arr = [];
	var second_ques_arr=[];
	var val_imesh = imesh_obj.get();
	industry_ques["questions"]=ques_arr;
	var ques_len = ques_arr.length;
	var count_opt=0;
	if(ques_len>0)
	{
		for(var i=0;i<ques_len;i++)
		{
			if(ques_len<=3)
			{
				cef_only3isq=1;
				first_ques_arr.push(ques_arr[i]);  
			}
			else if(i>=0 && i<=1)
			{
				if(industry_ques['questions'][i]['ques_type'] == 2 || industry_ques['questions'][i]['ques_type'] == 4)
				{
					var arrayOption = industry_ques['questions'][i]['options'][0];
					for (var z = 0; z < arrayOption.length; z++) 
					{
						count_opt= count_opt+1;
					}
					if(count_opt>8 &&  ($("#"+enq.CEF_S_cmobile_enq).val() == '+91' || $("#"+enq.CEF_S_cmobile_enq).val() == '91') && typeof(val_imesh.uv) !== 'undefined' && val_imesh.uv !== "V" )
					{
						second_ques_arr.push(ques_arr[i]);
					}
					else
					{
						first_ques_arr.push(ques_arr[i]);
					}
				}
				else
				{
					first_ques_arr.push(ques_arr[i]);
				}

			}
			else
			{
				if((industry_ques['questions'][i]['priority'] == -1 || industry_ques['questions'][i]['title'][0].toLowerCase().trim() == 'brand') || first_ques_arr.length >=3)
				{
					second_ques_arr.push(ques_arr[i]);
				}
				else if(first_ques_arr.length == 2)
				{
					count_opt>8 ? second_ques_arr.push(ques_arr[i]) : first_ques_arr.push(ques_arr[i]);
				}
				else
				{
					second_ques_arr.push(ques_arr[i]);
				}

			}
		}
	}
	return [first_ques_arr,second_ques_arr]	

}
function createFirstStepQuestions(questObj)
{
	$("#q-second-ISQ").html('');
	$("#CEF_Enrich_Forsecond").hide();
	var text_count=0;
	var radio_count=0;
	var sel_count=0;
	var check_count=0;
	cef_isq_html ='';
	var ques=0;
	lengthIsqQues = questObj['questions'].length;
	for (var k = 0; k < questObj['questions'].length; k++) 
	{
		for(var m=0;m<questObj['questions'][k]['ques_type'].length;m++)
		{ 
			ques++;
			switch (questObj['questions'][k]['ques_type'][m]) {
				case '1'://input text
					{                                        
						text_count++;
						var id = 'option_text'+text_count;
						cef_isq_html +='<div class="cenq-form-block2" id="isqQues'+ques+'"><label optionid='+questObj['questions'][k]['option_id'][m]+'><input type="text" min="1" id='+id+' class="cenq-isq-text valid" onfocus="this.style.color=\'#000\';onfocusErrMsg(id);" placeholder=\''+questObj['questions'][k]['title'][m]+'\' aria-autocomplete="list" aria-haspopup="true" style="width:96%; color: rgb(0, 0, 0);"></label> <div class="q-clr"> </div> <div class="q-errorMsg-qty wd352"> <p id="C_Est_Qty_errMsg" class="Flt-rgt H0"></p> </div><input type="hidden" id="text_ques_id'+text_count+'" value='+questObj['questions'][k]['question_id'][m]+'><input type="hidden" id="text_ques_title'+text_count+'" value="'+questObj['questions'][k]['title'][m]+'"></div>';
						break;
					}
				case '3'://select
					{
						sel_count++;
						var id = 'option_select'+sel_count;
						if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'quantity unit')
						{
							cef_isq_html += '<div class="cenq-form-block2" id="isqQues'+ques+'"><select class="enq-input3 cenq-custm-app valid" id='+id+' name="'+questObj['questions'][k]['title'][m]+'" onchange="if(this.value==\'\'){this.style.color=\'#5a5959\';} else{this.style.color=\'#000000\';};" onfocus="onfocusErrMsg(id);"><option value="">Unit</option>';
						}
						else
						{
							cef_isq_html += '<div class="cenq-form-block2" id="isqQues'+ques+'"><select class="enq-input3 cenq-custm-app valid" id='+id+' name="'+questObj['questions'][k]['title'][m]+'" onchange="if(this.value==\'\'){this.style.color=\'#5a5959\';} else{this.style.color=\'#000000\';};" onfocus="onfocusErrMsg(id);"><option value="">'+questObj['questions'][k]['title'][m]+'</option>';
						}
						for(var b = 0; b < questObj['questions'][k]['options'][m].length; b++) 
						{
							if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'approximate order value' || questObj['questions'][k]['title'][m].toLowerCase().trim() == 'currency')
							{
								var opt = CEF_OptionHash(questObj['questions'][k]['options'][m][b],questObj['questions'][k]['option_id'][m][b],id);
								cef_isq_html += opt;
							}
							else
							{
								cef_isq_html +='<option value="'+questObj['questions'][k]['options'][m][b]+'" optionid='+questObj['questions'][k]['option_id'][m][b]+'>'+questObj['questions'][k]['options'][m][b]+'</option>';
							}
						}
						cef_isq_html +='</select>'; 
						cef_isq_html+='<input type="hidden" id="select_ques_id'+sel_count+'" value='+questObj['questions'][k]['question_id'][m]+'><input type="hidden" id="select_ques_title'+sel_count+'" value="'+questObj['questions'][k]['title'][m]+'">';
						if(m>0 && questObj['questions'][k]['title'][m].toLowerCase().trim() == 'currency')
						{
							cef_isq_html +='</div><div class="q-clr"></div><div class="q-errorMsg-qty wd352"> <p id="C_aov_errMsg" class="Flt-rgt H0"></p> ';
						}
						else if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'quantity unit')
						{
							cef_isq_html+='</div><div class="q-clr"></div>';
						}
						else
						{
							cef_isq_html+='</div>';
						}
						break;
					}
				case '2'://radio
					{
						radio_count++;
						var id = 'option_radio'+radio_count;
						var idVal = 'radio'+radio_count+ques;
						var arrayInner = questObj['questions'][k]['options'][m];
						cef_isq_html+='<div id="radiobox'+check_count+'" id="isqQues'+ques+'"><div class="isq-hd-enq">'+questObj['questions'][k]['title'][m]+'</div>';
						for (var z = 0; z < arrayInner.length; z++) 
						{
							if(questObj['questions'][k]['options'][m][z].toLowerCase().trim() != 'others' && questObj['questions'][k]['options'][m][z].toLowerCase().trim() != 'other')
							{
								cef_isq_html+='<div class="CEFisqStyle vat-enq dsp-inl"><label optionid='+questObj['questions'][k]['option_id'][m][z]+' ><input name='+id+' type="radio" class="vat"  value='+questObj['questions'][k]['options'][m][z]+'><div class="isq-enq-txt vat-enq dsp-inl">'+questObj['questions'][k]['options'][m][z]+'</div></label></div>';		
							}
							else
							{
								cef_isq_html+='<div class="CEFisqStyle vat-enq dsp-inl"><label optionid='+questObj['questions'][k]['option_id'][m][z]+' ><input id='+idVal+' name='+id+' type="radio" class="vat" style="display:none" value='+questObj['questions'][k]['options'][m][z]+'><input id=rad'+idVal+' name='+name+' class="Otr-frst" placeholder="Other '+questObj['questions'][k]['title'][m]+'" onblur="saveTxtVal(\''+idVal+'\',\'rad'+idVal+'\',\'#q-second-ISQ\');"></label></div>';
								txtrad = 1;		
							}		
						}
						cef_isq_html+='<input type="hidden" id="radio_ques_id'+radio_count+'" value='+questObj['questions'][k]['question_id'][m]+'><input type="hidden" id="radio_ques_title'+radio_count+'" value="'+questObj['questions'][k]['title'][m]+'"></div>';
						break;
					}

				case '4'://checkbox
					{
						check_count++;
						var name = 'option_checkbox'+check_count;
						var id ='option_checkbox'+check_count+ques;
						cef_isq_html+='<div id="checkbox'+check_count+'" id="isqQues'+ques+'"><div class="isq-hd-enq">'+questObj['questions'][k]['title'][m]+'</div>';
						var arrayInner = questObj['questions'][k]['options'][m];
						for (var z = 0; z < arrayInner.length; z++) 
						{
							if(questObj['questions'][k]['options'][m][z].toLowerCase().trim() != 'others' && questObj['questions'][k]['options'][m][z].toLowerCase().trim() != 'other')
							{
								cef_isq_html+='<div class="CEFisqStyle vat-enq dsp-inl"><div class="dsp-inl"><label optionid='+questObj['questions'][k]['option_id'][m][z]+'><input type="checkbox" name='+name+' value="'+questObj['questions'][k]['options'][m][z]+'" class="vat-enq"><div class="isq-enq-txt vat-enq dsp-inl">'+questObj['questions'][k]['options'][m][z]+'</div></label></div></div>';
							}
							else
							{
								cef_isq_html+='<div class="CEFisqStyle vat-enq dsp-inl chkEnq"><div class="dsp-inl"><label optionid='+questObj['questions'][k]['option_id'][m][z]+'><input id='+id+' type="checkbox" name='+name+' value="'+questObj['questions'][k]['options'][m][z]+'" class="vat-enq" style="display:none"><input id=check'+id+' name='+name+' class="Otr-frst" placeholder="Other '+questObj['questions'][k]['title'][m]+'" onblur="saveTxtVal(\''+id+'\',\'check'+id+'\',\'#q-second-ISQ\');"></label></div></div>';
								txtchk =1;
							}
						}
						cef_isq_html+='<input type="hidden" id="check_ques_id'+check_count+'" value='+questObj['questions'][k]['question_id'][m]+'><input type="hidden" id="check_ques_title'+check_count+'" value="'+questObj['questions'][k]['title'][m]+'"></div>';
						break;
					}

			}
		}
	}
	$("#q-second-ISQ").html(cef_isq_html);
	cef_IsqDesign();
}

function saveTxtVal(hiddenVal,txtVal,divId)
{
	if($(divId).find('#'+txtVal).val() != "")
	{
		$(divId).find('#'+hiddenVal).val($(divId).find('#'+txtVal).val());
		$(divId).find('#'+hiddenVal).attr('checked', 'checked');
	}
}

function CEF_OptionHash(optionVal,optionId,selectId)
{
	var isdCode = $('#'+enq.CEF_S_cmobile_enq).val();
	var countryName = $('#'+enq.CEF_S_countryname_enq).val();
	var countryISO = $('#'+enq.CEF_S_country_iso).val();
	var cef_selopt_htm='';
	if((isdCode == '+91' || isdCode == '91') && (countryName == 'India' || countryISO == 'IN'))
	{
		switch(parseInt(Math.floor(optionVal))){
			case 1    : $('#'+selectId).hide();cef_selopt_htm = "<option value='INR' optionid="+optionId+" selected>INR</option>";break;
			case 100  :  cef_selopt_htm = "<option value='Upto 1,000' optionid="+optionId+">Upto 1,000</option>";break;
			case 200  :  cef_selopt_htm = "<option value='1,000 to 3,000' optionid="+optionId+">1,000 to 3,000</option>";break;
			case 300  :  cef_selopt_htm = "<option value='3,000 to 10,000' optionid="+optionId+">3,000 to 10,000</option>";break;
			case 400  :  cef_selopt_htm = "<option value='10,000 to 20,000' optionid="+optionId+">10,000 to 20,000</option>";break;
			case 500  :  cef_selopt_htm = "<option value='20,000 to 50,000' optionid="+optionId+">20,000 to 50,000</option>";break;
			case 600  :  cef_selopt_htm = "<option value='50,000 to 1 Lakh' optionid="+optionId+">50,000 to 1 Lakh</option>";break;
			case 700  :  cef_selopt_htm = "<option value='1 to 2 Lakh' optionid="+optionId+">1 to 2 Lakh</option>";break;
			case 800  :  cef_selopt_htm = "<option value='2 to 5 Lakh' optionid="+optionId+">2 to 5 Lakh</option>";break;
			case 900  :  cef_selopt_htm = "<option value='5 to 10 Lakh' optionid="+optionId+">5 to 10 Lakh</option>";break;
			case 1000 :  cef_selopt_htm = "<option value='10 to 20 Lakh' optionid="+optionId+">10 to 20 Lakh</option>";break;
			case 1100 :  cef_selopt_htm = "<option value='20 to 50 Lakh' optionid="+optionId+">20 to 50 Lakh</option>";break;
			case 1200 :  cef_selopt_htm = "<option value='50 Lakh to 1 Crore' optionid="+optionId+">50 Lakh to 1 Crore</option>";break; 
		}
	}
	else
	{
		switch(parseInt(Math.floor(optionVal))){
			case 1    :  cef_selopt_htm = "<option value='INR' optionid="+optionId+">INR</option>";break;
			case 2    :  cef_selopt_htm = "<option value='USD' optionid="+optionId+">USD</option>";break;
			case 3    :  cef_selopt_htm = "<option value='GBP' optionid="+optionId+">GBP</option>";break;
			case 4    :  cef_selopt_htm = "<option value='EUR' optionid="+optionId+">EUR</option>";break;
			case 100  :  cef_selopt_htm = "<option value='>Upto 1000' optionid="+optionId+">Upto 1000</option>";break;
			case 200  :  cef_selopt_htm = "<option value='1000 to 3000' optionid="+optionId+">1000 to 3000</option>";break;
			case 300  :  cef_selopt_htm = "<option value='3000 to 10000' optionid="+optionId+">3000 to 10000</option>";break;
			case 400  :  cef_selopt_htm = "<option value='10000 to 20000' optionid="+optionId+">10000 to 20000</option>";break;
			case 500  :  cef_selopt_htm = "<option value='20000 to 50000' optionid="+optionId+">20000 to 50000</option>";break;
			case 600  :  cef_selopt_htm = "<option value='50000 to 0.1 Million' optionid="+optionId+">50000 to 0.1 Million</option>";break;
			case 700  :  cef_selopt_htm = "<option value='0.1 to 0.2 Million' optionid="+optionId+">0.1 to 0.2 Million</option>";break;
			case 800  :  cef_selopt_htm = "<option value='0.2 to 0.5 Million' optionid="+optionId+">0.2 to 0.5 Million</option>";break;
			case 900  :  cef_selopt_htm = "<option value='0.5 to 1 Million' optionid="+optionId+">0.5 to 1 Million</option>";break;
			case 1000 :  cef_selopt_htm = "<option value='1 to 2 Million' optionid="+optionId+">1 to 2 Million</option>";break;
			case 1100 :  cef_selopt_htm = "<option value='2 to 5 Million' optionid="+optionId+">2 to 5 Million</option>";break;
			case 1200 :  cef_selopt_htm = "<option value='5 to 10 Million' optionid="+optionId+">5 to 10 Million</option>";break;
			case 1300 :  cef_selopt_htm = "<option value='More than 10 Million' optionid="+optionId+">More than 10 Million</option>";break; 
		}
	}

	return cef_selopt_htm;
}
function createQuestions(questObj) {
	var text_count=0;
	var radio_count=0;
	var sel_count=0;
	var check_count=0;
	var ques=0;
	var last_id='';
	var inputTab = document.getElementById('inputTab');
	lengthIsqQues = questObj['questions'].length;
	for (var k = 0; k < questObj['questions'].length; k++) {
		for(var m=0;m<questObj['questions'][k]['ques_type'].length;m++)
		{ 
			if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'brand')
			{
				continue;
			}
			ques++;
			switch (questObj['questions'][k]['ques_type'][m]) {
				case '1'://input text
					{                                        
						text_count++;
						var inptdiv = document.createElement("div");
						if(m == 0)
						{
							inptdiv.innerHTML = questObj['questions'][k]['title'][m];
							inptdiv.setAttribute('class', 'iSq-h');
						}
						var elementdiv = document.createElement("div");
						elementdiv.setAttribute('class', 'tab-content-isq');
						elementdiv.setAttribute('id', 'IsqTab-'+ques);
						var elementLabel = document.createElement("label");
						elementLabel.setAttribute('optionid',questObj['questions'][k]['option_id'][m]);
						elementdiv.appendChild(elementLabel);
						var inputbox = document.createElement("input");
						inputbox.setAttribute('type', 'text');
						inputbox.setAttribute('placeholder', 'Enter '+questObj['questions'][k]['title'][m]);
						inputbox.setAttribute('id','option_text'+text_count);
						if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'usage/application')
						{
							inputbox.setAttribute('class', 'txtfcs wd768');
						}
						else if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'quantity')
						{
							inputbox.setAttribute('class', 'BrF2 txtfcs');
						}
						else
						{
							inputbox.setAttribute('class', 'txtfcs');
						}
						elementLabel.appendChild(inputbox);
						inputTab.appendChild(elementdiv);
						inputTab.appendChild(inptdiv); 
						inputTab.insertBefore(inptdiv,elementdiv);
						setquestionparam(questObj['questions'][k]['question_id'][m],questObj['questions'][k]['title'][m],'text_ques_id'+text_count,'text_ques_title'+text_count,elementdiv.id); 
						last_id='option_text'+text_count;
						break;
					}
				case '3'://select
					{
						sel_count++;
						var slctdiv = document.createElement("div");
						if(m == 0)
						{
							slctdiv.innerHTML = questObj['questions'][k]['title'][m];
							slctdiv.setAttribute('class', 'iSq-h');
						}
						var select = document.createElement("select");
						select.id='option_select'+sel_count;
						var fi_option = document.createElement("option");
						if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'quantity unit')
						{
							fi_option.text='Unit';
						}
						else
						{
							fi_option.text=questObj['questions'][k]['title'][m];
						}
						fi_option.value='';
						select.setAttribute('onchange',"cef_sel(this)");
						select.setAttribute('onfocus',"onfocusErrMsg(this.id)");
						select.setAttribute('name',questObj['questions'][k]['title'][m]);
						select.appendChild(fi_option);
						for (var b = 0; b < questObj['questions'][k]['options'][m].length; b++) {
							if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'approximate order value' || questObj['questions'][k]['title'][m].toLowerCase().trim() == 'currency')
							{
								var opt = CEF_OptionHash(questObj['questions'][k]['options'][m][b],questObj['questions'][k]['option_id'][m][b]);
								select.insertAdjacentHTML('beforeend',opt);
							}
							else
							{
								var option = document.createElement("option");
								option.value = questObj['questions'][k]['options'][m][b];
								option.text = questObj['questions'][k]['options'][m][b];
								option.setAttribute('optionid',questObj['questions'][k]['option_id'][m][b]);
								select.appendChild(option);
							}
						}
						if(m>0)
						{
							var errordiv = document.createElement("div");
							var elementp = document.createElement("p");
							var slctnode = $("#industry_ques").find('#'+last_id)[0];
							if(questObj['questions'][k]['title'][m].toLowerCase().trim() == 'currency'){elementp.setAttribute('id','q-error');elementp.setAttribute("style","margin:5px 0 0;position:absolute;padding-left: 170px;")}else{elementp.setAttribute('id','q-error-qty');}
							errordiv.appendChild(elementp);
							if(document.getElementById(last_id).parentNode.nodeName == "LABEL")
							{
								slctnode.parentNode.insertBefore(select, slctnode.nextSibling);
								slctnode.parentNode.appendChild(errordiv);
								document.getElementById(last_id).parentNode.parentNode.setAttribute("style", "width:100%;float:left;");
								select.setAttribute("style", "width:100px;background-position:74px -197px !important;border-radius:0px 4px 4px 0px!important");
								document.getElementById(last_id).parentNode.setAttribute("style", "width:222px;");
								document.getElementById(last_id).setAttribute("style", "width:210px;");
								setquestionparam(questObj['questions'][k]['question_id'][m],questObj['questions'][k]['title'][m],'select_ques_id'+sel_count,'select_ques_title'+sel_count,document.getElementById(last_id).parentNode.parentNode.id);
							}
							else
							{				
								try{
								slctnode.parentNode.insertBefore(select, slctnode.nextSibling);
								slctnode.parentNode.appendChild(errordiv);
								if(Math.floor($("#option_select"+sel_count).val()) == 1){
									select.setAttribute('style',"display:none");
								}else{
									document.getElementById(last_id).parentNode.setAttribute("style", "width: 100%;float: left;");
									if($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') == '91' && ($('#'+enq.CEF_S_countryname_enq).val() == 'India' || $('#'+enq.CEF_S_country_iso).val() == 'IN') && questObj['questions'][k]['title'][m].toLowerCase().trim() == 'currency')
									{
										select.setAttribute("style", "display:none");
									}
									else if($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') !== '91' && $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') !== '+91' && questObj['questions'][k]['title'][m].toLowerCase().trim() == 'currency')
									{
										select.setAttribute("class", "BrF enq-input4");	
										select.setAttribute("style", "width:100px;background-position:74px -197px !important");
									}
									else
									{
										select.setAttribute("style", "width:210px;float:left;background-position:187px -197px !important");
									}
								} 
								setquestionparam(questObj['questions'][k]['question_id'][m],questObj['questions'][k]['title'][m],'select_ques_id'+sel_count,'select_ques_title'+sel_count,$('#industry_ques').find('#'+last_id).parent().attr('id'));
								}catch(e){}
							}
						}
						else
						{
							var elementdiv = document.createElement("div");
							elementdiv.setAttribute('class', 'tab-content-isq');
							elementdiv.setAttribute('id', 'IsqTab-'+ques);
							if($('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') !== '91' && $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') !== '+91' && questObj['questions'][k]['title'][m].toLowerCase().trim() == 'approximate order value')
							{
								select.setAttribute("class", "BrF2 FlA enq-input4");
							}
							else
							{
								select.setAttribute('class', 'FlA enq-input4');
							}
							elementdiv.appendChild(select);
							inputTab.appendChild(elementdiv);
							inputTab.appendChild(slctdiv);
							inputTab.insertBefore(slctdiv,elementdiv); 
							setquestionparam(questObj['questions'][k]['question_id'][m],questObj['questions'][k]['title'][m],'select_ques_id'+sel_count,'select_ques_title'+sel_count,elementdiv.id); 
						}
						last_id='option_select'+sel_count;
						break;
					}
				case '2'://radio
					{
						radio_count++;
						var radiodiv = document.createElement("div");
						if(m == 0)
						{
							radiodiv.innerHTML = questObj['questions'][k]['title'][m];
							radiodiv.setAttribute('class', 'iSq-h');
						}
						var elementdiv = document.createElement("div");
						var idVal = 'radio'+radio_count+ques;
						elementdiv.setAttribute('class', 'tab-content-isq');
						elementdiv.setAttribute('id', 'IsqTab-'+ques);
						var arrayInner = questObj['questions'][k]['options'][m];   
						for (var z = 0; z < arrayInner.length; z++) {
							var inputlbl = document.createElement("label");
							inputlbl.setAttribute('optionid',questObj['questions'][k]['option_id'][m][z]);
							var inputRd = document.createElement("input");
							inputRd.name=questObj['questions'][k]['question_id'][m];
							inputRd.setAttribute('type', 'radio');
							inputRd.setAttribute('name', 'option_radio'+radio_count);
							inputRd.setAttribute('value', questObj['questions'][k]['options'][m][z]);   
							inputlbl.appendChild(inputRd);
							if(questObj['questions'][k]['options'][m][z].toLowerCase().trim() == 'others' || questObj['questions'][k]['options'][m][z].toLowerCase().trim() == 'other')
							{
								inputRd.setAttribute('id',idVal);
								inputRd.setAttribute('style','display:none');
								inputlbl.setAttribute('class','wd390');
								var inputtxt = document.createElement("input");
								inputtxt.setAttribute('id', 'rad'+idVal);
								inputtxt.setAttribute('class', 'othr-cls wdT20p');
								inputtxt.setAttribute('name', 'option_checkbox'+check_count);
								inputtxt.setAttribute('placeholder',  'Other ' +questObj['questions'][k]['title'][m]);
								inputtxt.setAttribute('onblur',  'saveTxtVal(\''+idVal+'\',\'rad'+idVal+'\',\'#industry_ques\');');
								inputlbl.appendChild(inputtxt);
							}
							else
							{
								var element = document.createElement("div");
								element.innerHTML = questObj['questions'][k]['options'][m][z];
								element.setAttribute('class', 'cef_ilb VaTP IsqTx');
								inputlbl.appendChild(element);
							}
							elementdiv.appendChild(inputlbl);
						}
						inputTab.appendChild(elementdiv);
						inputTab.appendChild(radiodiv); 
						inputTab.insertBefore(radiodiv,elementdiv);
						setquestionparam(questObj['questions'][k]['question_id'][m],questObj['questions'][k]['title'][m],'radio_ques_id'+radio_count,'radio_ques_title'+radio_count,elementdiv.id);
						break;
					}

				case '4'://checkbox
					{
						check_count++;
						var chkdiv = document.createElement("div");
						if(m == 0)
						{
							chkdiv.innerHTML = questObj['questions'][k]['title'][m];
							chkdiv.setAttribute('class', 'iSq-h');
						}
						var id ='option_checkbox'+check_count+ques;
						var elementdiv = document.createElement("div");
						elementdiv.setAttribute('class', 'tab-content-isq');
						elementdiv.setAttribute('id', 'IsqTab-'+ques);
						var arrayInner = questObj['questions'][k]['options'][m];
						for (var z = 0; z < arrayInner.length; z++) {
							var inputlbl = document.createElement("label");
							inputlbl.setAttribute('optionid',questObj['questions'][k]['option_id'][m][z]);
							var inputchk = document.createElement("input");
							inputchk.setAttribute('type', 'checkbox');
							inputchk.setAttribute('name', 'option_checkbox'+check_count);
							inputchk.setAttribute('value',questObj['questions'][k]['options'][m][z]);
							inputlbl.appendChild(inputchk);
							if(questObj['questions'][k]['options'][m][z].toLowerCase().trim() == 'others' || questObj['questions'][k]['options'][m][z].toLowerCase().trim() == 'other')
							{	
								inputchk.setAttribute('id',id);
								inputchk.setAttribute('style','display:none');
								inputlbl.setAttribute('class','wd390');
								var inputtxt = document.createElement("input");
								inputtxt.setAttribute('id', 'check'+id);
								inputtxt.setAttribute('class', 'othr-cls wdT20p');
								inputtxt.setAttribute('name', 'option_checkbox'+check_count);
								inputtxt.setAttribute('placeholder',  'Other ' +questObj['questions'][k]['title'][m]);
								inputtxt.setAttribute('onblur',  'saveTxtVal(\''+id+'\',\'check'+id+'\',\'#industry_ques\');');
								inputlbl.appendChild(inputtxt);
							}
							else{
								var element = document.createElement("div");
								element.innerHTML = questObj['questions'][k]['options'][m][z];
								element.setAttribute('class', 'cef_ilb VaTP IsqTx');
								inputlbl.appendChild(element);
							}
							elementdiv.appendChild(inputlbl); 
						}
						inputTab.appendChild(elementdiv);
						inputTab.appendChild(chkdiv); 
						inputTab.insertBefore(chkdiv,elementdiv);
						setquestionparam(questObj['questions'][k]['question_id'][m],questObj['questions'][k]['title'][m],'check_ques_id'+check_count,'check_ques_title'+check_count,elementdiv.id);
						break;
					}
			}
		}
	}
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	if(typeof(enq.sbmtDesc) == "undefined" && (prodType == 'P' || prodType == 'C'))
	{
		$("#inputTab").append('<div class="iSq-h">Other Details</div><div class="tab-content-isq" id="IsqTab-n"></div>');
		var desc_html = $("#desc_box").html();
		$("#IsqTab-n").html(desc_html);
	}
	industry_inputtabhtml=$('#inputTab').html();
}
function cef_sel(t)
{
	if(t.value==''){t.style.color='#5a5959';} else{t.style.color='#000000';};
}
function setquestionparam(ques_id,description,input_id,input_id_desc,maindiv)
{
	var inputbox_hi = document.createElement("input");
	inputbox_hi.setAttribute('type', 'hidden');
	inputbox_hi.setAttribute('id',input_id);
	inputbox_hi.setAttribute('value',ques_id);
	$('#'+maindiv).append(inputbox_hi);
	var inputbox_title = document.createElement("input");
	inputbox_title.setAttribute('type', 'hidden');
	inputbox_title.setAttribute('id',input_id_desc);
	inputbox_title.setAttribute('value',description);
	$('#'+maindiv).append(inputbox_title);
}

$('#isq_submit_btn').click(function(){
			var sbmt = firstStepV("#IsqTab-",'q-error-qty','q-error','#industry_form');
			if(!sbmt){return false;}
			industry_ques_response('industry_ques');
			CEF_NextEnrichmentStep();
});

function getIsqIDSV(id)
{
	var q_id = '';
	var q_list_id='';
	var count = 0;
	$("#"+id).find('input[type=text],select').each(function()
			{
			var type= $(this).attr('type'); 
			var type_id=$(this).attr('id');
			if((typeof(type)!=='undefined' && type=='text' && type_id.match(/option_text/g))) 
			{
			q_id=$(this).attr('id');
			}
			else if((typeof(type)=='undefined' && type_id.match(/option_select/g)))
			{
			if(count == 0){q_id =$(this).attr('id');}else{q_list_id =$(this).attr('id');}
			}
			count++;		
			});	
	return [q_id,q_list_id];
}
function industry_ques_response(id)
{
	var ques_id=new Array();
	var b_response=new Array();
	var ques_desc=new Array();
	var option_id=new Array();
	var val_imesh = imesh_obj.get();
	var em = $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'') == '91' ? $('#C_S_email_In').val() : $('#'+enq.CEF_S_email).val();
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	cefIdentifiedInfo();
	$(".cenq-bar-line").css({width:"80%"});
	ENQGATrack('ENQ_Submit_Isq','Onclick'); 
	var query_id=$('#queryID').val();
	if(cef_update_isq == true)
	{
		var res = createISQResponseHash('#q-second-ISQ');
		var ques_id1 = res[0]; var b_response1=res[1];var ques_desc1=res[2];var option_id1=res[3];
		var res_update = createISQResponseHash('#industry_ques');
		var ques_id2 = res_update[0];var b_response2=res_update[1];var ques_desc2=res_update[2];var option_id2=res_update[3];
		if(b_response2.length == 0 || ques_id2.length==0 || ques_desc2.length==0 || option_id2.length ==0)
		{
			return false;
		}
		else
		{
			ques_id = $.merge(ques_id1,ques_id2);
			b_response = $.merge(b_response1,b_response2);
			ques_desc = $.merge(ques_desc1,ques_desc2);
			option_id=$.merge(option_id1,option_id2);
		}
	}
	else
	{
		var hsh_res =createISQResponseHash('#'+id,ques_id,b_response,ques_desc,option_id);
		ques_id = hsh_res[0]; b_response=hsh_res[1];ques_desc=hsh_res[2];option_id=hsh_res[3];
	}
	var request_param = {
		"modid":glmodid,
		"token":"imobile@15061981",
		"ofr_id":query_id,
		"q_id":ques_id,
		"b_response":b_response,
		"q_desc":ques_desc,
		"enq":"1",
		"format":"1",
		"b_id":option_id,
		"mcat_id":mcat_setIsq,
		"UPDURL":window.location.href,
		"UPDIP":page.countryIp,
		"UPDIP_COUNTRY":page.country,
		"UPDATESCREEN":"DESKTOP ENQUIRY FORM"
	};
	if(val_imesh.em != 'undefined' && val_imesh.em!='')
	{
		request_param.glusr_email=val_imesh.em;
	}
	if(val_imesh.glid != 'undefined' && val_imesh.glid!='')
	{
		request_param.glusrid=val_imesh.glid;
	}
	if(cef_update_isq == true)
	{
		request_param.update =1;
	}
	if(typeof b_response !== 'undefined' && b_response.length > 0) 
	{
		ENQGATrack('ENQ_Submit_Isq_EnrichForm','Onclick');  
		if(id.match(/q-second-ISQ/ig))
		{
			ENQGATrack('ENQ_ISQSubmitEnrich1','OnSubmit');
		}
		else if(id.match(/industry_ques/ig))
		{
			ENQGATrack('ENQ_ISQSubmitEnrich2','OnSubmit');
		}
	}
	if(typeof(b_response)!=='undefined' && b_response!=''){
		cef_update_isq = true;
		rfqfunc.getResponse('setISQ',request_param,function(json_obj){},function(){});
}
}
function createISQResponseHash(id)
{
	var radio=0;
	var select=0;
	var text=0;
	var checkbox=0;
	var q_name='';
	var aov_present=0;
	var est_quant=0;
	var ques_id=new Array();
	var b_response=new Array();
	var ques_desc=new Array();
	var option_id=new Array();
	$(id).find('input[type=text],select,input[type=radio],input[type=checkbox]:checked').each(function()
			{
			var type= $(this).attr('type'); 
			var response='';
			if(typeof(type)!=='undefined' && type=='radio')
			{	
			if(q_name!==$(this).attr('name'))
			{
			radio++;
			q_name=$(this).attr('name'); 
			response=$(id).find('input[name=' + q_name + ']:radio:checked').val();	 
			if(typeof(response)!=='undefined' && response!=='')
			{
			ques_id.push($(id).find("#radio_ques_id"+radio).val());   
			ques_desc.push($(id).find("#radio_ques_title"+radio).val()); 
			option_id.push($(id).find(this).parent().attr('optionid'));
			b_response.push(response);
			}
			}
			else{return;}
			}
			else if(typeof(type)!=='undefined' && type=='checkbox')
			{
				if(q_name!==$(this).attr('name')){
					checkbox++; 
				}
				q_name=$(this).attr('name'); 
				ques_id.push($(id).find("#check_ques_id"+checkbox).val());   
				ques_desc.push($(id).find("#check_ques_title"+checkbox).val());  
				option_id.push($(id).find(this).parent().attr('optionid'));
				b_response.push($(id).find(this).val());
			}
			else if(typeof(type)==='undefined')
			{
				select++;
				q_id=$(this).attr('id'); 
				response=$(id).find('#'+q_id).val();
				if(typeof(response)!=='undefined' && response!==''){
					if($(id).find("#select_ques_title"+select).val().toLowerCase() == 'approximate order value') 
					{
						aov_present=1;
					}
					if($(id).find("#select_ques_title"+select).val().toLowerCase() == 'currency')
					{
						if(aov_present==1)
						{
							ques_id.push($(id).find("#select_ques_id"+select).val()); 
							ques_desc.push($(id).find("#select_ques_title"+select).val());
							option_id.push($(id).find('#'+q_id+' option:selected').attr('optionid'));
							b_response.push(response);
						}
					}
					else if($(id).find("#select_ques_title"+select).val().toLowerCase() == 'quantity unit')
					{
						if(est_quant==1)
						{
							ques_id.push($(id).find("#select_ques_id"+select).val()); 
							ques_desc.push($(id).find("#select_ques_title"+select).val());
							option_id.push($(id).find('#'+q_id+' option:selected').attr('optionid'));
							b_response.push(response);
						}
					}
					else
					{
						ques_id.push($(id).find("#select_ques_id"+select).val()); 
						ques_desc.push($(id).find("#select_ques_title"+select).val());
						option_id.push($(id).find('#'+q_id+' option:selected').attr('optionid'));
						b_response.push(response);
					}
				}
			}
			else if(typeof(type)!=='undefined' && type=='text'){
				text++;
				q_id=$(this).attr('id'); 
				response=$(id).find('#'+q_id).val();
				if(typeof(response)!=='undefined' && response!==''){
					if($(id).find("#text_ques_title"+text).val().toLowerCase() == 'quantity')
					{
						est_quant=1;
					}
					ques_id.push($(id).find("#text_ques_id"+text).val()); 
					ques_desc.push($(id).find("#text_ques_title"+text).val()); 
					b_response.push(response);
					option_id.push($(id).find(this).parent().attr('optionid'));
				}
			}
			});
	return [ques_id,b_response,ques_desc,option_id];
}
function CEF_NextEnrichmentStep()
{
	$("#isq_step").hide();
	prodType = (typeof(enq.CefProdType) != "undefined" && enq.CefProdType) ? enq.CefProdType : (((typeof(prod_serv)) !='undefined') ? prod_serv : 'P');
	if(typeof(enq.sbmtDesc) == "undefined" && $('#C_Desc_Prod').val() !== '' && $('#C_Desc_Prod').val() != undefined && (prodType == 'P' || prodType == 'C'))
	{
		sendThirdFormEnq();
	}
	else
	{
		showEnqLastStep();
	}
}
function cefSetLocalityName(data,CEF_LocalityName,CEF_CityName,CEF_StateName)
{
	$("#"+CEF_LocalityName).html('');
	$("#"+CEF_CityName).html('');
	$("#"+CEF_StateName).html('');
	if(typeof(enq.is_catalog_enq)=='undefined' || enq.is_catalog_enq==0)
	{
		if(typeof(data.locality) !== 'undefined' && data.locality!= "" && typeof(data.city) !== 'undefined' && data.city!== "" )
		{
			$("#"+CEF_LocalityName).html('&nbsp;|&nbsp;'+data.locality);
			if(data.city!==data.locality){
				$("#"+CEF_LocalityName).append("&nbsp;,&nbsp;");
				$("#"+CEF_CityName).html(data.city);}
		}
		else 
		{
			if(typeof(data.city) !== 'undefined' && data.city!== "" )
			{
				$("#"+CEF_CityName).html('&nbsp;|&nbsp;'+data.city);
				if(data.city!==data.state && typeof(data.state) !== 'undefined' && data.state!== ""){
					$("#"+CEF_CityName).append('&nbsp;,&nbsp;');
					$("#"+CEF_StateName).html(data.state);}
			}else{}
		}
	}
}
function updateEnquiry()
{
	var isd_code = $('#'+enq.CEF_S_cmobile_enq).val().replace(/\+/,'');
	var params_request = {  
		'rfq_id':$('#queryID').val(),
		'rfq_queryDestination':$('#query_type').val(),
		'rfq_r_glusr_usr_id':enq.R_glusr_id,
		'rfq_mod_id':enq.modid,
		'token':"imartenquiryprovider"
	};
	if(imesh_obj.get().fn == "" && $('#C_S_name').val() !== '')
	{
		params_request.rfq_s_name = $('#C_S_name').val();
	}
	if(isd_code == "91" && imesh_obj.get().em == "" && $('#C_S_email_In').val() !== '')
	{
		params_request.rfq_s_email = $('#C_S_email_In').val();
	}
	if(isd_code !== "91" && imesh_obj.get().mb1 == "" && $('#C_S_mobile_F').val() !== '')
	{
		params_request.rfq_s_mobile = $('#C_S_mobile_F').val();
	}
	if(imesh_obj.get().ct == "" && $('#C_S_city_enq').val() !=='')
	{
		params_request.rfq_s_city=$('#C_S_city_enq').val();
	}
	if($('#C_Desc_Prod').val() != "")
	{
		params_request.rfq_desc = $('#C_Desc_Prod').val();
	}
	if(params_request.rfq_id!='' && ((params_request.rfq_desc != '' && typeof(params_request.rfq_desc) != "undefined") || (params_request.rfq_s_mobile != '' && typeof(params_request.rfq_s_mobile) != "undefined") || (params_request.rfq_s_email !='' && typeof(params_request.rfq_s_email) != "undefined") || (params_request.rfq_s_name !='' && typeof(params_request.rfq_s_name) != "undefined") || typeof(params_request.rfq_s_city) !='undefined'))
	{
		rfqfunc.getResponse('sendBlEnq',params_request,function(response){},function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-enrich-error.mp');});
	}
}
function getInterestRecordId(imi_obj)
{
	var val_imesh = imesh_obj.get();
	var sender_glusr_id = (val_imesh.glid != "undefined") ? (val_imesh.glid) : '';
	if(imi_obj.is_admin == 1 || (val_imesh == undefined || val_imesh == -1 || val_imesh=="") || (sender_glusr_id == imi_obj.R_glusr_id))
	{
		return false;
	}
	var sender_email = val_imesh.em;
	var params_request = {
		"interest_sender_mobile":val_imesh.mb1,
		"interest_sender_first_name":val_imesh.fn,
		"interest_product_name":enq.R_title,
		"interest_current_url":window.location.href,
		"interest_modreftype":imi_obj.modreftypflag,
		"interest_sender_email_id":sender_email,
		"interest_modrefid":imi_obj.displayId,
		"interest_sender_ip":page.countryIp,
		"interest_mail_send":"0",
		"interest_sender_glusr_id":sender_glusr_id,
		"interest_sender_ip_country":page.country,
		"interest_sender_ip_country_iso":page.countryCode,
		"interest_modid":imi_obj.modid,
		"interest_rcv_glusr_id":imi_obj.R_glusr_id};
	params_request.interest_mcat_id = enq.CEF_mcat_id;
	rfqfunc.getResponse('intentGeneration',params_request,function(response){enq.interestId = response.Interest_id;},function(){});
}
function remainInfoFieldDecider()
{
	$('#new-usr-msg').text('Contact Information');
	$('#C_ProcessImg').hide(); $("#remain_info").show();
	$("#remain_info").find('#C_S_email_In').css('display','none');
	$("#remain_info").find('#C_S_mobile_F').css('display','none');
	$('#C_S_email_mobile_div').css('display','none');
	if(imesh_obj.get().fn == "" && $('#C_S_name').val() == ''){$('#C_S_name_div').css('display','block');}else{$('#C_S_name_div').css('display','none');}
	if(($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") && imesh_obj.get().ct == ""){$('#C_S_city_enq_div').css('display','block');}else{$('#C_S_city_enq_div').css('display','none');}
	if(imesh_obj.get().em == "" && ($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91"))
	{
		$("#remain_info").find('#C_S_email_In').css('display','block');
		$('#C_S_email_mobile_div').css('display','block');
		cefEmailSuggester('C_S_email_In');
		$("#icon_enq").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
		$("#icon_enq").css({"left":"93px","top":"1px"});
	}
	else if(imesh_obj.get().mb1 == "" && $('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91")
	{
		$("#remain_info").find('#C_S_mobile_F').css('display','block');
		$('#C_S_mobile_F').attr('tabIndex', 145);
		$('#C_S_mobile_F').css({"width": "90%","padding-left": "32px"});
		$("#icon_enq_email").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
		$("#icon_enq_email").css({"left": "9px"});
		$('#C_S_email_mobile_div').css('display','block');
	}
	if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
	{
		ENQGATrack('ENQ_ShowUserInfoStep','ShowUserInfoStepIndian'); 
		if(enq.againUIS == true) ENQGATrack('ENQ_ShowLastUserInfoStep','ShowUserInfoStepIndian'); 
	}
	else
	{
		ENQGATrack('ENQ_ShowUserInfoStep','ShowUserInfoStepForeign');
		if(enq.againUIS == true) ENQGATrack('ENQ_ShowLastUserInfoStep','ShowUserInfoStepForeign');
	}
}
function loginFieldDecider(){
	if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
	{
		$("#C_S_mobile").show();
		$("#C_S_email").hide();
		$('#C_country_dropdown .value').show();
		$("#icon_enq").removeClass("cef_bg eq-email-icon").addClass("cef_bg miconP");
		$("#icon_enq").removeAttr('style');
	}
	else
	{
		$("#C_S_email").show();
		$("#C_S_mobile").hide();
		$('#C_country_dropdown .value').hide();
		$("#C_S_email").css({"padding-left":"66px","width":"282px"});
		$("#icon_enq").removeClass("cef_bg miconP").addClass("cef_bg eq-email-icon");
		$("#icon_enq").css({"left":"45px","top":"1px"});
	}   
}
function showSlider(){
	$("#slider_li").empty();
	$("#slider_li").removeAttr('style');
	makeSliderLi();
	$('#multi_box,#slider_li,#opa_bx').show(); 
	$('#arrow-hover').hide();
	var lisize= $('#thumbnail li').size();
	if(lisize >= 5){
		$("#arrow-down").css("display","block");
		$("#arrow-up").css("display","block");
		$('.thumbnail_pos').addClass('top_p3');
	}
	if(lisize===4){    
		$('.thumbnail_pos').addClass('top_p3');
	}
	if(lisize===3){    
		$('.thumbnail_pos').addClass('top_p2');
	}
	if(lisize===2){
		$('.thumbnail_pos').addClass('top_p1');
	}
}
function sliderImageChange(sliderImage){
	$("#arrow-hover").css("display","none");
	$("#big_img_bx img").attr("src",sliderImage);
	$(".BlrImg").css("background-image",'url('+sliderImage+')');
			}
			function makeSliderLi(){
			for(i=0;i<enq.more_images.length;i++)
			{
			$("#slider_li").append("<li>" + "<div class='wd2_p cp'><div class='dsl_p'><div class='dsl_cl'><img onmouseover='sliderImageChange(\""+enq.more_images[i]+"\");' src='"+enq.more_images[i]+"'></div></div></div>" + "</li>");
			}     
			}
			function showBigImage(obj){
			if(typeof(enq.is_catalog_enq)!=='undefined' && enq.is_catalog_enq==1)
			{
			$("#slider_li").hide();
			if(typeof(enq.more_images)!=='undefined' && enq.more_images !== ''){$("#arrow-hover").show();}
			$("#arrow-down,#arrow-up,#opa_bx").css("display","none");
			}
			}
			function slideArrow(id,stype,direction){
			var ul = document.getElementById(id).getElementsByTagName('ul')[0];
			var li=ul.getElementsByTagName('li').length;
			var SlideLength = 69;
			if(li>4)
			{
				window.lilength=parseInt(li-4)* SlideLength;
			}
			var xval=getComputeTranslate(ul);
			if(stype=='down')
			{
				if((-window.lilength) < parseInt(xval))
				{
					xval=parseInt(xval- SlideLength);
				}
			}
			else
			{
				if(parseInt(xval)!=0)
				{
					xval=parseInt(xval+SlideLength);
				}
			}
			document.getElementById(id).getElementsByTagName('ul')[0].style.transform ='translate(0px, '+xval+'px)';
			document.getElementById(id).getElementsByTagName('ul')[0].style.msTransform ='translate(0px, '+xval+'px)';  
			}
function getComputeTranslate(obj){
	if(!window.getComputedStyle) return;
	var style = getComputedStyle(obj),
	    transform = style.transform || style.webkitTransform || style.mozTransform || style.msTransform;
	var mat = transform.match(/^translate\((.+)\)$/);
	if(mat) return parseFloat(mat[1].split(', ')[13]);
	mat = transform.match(/^matrix\((.+)\)$/);
	return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}
function otpGenerate()
{
	var mobile_val= imesh_obj.get().mb1 || $('#'+enq.CEF_S_mobile).val();
	var usr_cc = imesh_obj.get().phcc || '91';
	var usr_country = imesh_obj.get().iso || 'IN';
	var params_request = {  
		'token':"imobile@15061981",
		'mobile_num': mobile_val,
		'modid': enq.modid,
		'user_mobile_country_code': usr_cc,
		'flag':"OTPGen",
		'user_ip':page.countryIp,
		'user_country':usr_country,
		'process':"OTP_CentralisedEnqForm_Desktop",
		'user_updatedusing' :"DESKTOP ENQUIRY FORM"
	};
	if(typeof(enq.company)!='undefined' && enq.company!='')
	{
		params_request.company_name = enq.company;
	}
	$('#mobNumber').html(mobile_val);
	if(params_request.modid !='' && params_request.user_ip !='' && params_request.user_ip != undefined && params_request.user_country !='' && typeof(params_request.mobile_num) !== 'undefined' && params_request.mobile_num !=='' && typeof(params_request.user_mobile_country_code) !== 'undefined' && params_request.user_mobile_country_code !=='')
	{
		rfqfunc.getResponse('otp',params_request,function(response){otp_generated = 1;},function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-error.mp');});
	}
}
function resendOtp(){
	otpGenerate();
	$('#otpValue').val('');
	$('#otpValue_errMsg').hide();
	$('#resendOtp').attr("disabled","disabled").css({'opacity':'0.4','cursor':'default'});
	ENQGATrack('ENQ_OtpForm_Resend','Onclick');  
	setTimeout(function(){$('#resendOtp').prop("disabled", false).css({'opacity':'1','cursor':'pointer'});}, 30000);
	var timestamp_val = setInterval(blinker,1000);
	setTimeout(function(){clearInterval(timestamp_val);}, 5000);
}

function checkUserInfo()
{
	var imeshCookie = imesh_obj.get();	
	var name = '';
	if(typeof(imeshCookie.fn) != 'undefined' && imeshCookie.fn != null  && imeshCookie.fn != 'null'  && imeshCookie.fn != '')
	{
		name = typeof(imeshCookie.ln) === "undefined" || imeshCookie.ln === null  ? imeshCookie.fn : imeshCookie.fn+' '+imeshCookie.ln ;
	}						
	typeof(imeshCookie.fn) === 'undefined' || imeshCookie.fn === null || imeshCookie.fn === 'null' ? $('#C_S_name').val('') : $('#C_S_name').val(name);
	if(imeshCookie.phcc == '91'){
		typeof(imeshCookie.em) === 'undefined' || imeshCookie.em === null || imeshCookie.em === 'null' ? $('#C_S_email_In').val('') : $('#C_S_email_In').val(imeshCookie.em);
	}
	if(imeshCookie.phcc != '91'){
		typeof(imeshCookie.mb1) === 'undefined' || imeshCookie.mb1 === null || imeshCookie.mb1 === 'null' ? $('#C_S_mobile_F').val('') : $('#C_S_mobile_F').val(imeshCookie.mb1);	
	}
	typeof(imeshCookie.co) === 'undefined' || imeshCookie.co === null ? $('#'+enq.CEF_S_organization).val('') : $('#'+enq.CEF_S_organization).val(imeshCookie.co);					
	typeof(imeshCookie.cn) === 'undefined' || imeshCookie.cn === null ? $('#'+enq.CEF_S_countryname_enq).val() : $('#'+enq.CEF_S_countryname_enq).val(imeshCookie.cn);					
	typeof(imeshCookie.ct) === 'undefined' || imeshCookie.ct === null ? $('#C_S_city_enq').val('') : $('#C_S_city_enq').val(imeshCookie.ct);
	typeof(imeshCookie.ctid) === 'undefined' || imeshCookie.ctid === null ? $('#C_S_city_id').val('') : $('#C_S_city_id').val(imeshCookie.ctid);						
	typeof(imeshCookie.stid) === 'undefined' || imeshCookie.stid === null ? $('#C_S_state_id').val('') : $('#C_S_state_id').val(imeshCookie.stid);
}

function skipOtp()
{
	if((glmodid == 'MDC' || glmodid =='FCP') && (enq.CEF_form_type=="enq_inline" || enq.CEF_form_type=="enq_rhs") && ((typeof(enq.CEF_enrichFormAction) != "undefined") && (typeof(enq.CEF_enrichFormAction) === "function") && (typeof(enq.CEF_form_type) != "undefined") && (enq.CEF_form_type != '')))
	{
		enq.CEF_enrichFormAction.apply();	
	}
	else
	{
		$('#enquiryOtp_second').hide();
		$('#CEF_EnqPart,#C_Thank_msg').show();
		$('.cBtn').removeClass('TP29');
		$("#CEF_EMFHtmlID").hide();
		hidePayX();
		ENQGATrack('ENQ_ShowThankyouStep','OnShowEnrichment'); 
		if($('#amazonStrip').css('display') == 'block')
		{
			ENQGATrack('ENQ-Amazon-Ad-Thankyou','ViewPort'); 
		} 
	}
	ENQGATrack('ENQ_OtpForm_Skip','Onclick');
}
$('#otpValue').on('keydown', function(event){
		var code_event=(event.keyCode?event.keyCode:event.which);
		if(code_event == 13){
		otpVerify();
		}
		});
function otpVerify()
{
	var mobile_val=imesh_obj.get().mb1 || $('#'+enq.CEF_S_mobile).val();
	var usr_cc = imesh_obj.get().phcc || '91';
	$('#otpValue_errMsg').hide();
	otp_hit = 0;
	var params_request = {  
		'token':"imobile@15061981",
		'mobile_num': mobile_val,
		'modid': enq.modid,
		'user_mobile_country_code': usr_cc,
		'flag':"OTPVer",
		'auth_key':$("#otpValue").val(),
		'glusrid':imesh_obj.get().glid,
		'verify_process':'Online',
		'verify_screen' : "DESKTOP ENQUIRY FORM"
	};
	if(typeof(enq.company)!='undefined' && enq.company!='')
	{
		params_request.company_name = enq.company;
	}
	if($("#otpValue").val() == ''){$('#otpValue_errMsg').html('Please enter the correct verification code.');$('#otpValue_errMsg').css('display','block');}
	if($('#otpValue').val() != "")
	{
		ENQGATrack('ENQ_OtpForm_Submit','Onclick'); 
	}
	if(enquiry_count>=1)
	{
		if($('#otpValue').val() != "")
		{
			ENQGATrack('ENQ_OTPSubmitAfter3Enq','OnClickOTP'); 
		}
	}
	if(params_request.user_mobile_country_code !=='' && params_request.mobile_num !=='' && params_request.glusrid !=='' && params_request.modid !=='' && params_request.auth_key!=='' &&  params_request.auth_key.length==4)
	{
		rfqfunc.getResponse('otp',params_request,otpVerifySuccess,function(message){imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-error.mp');});
		
}
else
{
	$('#otpValue_errMsg').html('Please enter the correct verification code.');
	$('#otpValue_errMsg').css('display','block');
}
}
function otpVerifySuccess(response)
{
	var v4iilex_val= readCookie('v4iilex');
	var val_imesh = imesh_obj.get();
	var mobile_val=imesh_obj.get().mb1 || $('#'+enq.CEF_S_mobile).val();
	if(response.Response.Status == 'Failure')
	{
		$('#otpValue_errMsg').html('Please enter the correct verification code.');
		$('#otpValue_errMsg').css('display','block');
		otp_failure = 1;
	}
	else if(response.Response.Status == 'Success' && response.Response.Code == '200')
	{
		otp_status = 1;otp_hit = 1;
		if(val_imesh != "" && v4iilex_val != "" && typeof(setCookieUv) != "undefined")
		{
			setCookieUv();
			verified=1;
		}
		else
		{
			userDetailsAutoFetch(mobile_val);
			setTimeout(function(){verified=1;},500);
		}
		try{
			if((glmodid == 'FCP' || glmodid == 'MDC') && (typeof(enq.CEF_enrichFormAction) != "undefined") && (typeof(enq.CEF_enrichFormAction) === "function") && (typeof(enq.CEF_form_type) != "undefined") && (enq.CEF_form_type != '') && $('#enquiryOtp').html() == "")
			{
				var timer = setInterval(function(){if(imeshSet == 1){enq.CEF_enrichFormAction.apply();clearInterval(timer);}},500);
			}
			else
			{
				if(enquiry_count>=1)
				{
					var Intvar = setInterval(function(){ 
						if(login_response == 1 || verified==1)
						{
							enquiry_count=0;
							$('#enquiryOtp_second').hide();
							showEnquiryForm(enq);
							clearInterval(Intvar);
						}
					}, 1000);
					ENQGATrack('ENQ_OTPVerifySuccessAfter3Enq','OnClickOTP'); 
					if((($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91") && ($('#C_S_email_In').val() == '' || $('#'+enq.C_S_name).val()== '' || $('#C_S_city_enq').val() == '' )))
					{
						ENQGATrack('ENQ_ShowContactDetailAfter3Enq','OnShowEnrichment'); 
					}
					else
					{
						ENQGATrack('ENQ_ShowEnrichment1After3Enq','OnShowEnrichment'); 
					}
				}
				else
				{ 
					if($('#enquiryOtp').html() == "")
					{
						$('#enquiryOtp_second').hide();
						$('#CEF_EnqPart,#C_Thank_msg').show();
						$('.cBtn').removeClass('TP29');
						$("#CEF_EMFHtmlID").hide();
						hidePayX();
						ENQGATrack('ENQ_ShowThankyouStep','OnShowEnrichment'); 
						ENQGATrack('ENQ_OtpForm_OtpVerifySuccess','Onclick'); 
						if($('#amazonStrip').css('display') == 'block')
						{
							ENQGATrack('ENQ-Amazon-Ad-Thankyou','ViewPort'); 
						} 
					}
					else{
						imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-otpform-verify-success-enrichment.mp');
					}
				}
			}
		}catch(e){}
	}
}
function blinker() {
	$('#blink-msg').fadeOut(500);
	$('#blink-msg').fadeIn(500);
}
function callGetIsqService()
{
	if(typeof(enq.sbmtDesc) == "undefined")
	{
		$('#C_Desc_Prod').val('');	
	}
	if(enq.CEF_mcat_id!=='' && enq.CEF_mcat_id != undefined)
	{
		getindustry_specific_ques(enq.CEF_mcat_id,'3');
	}
	else if(enq.CEF_cat_id !== '' && enq.CEF_cat_id != undefined)
	{
		getindustry_specific_ques(enq.CEF_cat_id,'2');
	}
	else
	{
		isqAvail = 1;
	}
}
function trackUserInfoStep()
{
	if($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91")
	{
		ENQGATrack('ENQ_ShowUserInfoStep','ShowUserInfoStepIndian'); 
	}
	else if($('#'+enq.CEF_S_cmobile_enq).val() !== "+91" && $('#'+enq.CEF_S_cmobile_enq).val() !== "91")
	{
		ENQGATrack('ENQ_ShowUserInfoStep','ShowUserInfoStepForeign'); 
	}
}
function ENQGATrack(TracName,TracEvent)
{
	if(typeof _gaq != "undefined" && _gaq != null){ _gaq.push(['_trackEvent',TracName,TracEvent, enq.modid , 0, true]);}
}

function tracPayX(){
	ENQGATrack('ENQ_submitPayXBnr','Onsubmit'); 
}

function getAmazonStrip(jsonResult)
{
	var len = jsonResult.data.length || 0;
	if(len != 0 && len >= 3)
	{
		var AmazonData=[]; enq.amazon = true;
		for (var i = 0; i < len; i++) 
		{
			var amazon_arr = [];
			amazon_arr["imgTS"] = jsonResult.data[i].PC_ITEM_IMG_LARGE_125X125;
			amazon_arr["titleTS"] = jsonResult.data[i].TITLE;
			amazon_arr["priceTS"]  = jsonResult.data[i].SDA_PC_ITEM_FOB_PRICE;
			amazon_arr["urlTS"] = jsonResult.data[i].ECOM_URL;
			AmazonData.push(amazon_arr);
		}
		var len_Data = AmazonData.length;
		var diff = len_Data - 10;
		if(diff>0){
			for(var i=0;i<diff;i++)
			{
				AmazonData.pop();
			}
		}		
		createAmazonHtml(AmazonData);		
	}
}

function createAmazonHtml(AmazonArr)
{
	$('#amazonBx').html(''); 
	amazonHtml = '';
	var unitLength = AmazonArr.length;
	var amazonDiv = document.getElementById('amazonBx');
	for(var i=0; i<unitLength; i++)
	{

		amazonDiv.innerHTML += '<div class="unitt"><div id="ts_rbon_'+i+'"></div><a id="ts_anchr_'+i+'" Onclick="tracAmazon();" target="_blank"><div class="imgc"><img alt="ads" style="display: inline;" id="ts_img_'+i+'"></div><span id="ts_title_'+i+'" class="title"></span><div class="Enprc" id="ts_price_'+i+'"></div><div class="Eecom-container"><img src="//utils.imimg.com/imsrchui/imgs/Amazon-Favicon-64x64.png" data-original="//utils.imimg.com/imsrchui/imgs/Amazon-Favicon-64x64.png" style="display: block;"><span class="Btn-E">Shop Now</span></div></a></div>';
		AmazonArr[i]["imgTS"] = AmazonArr[i]["imgTS"].replace('http:','');
		AmazonArr[i]["urlTS"] = AmazonArr[i]["urlTS"];
		AmazonArr[i]["urlTS"] = AmazonArr[i]["urlTS"].replace(/i0f1a-21/ig,"imenq-21");
		$('#ts_anchr_'+i).attr('href',AmazonArr[i]["urlTS"]);
		$('#ts_img_'+i).attr('src',AmazonArr[i]["imgTS"]);
		$('#ts_title_'+i).attr('title',AmazonArr[i]["titleTS"]);
		if(AmazonArr[i]["titleTS"] != '' && AmazonArr[i]["titleTS"].length > 45){
			AmazonArr[i]["titleTS"] = AmazonArr[i]["titleTS"].substr(0,45) + '...'; 
			$('#ts_title_'+i).html(AmazonArr[i]["titleTS"]);
		}
		else{
			$('#ts_title_'+i).html(AmazonArr[i]["titleTS"]);
		}
		$('#ts_price_'+i).html('Rs '+AmazonArr[i]["priceTS"]);
		i == 1 ? $('#ts_rbon_'+i).attr('class','rbon').html('Best Price') : '';
		i == 3 ? $('#ts_rbon_'+i).attr('class','rbon').html('Selling Fast') : '';
		i == 5 ? $('#ts_rbon_'+i).attr('class','rbon').html('Best Deal') : '';
		i == 9 ? $('#ts_rbon_'+i).attr('class','rbon').html('Popular') : '';
	}
	$('#amazonStrip').show();
	$('#thankBx').removeClass('q-thnx_msg').addClass('q-thnx_msg1');
	$('#view_next').removeClass('btn_vm').addClass('btn_vm_n');
	$('#thx_arw').removeClass('mRg1').addClass('mRg');
	$("#Bg-thnk").css({'padding-top':'15px'});
	amazonHtml = $('#amazonStrip').html();
}

function tracAmazon()
{
	ENQGATrack('ENQ-Amazon-Ad-Thankyou','onClick'); 
}

$(document).keydown(function(e) {
		if(e.keyCode == 27 )
		{	
		if($('#queryID').length > 0 && $('#queryID').val() != "")
		{
		$('#queryID').val('');
		}
		var cef_esc_flag = 0;
		if(typeof(enq.R_title) != 'undefined' && enq.R_title != "")
		{
		if(nxtprevflag ==0){history.back();}
		} 
		if($('#'+enq.CEF_form_disp_id).css('display') == 'block' && $('#CEF_EMFHtmlID').css('display') == 'none')
		{
		if(enq.CEF_form_type == '')
		{
		cef_esc_flag = 1;
		}
		hideEnquiryForm();
		ENQGATrack('ENQ_EscLoginStep','OnEsc'); 		
		}
		else if($('#enquiryOtp_second').css('display') == 'block' && $('#CEF_EMFHtmlID').css('display') == 'none' && $("#isq_step").css('display') == 'none')
		{
			cef_esc_flag = 1;
			ENQGATrack('ENQ_EscOtpAfter3Enq','OnEsc'); 
			hideEnquiryForm();    
		}
		else if($('#CEF_EMFHtmlID').css('display') == 'block' && $('#CEF_Enrich_Forsecond').css('display') == 'none' &&  $("#isq_step").css('display') == 'none' && $('#enquiryOtp_second').css('display') == 'none')
		{
			cef_esc_flag = 1;
			hideEnquiryForm();
			ENQGATrack('ENQ_EscFirstEnrichForm','OnEsc'); 
		}
		else if($('#CEF_Enrich_Forsecond').css('display') == 'block')
		{
			cef_esc_flag = 1;
			hideEnquiryForm();
			ENQGATrack('ENQ_EscSecondEnrichForm','OnEsc'); 
		}
		else
		{
			cef_esc_flag = 1;
			hideEnquiryForm();
		}
		if(cef_esc_flag == 1)
		{
			if((glmodid == 'MDC' || glmodid == 'FCP') && (typeof(enq.CEF_enrichFormAction) != "undefined") && (typeof(enq.CEF_enrichFormAction) === "function"))
			{
				if(($('#'+enq.CEF_S_cmobile_enq).val() == "+91" || $('#'+enq.CEF_S_cmobile_enq).val() == "91" ) &&  enquiry_count==1){}else{enq.CEF_enrichFormAction.apply();}				
			}
		}
		if(glmodid=='FCP' ||glmodid =='MDC' || glmodid == 'PRODDTL')
		{
			page.Identified();	
		}
		cefImIntFlag = 0;
		nxtprevflag=0;
		}
		if($('input:focus').length == 0 && $('textarea:focus').length == 0 && e.keyCode == 39 && $('#enquiry').css('display')=='block' &&  $('#qnext').css('display')=='block'){
			cenqNxtProd();
			imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-form-nxt-key.mp');
		}
		if($('input:focus').length == 0 && $('textarea:focus').length == 0 && e.keyCode == 37 && $('#enquiry').css('display')=='block' && $('#qpre').css('display')=='block'){
			cenqPreProd();
			imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-form-pre-key.mp');
		}
});
$(window).on('popstate', function(e) {	
		if(typeof(enq.R_title)!=='undefined' && enq.R_title!=='' && $('#enquiry').css('display') == 'block')
		{
		hideEnquiryForm();
		nxtprevflag=0;
		cefImIntFlag = 0;
		imInvokeRequestForGaCode('/cgi/enquiry-'+enq.modid+'-backbutton-click.mp');
		}
		});
$('#C_EnqBtn').on('keydown', function(e) { 
		var keyCode = e.keyCode || e.which; 
		if (keyCode == 9) { 
		e.preventDefault(); 
		} 
		});
$('#CEF_EnqForm input').on('keydown', function(event) 
{
	var code_event=(event.keyCode?event.keyCode:event.which);
	if (code_event == 13 && $("#C_EnqBtn").is(":focus")===false && $('.sugD,.ui-menu-item').is(":visible")===false) {
		cefValidate();
	}
});
var cefChkUserFlag = 0;
var cefImIntFlag = 0;
var check_price=0;
var industry_ques={};
var industry_questions_found=0;
var industry_inputtabhtml = '';
var nxtprevflag=0;
var otp_status=0;
var otp_failure=0;
var otp_generated='';
var otp_hit = '';
var imeshSet = 0;
var lengthIsqQues = 0;
var prodType = 'P';
var verified = 0;
var enquiry_count = 0;
var login_response=0;
var mcat_setIsq='';
var did = {};
var img_form = 0;
var showFirstEnrich=0;
var cef_isq_html='';
var cef_update_isq = false;
var cef_only3isq = 0;
var industry_ques_firstStep= {};
var txtchk = 0;
var txtrad = 0;
var usrupdate=0;
var isqAvail = 0;
var callIsqFlag = false;
var amazonHtml= '';