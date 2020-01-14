function submitRegiser_OnClick()
{
    var loginInput = document.getElementById('loginInput');
    var passwordInput = document.getElementById('passwordInput');
    var emailInput = document.getElementById('emailInput');

    if(loginInput != null && passwordInput != null && emailInput.value != null) 
    {
        if(DataProvider.register(loginInput.value, passwordInput.value, emailInput.value))
        {
            console.log("Registering successfull...")
        }
    }
    
}