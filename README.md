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


you can use all this rules in mixed

    data-cvalidation="required 20<length<6 validname"

custom error message:

    data-cvalidation-message="Your password doesn't match wich confirm password"

custom field name:

    data-cvalidation-fieldname="My Field"


Example:
-------

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

                <input type="submit" id="form1" name="submit" value="Submit" />
            </p>
        </form>
