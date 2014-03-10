var CValidation = function(){
    this.install();

}

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
            + "\ndiv.jGrowl .ui-state-notify {background-color:#2AB8FF !important}" ;
        window.document.getElementsByTagName('head')[0].appendChild(jGrowlLibCss);

    }


}

