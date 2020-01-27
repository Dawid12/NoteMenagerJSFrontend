function submitRegiser_OnClick()
{
    var loginInput = document.getElementById('loginInput');
    var passwordInput = document.getElementById('passwordInput');
    var emailInput = document.getElementById('emailInput');

    if(loginInput != null && passwordInput != null && emailInput.value != null) 
    {
        var dataProvider = new DataProvider(null, localStorage['baseUrl'])
        dataProvider.register({UserId: 0, Login: loginInput.value, Password: passwordInput.value, Email: emailInput.value}).then(function(result)
        {
            if(result != null && result.UserId != 0)
            {
                alert("Register successfull!")
            }
        });
    }
    
}