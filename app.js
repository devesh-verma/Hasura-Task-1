var express = require("express");
var cookieParser = require("cookie-parser");
var axios = require("axios");

var app = express();
app.use(cookieParser());


// "/" => "Hello World"
app.get("/", function (req, res) {
    res.send("Hello World - Devesh");
});


//setting cookies
app.get("/setcookies",function (req, res) {
    var cookiename = req.cookies.name;
    var cookieage = req.cookies.age;
    if (cookiename === undefined || cookieage === undefined ){
        console.log(req.cookies);
        res.cookie('name', 'Devesh');
        res.cookie('age', '22');
        console.log("cookies set successfulLY");
        res.end();
    }
    else{
        console.log("cookie already exists");
        res.end();
    }
});

//Displaying cookies
app.get('/getcookies', function(req, res) {
    console.log('Cookies: ', req.cookies);
    res.send(req.cookies);
});

// Render a static file like this
app.use('/html', express.static(__dirname + '/static'));

// Rendering authors and there posts
const users = 'https://jsonplaceholder.typicode.com/users';
const posts = 'https://jsonplaceholder.typicode.com/posts';

function user() {
    return axios.get(users);
}
function post() {
    return axios.get(posts);
}

app.get('/authors', function(req, res){

    axios.all([user(),post()])
        .then(axios.spread(function(users,posts){
            var name=[]; // getting error with name
            users.data.forEach(function(user){
                name.push(user.name);
            });
            postsNum=[];
            posts.data.forEach(function(post){
                if(postsNum[post.userId -1]==null)
                    postsNum[post.userId-1]=1;
                else
                    postsNum[post.userId-1]+=1;
            });
            for(var i=0;i<name.length;i++)
                //getting error in below line
                res.write(`${i+1}) ${name[i]} has number of posts= ${postsNum[i]}\n`);
            // error in above line
            res.end();
        })).catch(function(error)
    {
        res.status(500).send('Error');
    });
});


// "*" => requests sent to any route other than the ones defined by us will trigger this route.
// NOTE : ROUTE ORDERING MATTERS, IF WE PUT "*" ROUTE AT 1ST NO OTHER ROUTES WILL BE ABLE  TO EXECUTE AS THEY WILL MATCH "*" ROUTE AT FIRST AND HENCE THAT WILL KEEP EXECUTING
// ROUTES ARE MATCHED IN ORDER OF THEIR EXISTENCE
app.get("*", function (req, res) {
    res.send("Star route");
});


//Tell Express to listen for requests (start server)

app.listen(3000, function() {
        console.log("server is running at 3000");
});
