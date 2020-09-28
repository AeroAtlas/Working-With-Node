const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//Controller
const errorController = require('./controllers/error');
//Database
const {mongoConnect} = require("./util/database");
//Models 
const User = require("./models/user")
//Initialize Express
const app = express();

//Set global config value and tell express where to find templates
app.set('view engine', 'ejs');
app.set('views', 'views');

//Create Route Variables
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//? Middleware (incomming requests are only funned through Middleware)
//Body Parser
app.use(bodyParser.urlencoded({extended: false}));
//Static files (read access)
app.use(express.static(path.join(__dirname, 'public')));
//Find User Middleware
app.use((req,res,next) => {
  User.findById("5f702746dc6b86039d69ae16")
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id)
      next();
    })
    .catch(err => console.log(err))
})

//Routing
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
//Render 404 if no routes are hit
app.use(errorController.noPageFound)

//Database Connect
mongoConnect(() => {
  app.listen(3000)
})


















//app.use([path,]callback[,callback])...





//Client -> Request -> Server -> Response -> Client


//Stream -> ReqBody1 => ReqBody2 => Buffer[ReqBody3 => ReqBody4] -> Fully Parsed

/*Incoming Req -> MyCode + Single JS Thread 
                            ->Event Loop(only finish fast finishing code) -> Handle Event Callbacks 
                            ->"fs" -sent to-> WorkerPool (Does the heavy lifting & runs of diff threads)
                                                  ->^ triggers callback to EventLoop
Event Loop  -> Timers(Execute setTimeout, setInterval Callback)
            -> Pending Callbacks (Execute I/O-related (input/output-disk + network operations ~blocking ops). Callbacks that were defered)
              ( if too many callbacks it will skip a few and give those callback to the next loop )
            -> Poll (retrieve new I/O events, execute their callbacks). If not possible defer to pending cb's and check for timers cb's
            -> Check (execute setImmediate() callbacks) executes immediate after any open callbacks. faster than settimeout. after current cycle
            -> Close Callbaccks (execute all close event callbacks)
            --> process.exit (if (refs == 0)) [refs is for every new callback] -1 ever completed callback
                ** Listen doesn't let refs decrease so it stays looping
*/

/*
Middleware -> Request -> Middleware () -> Response
*/