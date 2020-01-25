class RestHelper
{
    constructor()
    {
    }
    static async post(url, myBody)
    {
      var temp = JSON.stringify(myBody);
      const rawResponse = await fetch(url, 
        {
          method: 'POST',
          headers: 
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(myBody)
        });
        const content = await rawResponse.json();
        return content;
    }
}