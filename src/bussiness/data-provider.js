class DataProvider 
{
    constructor(loggedUser, baseUrl)
    {
        this.loggedUser = loggedUser;
        this.baseUrl = baseUrl;
        this.paths = new RestPaths();
    }
    async login(login, password)
    {
        return RestHelper.post(this.baseUrl + this.paths.Login, {Login: login, Password: password});
    }
    async register()
    {
        return RestHelper.post(this.baseUrl + this.paths.Register, null);
    }
    async getUserNotes()
    {
        return RestHelper.post(this.baseUrl + this.paths.UserNotes, this.loggedUser);
    }
    async createNote(note)
    {
        note.UserId = this.loggedUser.UserId;
        return RestHelper.post(this.baseUrl+this.paths.CreateNote, note);
    }
    async deleteNotes(notes)
    {
        return RestHelper.post(this.baseUrl + this.paths.DeleteNotes, notes);
    }
    async updateNote(note)
    {
        return RestHelper.post(this.baseUrl + this.paths.SaveNote, note);
    }
    async getUserTasks()
    {
        return RestHelper.post(this.baseUrl + this.paths.UserTasks, this.loggedUser);
    }
    async createTask(task)
    {
        task.UserId = this.loggedUser.UserId;
        return RestHelper.post(this.baseUrl+this.paths.CreateTask, task);
    }
    async deleteTasks(tasks)
    {
        return RestHelper.post(this.baseUrl+ this.paths.DeleteTask, tasks);
    }
    async updateTask(task)
    {
        return RestHelper.post(this.baseUrl + this.paths.UpdateTask, task);
    }
    async getTaskStatuses()
    {
        return RestHelper.post(this.baseUrl + this.paths.GetTaskStatuses, null);
    }
}