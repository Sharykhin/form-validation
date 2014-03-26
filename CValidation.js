/**
 * @author Siarhei Sharykhin
 * @namespace CValidation
 * @desc A class checks data of the form and show notification messages
 * @param locale current language
 * @param {string} showType which type of error notification will be used
 * @constructor
 */
var CValidation = function(locale,showType){
    //Install jQuery library
    this.installQuery();
    //Install plugin Masked Input to use mask
    this.installmaskedinput();
    //Set current language. By default language is russian(ru)
    this.locale = locale || this.setLocale('ru');
    //Get a current type of the notifications
    this.showType = showType || this.getShowType();
    //Install appropriate library of type
    this['install'+this.showType]();
    //Install Custom styles
    this.installCValidationCss();
    this.animateEffect = this.getAnimateEffect();
}

/**
 * @memberof CValidation
 * @method setShowType
 * @desc set type of notifications
 * @param {string} type name of type
 */
CValidation.prototype.setShowType=function(type) {
    //Param type is required
    if(type === undefined) {
        throw "param type is required";
    }
    this.showType = type;
    this['install'+this.showType]();
};

/**
 * @memberof CValidation
 * @method getShowType
 * @desc Get current type of the notifications
 * @returns {*|string}
 */
CValidation.prototype.getShowType = function() {
    return this.showType || 'jGrowl';
};

/**
 * @memberof CValidation
 * @method getAnimateEffect
 * @desc get current animate effect, when errors occured
 * @returns {*|string}
 */
CValidation.prototype.getAnimateEffect = function() {
    return this.animateEffect || 'wiggle';
};

/**
 * @memberof CValidation
 * @method setAnimateEffect
 * @desc set animate effect of errors
 * @param {string} effect name of effect
 */
CValidation.prototype.setAnimateEffect = function(effect) {
    //Param effect is required
    if(effect === undefined) {
        throw "You didn't set effect. Did you forget to do it?";
    }
    this.animateEffect = effect;
}

/**
 * @memberof CValidation
 * @type {{wiggle: string}}
 * @desc list of available effects
 */
CValidation.prototype.animationEffects = {
  'wiggle':' animate0 wiggle ',
  'pulse' :' animate0 pulse  ',
  'wobble':' animate0 wobble ',
  'flash':' animate0 flash ',
  'shake':' animate0 shake ',
  'bounce':' animate0 bounce '
};

/**
 * @memberof CValidation
 * @method setLocale
 * @param {string} locale language (For example: 'ru' or 'en' etc...)
 * @example this.setLocale('ru') or this.setLocale(ru)
 * @returns {string} language
 */
CValidation.prototype.setLocale = function(locale) {
    if(locale === undefined) {
        throw "A param locale is required for this method";
    }
    //Convert to string, is user forget inset string format
    this.locale = String(locale);
    return this.locale;
};

/**
 * @memberof CValidation
 * @method getLocale
 * @desc return current language (For example: 'ru' or 'en')
 * @returns {string} current language
 */
CValidation.prototype.getLocale = function() {
    return this.locale;
};

/**
 * @memberof CValidation
 * @method i18n
 * @desc it returns a message,which has been translated in appropriate language
 * @param {string} type type of message
 * @param {object|undefined} params this optional param
 * @returns {string} message
 */
CValidation.prototype.i18n = function(type,params) {
    return this.createMessage(this.i18nMessages[this.locale][type],params);
};

/**
 * @memberof CValidation
 * @desc it returns message with replaced params if they exist
 * @param {string} msg source message
 * @param {object|undefined} params parameters which will be replaced in message
 * @returns {*}
 */
CValidation.prototype.createMessage = function(msg,params) {
    //if params doesn't exist return source message
    if(params === undefined) {
        return msg;
    } else {
        if(typeof params !=='object') {
            throw "The params of the method i18n must be an object.For example {a:'a',b:4} ";
        }
        for(var i in params) {
            var regV = /{{/+i+/}}/;
            regV=regV.replace(/{\//,'{');
            regV=regV.replace(/\/}/,'}');
            msg=msg.replace(eval(regV),params[i]);
        }

        return msg

    }
};

/**
 * @memberof CValidation
 * @method showCustomNotification
 * @desc Create a custom popUp notification
 * @param {string} message message of notification
 * @param {integer|string} duration time when popUp will be hidden
 */
CValidation.prototype.showCustomNotification = function(message,duration) {
  var duration = parseInt(duration,10) || 4000;
  jQuery('<div />').addClass('CValidation-cutom-notification').css({'width':'200px','position':'fixed','left':'50%','marginLeft':'-100px','zIndex':'999999999','top':'40%','background':'rgba(255,107,110,0.8)','color':'#ffffff','padding':'20px','borderRadius':'10px'}).text(message).fadeIn().appendTo('body');
    setTimeout(function(){
        jQuery('div.CValidation-cutom-notification').fadeOut(function(){
            jQuery(this).remove();
        });
    },duration);

};

/**
 * @memberof CValidation
 * @method ready
 * @desc it is ready method, where you must placed custom code. It will be called, when all plugins will be installed
 * @param {function} callback
 */
CValidation.prototype.ready = function(callback) {
    var jQueryInstalled = setInterval(function(){
        if(window.jQuery !== undefined && jQuery.mask !== undefined) {
            clearInterval(jQueryInstalled);
            (function($){$(document).ready(callback)})(jQuery);
        }
    },100);
};

/**
 * @memberof CValidation
 * @desc A method check form on valid data
 * @param formSelector form selectro
 * @param ajax is sumbit use ajax request
 * @returns {boolean}
 */
CValidation.prototype.submitForm = function(formSelector,ajax) {
        //Prevend Default action in cross browsers
        if(typeof arguments[1] === 'object') {
            var eventObj = arguments[1];
            eventObj.preventDefault();
        }
        if(arguments[2] !== undefined && typeof arguments[2] === 'object') {
            var eventObj = arguments[2];
            eventObj.preventDefault();
        }
        var typeOfFirstArgs =  typeof arguments[0];
        /*
         * if formSelector doesn't exists get selector of form as parent of current submit button
         */
        var formSelector = (typeof formSelector === 'string') ? jQuery(formSelector) : jQuery(arguments[0]).parents('form');

        //Get All form elements
        var formElements = formSelector.find('input,textarea,select').not('button[type=submit],input[type=submit]');
        //Initialize error array
        var errors = [];
        //Create reference on current class
        var $this = this;
        //Remove all errors class at elements
        formElements.removeClass('cvalidation-error'+this.animationEffects[this.animateEffect]);
        //Remove attributes of powertip
        formElements.removeAttr('data-powertip');
        //Remove all tips of powertip
        if(this.showType === 'powerTip') {
            formElements.each(function(){
                jQuery.powerTip.destroy(jQuery(this));
            });
        }
        formSelector.find('.CValidation-textError').remove();
        console.log(formSelector);
        if( formSelector.find('.CValidationListErrors').length > 0) {
            formSelector.find('.CValidationListErrors').slideUp(function(){
                jQuery(this).remove();
            });
        }

        //Walk on each element
        formElements.each(function(){
            //Check if field has neccessary attribute
           if(jQuery(this).attr('data-cvalidation')) {
               //get array of rules
               var rules = jQuery.trim(jQuery(this).attr('data-cvalidation')).split(" ");
               //Get field name which will be shown in notification message
                var fieldName = jQuery(this).attr('data-cvalidation-fieldname') || ((jQuery(this).prev().is('label')) ? jQuery(this).prev().text() : jQuery(this).attr('name'));
               //Check data for each rule
               for(var i= 0,len=rules.length;i<len;i++){
                   //Check if users add custom error message
                   if(jQuery(this).attr('data-cvalidation-message')) {
                       var errorMessage = jQuery.trim(jQuery(this).attr('data-cvalidation-message'));
                   }
                   //if rule of length use validLength method
                   if(rules[i].search(/length/) !== -1) {
                       $this.validLength(jQuery(this),errors,rules[i],errorMessage,fieldName);
                       continue;
                   }


                   //if rule of not use not method
                   if(rules[i].search(/notToBe/) !== -1) {
                       $this.notToBe(jQuery(this),errors,rules[i],errorMessage,fieldName);
                       continue;
                   }

                   //if rule of equal use validEqual method
                   if(rules[i].search(/equal/) != -1) {
                       $this.validEqual(jQuery(this),errors,rules[i],errorMessage,fieldName);
                       continue;
                   }
                    //use appropriate method
                    $this[rules[i]](jQuery(this),errors,errorMessage,fieldName);
               }
           }
        });

       //If the errors exist, show notification messages
       if(errors.length > 0) {

           this['show_'+this.showType+'_Notification'](errors,formSelector);
           return false;
       }

        if(ajax !== true) {

            formSelector.find('input[type=submit],button[type=submit]').off('click');
            formSelector.off('submit');
            //If form doesn't contain button with submit type
            if(formSelector.find('input[type=submit],button[type=submit]').length === 0) {
                //Check if method is called via onclick attribute
                formSelector.find('[onclick*="submitForm"]').removeAttr('onclick');
                //Create submit button, insert it into form and immediately imitate click
                jQuery('<input type="submit" />').appendTo(formSelector).click();

            } else {
                //Chech if method is called via onclick attribute
                if(typeOfFirstArgs === 'object') {
                    formSelector.find('[onclick*="submitForm"]').removeAttr('onclick');
                    formSelector.find('input[type=submit],button[type=submit]').click();
                }
                //Of submit from call via custom handler, so we need in short timeout to send form
                if(typeOfFirstArgs === 'string') {
                   setTimeout(function(){
                       formSelector.find('input[type=submit],button[type=submit]').click();
                   },100);
                }
            }

        } else {
            //if form uses ajax reuqest for handle data, so return true
            return true;
        }



};

/**
 * @memberof CValidation
 * @method show_jGrowl_Notification
 * @desc show notifications using jGworl plugin
 * @param {object} errors
 */
CValidation.prototype.show_jGrowl_Notification = function(errors) {

    for(var i= 0,len=errors.length;i<len;i++){
        $.jGrowl(errors[i].message,{header:errors[i].type,themeState:'error',life:5000,closerTemplate:"<div>[ "+this.i18n('close_all')+" ]</div>"});
    }
};

/**
 * @memberof CValidation
 * @method show_powerTip_Notification
 * @desc show error notifications using powerTip plugin
 * @link http://stevenbenner.github.io/jquery-powertip/
 * @param {object} errors
 */
CValidation.prototype.show_powerTip_Notification = function(errors) {
    this.showCustomNotification(this.i18n('error_occured'));
    for(var i= 0,len=errors.length;i<len;i++){
        if(errors[i].element.attr('data-powertip') === undefined) {
            errors[i].element.attr('data-powertip',errors[i].message);
        }
        errors[i].element.powerTip({manual:false,smartPlacement:true});
        errors[i].element.focus(function(){
            $(this).powerTip('hide');
        });
    }
};

/**
 * @memberof CValidation
 * @method show_textError_Notification
 * @desc show error message under each field
 * @param {object} errors
 */
CValidation.prototype.show_textError_Notification = function(errors) {

    for(var i= 0,len=errors.length;i<len;i++){
        errors[i].element.after("<p class='CValidation-textError' style='color:#FF0000;clear:both'>"+errors[i].message+"</p>");
    }

};

/**
 * @memberof CValidation
 * @method show_listError_Notification
 * @desc show list of errors in the end of form
 * @param {object} errors
 * @param formSelector selector of form
 */
CValidation.prototype.show_listError_Notification = function(errors,formSelector) {

    formSelector.append("<div style='display: none' class='CValidationListErrors' />");
    var currentListError = formSelector.find('.CValidationListErrors');
    for(var i= 0,len=errors.length;i<len;i++){
        $("<p class='CValidation-textError' style='color:#FF0000;clear:both'>"+errors[i].message+"</p>").appendTo(currentListError);
    }
    formSelector.find('.CValidationListErrors').slideDown();


};

/**
 * @memberof CValidation
 * @param fieldSelector
 * @param errors
 * @param rule
 * @param errorMessage
 * @param fieldName
 */
CValidation.prototype.validLength = function(fieldSelector,errors,rule,errorMessage,fieldName) {
    var valueLength = jQuery.trim(fieldSelector.val()).length;
    if(rule.search(/>?length>?/) !== -1 && rule.search(/>/) !== -1) {
        //if rule is max>lenght>min
        var intervals = rule.replace(/>?length>?/,' ');
        intervals = intervals.split(" ");
        var maxValue = parseInt(intervals[0],10) || null;
        var minValue = parseInt(intervals[1],10) || null;
    }
    if(rule.search(/<?length<?/) !== -1 && rule.search(/</) !== -1) {
        //if rule is min<lenght<max
        var intervals = rule.replace(/<?length<?/,' ');
        intervals = intervals.split(" ");
        var maxValue = parseInt(intervals[1],10) || null;
        var minValue = parseInt(intervals[0],10) || null;
    }

    if(valueLength < minValue && minValue !== null) {
        this.addErrorClass(fieldSelector);
        errors.push({type:this.i18n('header_length'),message:errorMessage || this.i18n('length_min',{field:fieldName,num:minValue})});
    }
    if(valueLength > maxValue && maxValue !== null) {
        this.addErrorClass(fieldSelector);
        errors.push({type:this.i18n('header_length'),message:errorMessage || this.i18n('length_max',{field:fieldName,num:maxValue})});
    }

};


/**
 * @memberof CValidation
 * @method toBeInt
 * @desc A value in the field must be integer
 * @param fieldSelector
 * @param {array} errors array of errors
 * @param {string} errorMessage custom error message
 * @param {string} fieldName title of field which will be shown in notification message
 */
CValidation.prototype.toBeInt = function(fieldSelector,errors,errorMessage,fieldName) {
    var fieldValue = jQuery.trim(fieldSelector.val());
    if(fieldValue.search(/[0-9].*/)===-1) {
        this.addErrorClass(fieldSelector);
        errors.push({type:this.i18n('header_attention'),message:errorMessage || this.i18n('toBeInt',{field:fieldName}),element:fieldSelector});
    }
};



/**
 * @memberof CValidation
 * @method validEqual
 * @desc it checks if two value are equal
 * @param fieldSelector
 * @param {array} errors array of errors
 * @param {string} rule current rule
 * @param {string} errorMessage custom error message
 * @param {string} fieldName title of field which will be shown in notification message
 */
CValidation.prototype.validEqual = function(fieldSelector,errors,rule,errorMessage,fieldName) {
    var fieldValue = jQuery.trim(fieldSelector.val());
    var params = rule.split("=");
    var equalWith = params[1];
    var equalElement =  fieldSelector.parents('form').find('input[name="'+equalWith+'"]');
    var equalFieldName = equalElement.attr('data-cvalidation-fieldname') || ((equalElement.prev().is('label')) ? equalElement.prev().text() : equalElement.attr('name'));
    var equalValue = jQuery.trim(equalElement.val());
    if(fieldValue !== equalValue) {

        this.addErrorClass(fieldSelector);
        this.addErrorClass(fieldSelector.parents('form').find('input[name="'+equalWith+'"]'));
        errors.push({type:this.i18n('header_match'),message:errorMessage || this.i18n('not_equal',{field:fieldName,field2:equalFieldName}),element:fieldSelector});
    }

};

/**
 * @memberof CValidation
 * @method notToBe
 * @desc method checks that value of the field can not be equal in brackets
 * @param fieldSelector
 * @param errors
 * @param rule
 * @param errorMessage
 * @param fieldName
 */
CValidation.prototype.notToBe = function(fieldSelector,errors,rule,errorMessage,fieldName) {
    var fieldValue = jQuery.trim(fieldSelector.val());
    var rule = rule.replace(/notToBe/,'');
    rule=rule.replace(/\(|\)/g,'');

    var params = rule.split(",");
    for(var i= 0,len=params.length;i<len;i++){
        if(fieldValue===params[i]) {
            this.addErrorClass(fieldSelector);
            errors.push({type:this.i18n('header_attention'),message:errorMessage || this.i18n('notBe',{field:fieldName,val:params[i]}),element:fieldSelector});
        }
    }

};


/**
 * @memberof CValidation
 * @method required
 * @desc it checks if field is filled
 * @param fieldSelector
 * @param errors
 * @param errorMessage
 * @param {string} fieldName
 */
CValidation.prototype.required = function(fieldSelector,errors,errorMessage,fieldName) {
    if(jQuery.trim(fieldSelector.val()) === '') {
        this.addErrorClass(fieldSelector);
        errors.push({type:this.i18n('header_required'),message:errorMessage || this.i18n('required',{field:fieldName}),element:fieldSelector});
    }
};

/**
 * @memberof CValidation
 * @method addErrorClass
 * @desc Add an error class to the current field in 3 miliseconds. It is needed to show animated effect
 * @param fieldSelector jquery selector of field
 */
CValidation.prototype.addErrorClass = function(fieldSelector) {
    var $this = this;
    setTimeout(function(){
        fieldSelector.addClass('cvalidation-error ' + $this.animationEffects[$this.animateEffect]);
    },3);
}

/**
 * @memberof CValidation
 * @method email
 * @desc it checks if value of email has correct data
 * @param fieldSelector
 * @param errors
 * @param errorMessage
 * @param fieldName
 */
CValidation.prototype.email = function(fieldSelector,errors,errorMessage,fieldName) {
    var regEmail = /^[a-z0-9_\.-]{1,20}@[a-z0-9_-]{1,20}\.[a-z0-9]{2,3}$/gi;
    if(jQuery.trim(fieldSelector.val()).search(regEmail) === -1) {
        this.addErrorClass(fieldSelector);
        errors.push({type:this.i18n('header_email'),message:errorMessage || this.i18n('email'),element:fieldSelector});
    }
};

/**
 * @memberof CValidation
 * @method validname
 * @desc it checks if value has valid data
 * @param fieldSelector
 * @param errors
 * @param errorMessage
 * @param fieldName
 */
CValidation.prototype.validname = function(fieldSelector,errors,errorMessage,fieldName) {
    var regName = /\!|\*|-|\.|_|\'|\\|\/|\"|\#|\%|\&|\@|\~|:|\^/gi;
   if(jQuery.trim(fieldSelector.val()).search(regName) !== -1 || jQuery.trim(fieldSelector.val())==='') {
       this.addErrorClass(fieldSelector);
       errors.push({type:this.i18n('header_validname'),message:errorMessage || this.i18n('name',{field:fieldName}),element:fieldSelector});
   }
};


/**
 * @memberof CValidation
 * @method install
 * @desc install all neccessary libraries
 */
CValidation.prototype.installjGrowl=function() {


    var jqueryInstalled = setInterval(function(){
        if(window.jQuery !== undefined) {
            clearInterval(jqueryInstalled);
            if(window.jQuery.jGrowl === undefined) {

                /**TEST*/
                var jGrowlJs = document.createElement('script');
                jGrowlJs.type = 'text/javascript';
                jGrowlJs.async = true;
                jGrowlJs.src = '//cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.js';
                document.getElementsByTagName('head')[0].appendChild(jGrowlJs);

                var jGrowlCss = document.createElement('link');
                jGrowlCss.type = 'text/css';
                jGrowlCss.rel = 'stylesheet';
                jGrowlCss.async = true;
                jGrowlCss.href = '//cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.css';
                document.getElementsByTagName('head')[0].appendChild(jGrowlCss);
                //var css = document.getElementsByTagName('link')[0]; s.parentNode.insertBefore(jGrowlCss, css);

                /**END TEST*/
            }
        }
    },10);

};

/**
 * @memberof CValidation
 * @method installpowerTip
 * @desc Install powerTip library from cdnjs. Version is 1.2.0
 */
CValidation.prototype.installpowerTip = function() {
    //powerTip requires jQuery, so first, let's install jquery if it doesn't exist
    var jqueryInstalled = setInterval(function(){
        if(window.jQuery !== undefined) {
            clearInterval(jqueryInstalled);
            if(window.jQuery.powerTip === undefined) {

                var powertipJs = document.createElement('script');
                powertipJs.type = 'text/javascript';
                powertipJs.async = true;
                powertipJs.src = '//cdnjs.cloudflare.com/ajax/libs/jquery-powertip/1.2.0/jquery.powertip.min.js';
                document.getElementsByTagName('head')[0].appendChild(powertipJs);

                var powertipCss = document.createElement('link');
                powertipCss.type = 'text/css';
                powertipCss.rel = 'stylesheet';
                powertipCss.async = true;
                powertipCss.href = '//cdnjs.cloudflare.com/ajax/libs/jquery-powertip/1.2.0/css/jquery.powertip-red.css';
                document.getElementsByTagName('head')[0].appendChild(powertipCss);
                //var css = document.getElementsByTagName('link')[0]; s.parentNode.insertBefore(powertipCss, css);



            }
        }
    },10);
};

/**
 * @memberof CValidation
 */
CValidation.prototype.installtextError = function() {

};

/**
 * @memberof CValidation
 */
CValidation.prototype.installlistError = function() {

};

/**
 * @memberof CValidation
 * @method installQuery
 * @desc install jQuery library from google. Version is 1.10.1
 */
CValidation.prototype.installQuery = function(){
    //First check if jQuery exists
    if(window.jQuery === undefined) {
            var jQueryJs = document.createElement('script');
            jQueryJs.type = 'text/javascript';
            jQueryJs.async = true;
            jQueryJs.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js';
            document.getElementsByTagName('head')[0].appendChild(jQueryJs);
    }

};

/**
 * @memberof CValidation
 * @method installmaskedinput
 * @desc install masked input plugin
 */
CValidation.prototype.installmaskedinput = function(){
    //maskInput requires jQuery, so let't first be sure, that jquery already installed
    var jqueryInstalled = setInterval(function(){
        //If jquery installed successfullt, install maskInput
        if(window.jQuery !== undefined) {
            clearInterval(jqueryInstalled);
            if(window.jQuery.mask === undefined) {
                var maskInputJs = document.createElement('script');
                maskInputJs.type = 'text/javascript';
                maskInputJs.async = true;
                maskInputJs.src = '//cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.3.1/jquery.maskedinput.min.js';
                document.getElementsByTagName('head')[0].appendChild(maskInputJs);
            }
        }
    },10);
};

CValidation.prototype.isIE = function() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

/**
 * @memberof CValidation
 * @method installCValidationCss
 * @desc Install custom css styles for this class
 */
CValidation.prototype.installCValidationCss = function() {
    var  CValidationCss = window.document.createElement('style');
    CValidationCss.setAttribute('type','text/css');

    var customCss = "\n.cvalidation-error  {border:1px solid #FF0000 !important;background-color: #FFF6F5 !important;}"
        + "\ndiv.jGrowl div.jGrowl-closer  {background-color:#CE0A0A !important;color:#ffffff !important}"
        + "\n@-webkit-keyframes wiggle{0%{-webkit-transform:skewX(9deg)}10%{-webkit-transform:skewX(-8deg)}20%{-webkit-transform:skewX(7deg)}30%{-webkit-transform:skewX(-6deg)}40%{-webkit-transform:skewX(5deg)}50%{-webkit-transform:skewX(-4deg)}60%{-webkit-transform:skewX(3deg)}70%{-webkit-transform:skewX(-2deg)}80%{-webkit-transform:skewX(1deg)}90%{-webkit-transform:skewX(0deg)}100%{-webkit-transform:skewX(0deg)}}"
        + "\n@-moz-keyframes wiggle{0%{-moz-transform:skewX(9deg)}10%{-moz-transform:skewX(-8deg)}20%{-moz-transform:skewX(7deg)}30%{-moz-transform:skewX(-6deg)}40%{-moz-transform:skewX(5deg)}50%{-moz-transform:skewX(-4deg)}60%{-moz-transform:skewX(3deg)}70%{-moz-transform:skewX(-2deg)}80%{-moz-transform:skewX(1deg)}90%{-moz-transform:skewX(0deg)}100%{-moz-transform:skewX(0deg)}}"
        + "\n@-o-keyframes wiggle{0%{-o-transform:skewX(9deg)}10%{-o-transform:skewX(-8deg)}20%{-o-transform:skewX(7deg)}30%{-o-transform:skewX(-6deg)}40%{-o-transform:skewX(5deg)}50%{-o-transform:skewX(-4deg)}60%{-o-transform:skewX(3deg)}70%{-o-transform:skewX(-2deg)}80%{-o-transform:skewX(1deg)}90%{-o-transform:skewX(0deg)}100%{-o-transform:skewX(0deg)}}"
        + "\n@keyframes wiggle{0%{transform:skewX(9deg)}10%{transform:skewX(-8deg)}20%{transform:skewX(7deg)}30%{transform:skewX(-6deg)}40%{transform:skewX(5deg)}50%{transform:skewX(-4deg)}60%{transform:skewX(3deg)}70%{transform:skewX(-2deg)}80%{transform:skewX(1deg)}90%{transform:skewX(0deg)}100%{transform:skewX(0deg)}}"
        + "\n.wiggle{-webkit-animation-name:wiggle;-moz-animation-name:wiggle;-o-animation-name:wiggle;animation-name:wiggle;-webkit-animation-timing-function:ease-in;-moz-animation-timing-function:ease-in;-o-animation-timing-function:ease-in;animation-timing-function:ease-in}.animated.wiggle{-webkit-animation-duration:.75s;-moz-animation-duration:.75s;-o-animation-duration:.75s;animation-duration:.75s}"
        + "\n.animate0 {-webkit-animation-duration: .8s; -webkit-animation-delay: 0s; -webkit-animation-timing-function: ease; -webkit-animation-fill-mode: both;-moz-animation-duration: .8s; -moz-animation-delay: 0s; -moz-animation-timing-function: ease;-moz-animation-fill-mode: both; -ms-animation-duration: .8s;-ms-animation-delay: 0s; -ms-animation-timing-function: ease; -ms-animation-fill-mode: both;animation-duration: .8s; animation-delay: 0s; animation-timing-function: ease; animation-fill-mode: both;}"
        + "\n.CValidationListErrors {border: 1px solid #FF0000;padding: 10px;background: #FFF6F5; border-radius: 10px;}"
        + "'n@-webkit-keyframes pulse{0%{-webkit-transform:scale(1)}50%{-webkit-transform:scale(1.1)}100%{-webkit-transform:scale(1)}}"
        + "\n@-moz-keyframes pulse{0%{-moz-transform:scale(1)}50%{-moz-transform:scale(1.1)}100%{-moz-transform:scale(1)}}"
        + "\n@-o-keyframes pulse{0%{-o-transform:scale(1)}50%{-o-transform:scale(1.1)}100%{-o-transform:scale(1)}}"
        + "\n@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}"
        + "\n.pulse{-webkit-animation-name:pulse;-moz-animation-name:pulse;-o-animation-name:pulse;animation-name:pulse}"
        + "\n@-webkit-keyframes wobble{0%{-webkit-transform:translateX(0%)}15%{-webkit-transform:translateX(-25%) rotate(-5deg)}30%{-webkit-transform:translateX(20%) rotate(3deg)}45%{-webkit-transform:translateX(-15%) rotate(-3deg)}60%{-webkit-transform:translateX(10%) rotate(2deg)}75%{-webkit-transform:translateX(-5%) rotate(-1deg)}100%{-webkit-transform:translateX(0%)}}"
        + "\n@-moz-keyframes wobble{0%{-moz-transform:translateX(0%)}15%{-moz-transform:translateX(-25%) rotate(-5deg)}30%{-moz-transform:translateX(20%) rotate(3deg)}45%{-moz-transform:translateX(-15%) rotate(-3deg)}60%{-moz-transform:translateX(10%) rotate(2deg)}75%{-moz-transform:translateX(-5%) rotate(-1deg)}100%{-moz-transform:translateX(0%)}}"
        + "\n@-o-keyframes wobble{0%{-o-transform:translateX(0%)}15%{-o-transform:translateX(-25%) rotate(-5deg)}30%{-o-transform:translateX(20%) rotate(3deg)}45%{-o-transform:translateX(-15%) rotate(-3deg)}60%{-o-transform:translateX(10%) rotate(2deg)}75%{-o-transform:translateX(-5%) rotate(-1deg)}100%{-o-transform:translateX(0%)}}"
        + "\n@keyframes wobble{0%{transform:translateX(0%)}15%{transform:translateX(-25%) rotate(-5deg)}30%{transform:translateX(20%) rotate(3deg)}45%{transform:translateX(-15%) rotate(-3deg)}60%{transform:translateX(10%) rotate(2deg)}75%{transform:translateX(-5%) rotate(-1deg)}100%{transform:translateX(0%)}}"
        + "\n.wobble{-webkit-animation-name:wobble;-moz-animation-name:wobble;-o-animation-name:wobble;animation-name:wobble}"
        + "\n@-webkit-keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}"
        + "\n@-moz-keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}"
        + "\n@-o-keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}"
        + "\n@keyframes flash{0%,50%,100%{opacity:1}25%,75%{opacity:0}}"
        + "\n.flash{-webkit-animation-name:flash;-moz-animation-name:flash;-o-animation-name:flash;animation-name:flash}"
        + "\n@-webkit-keyframes shake{0%,100%{-webkit-transform:translateX(0)}10%,30%,50%,70%,90%{-webkit-transform:translateX(-10px)}20%,40%,60%,80%{-webkit-transform:translateX(10px)}}"
        + "\n@-moz-keyframes shake{0%,100%{-moz-transform:translateX(0)}10%,30%,50%,70%,90%{-moz-transform:translateX(-10px)}20%,40%,60%,80%{-moz-transform:translateX(10px)}}"
        + "\n@-o-keyframes shake{0%,100%{-o-transform:translateX(0)}10%,30%,50%,70%,90%{-o-transform:translateX(-10px)}20%,40%,60%,80%{-o-transform:translateX(10px)}}"
        + "\n@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}}"
        + "\n.shake{-webkit-animation-name:shake;-moz-animation-name:shake;-o-animation-name:shake;animation-name:shake}"
        + "\n@-webkit-keyframes bounce{0%,20%,50%,80%,100%{-webkit-transform:translateY(0)}40%{-webkit-transform:translateY(-30px)}60%{-webkit-transform:translateY(-15px)}}"
        + "\n@-moz-keyframes bounce{0%,20%,50%,80%,100%{-moz-transform:translateY(0)}40%{-moz-transform:translateY(-30px)}60%{-moz-transform:translateY(-15px)}}"
        + "\n@-o-keyframes bounce{0%,20%,50%,80%,100%{-o-transform:translateY(0)}40%{-o-transform:translateY(-30px)}60%{-o-transform:translateY(-15px)}}"
        + "\n@keyframes bounce{0%,20%,50%,80%,100%{transform:translateY(0)}40%{transform:translateY(-30px)}60%{transform:translateY(-15px)}}"
        + "\n.bounce{-webkit-animation-name:bounce;-moz-animation-name:bounce;-o-animation-name:bounce;animation-name:bounce}"
        + "\ndiv.jGrowl .ui-state-error,div.jGrowl .error {background:#CE0A0A !important}"
        + "\ndiv.jGrowl .jGrowl-message,div.jGrowl .jGrowl-close,div.jGrowl .jGrowl-header {color:#ffffff !important}"
        + "\ndiv.jGrowl .ui-state-success,div.jGrowl .success {background:#2F8F2B !important}"
        + "\ndiv.jGrowl .ui-state-notify,div.jGrowl .notify {background:#2AB8FF !important}"
        + "\n#jGrowl  {z-index:99999999999}";

    if (this.isIE() == 8 || this.isIE()==7) {
       var jqeuryInstalled = setInterval(function(){
           if(window.jQuery !== undefined && jQuery('head') !== undefined) {
               clearInterval(jqeuryInstalled);
               jQuery('<div />').html('<style type="text/css">'+customCss+'</style>').appendTo('head');
           }
       },10)

    } else {
        CValidationCss.innerHTML=customCss;
        window.document.getElementsByTagName('head')[0].appendChild(CValidationCss);
    }

};

/**
 * @memberof CValidation
 * @desc internationalization translations
 * @type {object}
 */
CValidation.prototype.i18nMessages = {
    ru:{
        required:'Поле {{field}} обязательно',
        length_min:'Поле {{field}} не должно быть меньше {{num}} символов',
        length_max:'Поле {{field}} не должно быть больше {{num}} символов',
        not_equal:'Поле {{field}} не совпадает в полем {{field2}}',
        email:'Значение email-а некорректно',
        name:'Поле {{field}} имеет некорректное значение',
        notBe:'Поле {{field}} не может принимать значение {{val}}',
        header_required:'Обазятельно!!!',
        header_attention:'Внимание!!!',
        header_email:'Email',
        header_validname:'Осторожно',
        header_length:'Длина',
        header_match:'Несовпадение',
        close_all:'закрыть все',
        error_occured:'Данные не корректны!Пожалуйста проверьте поля отмеченные красной рамкой',
        toBeInt:'Значение поля {{field}} должно быть числом'
    },
    en:{
        required:'Field {{field}} is required',
        length_min:'Field {{field}} has minimem {{num}} charactares',
        length_max:'Поле {{field}} has maxmimun {{num}} charactares',
        not_equal:'Field {{field}} doesn\'t match with {{field2}}',
        email:'Value of email is incorrect',
        name:'Field {{field}} has incorrect value',
        notBe:'Field {{field}} can\'t be equal {{val}}',
        header_required:'Required!!!',
        header_attention:'Attention!!!',
        header_email:'Email',
        header_validname:'Be careful',
        header_length:'Length',
        header_match:'Not match',
        close_all:'close all',
        error_occured:'Errors was occured, please check data in the fields with red border',
        toBeInt:'Value of a field {{field}} must be numeric'

    }
};




