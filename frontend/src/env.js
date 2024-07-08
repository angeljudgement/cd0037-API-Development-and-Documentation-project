export const environment = {
  production: false,
  apiServerUrl: 'https://cd0037-api-development-and-documentation.onrender.com', // the running FLASK api server url
  auth0: {
    url: 'dev-8qytb52luzve8pdy.us', // the auth0 domain prefix
    audience: 'quizzes', // the audience set for the auth0 app
    clientId: 'Ywst25ZehmdkAjX8vAZO97BMegFRAvw3', // the client id generated for the auth0 app
    callbackURL: 'http://localhost:3000', // the base url of the running ionic application. 
  }
};
