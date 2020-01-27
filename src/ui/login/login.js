const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
function onLoad()
{
    localStorage['baseUrl'] = "http://localhost:27847/";
}
window.onclick = function(event) 
{
    var modal = document.getElementById('registerDiv');
    if (event.target == modal) 
    {
        modal.style.display = "none";
    }
}
function registerBtn_OnClick()
{
    let win = new BrowserWindow({width: 400, height: 400})
    win.on('close', function() { win = null; })
    win.removeMenu()
    //win.webContents.openDevTools()
    win.loadFile('src/ui/register/register.html')
    win.show()
}
function cancelBtn_OnClick()
{
    var modal = document.getElementById('registerDiv');
    if (event.target == modal) 
    {
        modal.style.display = "none";
    }
}
async function submitLogin_OnClick()
{
    var loginInput = document.getElementById('loginInput');
    var passwordInput = document.getElementById('passwordInput');
    if(loginInput != null && passwordInput != null)
    {
        var dataProvider = new DataProvider(null, localStorage['baseUrl'])
        dataProvider.login(loginInput.value, passwordInput.value).then(function(result)
        {
            if(result != null && result.UserId != null && result.UserId != 0)
            {
                let win = new BrowserWindow({show: false})
                win.maximize()
                debugger;
                localStorage['user'] = JSON.stringify(result);
                win.on('close', function() { win = null; })
                win.loadFile('src/ui/main/main.html')
                //win.webContents.openDevTools()
                win.removeMenu()
                win.show()
                window.close()
            }
            else
            {
                alert("Failed to login!");
            }
        });
    }
}