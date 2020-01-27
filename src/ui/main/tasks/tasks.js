var tasks = null;
var selectedMasterTask = null;
var selectedTaskStatus = null;
var masterTasks = [];
var taskStatuses = [];
var shouldRefresh = false;
function onItemSelect(val, option, item)
{
    if(item != null && item.textContent != null)
    {
        selectedMasterTask = item.textContent
    }
}
function onStatusSelect(val, option, item)
{
    if(item != null && item.textContent != null)
    {
        selectedTaskStatus = item.textContent
    }
}
function getStatusText(statusId)
{
    if(taskStatuses != null && taskStatuses.length > 0)
    {
        for(let i = 0; i < taskStatuses.length; i++)
        {
            if(taskStatuses[i].id == statusId)
            {
                return taskStatuses[i].title;
            }
        }
    }
    return "unknown";
}
function getDisplayTask(task)
{
    if(task != null)
    {
        return "["+task.TaskId.toString()+"]" + task.Title + " - " + getStatusText(task.TaskStatus);
    }
    return "none";
}
function tasks_OnLoad()
{
    let creationDateInput = $('#creationDateInput').data('input');
    let editionDateInput = $('#editionDateInput').data('input');
    creationDateInput.disable();
    editionDateInput.disable();
    if(localStorage['user'] != null && localStorage["baseUrl"] != null)
    {
        window.dataProvider = new DataProvider(JSON.parse(localStorage['user']), localStorage["baseUrl"])
        refresh();
    }
}
function refresh()
{
    window.dataProvider.getTaskStatuses().then(function(result)
    {
        fillStatusSelect(result);
        window.dataProvider.getUserTasks().then(function(result)
        {
            tasks = result;
            var toDisplay = tasks.filter(function(task){return task.MasterTaskId == null;})
            
            for(let i = 0; i < toDisplay.length; i++)
            {
                $('#tasksTreeView').data('treeview').addTo(null, {
                    caption: getDisplayTask(toDisplay[i])
                });
            }
            fillMasterSelect();
        });
    });
}
function fillMasterSelect()
{
    let masterTaskSelect = $('#masterTaskSelect').data('select');
    if(masterTaskSelect != null && tasks != null)
    {
        let displayTitles = []
        for(let i = 0; i < tasks.length; i++)
        {
            let title = getDisplayTask(tasks[i])
            displayTitles.push(title);
            masterTasks.push({id: tasks[i].TaskId, index: i, title: title})
        }
        masterTasks.push({id: null, title: "[none]none", index: masterTasks.length});
        displayTitles.push("[none]none");
        masterTaskSelect.data(displayTitles)
    }
}
function fillStatusSelect(statuses)
{
    let taskStatusSelect = $('#taskStatusSelect').data('select');
    if(taskStatusSelect != null && statuses != null)
    {
        let displayTitles = [];
        for(let i = 0; i < statuses.length; i++)
        {
            displayTitles.push(statuses[i].Name);
            taskStatuses.push({id: statuses[i].StatusId, index: i, title: statuses[i].Name})
        }
        taskStatusSelect.data(displayTitles)
    }
}
function onNodeInsert(node, tree)
{
    let taskId = getTaskId(node)
    if(taskId != null)
    {
        let children = tasks.filter(function(task){ return task.MasterTaskId == taskId });
        if(children != null)
        {
            for(let i = 0; i < children.length; i++)
            {
                $('#tasksTreeView').data('treeview').addTo(node, {
                    caption: getDisplayTask(children[i])
                });
            }
        }
    }
}
function getTaskId(treeNode)
{
    if(treeNode != null && treeNode.innerText != null)
    {
        let openingBracket = treeNode.innerText.indexOf("[");
        let closingBracket = treeNode.innerText.indexOf("]");
        if(openingBracket != null && closingBracket != null)
        {
            let taskIdStr = treeNode.innerText.substring(openingBracket + 1, closingBracket);
            if(taskIdStr != null)
            {
                let taskId = parseInt(taskIdStr)
                if(taskId != null)
                {
                    return taskId;
                }
            }
        }
    }
    return null;
}
function onNodeClick(node, tree)
{
    let taskId = getTaskId(node)
    if(taskId != null && tasks != null)
    {
        for(let i = 0; i < tasks.length; i++)
        {
            if(tasks[i].TaskId == taskId)
            {
                let taskTitleInput = $('#taskTitleInput').data('input');
                if(taskTitleInput != null)
                {
                    taskTitleInput.elem.value = tasks[i].Title;
                }
                let creationDateInput = $('#creationDateInput').data('input');
                if(creationDateInput != null)
                {
                    creationDateInput.elem.value = new Date(parseInt(tasks[i].CreationDate));
                }
                let editionDateInput = $('#editionDateInput').data('input');
                if(editionDateInput != null)
                {
                    editionDateInput.elem.value = new Date(parseInt(tasks[i].EditionDate));
                }
                let masterTaskSelect = $('#masterTaskSelect').data('select');
                if(masterTaskSelect != null)
                {
                    let masterTask = masterTasks.filter(function(task)
                    {
                        return task.id == tasks[i].MasterTaskId;
                    });
                    if(masterTask != null && masterTask.length > 0)
                    {
                        masterTaskSelect.val(masterTask[0].index);
                    }
                    else
                    {
                        masterTaskSelect.val(masterTasks[masterTasks.length - 1].index);
                    }
                }
                let taskStatusSelect = $('#taskStatusSelect').data('select');
                if(taskStatusSelect != null)
                {
                    let taskStatus = taskStatuses.filter(function(status)
                    {
                        return status.id == tasks[i].TaskStatus;
                    });
                    if(taskStatus != null && taskStatus.length > 0)
                    {
                        taskStatusSelect.val(taskStatus[0].index);
                    }
                }
                let taskTextInput = $('#taskTextInput').data('textarea');
                if(taskTextInput != null)
                {
                    taskTextInput.elem.value = tasks[i].TaskText;
                }
                break;
            }
        }
    }
}
function onExpandNode(node, tree)	
{
}
function addTask()
{
    let task = makeNewTask();
    let parentNode = null;
    let currentNode = $('#tasksTreeView').find('.current');
    if(currentNode != null && currentNode.length > 0)
    {
        let taskId = getTaskId(currentNode[0]);
        if(taskId != null)
        {
            task.MasterTaskId = taskId;
            parentNode = currentNode[0];
        }
    }
    else
    {
        task.MasterTaskId = null;
    }
    window.dataProvider.createTask(task).then(function(result) 
    {
        $('#tasksTreeView').data('treeview').addTo(parentNode, {
            caption: "["+result.TaskId.toString()+"]"+result.Title  + " - " + getStatusText(result.TaskStatus)
        })
        tasks.push(result);
    });
}
function deleteTask()
{
    debugger;
    let currentNode = $('#tasksTreeView').find('.current');
    if(currentNode != null && currentNode.length > 0)
    {
        let taskId = getTaskId(currentNode[0]);
        if(taskId != null)
        {
            let selectedNode = tasks.filter(function(task) {return task.TaskId == taskId});
            let childrenOfNode = getTaskStructure(taskId);
            Array.prototype.push.apply(childrenOfNode, selectedNode);
            window.dataProvider.deleteTasks(childrenOfNode).then(function(result)
            {
                $('#tasksTreeView').data('treeview').del($('#tasksTreeView').find('.current'))
            });
            for(let i = 0; i < tasks.length; i++)
            {
                for(let j = 0; j < childrenOfNode.length; j++)
                {
                    if(tasks[i].TaskId == childrenOfNode[j].TaskId)
                    {
                        tasks.splice(i, 1);
                        childrenOfNode.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
}
function updateTask()
{
    let currentNode = $('#tasksTreeView').find('.current');
    if(currentNode != null && currentNode.length > 0)
    {
        let taskId = getTaskId(currentNode[0]);
        if(taskId != null)
        {
            let updatedTask = updateTaskObject(taskId);
            window.dataProvider.updateTask(updatedTask).then(function(result) 
            {
               if(result != null && result == true)
               {
                   alert("Successfully saved!");
                   if(shouldRefresh)
                   {
                        document.location.href = document.location.href;
                   }
               }
            });
            currentNode[0].innerText = getDisplayTask(updatedTask);
        }
    }
}
function updateTaskObject(taskId)
{
    if(taskId != null && tasks != null)
    {
        for(let i = 0; i < tasks.length; i++)
        {
            if(tasks[i].TaskId == taskId)
            {
                let taskTitleInput = $('#taskTitleInput').data('input');
                if(taskTitleInput != null)
                {
                    tasks[i].Title = taskTitleInput.elem.value;
                }
                let editionDateInput = $('#editionDateInput').data('input');
                if(editionDateInput != null)
                {
                    tasks[i].EditionDate = Date.now().toString();
                }
                let masterTaskSelect = $('#masterTaskSelect').data('select');
                if(masterTaskSelect != null)
                {
                    if(selectedMasterTask != null)
                    {
                        let masterTask = masterTasks.filter(function(task)
                        {
                            return task.title == selectedMasterTask;
                        });
                        if(masterTask != null && masterTask.length > 0)
                        {
                            if(tasks[i].TaskId != masterTask[0].id)
                            {
                                tasks[i].MasterTaskId = masterTask[0].id;
                                shouldRefresh = true;
                            }
                        }
                    }
                }
                let taskStatusSelect = $('#taskStatusSelect').data('select');
                if(taskStatusSelect != null)
                {
                    debugger;
                    if(selectedTaskStatus != null)
                    {
                        let taskStatus = taskStatuses.filter(function(status)
                        {
                            return status.title == selectedTaskStatus;
                        });
                        if(taskStatus != null && taskStatus.length > 0)
                        {
                            tasks[i].TaskStatus = taskStatus[0].id;
                        }
                    }
                }
                let taskTextInput = $('#taskTextInput').data('textarea');
                if(taskTextInput != null)
                {
                    tasks[i].TaskText = taskTextInput.elem.value;
                }
                return tasks[i]
            }
        }
    }
}
function getTaskStructure(taskId)
{
    let children = tasks.filter(function(task) {return task.MasterTaskId == taskId});
    let childrenOfChildren = [];
    if(children != null && children.length > 0)
    {
        for(let i = 0; i<children.length;i++)
        {
            Array.prototype.push.apply(childrenOfChildren, getTaskStructure(children[i].TaskId));
        }
        Array.prototype.push.apply(children, childrenOfChildren);
    }
    return children;
}
function makeNewTask()
{
    return {
        TaskId: 0,
        UserId: null,
        Title: "New task",
        TaskText: "empty",
        CreationDate: Date.now().toString(),
        EditionDate: Date.now().toString(),
        TaskStatus: 1,
        MasterTaskId: null,
    };
}