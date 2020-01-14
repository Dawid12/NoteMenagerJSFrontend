const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

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
    win.webContents.openDevTools()
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
function submitLogin_OnClick()
{
    var loginInput = document.getElementById('loginInput');
    var passwordInput = document.getElementById('passwordInput');
    if(loginInput != null && passwordInput != null)
    {
        debugger;
        var dataProvider = new DataProvider(loginInput.value, passwordInput.value);
        if(dataProvider.login())
        {
            let win = new BrowserWindow({width: "100%", height: "100%"})
            win.dataProvider = dataProvider;
            win.on('close', function() { win = null; })
            win.loadFile('src/ui/main/main.html')
            win.webContents.openDevTools()
            win.removeMenu()
            win.show()
            window.close()
        }
    }
}