import { opine, serveStatic } from "https://deno.land/x/opine@2.0.2/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.10.2/mod.ts";
import { GitHubClient, LinkedInClient, GoogleClient } from 'https://raw.githubusercontent.com/oslabs-beta/DenOAuth/bd756b2d5d0e1bb2961dcf35fc4b9bf4f005758d/mod.ts'


const app = opine();



const GitHubObject = new GitHubClient({
    clientId: '<your_cliendId>',
    clientSecret: "<your_cliendSecret>",
    tokenUri: 'https://github.com/login/oauth/access_token',
    redirect: "http://localhost:3000/auth/github/callback",
    scope: "read:user"
});

const LinkedInObject = new LinkedInClient({
    clientId: '<your_cliendId>',
    clientSecret: '<your_cliendSecret>',
    tokenUri: 'https://api.linkedin.com/v2/me',
    redirect: 'http://localhost:3000/auth/linkedin/callback',
    scope: 'r_liteprofile'
});

const GoogleObject = new GoogleClient({
    clientId: '<your_cliendId>',
    clientSecret: '<your_cliendSecret>',
    tokenUri: 'https://accounts.google.com/o/oauth2/token',
    redirect: 'http://localhost:3000/auth/google/callback',
    scope: 'https://mail.google.com&access_type=offline&include_granted_scopes=true'
});

// const router = new Router();



app.engine('.html', renderFileToString);  
app.use(serveStatic("html"));

app.get('/login', async (req, res) => {
    res.render('login.html')
})

app.get('/gitHub', (req, res) => {
  res.redirect(GitHubObject.code.createLink())
})
app.get('/linkedin', (req, res) => {
  res.redirect(LinkedInObject.code.createLink())
})

app.get('/google', (req, res) => {
  res.redirect(GoogleObject.code.createLink())
})

app.get('/auth/github/callback', async (req, res) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GitHubObject.code.processAuth(req._parsedUrl);
    // userProfile is an object of information given by GitHub. You can destructure the object to grab specific information
    const { name } = userProfile;
    
    res.send(`Hello, ${name}!`);
})

app.get('/auth/linkedin/callback', async (req, res) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await LinkedInObject.code.processAuth(req._parsedUrl);
    // userProfile is an object of information given by LinkedIn. You can destructure the object to grab specific information
    const {localizedFirstName} = userProfile;

    res.send(`Hello ${localizedFirstName}`);
})


app.get('/auth/google/callback', async (req, res) => {
    // Exchange the authorization code for an access token and exchange token for profile
    const userProfile: any = await GoogleObject.code.processAuth(req._parsedUrl);
    // userProfile is an object of information given by Google. 
    //You can destructure the object to grab specific information once the app has been verified
    res.send(`Hello, this is where your secret page lives`);
})

app.listen(
    3000,
    () => console.log("server has started on http://localhost:3000 🚀"),
  );
