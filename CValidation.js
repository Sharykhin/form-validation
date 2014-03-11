var CValidation = function(){
    this.install();

}


CValidation.prototype.submitForm = function(formSelector,ajax) {
        window.event.preventDefault();
        var formSelector = formSelector || jQuery(window.event.target).parents('form');
        var formElements = formSelector.find('input,textarea').not('button[type=submit],input[type=submit]');
        var errors = [];
        var $this = this;
        formElements.removeClass('cvalidation-error');
        formElements.each(function(){
           if(jQuery(this).attr('data-cvalidation')) {
               var rules = jQuery.trim(jQuery(this).attr('data-cvalidation')).split(" ");
               for(var i= 0,len=rules.length;i<len;i++){
                   if(jQuery(this).attr('data-cvalidation-message')) {
                       var errorMessage = jQuery.trim(jQuery(this).attr('data-cvalidation-message'));
                   }
                   if(rules[i].search(/length/) !== -1) {
                       $this.validLength(jQuery(this),errors,rules[i],errorMessage);
                       continue;
                   }
                   if(rules[i].search(/equal/) != -1) {
                       $this.validEqual(jQuery(this),errors,rules[i],errorMessage);
                       continue;
                   }

                    $this[rules[i]](jQuery(this),errors,errorMessage);

               }
           }
        });
       if(errors.length > 0) {
           for(var i= 0,len=errors.length;i<len;i++){
               jQuery.jGrowl(errors[i].message,{header:errors[i].type,themeState:'error'});
           }
           return false;
       }

        if(ajax !== true) {
            formSelector.find('input[type=submit],button[type=submit]').off('click');
            formSelector.find('input[type=submit],button[type=submit]').attr('onclick','return true;').click();
        }



};


CValidation.prototype.validLength = function(fieldSelector,errors,rule,errorMessage) {
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
        fieldSelector.addClass('cvalidation-error');
        errors.push({type:'min lenght',message:errorMessage || 'Filed must have minimun '+minValue+' charachter'});
    }
    if(valueLength > maxValue && maxValue !== null) {
        fieldSelector.addClass('cvalidation-error');
        errors.push({type:'max lenght',message:errorMessage || 'Filed can contain maxmimin '+maxValue+' charachter'});
    }

};

CValidation.prototype.validEqual = function(fieldSelector,errors,rule,errorMessage) {
    var fieldValue = jQuery.trim(fieldSelector.val());
    var params = rule.split("=");
    var equalWith = params[1];
    var equalValue = jQuery.trim(fieldSelector.parents('form').find('input[name="'+equalWith+'"]').val());
    if(fieldValue !== equalValue) {

        fieldSelector.addClass('cvalidation-error');
        fieldSelector.parents('form').find('input[name="'+equalWith+'"]').addClass('cvalidation-error');
        errors.push({type:'doesn\'t match',message:errorMessage || 'Fields value doesn\'t match'});
    }

};

CValidation.prototype.required = function(fieldSelector,errors,errorMessage) {
    if(jQuery.trim(fieldSelector.val()) === '') {
        fieldSelector.addClass('cvalidation-error');
        errors.push({type:'required',message:errorMessage || 'Field is required'});
    }
};


CValidation.prototype.email = function(fieldSelector,errors,errorMessage) {
    var regEmail = /^[a-z0-9_\.-]{1,20}@[a-z0-9_-]{1,20}\.[a-z0-9]{2,3}$/gi;
    if(jQuery.trim(fieldSelector.val()).search(regEmail) === -1) {
        fieldSelector.addClass('cvalidation-error');
        errors.push({type:'invalid email',message:errorMessage || 'Email has incorrect value'});
    }
};

CValidation.prototype.validname = function(fieldSelector,errors,errorMessage) {
    var regName = /^[a-zа-я0-9_-\s]{3,40}$/gi;
   if(jQuery.trim(fieldSelector.val()).search(regName) === -1) {
       fieldSelector.addClass('cvalidation-error');
       errors.push({type:'invalid name',message:errorMessage || 'Name has incorrect value'});
   }
};


CValidation.prototype.install=function() {
    if(window.jQuery === undefined) {

        var jqueryLib = window.document.createElement('script');
        jqueryLib.setAttribute('type','text/javascript');
//        jqueryLib.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js');
        var request;
        if (window.XMLHttpRequest) {
            // IE7+, Firefox, Chrome, Opera, Safari
            request = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        // load
        request.open('GET', 'https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js', false);
        request.send();
        var response = request.responseText;
        jqueryLib.innerHTML=response;
        window.document.getElementsByTagName('head')[0].appendChild(jqueryLib);
    }

    if(window.jQuery.jGrowl === undefined) {

        var  jGrowlLib = window.document.createElement('script');

        jGrowlLib.setAttribute('type','text/javascript');
//        jGrowlLib.setAttribute('src', '//cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.js');

        var request;
        if (window.XMLHttpRequest) {
            // IE7+, Firefox, Chrome, Opera, Safari
            request = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        // load
        request.open('GET', '//cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.js', false);
        request.send();
        var response = request.responseText;
        jGrowlLib.innerHTML=response;
        window.document.getElementsByTagName('head')[0].appendChild(jGrowlLib);

        jGrowlLib.setAttribute('type','text/javascript');

        var  jGrowlLibCss = window.document.createElement('style');
        jGrowlLibCss.setAttribute('type','text/css');

        var request;
        if (window.XMLHttpRequest) {
            // IE7+, Firefox, Chrome, Opera, Safari
            request = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        // load
        request.open('GET', '//cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.css', false);
        request.send();
        var response = request.responseText;
        jGrowlLibCss.innerHTML=response
            + "\ndiv.jGrowl .ui-state-error {background-color:#CE0A0A !important}"
            + "\ndiv.jGrowl .ui-state-success {background-color:#2F8F2B !important}"
            + "\ndiv.jGrowl .ui-state-notify {background-color:#2AB8FF !important}"
            + "\n.cvalidation-error  {border:1px solid #FF0000 !important}";
        window.document.getElementsByTagName('head')[0].appendChild(jGrowlLibCss);

    }

};

