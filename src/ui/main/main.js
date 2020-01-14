function page_OnLoad()
{
    var dataProvider = window.dataProvider;
}
function ribbon_OnTabChange(arguments)
{
    if(arguments != null && arguments[0] != null)
    {
        let tabName = arguments[0].innerText;
        let tabs = document.getElementsByClassName("tabcontent");
        for (let i = 0; i < tabs.length; i++) 
        {
            tabs[i].style.display = "none";
        }
        var selectedTab = document.getElementById(tabName);
        if(selectedTab != null)
        {
            selectedTab.style.display = "block";
        }
    }
}
function notesCreate_OnClick()
{
    console.log("Creating note...")
}
function notesDelete_OnClick()
{
    console.log("Deleting note...")
}
function notesUpdate_OnClick()
{
    console.log("Update note...")
}
function notesRefresh_OnClick()
{
    console.log("Refreshing notes...")
}


function tasksCreate_OnClick()
{
    console.log("Creating task...")
}
function tasksDelete_OnClick()
{
    console.log("Deleting task...")
}
function tasksUpdate_OnClick()
{
    console.log("Update task...")
}
function tasksRefresh_OnClick()
{
    console.log("Refreshing tasks...")
}