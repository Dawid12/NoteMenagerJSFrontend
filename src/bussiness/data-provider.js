class DataProvider 
{
    constructor(login, password)
    {
        this.userLogin = login;
        this.userPassword = password;
    }
    login()
    {
        return true;
    }
    static register()
    {
        return true;
    }
}