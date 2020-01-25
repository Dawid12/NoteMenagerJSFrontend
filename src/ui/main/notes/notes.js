var notes = null;
function notes_OnLoad()
{
    if(localStorage['user'] != null && localStorage["baseUrl"] != null)
    {
        window.dataProvider = new DataProvider(JSON.parse(localStorage['user']), localStorage["baseUrl"])
        refresh();
    }
}
function refresh()
{
    window.dataProvider.getUserNotes().then(function(result)
    {
        notes = result;
        var toDisplay = notes.filter(function(note){return note.MasterNoteId == null;})
        for(var i = 0; i < toDisplay.length; i++)
        {
            $('#notesTreeView').data('treeview').addTo(null, {
                caption: "["+toDisplay[i].NoteId.toString()+"]"+toDisplay[i].Title
            });
        }
    });
}
function onNodeInsert(node, tree)
{
    let noteId = getNoteId(node)
    if(noteId != null)
    {
        let children = notes.filter(function(note){ return note.MasterNoteId == noteId });
        if(children != null)
        {
            for(let i = 0; i < children.length; i++)
            {
                $('#notesTreeView').data('treeview').addTo(node, {
                    caption: "["+children[i].NoteId.toString()+"]"+children[i].Title
                });
            }
        }
    }
}
function getNoteId(treeNode)
{
    if(treeNode != null && treeNode.innerText != null)
    {
        let openingBracket = treeNode.innerText.indexOf("[");
        let closingBracket = treeNode.innerText.indexOf("]");
        if(openingBracket != null && closingBracket != null)
        {
            let noteIdStr = treeNode.innerText.substring(openingBracket + 1, closingBracket);
            if(noteIdStr != null)
            {
                let noteId = parseInt(noteIdStr)
                if(noteId != null)
                {
                    return noteId;
                }
            }
        }
    }
    return null;
}
function onNodeClick(node, tree)
{
}
function onExpandNode(node, tree)	
{
}
function addNote()
{
    let note = makeNewNote();
    let parentNode = null;
    let currentNode = $('#notesTreeView').find('.current');
    if(currentNode != null && currentNode.length > 0)
    {
        let noteId = getNoteId(currentNode[0]);
        if(noteId != null)
        {
            note.MasterNoteId = noteId;
            parentNode = currentNode[0];
        }
    }
    else
    {
        note.MasterNoteId = null;
    }
    window.dataProvider.createNote(note).then(function(result) {
        $('#notesTreeView').data('treeview').addTo(parentNode, {
            caption: "["+result.NoteId.toString()+"]"+result.Title
        })
        notes.push(result);
    });
}
function deleteNote()
{
    let currentNode = $('#notesTreeView').find('.current');
    if(currentNode != null && currentNode.length > 0)
    {
        let noteId = getNoteId(currentNode[0]);
        if(noteId != null)
        {
            let selectedNode = notes.filter(function(note) {return note.NoteId == noteId});
            let childrenOfNode = getNoteStructure(noteId);
            Array.prototype.push.apply(childrenOfNode, selectedNode);
            window.dataProvider.deleteNotes(childrenOfNode).then(function(result)
            {
                $('#notesTreeView').data('treeview').del($('#notesTreeView').find('.current'))
            });
            for(let i = 0; i < notes.length; i++)
            {
                for(let j = 0; j < childrenOfNode.length; j++)
                {
                    if(notes[i].NoteId == childrenOfNode[j].NoteId)
                    {
                        notes.splice(i, 1);
                        childrenOfNode.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
}
function updateNote()
{
    debugger;
    let currentNode = $('#notesTreeView').find('.current');
    if(currentNode != null && currentNode.length > 0)
    {
        let noteId = getNoteId(currentNode[0]);
        if(noteId != null)
        {
            let updatedNote = updateNoteObject(noteId);
            window.dataProvider.updateNote(updatedNote).then(function(result) 
            {
               debugger; 
            });
            currentNode[0].innerText = "["+updatedNote.NoteId.toString()+"]"+updatedNote.Title;
        }
    }
}
function updateNoteObject(noteId)
{
    if(noteId != null && notes != null)
    {
        for(let i = 0; i < notes.length; i++)
        {
            if(notes[i].NoteId == noteId)
            {
                notes[i].Title = "updated Note"
                notes[i].NoteText = "updated note text"
                return notes[i]
            }
        }
    }
}
function getNoteStructure(noteId)
{
    let children = notes.filter(function(note) {return note.MasterNoteId == noteId});
    let childrenOfChildren = [];
    if(children != null && children.length > 0)
    {
        for(let i = 0; i<children.length;i++)
        {
            Array.prototype.push.apply(childrenOfChildren, getNoteStructure(children[i].NoteId));
        }
        Array.prototype.push.apply(children, childrenOfChildren);
    }
    return children;
}
function makeNewNote()
{
    return {
        NoteId: 0,
        TaskId: null,
        UserId: null,
        NoteText: "empty",
        Type: null,
        MasterNoteId: null,
        Title: "New note",
        CreationDate: Date.now().toString(),
        EditionDate: Date.now().toString()
    };
}