var myWidth = 0, myHeight = 0;
function cls()
{try{document.getElementById('sourcediv').className="soff";}catch(err){}}
function info(divId){
	document.getElementById(divId).style.display ='block';}
function info1(divId){
	document.getElementById(divId).style.display ='none';
}
/*
Input: File name of the Mcat page
Outout: Redirection to impcat city page.
*/
function cityRedirectToImpcat(Form,urlname,biz_val,price)
{
    var string=Form.city_ss.value;
    var biz_url = '';
    if(biz_val > 0)
    {
        biz_url = '?biz='+biz_val;
    }
    if(string != 'Enter city...')
    {
        string = string.replace(/[^a-zA-Z0-9\.\- ]/g, '');
        string = string.replace(/(^\s+)/,'') ;
        string = string.replace(/(\s+$)/,'') ;
        string = string.replace(/(\.)/g,'-') ;
        string = string.replace(/\s+/g,'-') ;
        string = string.replace(/--/g,'-') ;
        string = string.replace(/-+$/,'') ;
        string = string.toLowerCase() ;
        if(urlname)
        {
            if(string.length<1)
            {
                alert("Please enter valid city of your choice...");
            }
            else
            {
                $.ajax(
                {
                    url: "https://utils.imimg.com/suggest/suggest.php",
                    dataType: "jsonp",
                    data : {q : string,limit: 1,type:'city',match:'exact',method:'exact'},
                    success:function(n)
                    {
                        if((n.city.length)>0)
                        {
                            window.location=(urlname.match(/ss=/g))?urlname+'&cq='+string:'//'+location.hostname+'/'+string+'/'+urlname+'.html'+biz_url+price;
                        }
                        else
                        {
                            alert("Please enter valid city of your choice...");
                        }
                    },
                    jsonpCallback: "cityname",
                    cache: !0
                });
            }
        }
        else
        {
            window.location = '//'+location.hostname+'/impcat/';
        }
        return false;
    }
}
/* to resolve onload*/ 
$('.res').load(function() {
		resize_hw(this, 100, 100);
		});
// Google Custom Code Start
var google_adnum = 0; /* only insert this line for your first ad unit */
function loadGoogleAdScript(label){
document.write = function(text)
{
	$('#'+label).append(text);
};
$.getScript("//pagead2.googlesyndication.com/pagead/show_ads.js");	
}
// Google Custom Code End
/*City-Detail MCAT Scroll Function */
$(document).ready(function(){
                $(".show-all").click(function(){
                        $(".moreBuisness").slideDown("slow");
                        $(this).hide();
                        $("#Relgn").css("margin-top","0px")
                        });
                });
/*City Detail - Replace Big image path with blank src */
function zoomimg(imageNm)
{
	var changepath = document.getElementById('imgzoom'); 
	changepath.src = imageNm;

}
/* City Detail Page - Visit Place Zoom-up Image*/
$(document).ready(function(){
                $(".closeZoomIcon").click(function(){
                        $("#close-zoom-img").fadeOut("fast");
			$("#imgzoom").attr({src: ""});
                        });
                $(".place img").click(function(){
                        $("#close-zoom-img").fadeIn("fast");
                        });
                document.onkeydown = function(evt) {
                evt = evt || window.event;
                if (evt.keyCode == 27) {
                $("#close-zoom-img").fadeOut("fast");
		$("#imgzoom").attr({src: ""});
                }
                };
                //Code to manage bottom related-mcat-strip
//                 if ($('.rcu').length ===1)
//                 {$('.rcu').addClass('tbl')}
                if($('.rcu.w50 li').length <= 1)
                {$('.rcu').removeClass('rl')}
                if($('.rcu.rl li').length > 4)
                {
                    var rc1 = $('.rcu.rl li:nth-child(1)').height();
                    var rc2 = $('.rcu.rl li:nth-child(2)').height();
                    var rc3 = $('.rcu.rl li:nth-child(3)').height();
                    var rc4 = $('.rcu.rl li:nth-child(4)').height();
                    var rc5 = $('.rcu.rl li:nth-child(5)').height();
                    if($('.rcu.rl li').length > 5)
                    {
                        var rc6 = $('.rcu.rl li:nth-child(6)').height();
                        if((rc1>16 && rc2>16) || (rc2>16 && rc3>16) || (rc3>16 && rc1>16))
                        {
                            $('.rcu.rl li:nth-child(6)').hide();
                            if((rc3>16 && rc4>16) || (rc4>16 && rc5>16) || (rc5>16 && rc3>16))
                            {
                                $('.rcu.rl li:nth-child(5)').hide();
                            }
                        }
                        else if((rc4>16 && rc5>16) || (rc5>16 && rc6>16) || (rc6>16 && rc4>16))
                        {
                            $('.rcu.rl li:nth-child(6)').hide();
                        }
                    }
                    else
                    {
                        if(rc1>16 && rc2>16 && rc3>16 && rc4>16)
                        {
                            $('.rcu.rl li:nth-child(5)').hide();
                        }
                    }
                }
});
function show_dfp_ad_md()
        {
                if(typeof(adsbygoogle)!="undefined" && typeof(google_middleAd)!="undefined" && google_middleAd == 1)
                {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                }
                else
                {
                        setTimeout(function(){show_dfp_ad_md()}, 50);
                }
        }
        head.js("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
        head.ready("adsbygoogle.js", function(){
        show_dfp_ad_md();
        });
// bl form form implementation
function setIMFormObject(imform,key)
{
        var storageTime = Math.floor((new Date).getTime()/1000);
        var formObject = parseFormJson(localStorage[imform.toLowerCase()] || "{}");
        formObject[key] = storageTime;
        // Put the object into storage
        localStorage.setItem(imform, JSON.stringify(formObject));
}
function getIMFormObject(imform,key)
{
        // Retrieve the object from storage
        return $.parseJSON(localStorage[imform.toLowerCase()]||'{}')[key.toLowerCase()];
}
function parseFormJson(data) {
    return JSON ? JSON.parse(data) : eval("(" + data + ")")
}
//FEEDBACK JS START

function add_feedback_link(){
$(document).ready(function() {
ims.feedback_id = '';
ims.fdbkTime = 30;
ims.feedbackShow = 0;
ims.autoFdbkShow = 0;
var feedStorageTime = getIMFormObject('imform','imfdbk');
if(typeof(feedStorageTime) != "undefined"){
    var currentTime = Math.floor((new Date).getTime()/1000);
    var timedifference = currentTime - feedStorageTime;
    if(timedifference > 1800){
        ims.feedbackShow = 1;
        page.notMeQ.push(feedback_reset);
    }
}else{
    ims.feedbackShow = 1;
    page.notMeQ.push(feedback_reset);
}
ims.fdbkmcatname = typeof(page.mcatName) != "undefined" && page.mcatName || '';
if($(document).height() > 2300 && ims.feedbackShow == 1)
{
      $('#hfdiv').append('<div id="main_div_fdbk"><div class="s_fd st_p animated" onclick="sticky_feedback();"><span class="fdco"></span><span class="text bg"></span><div id="close-fd" class="cl_d" style="margin: -5px 15px 0px;">X</div></div><div class="stcon sbtm" id="fdbk_form" style="display:none"><div class="srch_feedback goff" name="srch_feedback" id="srch_feedback" style="display:block;margin:5px 0"><div class="fb_div" id="thx_ms"><form name="form1" method="post" action=""><div style="display: block;" id="fd_box"><div class="se_txt"> Were results useful? </div><div class=" sm" id="r0" onClick="show_satisfy()"><div class="lk_in"><img src="//utils.imimg.com/imsrchui/imgs/like1.png"></div> Yes </div><div id="r1" onClick="show_not_satisfy()" class="sm"><div class="dis_in"><img src="//utils.imimg.com/imsrchui/imgs/dislike.png"></div> No</div><div class="clb"></div></div><div id="sugd" style="display:none;"><div id="user_unidentity" style="display: none;"><dl class="dropdown country-dropdown-fdbk" id="country-dropdown-fdbk" autocomplete="off"></dl><input type="hidden" value=""><div id="ind_fdbk"><div id="mob_fd"><input type="text" maxlength="10" placeholder="Mobile Number" class="mobn" style="text-indent: 100px;" onblur=checkmob("mob"); id="mob" name="mob"><p id="show_mob" style="display:none" class="show_mob"></p></div><div id="email1_fd" style="display:none"><input type="text" maxlength="40" placeholder="Email Id" class="mobn" onblur=checkemail("email1");  id="email1" name="email1" ><p id="show_email" style="display:none" class="show_mob"></p></div></div></div><div id="suggestion"><textarea class="tx_a input_fd" id="r2" name="suggestion" style="display:none"></textarea></div><div id="opt"><div class="lblk feedback-item" id="r11" onClick="product_msg()" ><div class="fsms" style="display:none"> Select a category that describes your issue: </div><input type="radio" placeholder=" I couldn\'t find the required product"   name="suggestion1" class="input_fd"  id="radio1_fd" ><label for ="radio1_fd"> I couldn\'t find the required product</label><textarea class="tx_a fd-none" name="suggestion"  id="radio1" ></textarea></div><div class="lblk feedback-item" onClick="location_msg()"  ><input type="radio" placeholder="My location preference does not match" data-id="radio2" name="suggestion1" id="radio2_fd" class="input_fd" ><label for ="radio2_fd" > My location preference does not match </label><textarea class="tx_a fd-none" name="suggestion"  ></textarea></div><div id="r13" class="lblk feedback-item" onClick="contact_msg()" ><input type="radio" placeholder="Listed supplier is not responding"  data-id="radio3" name="suggestion1" id="radio3_fd" class="input_fd" ><label for="radio3_fd" > Listed supplier is not responding </label><textarea class="tx_a   fd-none" name="suggestion"    ></textarea></div><div class="lblk feedback-item" id="r14" onClick="other_msg()" ><input type="radio" placeholder="Any other reason" data-id="radio4" name="suggestion1"  id="radio4_fd" class="input_fd" ><label for ="radio4_fd"> I have Other concern</label><textarea class="tx_a fd-none" name="suggestion"  id="radio4" onblur=checkcomment("radio4");></textarea><p id="fd_comment" style="display:none" class="fsms"></p></div></div><input type="button" onClick="submit_comment_feedback();" value="Submit" id="Submit" tabindex="60" class="fd_btn"></div></form></div><div class="thx_mess" style="display:none;" id="thx_ms1"><span><svg viewBox="0 0 126 126" height="40px" width="40px" y="0px" x="0px"><path d="M100.517,25.488 C79.829,4.799,46.17,4.799,25.486,25.483C4.798,46.169,4.8,79.829,25.488,100.517c20.682,20.684,54.341,20.684,75.027-0.004 C121.201,79.829,121.199,46.171,100.517,25.488z M94.728,94.728c-17.494,17.494-45.961,17.496-63.455,0.002 c-17.498-17.497-17.496-45.966,0-63.46c17.494-17.493,45.959-17.495,63.457,0.002C112.224,48.766,112.222,77.235,94.728,94.728z M43.211,48.641c0-3.423,2.777-6.201,6.201-6.201c3.423,0,6.2,2.777,6.2,6.201c0,3.426-2.777,6.203-6.2,6.203 C45.988,54.844,43.211,52.067,43.211,48.641z M71.328,48.641c0-3.423,2.78-6.201,6.203-6.201c3.423,0,6.201,2.777,6.201,6.201 c0,3.426-2.777,6.203-6.201,6.203C74.108,54.844,71.328,52.067,71.328,48.641z M85.988,74.039 c-3.843,8.887-12.843,14.629-22.928,14.629c-10.301,0-19.354-5.771-23.064-14.703c-0.636-1.53,0.089-3.286,1.62-3.921 c0.376-0.156,0.766-0.23,1.15-0.23c1.176,0,2.292,0.696,2.771,1.85c2.777,6.685,9.655,11.004,17.523,11.004 c7.69,0,14.528-4.322,17.421-11.011c0.658-1.521,2.424-2.222,3.944-1.563C85.946,70.752,86.646,72.518,85.988,74.039z" stroke-linejoin="round" stroke-linecap="round" stroke-width="0" stroke="#6D6E70"></svg></span><p style="padding-top:10px;font-weight:bold;color:#000;">Thank You!</p><span class="get-q">Get Instant Quote Now!</span><p style=" clear:both; padding:0; margin:0;"></p></div></div></div></div>');
      $('.get-q').click(function(event){event.preventDefault();temp9Obj.formObj.afflid.value='-40';openOnClickBLForm(); $(this).css("cursor","pointer");});
feedback_reset();
    $("#r1").click(function(){ 
        $("#opt").slideDown("slow"); 
        }); 
    $("#r0").click(function(){ 
        $("#opt").slideUp("slow"); 
    }); 
        var page_url = document.URL;
        var fdbkCountryISO = page.countryCode;
    if(typeof(imesh_obj.get().iso) != 'undefined' && imesh_obj.get().iso != '')
    {
        fdbkCountryISO = imesh_obj.get().iso;
    }     
        sugg_isd1 = new Suggester({"type":"isd","element":"country-dropdown-fdbk","onSelect":selectCountry_fdk,"url":page_url, fields: "cname,iso,icon_order",displayFields:"cname,value",displaySeparator:' +','defaultValue':fdbkCountryISO});
}
    $('.wlm').prepend('<div id="scrollTop"><div class="tpb"><img width="44" height="44" border="0" alt="" src="//utils.imimg.com/imsrchui/imgs/z.gif" class="arb nr tpim"><div class="tpxt">Top</div></div></div>');
      
    var clickLock = 0;  
    $('.tpb').on('click', function(){
    recordOutboundLink('tpb','Track-scroll-top','topcount',0,0);
    if (clickLock == 0) {

    $("html, body").animate({ scrollTop: 0 }, 1000);
    clickLock = 1;

    setTimeout(function(){  
    clickLock = 0;
    }, 3000);

    }
    
    });
    $('#close-fd').click(function(){
        if (typeof(ims.com_catgory)!= "undefined" && ims.com_catgory !== ''){
            submit_comment_feedback();
        }
        $("#main_div_fdbk").hide();
        setIMFormObject('imform','imfdbk');
            return false;
    });
    $('#sticky_bl_close').click(function(){
        $("#buy_lead_gen_form").hide();
        setIMFormObject('imform','stickybl');
            return false;
    });
     $(window).scroll(function(){
         if ($(this).scrollTop() > 300)
         {
            $('.tpb').fadeIn();
         }
         else
         {
            $('.tpb').fadeOut();
         }
        });
      });
}
function selectCountry_fdk(event , ob)
{
    $("#country-dropdown-fdbk dt a span").attr('style','background-position:0px -'+ob.data.icon_order*11+'px');
    $("#country-dropdown-fdbk dt span.value").html('+'+ob.value);
    var fvalue=$('#country-dropdown-fdbk span').text();
    if(fvalue!='+91'){
        $('#email1_fd').show();
        $('#mob_fd').hide();
        $('#country-dropdown-fdbk .value').hide();
    }
    else{
        $('#email1_fd').hide();
        $('#mob_fd').show();
        $('#country-dropdown-fdbk .value').show();
    }
}
function product_msg(){
    ims.com_catgory='product not found';
    $('#fd_comment').hide();
}
function location_msg(){
    ims.com_catgory='location not match';
    $('#fd_comment').hide();
}
function contact_msg(){
    ims.com_catgory='Listed supplier is not responding';
    $('#fd_comment').hide();
}
function other_msg(){
    ims.com_catgory='others';
}                            
function Result(){
    document.getElementById("thx_ms").style.display="none";
    document.getElementById("thx_ms1").style.display="block";
    setTimeout(function(){searchFeedback(); $(".s_fd").hide('fast'); $('#fdbk_form').hide('fast')},10000);   
}
function getURLParameter(name){
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').  exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
function Submit_Feedback_Category(){
    var xmlhttp;
    var url = document.URL;
    var query = ims.fdbkmcatname || '';
    var page = '';
    var total_res = imd.unq_list_count || '';
    //to get comma saparated dids..
    var anchs = document.getElementsByTagName("a");
    var did_string = '';
    var didArr = new Array();
    for (var i = 0, len = anchs.length; i < len; i++)
    {
        if ( anchs[i].id && anchs[i].id.indexOf("dispid") != -1){
                        var did_m = anchs[i].id;
                        var dir_pairs = did_m.split("dispid");
            didArr.push(dir_pairs[1]);
        }
    }
    // keep only last 15 dids from whole results set
    var didArrLimit = didArr.slice(didArr.length-15);
    for(i=0; i < didArrLimit.length; i++)
    {
        did_string += didArrLimit[i]+",";
    }
    did_string= did_string.replace(/.$/,'');
        var rating = ims.rating;
        var n_comment_category = ims.com_catgory;
    var comment = document.getElementById('r2').value || '';
    var mobile = document.getElementById('mob').value || ''; 
    var cookie = document.cookie || '';
    var local_storage = new IMStore();
//     var searches = local_storage.getData('ims','searches');
    var cities = local_storage.getData('ims','cities');
//     if(searches)
//     cookie += ';searches='+searches;
    if(cities){
        cookie += ';cities='+cities; 
        cookie += ';'; 
    }
    var city = '';
    if( (cookieVal = readCookie("xnHist")) != "") city = getparamVal(cookieVal, "city");
    var email = '';
    var val_imesh = readCookie("ImeshVisitor");
    if( (cookieVal = val_imesh) != "") email = getparamVal(cookieVal, "em");    
    var scroll = $(document).scrollTop();
    var full_name = '';
    if(val_imesh != ""){
                var last_name = (getparamVal(val_imesh, "ln")) ? ' '+getparamVal(val_imesh, "ln"): '';
                full_name = getparamVal(val_imesh, "fn")+last_name;
    }
    if(ims.feedback_id==''){
        $.ajax({
            url: "/insert_feedback_to_db.php", 
            data: { 
                    "query" : query ,
                    "page" : page,
                    "url" : url,
                    "total_res" : total_res,
                    "did_string" : did_string,
                    "rating" : rating,
                    "comment" : comment,
                    "cookie" : cookie, 
                    "scroll" : scroll,
                    "mobile" : mobile,
                    "category" : n_comment_category,
                    "city" : city,
                    "email" : email,
                    "name" : full_name
                },
            type: "POST",
            success: function(data){
                ims.feedback_id = data;           
                //ims.feedbackSubmitted = 1;
                setIMFormObject('imform','imfdbk');
                }
        });
    }
}
function check_feedback(){
    if ($('#opt input').is(':checked')){
        $('.fsms').hide();
    return true;
    }else{
        $('#show_email').hide();$('#show_mob').hide();
        $('.fsms').show();
        var val_imesh= readCookie('ImeshVisitor');
        if(val_imesh != ""){
            $('.s_fd .text').css({'top':'30px'});
            $('.fdco').css({'top':' 45px'});
            $('.stcon').css({'height':'226px'});
            $('.s_fd').css({'height':'228px'});
        }
    return false
    }
}
function checkcomment(id){
    var input_val = document.getElementById(id);
    if (ims.rating == 'n' && input_val.value == ''){
//         input_val.style.border = "1px solid #FF0000";
        $('#fd_comment').show();
        $('#fd_comment').html('Kindly provide your suggestion.');
        return false;
      }else{
          return true;
      }
}
function submit_comment_feedback(){
    
    if(checkmob('mob')==true || checkemail('email1')==true)
    {
        if(ims.rating=='y' || (ims.rating=='n' && check_feedback()==true && ((typeof(ims.com_catgory)!= "undefined" && ims.com_catgory !== 'others') || checkcomment('radio4')==true)))
        {
            Result();
            var fdemail = document.getElementById('email1').value || '';
            var mobile = document.getElementById('mob').value || '';
            var comment4 = document.getElementById('radio4').value || '';
            var url = document.URL;
            var query = ims.fdbkmcatname || '';
            comment = fdemail+''+comment4 || '';
            $.trim(mobile);
            $.ajax({
                    url: "/insert_feedback_to_db.php", 
                    data: { 
                            "search_id": ims.feedback_id,
                            "comment" : comment,
                            "mobile" : mobile,
                            "category" : ims.com_catgory,
                            "query" : query,
                            "url" : url
                            },
                    type: "POST",
                    success: function(){        
                        ims.feedbackSubmitted = 1;
                        setIMFormObject('imform','imfdbk');
                        getLoginStringv1();
                        callToIdentifiedQ();
                        }
                    });
            return true;
        }else{return false;}
     }else
     {
     return false;
     }
    $('.stcon').css({'height':'228px'});
    $('.s_fd').css({'height':'228px'});
}
//FEEDBACK SEARCH JS END 
function call_me_back_notme(){
    var val_imesh= readCookie('ImeshVisitor');
    var mobile = getparamVal(val_imesh, "mb1") || '';
    if(mobile) {
        $('#cm_mobile').hide();
    } else {
        $('#cm_mobile').show();
    }
}

$(document).ready(function(){
        page.notMeQ.push(call_me_back_notme);
        var val_imesh= readCookie('ImeshVisitor');
        var mobile = getparamVal(val_imesh, "mb1") || '';
        $('#cm_mobile').val(mobile);
        if(mobile){
        $('#cm_mobile').hide();
        }
        $('.sticky-fd').click(function(){
            callme();
            if ($('.stcon').css('display') === 'block') {
            searchFeedback();
            }
            });
        $('body').keypress(function(e){
            if(e.which == 27){
            // Close call me form
            callme();
            }
            });
});
$(window).scroll(function()
{
        var win_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if(imd.unq_list_count >= 4 && ($(window).scrollTop()>=300) && $('#fdbk_form').css('display') != 'block' && ims.autoFdbkShow == 0 && ims.feedbackShow == 1 && win_width>=1330) {
            sticky_feedback();
        }
});
function sticky_feedback() {
    $('.alft').css({'right':''}); if ($('#thx_ms').css('display') === 'block') {$('.stcon').css({'width':''}); } else{$('#fdbk_form').css({'width':'285px'}); }
    ims.autoFdbkShow = 1;
    $('#fd_box').show();
    $('#sugd').hide();
    $('.s_fd ').css({'height':'228px'});
    $('.stcon ').css({'height':'226px'});
    $('.s_fd .text').css({'top':'30px'});
    $('.fdco').css({'top':' 45px'});
    $('#ind_fdbk').css({'margin-top':''});
    $('.show_mob').css({'top':''});
    $('.mobn').css({'border':'1px solid #ccc'});
    $('#show_email').hide();$('#show_mob').hide();
    searchFeedback();
    if ($('#eto_footer_form').css('display') === 'block') {
        $("#eto_footer_form").slideToggle();
    }
    if ($('.sticky').css('display') === 'block') {
        callme();
        $("#eto_footer_form").slideToggle();
    }
    setTimeout(track_enquiry, 2000);
}
function searchFeedback() {
    $('.stcon').animate({
        width: "toggle"
    });
    $('.s_fd').toggleClass('alft');
    $('.s_fd').css('transition', '.50s');
}
$(window).scroll(function() {
    $('.s_fd').css('transition', '');
    var scroll = $(window).scrollTop();
    if (scroll >= 1200) {
        $(".s_fd, .stcon").css({'top':'190px' ,'position':'fixed'});
    } else {
        $(".s_fd, .stcon").css({'top':'1400px', 'position': 'absolute'});
    
    }
});
function show_satisfy(){
    $('#suggestion').show();
    $('.alft').css({'right':'285px'});
    $('.stcon').css({'width':'285px'});
    $("#fd_box").hide();
    $('#opt').hide();   
    var val_imesh = readCookie("ImeshVisitor");
    var mobile ='';
    if(val_imesh != ""){
        mobile = getparamVal(val_imesh, "mb1");
        if(mobile){
            $('#user_unidentity').hide();
            $('#mob').val(mobile);
            $('#suggestion').css({'margin-top':'40px'})
        } else {
            $('#user_unidentity').show();
            $("#sugd").show();
            $('#ind_fdbk').css({'margin-top':'35px'});
           
        }
    }else{
        $('#user_unidentity').show();
        $('#ind_fdbk').css({'margin-top':'35px'});
        $("#sugd").show();
     
    }
    ims.rating='y';
    Submit_Feedback_Category();
    if(mobile){ Result();}
}
function show_not_satisfy(){
    $('.alft').css({'right':'285px'});
    $('.stcon').css({'width':'285px'});
    $('#suggestion').hide();
    $("#fd_box").hide();
    $("#sugd").show();
    $("#opt").show();
    var val_imesh = readCookie("ImeshVisitor");
    if(val_imesh != "") {
        var mobile = getparamVal(val_imesh, "mb1");
        if(mobile){
            $('#user_unidentity').hide();
            $('#mob').val(mobile);
            $('.stcon').css({'height':'226px'});
        } else {
            $('#user_unidentity').show();
            $('.s_fd').css({'height':'296px'});
            $('.stcon').css({'height':'294px'});
            $('.s_fd .text').css({'top':'65px'});
            $('.fdco').css({'top':' 80px'});
        }
    } else {
            $('#user_unidentity').show();
            $('.s_fd').css({'height':'296px'});
            $('.stcon').css({'height':'294px'});
            $('.s_fd .text').css({'top':'65px'});
            $('.fdco').css({'top':' 80px'});
    }   
    ims.rating='n';
    Submit_Feedback_Category();
}

$(document).on('click','.s_fd', function(){if ($('#thx_ms').css('display') === 'block') {} else{$('.alft').css({'right':'285px'}); } })

function callme() {
    $('.sticky').animate({ width: "toggle"});
    $('.sticky-fd').toggleClass('aleft');
    $('.sticky-fd').css('transition', '.50s');
    $('#close').toggle();
}
function feedback_reset() {
    var val_imesh = readCookie("ImeshVisitor");
    if(val_imesh != "") {
        var mobile = getparamVal(val_imesh, "mb1");
        if(mobile){
            $('#user_unidentity').hide();
            $('#mob').val(mobile);
        } else {
            $('#user_unidentity').show();
        }
    } else {
        $('#user_unidentity').show();
    }
    if(document.getElementById('r1')!=null && document.getElementById('r1').checked == true) {
        $('#suggestion').html('Thank You!! Any other Suggestions:');
        $('#any_othr_rsn').show('10');
    }
}
function checkmob(id){
    var input_val = document.getElementById(id);
    if (ims.rating == 'n' ){
        $('.stcon').css({'height':'294px'});
        $('.s_fd').css({'height':'295px'});
        $('.s_fd .text').css({'top':'65px'});
        $('.fdco').css({'top':'80px'});
    }
    if (ims.rating == 'n' && input_val.value == ''){
        input_val.style.border = "1px solid #FF0000";
        $('#show_mob').show();
        $('#show_mob').html('Kindly enter correct Mobile Number.');
        return false;
      }else{
        var fd_country = $('#country-dropdown-fdbk .value').text();
        if(input_val.value)
        {
            if((/^\s*([0-9]{0,15})\s*$/).test(input_val.value))
            {
                if((input_val.value.length < 10  || input_val.value.length > 10 )&& fd_country == '+91'){
                    input_val.style.border = "1px solid #FF0000";
                    $('#show_mob').show();
                    $('#show_mob').html('Please Enter 10 Digit Mobile Number.');
                    return false;
                }else{
                input_val.style.border = "1px solid #CCCCCC";
                return true;
                }
            }else{
                input_val.style.border = "1px solid #FF0000";
                $('#show_mob').show();
                $('#show_mob').html('Kindly enter correct Mobile Number.');
            }
        }else{
            input_val.style.border = "1px solid #FF0000";
             $('#show_mob').show();
             $('#show_mob').html('Kindly enter your Mobile Number.');
        }
      }
}
function checkemail(id){
    var input_val = document.getElementById(id);
    if (ims.rating == 'n' ){
        $('.stcon').css({'height':'294px'});
        $('.s_fd').css({'height':'295px'});
        $('.s_fd .text').css({'top':'65px'});
        $('.fdco').css({'top':'80px'});
    }
    var fd_country = $('#country-dropdown-fdbk .value').text();
    if(input_val.value !=''){
        var email_fd = document.forms["form1"]["email1"].value;
        var atpos = email_fd.indexOf("@");
        var dotpos = email_fd.lastIndexOf(".");
        if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email_fd.length) {
            input_val.style.border = "1px solid #FF0000";
            $('#show_email').show();
            $('#show_email').html('Kindly enter a valid Email ID.');
            return false;
        }else{
            input_val.style.border = "1px solid #CCCCCC";
            return true;
        }
   }else{
        input_val.style.border = "1px solid #FF0000";
        $('#show_email').show();
        $('#show_email').html('Kindly enter the Email ID.');
        return false;
   }
}
function getIMFormObject(imform,key){
  // Retrieve the object from storage
  return $.parseJSON(localStorage[imform.toLowerCase()]||'{}')[key.toLowerCase()];
}
function track_enquiry(){
    if($('#fdbk_form').is(":visible")){
    var fdbkpg_src = 'mcat';  
//     var fdbkpgtyp = typeof(dir_cdmis) != "undefined" && dir_cdmis || '';
    if(typeof(dir_cdmis) != 'undefined' && dir_cdmis !=''  && dir_cdmis.match(/Typ-PG/))
    {
	 fdbkpg_src = 'generic';
    }
//     if(fdbkpgtyp !=='' && fdbkpgtyp.endsWith('G'))
//     {
//         fdbkpg_src = 'generic';
//     }
	imgtm.push({ 'event' : 'IMEvent-NI','eventCategory' : 'FDBK-OPEN','eventAction' : fdbkpg_src,'eventLabel' : this,'eventValue': 0});
    }
}
$(document).on('click','.input_fd', function(){
    $("#radio4").attr("placeholder","Please describe in detail, to let us help you.");
    if(ims.rating=='y'){
        $('.stcon').css({'height':'215px'});
    }else{
        var val_imesh= readCookie('ImeshVisitor');
        var mobile = getparamVal(val_imesh, "mb1") || '';
        if(mobile) {
            $('.s_fd').css({'height':'228px'});
            $('.stcon').css({'height':'226px'});
        }  
        else{
            $('.s_fd').css({'height':'296px'});
            $('.s_fd .text').css({'top':'65px'});
            $('.fdco').css({'top':'80px'});
        }
    }
    var id = $(this).data('id');
    $('.input_fd').each(function(){
        var idd= $(this).data('id');
        $('#' + idd).addClass('fd-none');
    })
    $('#' + id).removeClass('fd-none');
});


add_feedback_link();
var shft=6;
var scrollPos = 650;
function amazonStrip(sid)
{
    var posArr = ['-161.5px','-323px','-484.5px','-646px','-807.5px','-969px','-1130.5px','-1292px','-1453.5px','-1615px','-1776.5px','-1938px'];
    var tempID = parseInt(sid.replace("container-slider",""));
    var t1 = tempID;
    if(tempID == 5 || tempID == 10){tempID = 2;shft=6;}
    tlx_prd_viw = (typeof(tlx_prd_viw) != "undefined") ? tlx_prd_viw : '';
    var bx_wd = $('.e-tlso .unit').width() + 11.5; 
    var bx_mve = (tlx_prd_viw/2)*bx_wd;
    var $item1 = $('#'+sid+' div.item'),
    visible1 = parseInt(tlx_prd_viw), 
    index1 = 0, 
    endIndex1_mod ='';
    endIndex1 = ( $item1.length - visible1)/3;
    var pars1 = parseInt(endIndex1);
    endIndex1_mod = ( $item1.length - visible1)%4; 
    var t_endIndex1 ='';
    var k1=1; 
    var k1_l=1;
    if(tempID == 6 || tempID == 11)shft = 6;
    if(tempID>1 && tempID != 6 && tempID != 11)
    {
        i=0;
        $('#'+sid+' div.item').each(function(){
        if(i < shft) $('#'+sid+' .e-tlso .unit').css("left",posArr[i]);
        i++;

        });
        shft += 6; 
        $('#'+sid+' .arL').show();
        index1 = (tempID == 2 || tempID == 7 )? 2: ((tempID == 3 || tempID == 8) ? 4 : ((tempID == 4 || tempID == 9 )?4:0))
    }
    if( $('#'+sid+' div.item').length < tlx_prd_viw)
    {
        $('#'+sid+' .list-impcat').addClass('table');
    }
    $('#'+sid+' button.arR').click(function()
    {
        $('#'+sid+' .arR').prop('disabled',true);
        setTimeout(function(){
        $('#'+sid+' .arR').prop('disabled',false);
        },500); 
        if(index1 <  pars1 )
        {
            index1++;
            if(pars1 > 1)
            {
                k1++;
                $item1.animate({'left':'-='+bx_mve+'px'}, 200, 'linear');
                k1_l--;
            }
            else if(endIndex1_mod > 0)
            {
                $item1.animate({'left':'-='+bx_wd*endIndex1_mod+'px'}, 200, 'linear');
                k1=1;
                k1_l=1;
            }
            $('#'+sid+' .arL').show(); 
        }
        if(index1 == pars1 )
        $('#'+sid+' .arR').hide(); 
    });

    $('#'+sid+' button.arL').click(function(){
    $('#'+sid+' .arL').prop('disabled',true);
    setTimeout(function(){
    $('#'+sid+' .arL').prop('disabled',false);
    },500); 
    if(index1 > 0) {
    index1--;            
    if(k1_l<=pars1){
        k1_l++;
        $item1.animate({'left':'+='+bx_mve+'px'}, 200, 'linear');
        k1--;
        }
        else if(endIndex1_mod > 0){
        $item1.animate({'left':'+='+bx_wd*endIndex1_mod+'px'}, 200, 'linear');
        k1_l=1;
        k1=1;
        }
    }
    
    if(tempID == 1 || tempID == 6 || tempID == 11)
    {
     if(index1 == 0)$('#'+sid+' .arL').hide();    
    }else{
    if(index1 == 0)$('#'+sid+' .arL').hide(); 
    }
    $('#'+sid+' .arR').show();
    });

    if(index1  < pars1) $('#'+sid+' button.arR').css('display','block');
    if(tempID == 1)
    {
        recordInboundLinkTolexo('Amazon_Top', 'Amazon_Strip_on_Viewport',this.url, 0,true);
    }
    else if(($('#'+sid).length>0) && tempID > 1 && tempID != 11 )
    {
            tflag = 2;
            $(window).scroll(function(){
            var window_top = $(window).scrollTop();
            var div_top = $('#'+sid).offset().top;
            var ecom_strip = window_top + scrollPos;
            if(ecom_strip >= div_top && tflag == t1){
                amazon_trac = 'Amazon_'+(t1-1);
                recordInboundLinkTolexo(amazon_trac,'Amazon_Strip_on_Viewport',this.url,0,true);
                scrollPos += 300;
                tflag++;
            }
            });
    }
    else if(tempID == 11)
    {
        $(window).scroll(function(){
        var window_top = $(window).scrollTop();
        var div_top = $('#'+sid).offset().top;
        var ecom_strip = window_top + 1200;
        if(ecom_strip >= div_top && tflag == tempID){
        recordInboundLinkTolexo('Amazon_Bottom', 'Amazon_Strip_on_Viewport',this.url, 0,true);
        tflag++;
        }
        });
    }
}
$(document).ready(function() {
if($('.econ').length)setSlider('');
$('.clor_b').each(function(){var pck = $('.clor_b').text(); if(pck !=''){$('.clor_b').show(); }});
});
$(window).resize(function(){var win_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; if($('#fdbk_form').css('display') != 'none' &&  win_width<=1330) {sticky_feedback();  } });