class RestPaths
{
  constructor()
  {
    this.Base = "NoteMenagerService.svc";
    this.Login = this.Base + "/getUser/";
    this.Register = this.Base + "/createUser/";
    this.CreateNote = this.Base + "/createNote/";
    this.UserNotes = this.Base + "/userNotes/";
    this.SaveNote = this.Base + "/saveNote/";
    this.DeleteNotes = this.Base + "/deleteNotes/";
    this.UserTasks = this.Base + "/userTasks/";
    this.CreateTask = this.Base + "/createTask/";
    this.UpdateTask = this.Base + "/updateTask/";
    this.DeleteTask = this.Base + "/deleteTask/";
    this.GetTaskStatuses = this.Base + "/getTaskStatuses/";
  }
};