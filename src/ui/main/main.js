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
    let notesIframe = document.getElementById('notesFrame').contentWindow;
    if(notesIframe != null)
    {
        notesIframe.addNote();
    }
}
function notesDelete_OnClick()
{
    let notesIframe = document.getElementById('notesFrame').contentWindow;
    if(notesIframe != null)
    {
        notesIframe.deleteNote();
    }
}
function notesUpdate_OnClick()
{
    let notesIframe = document.getElementById('notesFrame').contentWindow;
    if(notesIframe != null)
    {
        notesIframe.updateNote();
    }
}
function notesRefresh_OnClick()
{
    let notesIframe = document.getElementById('notesFrame');//.contentWindow;
    notesIframe.src = notesIframe.src;
}


function tasksCreate_OnClick()
{
    let tasksIframe = document.getElementById('tasksFrame').contentWindow;
    if(tasksIframe != null)
    {
        tasksIframe.addTask();
    }
}
function tasksDelete_OnClick()
{
    let tasksIframe = document.getElementById('tasksFrame').contentWindow;
    if(tasksIframe != null)
    {
        tasksIframe.deleteTask();
    }
}
function tasksUpdate_OnClick()
{
    let tasksIframe = document.getElementById('tasksFrame').contentWindow;
    if(tasksIframe != null)
    {
        tasksIframe.updateTask();
    }
}
function tasksRefresh_OnClick()
{
    let tasksIframe = document.getElementById('tasksFrame');
    tasksIframe.src = tasksIframe.src;
}