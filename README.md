Validation class, which checks your form

Usage:
------

Set a necessary attribute in field

    data-cvalidation="required"

    data-cvalidation="length<6" or data-cvalidation="<3length<6"

    data-cvalidation="length>3" or data-cvalidation="6>length>3"

    data-cvalidation="email"

    data-cvalidation="validname"

    data-cvalidation="equal=confirm_password" (name attribute of filed)

    data-cvalidation="notToBe(0,abc)"

     data-cvalidation="toBeInt"


you can use all these rules mixed

    data-cvalidation="required 20<length<6 validname"

custom's error message:

    data-cvalidation-message="Your password doesn't match wich confirm password"

custom's field name:

    data-cvalidation-fieldname="My Field"

The use of the class:

    <script>
    var validation = new CValidation();
    var result = validation.submitForm('#forma',event);

    var enValid = new CValidation('en');
    enValid.setLocale('en');

    </script>

OR

    <input type="button" value="Send" onclick="validation.submitForm(this,event);" />



Also the class uses masked input: http://digitalbush.com/projects/masked-input-plugin.

Its use:

       $("#date").mask("99/99/9999");
       $("#phone").mask("(999) 999-9999");
       $("#tin").mask("99-9999999");
       $("#ssn").mask("999-99-9999");


Options:
--------

You can use different notifications. By default CValidation uses jGrowl, but you can choose another:

    Available:
        jGrowl
        powerTip
        textError
        listError

The first variant:

     <script>
        var validation = new CValidation('en','powerTip');
        var validation = new CValidation('en','textError');
     </script>

The second variant:

     <script>
        var validation = new CValidation();
        validation.setShowType('powerTip');
        validation.setShowType('textError');
        validation.setShowType('listError');
     </script>



You can use different effects of the notifications. By default CValidation uses 'wiggle'

    Available:
        wiggle
        wobble
        flash
        shake
        bounce



        <script>
            var validation = new CValidation();
            validation.setAnimateEffect('wiggle');
         </script>



Use method ready for custom handle, when all required plugins are installed, code, which you will
pass in ready function as argument will be called


        var valid = new CValidation();
        valid.ready(function(){
            //Your code here
        });


Contributions:
-------------


If you use the class via the attribute onclick, for example :

                <a href="#" onclick="validation.submitForm(this,event);">Send</a>

Parameters "this" and "event" are required



If you use custom handler, for example:

                var valid = new CValidation();
                valid.ready(function(){
                        $('#form1').click(function(event){
                                       valid.submitForm('#ff',event);
                           });
                });



Set first parametes CSS3 selector (parameter must be a string)
And "event" parameter is required also, but if you don't want auto submit form
you should set the second parameter to true (boolean), in this case, set event third parameter
for example:

                var valid = new CValidation();
                valid.ready(function(){
                $('#form1').click(function(event){
                                       valid.submitForm('#ff',true,event);
                               });
                });





Rules:
-----

    data-cvalidation="required"

Field is required

    data-cvalidation="length<6"

Field has max 6 symbols

    data-cvalidation="email"

Value of the field must have valid email

     data-cvalidation="validname"

Value of the field must have valid name (For examle: John, McGonnary)

    data-cvalidation="equal=confirm_password" (name attribute of filed)

Value of the field is equal value of the second field

    data-cvalidation="notToBe(0,abc)"

Value of the field can not be equal values in brackets

    data-cvalidation="toBeInt"

Value of the filed must be integer

Important
---------

The main method submitForm has the second parameter, by default it is undefined
and when all data of form have valid values, the method will automatically remove all listeners from the form
and imitate a click on submit, but if you pass the second parameter to `true`, method will return true
if all data are valid


I18n:
-----

The class uses object i18nMessages, where all translations are situated

        i18nMessages = {
            en:{
                require:'Field {{field}} is required'
            }
        }

You can change any message or add a new language

        <script>
            var validation = new CValidation();
            console.log(validation.i18nMessages.en.required);
            validation.i18nMessages.fr = {
                require:'Field {{field}} is required'
            };
         </script>



Example:
-------
    <script src="CValidation.js"></script>
    <script>
        var validation = new CValidation();

    </script>
    <form id="fomr">
            <p>
                <label>Login</label>
                <input type="text" data-cvalidation="required length>6"  name="login" />
            </p>
            <p>
                <label>First Name</label>
                <input type="text" data-cvalidation="validname" data-cvalidation-fieldname="Yout First Name" name="firstname" />
            </p>

            <p>
                <label>email</label>
                <input type="text"  name="email" data-cvalidation="email" data-cvalidation-message="Email isn't correct" />
            </p>
            <p>
                <label>password</label>
                <input type="password" data-cvalidation-fieldname="Password" data-cvalidation="length>6 equal=Model[confirm_password]"  name="password" />
            </p>
            <p>
                <label>Confirm password</label>
                <input type="password" data-cvalidation="length>6" name="Model[confirm_password]" />
            </p>
            <p>

                <input type="submit" id="form1" name="submit" value="Submit" onclick="validation.submitForm(this,event)"/>
            </p>
        </form>

   --------------------
    <script src="CValidation.js"></script>
    <script>
       var valid = new CValidation();
       valid.setShowType('powerTip');
       valid.setAnimateEffect('wobble');
       valid.ready(function(){
          $('#formask').mask('(999)-99-999');
          $('#form1').click(function(event){
              valid.submitForm('#ff',event);

          });
          });

    </script>


     <form id="ff" action="" method="get" >


            <p>
                <label>Your age</label>
                <input type="number" data-cvalidation="toBeInt" name="mynumber" />
            </p>

            <p>
                <label>Your phonenumber</label>
                <input type="text" id="formask" name="mynumber" />
            </p>

            <p>

                <input type="button" id="form1" name="submit" value="Submit" />
            </p>
    </form>
