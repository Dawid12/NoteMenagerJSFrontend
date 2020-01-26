var notes = null;
var selectedMasterNote = null;
var masterNotes = [];
function onItemSelect(val, option, item)
{
    if(item != null && item.textContent != null)
    {
        selectedMasterNote = item.textContent
    }
}
function notes_OnLoad()
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
    window.dataProvider.getUserNotes().then(function(result)
    {
        notes = result;
        var toDisplay = notes.filter(function(note){return note.MasterNoteId == null;})
        
        for(let i = 0; i < toDisplay.length; i++)
        {
            $('#notesTreeView').data('treeview').addTo(null, {
                caption: "["+toDisplay[i].NoteId.toString()+"]"+toDisplay[i].Title
            });
        }
        fillMasterSelect();
    });
}
function fillMasterSelect()
{
    let masterNoteSelect = $('#masterNoteSelect').data('select');
    if(masterNoteSelect != null && notes != null)
    {
        let displayTitles = []
        for(let i = 0; i < notes.length; i++)
        {
            displayTitles.push("["+notes[i].NoteId.toString()+"]"+notes[i].Title);
            masterNotes.push({id: notes[i].NoteId, index: i, title: "["+notes[i].NoteId.toString()+"]"+notes[i].Title})
        }
        masterNotes.push({id: null, title: "[none]none", index: masterNotes.length});
        displayTitles.push("[none]none");
        masterNoteSelect.data(displayTitles)
    }
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
    let noteId = getNoteId(node)
    if(noteId != null && notes != null)
    {
        for(let i = 0; i < notes.length; i++)
        {
            if(notes[i].NoteId == noteId)
            {
                let noteTitleInput = $('#noteTitleInput').data('input');
                if(noteTitleInput != null)
                {
                    noteTitleInput.elem.value = notes[i].Title;
                }
                let creationDateInput = $('#creationDateInput').data('input');
                if(creationDateInput != null)
                {
                    creationDateInput.elem.value = new Date(parseInt(notes[i].CreationDate));
                }
                let editionDateInput = $('#editionDateInput').data('input');
                if(editionDateInput != null)
                {
                    editionDateInput.elem.value = new Date(parseInt(notes[i].EditionDate));
                }
                let masterNoteSelect = $('#masterNoteSelect').data('select');
                if(masterNoteSelect != null)
                {
                    let masterNote = masterNotes.filter(function(note)
                    {
                        return note.id == notes[i].MasterNoteId;
                    });
                    if(masterNote != null && masterNote.length > 0)
                    {
                        masterNoteSelect.val(masterNote[0].index);
                    }
                    else
                    {
                        debugger;
                        masterNoteSelect.val(masterNotes[masterNotes.length - 1].index);
                    }
                }
                let noteTextInput = $('#noteTextInput').data('textarea');
                if(noteTextInput != null)
                {
                    noteTextInput.elem.value = notes[i].NoteText;
                }
                break;
            }
        }
    }
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
               if(result != null && result == true)
               {
                   alert("Successfully saved!");
                   document.location.href = document.location.href;
               }
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
                debugger
                let noteTitleInput = $('#noteTitleInput').data('input');
                if(noteTitleInput != null)
                {
                    notes[i].Title = noteTitleInput.elem.value;
                }
                let editionDateInput = $('#editionDateInput').data('input');
                if(editionDateInput != null)
                {
                    notes[i].EditionDate = Date.now().toString();
                }
                let masterNoteSelect = $('#masterNoteSelect').data('select');
                if(masterNoteSelect != null)
                {
                    if(selectedMasterNote != null)
                    {
                        let masterNote = masterNotes.filter(function(note)
                        {
                            return note.title == selectedMasterNote;
                        });
                        if(masterNote != null && masterNote.length > 0)
                        {
                            if(notes[i].noteId != masterNote[0].id)
                            {
                                notes[i].MasterNoteId = masterNote[0].id;
                            }
                        }
                    }
                }
                let noteTextInput = $('#noteTextInput').data('textarea');
                if(noteTextInput != null)
                {
                    notes[i].NoteText = noteTextInput.elem.value;
                }
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