Validation class, which checks your form

Usage:
------

in fileds set attribute:
    data-cvalidation="required"

    data-cvalidation="length<6" or data-cvalidation="<3length<6"

    data-cvalidation="length>3" or data-cvalidation="6>length>3"

    data-cvalidation="email"

    data-cvalidation="validname"

    data-cvalidation="equal=confirm_password" (name attribute of filed)

    data-cvalidation="notBe(0,abc)"


you can use all this rules in mixed

    data-cvalidation="required 20<length<6 validname"

custom error message:

    data-cvalidation-message="Your password doesn't match wich confirm password"

custom field name:

    data-cvalidation-fieldname="My Field"

use class:

    <script>
    var validation = new CValidation();
    var result = validation.submitForm($('#forma'));

    var enValid = new CValidation('en');
    enValid.setLocale('en');

    </script>


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

    data-cvalidation="notBe(0,abc)"

Value of the field can not be equal values in brackets


IMPORTANT
---------

Main method submitForm has second parameter, by default it is undefined
and when all data of form will be have valid values, method automatically remove all listeners from form
and imitate click on submit, but if you pass second parameter to `true`, method return true
if all data are valid


I18N:
-----

File Contain object: CValidationI18N where situated translations, example:

        CValidationI18N = {
            en:{
                require:'Field {{field}} is required'
            }
        }

You can change any message or add new language



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

                <input type="submit" id="form1" name="submit" value="Submit" onclick="validation.submitForm()"/>
            </p>
        </form>
