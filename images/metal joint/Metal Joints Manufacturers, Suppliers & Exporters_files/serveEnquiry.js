var cef_EMFDownloadHtml = '';
var imesh_cookie_obj = {}; 
if(typeof(cimjsv) === "undefined")
cimjsv = new Object();
cimjsv['//utils.imimg.com/enquiry/js/serveEnquiry.js']=353;

// var abtest_split;
// var utma_val=readCookie('__utma');
// if(typeof(utma_val) != "undefined" && utma_val!=''){
// utma_val=utma_val.split('.');
// var visitor_id=utma_val[1];
// abtest_split=visitor_id%2;
// }

function loadBackupScript(callback){
	if (typeof callback !== 'function') {
		throw 'Not a valid callback';
	}
	if(typeof(jQuery) === "function")
	{
		callback.apply();
	}
	else
	{
		var js_script = document.createElement('script');
		js_script.onload = callback;
		js_script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js';
		js_script.type = 'text/javascript';
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(js_script);
	}
}
loadBackupScript(function() { scriptLoadHandler(); });
function scriptLoadHandler()
{
		var utils_host_nm =getUtilsURL();
        var cssType='enquiry-v106.css';
        var urlType = "//"+utils_host_nm+"/enquiry/js/serveEnquiryHtml-v93.js?callback=serveEnqHtml";
		$('<link rel="stylesheet" type="text/css" href="//'+utils_host_nm+'/enquiry/css/'+cssType+'" rel="stylesheet" type="text/css"/>').appendTo("head");	  
		$.ajax({
		url: urlType,
		jsonp : false,
		dataType: "jsonp",
		jsonCallback: "jsonp",
		cache: true
		});
}
function serveEnqHtml(response)
{       
	var utils_host_nm =getUtilsURL();
    var jsType = 'enquiryMultiForm-v241.js';
	// var jsCentral  = 'central-v1.js';
	var enquiry = document.createElement("div");
	var divId = 'enquiry';
	enquiry.setAttribute("id", divId);
	document.body.appendChild(enquiry);
	$("#"+divId).hide();
	document.getElementById('enquiry').innerHTML = response;
    scriptLoadHandlerEnrichForm();
	var head = document.getElementsByTagName('head')[0];
	if(typeof(Suggester) === 'undefined' && glmodid!='IMOB'){  
	    var script2 = document.createElement('script');
	    script2.type = 'text/javascript';
	    script2.src = "//"+utils_host_nm+"/suggest/js/jq-ac-ui.js";
	    head.appendChild(script2);
	}
	var script1 = document.createElement('script');
	script1.type = 'text/javascript';
	script1.src = "//"+utils_host_nm+"/enquiry/js/"+jsType+"";
	var script2 = document.createElement('script');
	//script2.type = 'text/javascript';
	//script2.src = "//"+utils_host_nm+"/common/js/"+jsCentral+"";
	//head.appendChild(script2);	
	head.appendChild(script1);	
}
function scriptLoadHandlerEnrichForm()
{
	      var host_nm =getUtilsURL();
          var loadurl="//"+host_nm+"/enquiry/js/secondEnquiryForm-v57.js?callback=serveEnrichFormHtml";
		  $.ajax({
	      url:loadurl,
	      jsonp : false,
	      dataType: "jsonp",
	      jsonCallback: "jsonp",
	      cache: true
	      });
}
function serveEnrichFormHtml(response)
{
	cef_EMFDownloadHtml = response;
}
function activateEnqConversionTracking(){
	var img1 = document.createElement("img");
	var img2 = document.createElement("img");
	img1.onload = function() { return; };
	img2.onload = function() { return; };
	img1.src = "//www.googleadservices.com/pagead/conversion/1067418746/?value=1.00&label=qPViCN7MqQkQ-oj-_AM&guid=ON&script=0";
	img2.src = "//www.googleadservices.com/pagead/conversion/975765630/?value=1.00&label=RDmqCJq2uAkQ_oCk0QM&guid=ON&script=0";
}
function getUtilsURL()
{
	var utils_host_nm = 'utils.imimg.com';
	if(window.location.href.match(/(\/\/dev-|\/\/dev.|file:\/\/)/ig))
	{
	  utils_host_nm = 'dev-utils.imimg.com';
	}else if(window.location.href.match(/(\/\/stg-|\/\/stg.|file:\/\/)/ig))
	{
	  utils_host_nm = 'stg-utils.imimg.com';
	}
	return utils_host_nm;
}
