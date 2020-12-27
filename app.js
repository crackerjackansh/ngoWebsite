var express= require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),
	  passportLocalMongoose = require('passport-local-mongoose'),
    path = require('path'),
    session = require('express-session'),
    nodemailer = require('nodemailer');
    
// modules for gridFs
const crypto = require('crypto'),
      multer = require('multer'),
      GridFsStorage = require('multer-gridfs-storage'),
      Grid = require('gridfs-stream'),
      fetch = require('node-fetch');

var app= express();

// models
var User = require('./models/user'),
    Blog = require('./models/blog'),
    Pic = require('./models/pic'),
    Vid = require('./models/vid'),
    Internship = require('./models/internship'),
    Activities = require('./models/activity'),
    Upcoming = require('./models/upcoming');
    




// ==================
//  App config
// ==================
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// ==================
// Mongo URI
// ==================

const mongoURI="mongodb+srv://wayforlife:1way2for3life@cluster0.74qzv.mongodb.net/wayforlifeDB?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {useNewUrlParser: true,useUnifiedTopology: true});
const conn = mongoose.connection;
mongoose.set('useFindAndModify',false);



// ====================
// Authentication
// ====================

app.use(session({
	secret: 'Mary had a little lamb',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// reads the session, this is added to our UserSchema through passportLocalMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

// =======================
// GridFs initialize
// =======================

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


// ==============================
// ROUTES
// ==============================

// index page
app.get("/",function(req,res){
    
    Activities.find({},function(err,activity){
        if(err){
            console.log("error!!");
        }else{
            Upcoming.find({},function(err,upcomingActivity){
                if(err){
                    console.log("error!!");
                }else{
                    Blog.find({},function(err,blogs){
                        if(err){
                            console.log("error!!");
                        }else{
                            gfs.files.find().toArray((err, files) => {
                                // Check if files
                                if (!files || files.length === 0) {
                                  res.render('index', { files: false });
                                } else {
                                  files.map(file => {
                                    if (
                                      file.contentType === 'image/jpeg' ||
                                      file.contentType === 'image/png'
                                    ) {
                                      file.isImage = true;
                                    } else {
                                      file.isImage = false;
                                    }
                                  });
                                  res.render("index",{posts:activity,events:upcomingActivity,blogs:blogs,files:files});
                                  
                                }
                            });
                        }
                    })




                   
                }
            })
       
        }
    })
    
    
    
});

// activities page
app.get("/activities",function(req,res){
    Activities.find({},function(err,activity){
        if(err){
            console.log("error!!");
        }else{
            gfs.files.find().toArray((err, files) => {
                // Check if files
                if (!files || files.length === 0) {
                  res.render('index', { files: false });
                } else {
                  files.map(file => {
                    if (
                      file.contentType === 'image/jpeg' ||
                      file.contentType === 'image/png'
                    ) {
                      file.isImage = true;
                    } else {
                      file.isImage = false;
                    }
                  });
                  res.render("activities",{activities:activity, files: files });
                  
                }
            });
        }
    })
    
});

// gallery page
app.get("/gallery",function(req,res){
   
    Pic.find({},function(err,pic){
        if(err){
            console.log("error!!");
        }else{
            Vid.find({},function(err,vid){
                if(err){
                    console.log("error!!");
                }else{
                    gfs.files.find().toArray((err, files) => {
                        // Check if files
                        if (!files || files.length === 0) {
                          res.render('index', { files: false });
                        } else {
                          files.map(file => {
                            if (
                              file.contentType === 'image/jpeg' ||
                              file.contentType === 'image/png'
                            ) {
                              file.isImage = true;
                            } else {
                              file.isImage = false;
                            }
                          });
                          res.render("gallery",{pics:pic,vids:vid,files:files});
                          
                        }
                    });
                   
                }
            })
            
        }
    })
    
    
    
    
});

// blogs page
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error!!");
        }else{
            gfs.files.find().toArray((err, files) => {
                // Check if files
                if (!files || files.length === 0) {
                  res.render('index', { files: false });
                } else {
                  files.map(file => {
                    if (
                      file.contentType === 'image/jpeg' ||
                      file.contentType === 'image/png'
                    ) {
                      file.isImage = true;
                    } else {
                      file.isImage = false;
                    }
                  });
                  res.render("blogs",{blogs:blogs, files: files });
                  
                }
            });
        }
    })
    
});

// internships page
app.get("/internships",function(req,res){
    Internship.find({},function(err,internship){
        if(err){
            console.log("error!!");
        }else{
            gfs.files.find().toArray((err, files) => {
                // Check if files
                if (!files || files.length === 0) {
                  res.render('index', { files: false });
                } else {
                  files.map(file => {
                    if (
                      file.contentType === 'image/jpeg' ||
                      file.contentType === 'image/png'
                    ) {
                      file.isImage = true;
                    } else {
                      file.isImage = false;
                    }
                  });
                  res.render("internships",{internships:internship, files: files });
                  
                }
            });
        }
    })
});

// about us page
app.get("/aboutus",function(req,res){
    res.render("about");
});
// join us page
app.get("/joinus",function(req,res){
    res.render("join");
});
// contact us page
app.get("/contactus",function(req,res){
    res.render("contact");
});



// ===================
// Admin Section
// ===================

// Admin page
app.get("/admin",isLoggedIn,function(req,res){
    res.render("admin/adminPage");
});

// to get different pages of admin section

app.get("/admin/:page",isLoggedIn,function(req,res){
    if(req.params.page=="blogs"){
        Blog.find({},function(err,blogs){
            if(err){
                console.log("error!!");
            }else{
                res.render("admin/blogs",{blogs:blogs})
            }
        })
    }
    if(req.params.page=="pic"){
        Pic.find({},function(err,pic){
            if(err){
                console.log("error!!");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/pic",{pics:pic, files: files });
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="vid"){
        Vid.find({},function(err,vid){
            if(err){
                console.log("error!!");
            }else{
                res.render("admin/vid",{vids:vid})
            }
        })
    }
    if(req.params.page=="internships"){
        Internship.find({},function(err,internship){
            if(err){
                console.log("error!!");
            }else{
                res.render("admin/internships",{internships:internship})
            }
        })
    }
    if(req.params.page=="ourActivities"){
        Activities.find({},function(err,activity){
            if(err){
                console.log("error!!");
            }else{
               res.render("admin/ourActivities",{activities:activity})
            }
        })
    }
    if(req.params.page=="upcoming"){
        Upcoming.find({},function(err,upcomingActivity){
            if(err){
                console.log("error!!");
            }else{
               res.render("admin/upcoming",{upcoming:upcomingActivity})
            }
        })
    }
})

// ==================
// RESTapi Routes
// ==================

//new route
app.get("/admin/:page/new",isLoggedIn,function(req,res){
    res.render("admin/new",{page:req.params.page})
})

app.post("/admin/:page",isLoggedIn,upload.single('file'),function(req,res){
    //create route
    if(req.params.page=="blogs"){
        var obj=req.body.blog;
       
        
        if(req.file==undefined){
            obj=req.body.blog
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        console.log(obj)
        Blog.create(obj, function(err,blog){
            if(err){
                res.render("admin/new",{page:req.params.page});
            }else{
                
                console.log(req.body.blog)
                res.redirect("/admin/blogs");
            }
        })
    }
    if(req.params.page=="pic"){
        var obj=req.body.pic;
       
        
        if(req.file==undefined){
            obj=req.body.pic
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        console.log(obj)
        Pic.create(obj, function(err,pic){
            if(err){
                res.render("admin/new",{page:req.params.page});
            }else{
                console.log(req.body.pic)
                res.redirect("/admin/pic");
            }
        })
    }
    if(req.params.page=="vid"){
        var obj=req.body.vid;
        if(req.file==undefined){
            obj=req.body.vid
        }
        else{
            obj.thumbnail=req.file.filename;
            obj.image_id=req.file.id;
        }
        Vid.create(obj, function(err,vid){
            if(err){
                res.render("admin/new",{page:req.params.page});
            }else{
                console.log(req.body.vid)
                res.redirect("/admin/vid");
            }
        })
    }
    if(req.params.page=="internships"){
        var obj=req.body.internship;
       
        if(req.file==undefined){
            obj=req.body.internship
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        console.log(obj)
        Internship.create(obj, function(err,internship){
            if(err){
                res.render("admin/new",{page:req.params.page});
            }else{
                console.log(req.body.internship)
                res.redirect("/admin/internships");
            }
        })
    }
    if(req.params.page=="ourActivities"){
        var obj=req.body.activity;
       
        if(req.file==undefined){
            obj=req.body.activity
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        console.log(obj)
        Activities.create(obj, function(err,activity){
            if(err){
                console.log(err)
                res.render("admin/new",{page:req.params.page});
            }else{
                console.log(req.body.activity)
                res.redirect("/admin/ourActivities");
            }
        })
    }
    if(req.params.page=="upcoming"){
        var obj=req.body.upcomingActivity;
       
        if(req.file==undefined){
            obj=req.body.upcomingActivity
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        console.log(obj)
        Upcoming.create(obj, function(err,upcomingActivity){
            if(err){
                res.render("admin/new",{page:req.params.page});
            }else{
                console.log(req.body.upcomingActivity)
                res.redirect("/admin/upcoming");
            }
        })
    }
    
});

//show route

app.get("/admin/:page/:id",isLoggedIn,function(req,res){
    if(req.params.page=="blogs"){
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/show",{blog: foundBlog,page:req.params.page, files: files });
                      
                    }
                });
                
            }
        })
    }
    if(req.params.page=="pic"){
        Pic.findById(req.params.id,function(err,foundPic){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/show",{pic: foundPic,page:req.params.page, files: files });
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="vid"){
        Vid.findById(req.params.id,function(err,foundVid){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/show",{vid: foundVid,page:req.params.page, files: files });
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="internships"){
        Internship.findById(req.params.id,function(err,foundInternship){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/show",{internship: foundInternship,page:req.params.page, files: files });
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="ourActivities"){
        Activities.findById(req.params.id,function(err,foundActivities){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/show",{activity: foundActivities,page:req.params.page, files: files });
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="upcoming"){
        Upcoming.findById(req.params.id,function(err,foundUpcoming){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/show",{upcoming: foundUpcoming,page:req.params.page, files: files });
                      
                    }
                });
            }
        })
    }   
    
});

//edit route

app.get("/admin/:page/:id/edit",isLoggedIn,function(req,res){
    if(req.params.page=="blogs"){
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/edit",{blog: foundBlog,page:req.params.page, files: files});
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="pic"){
        Pic.findById(req.params.id,function(err,foundPic){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/edit",{pic: foundPic,page:req.params.page, files: files});
                      
                    }
                });
                
            }
        })
    }
    if(req.params.page=="vid"){
        Vid.findById(req.params.id,function(err,foundVid){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/edit",{vid: foundVid,page:req.params.page, files: files});
                      
                    }
                });
            }
        })
    }
    if(req.params.page=="internships"){
        Internship.findById(req.params.id,function(err,foundInternship){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/edit",{internship: foundInternship,page:req.params.page, files: files});
                      
                    }
                });
                
            }
        })
    }
    if(req.params.page=="ourActivities"){
        Activities.findById(req.params.id,function(err,foundActivities){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/edit",{activity: foundActivities,page:req.params.page, files: files});
                      
                    }
                });
                
            }
        })
    }
    if(req.params.page=="upcoming"){
        Upcoming.findById(req.params.id,function(err,foundUpcoming){
            if(err){
                res.redirect("/admin");
            }else{
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                      res.render('index', { files: false });
                    } else {
                      files.map(file => {
                        if (
                          file.contentType === 'image/jpeg' ||
                          file.contentType === 'image/png'
                        ) {
                          file.isImage = true;
                        } else {
                          file.isImage = false;
                        }
                      });
                      res.render("admin/edit",{upcoming: foundUpcoming,page:req.params.page, files: files});
                      
                    }
                });
                
            }
        })
    }
    
});

//update route

app.put("/admin/:page/:id/:imageId",isLoggedIn,upload.single('file'),function(req,res){
    if(req.params.page=="blogs"){
        var obj=req.body.blog;
        if(req.file==undefined){
            obj=req.body.blog
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        
       
        Blog.findByIdAndUpdate(req.params.id,obj,function(err,updatedBlog){
            if(err){
                res.redirect("/admin");
            }else{
                
                console.log(req.body.blog)
                if(!obj.image_id){
                    res.redirect("/admin/blogs/"+req.params.id);
                }else{
                    gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                    
                        res.redirect("/admin/blogs/"+req.params.id);
                      });
                    
                }
                
                
            }
        })
    }
    if(req.params.page=="pic"){
        var obj=req.body.pic;
        if(req.file==undefined){
            obj=req.body.pic
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        Pic.findByIdAndUpdate(req.params.id,obj,function(err,updatedPic){
            if(err){
                res.redirect("/admin");
            }else{
                if(!obj.image_id){
                    res.redirect("/admin/pic/"+req.params.id);
                }else{
                    gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                    
                        res.redirect("/admin/pic/"+req.params.id);
                      });
                    
                }
                
            }
        })
    }
    if(req.params.page=="vid"){
        var obj=req.body.vid;
        if(req.file==undefined){
            obj=req.body.vid
        }
        else{
            obj.thumbnail=req.file.filename;
            obj.image_id=req.file.id;
        }
        Vid.findByIdAndUpdate(req.params.id,obj,function(err,updatedVid){
            if(err){
                res.redirect("/admin");
            }else{
                if(!obj.image_id){
                    res.redirect("/admin/vid/"+req.params.id);
                }else{
                    gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                    
                        res.redirect("/admin/vid/"+req.params.id);
                      });
                    
                }
                   
                    
                
                    
                    
                
                
            }
        })
    }
    if(req.params.page=="internships"){
        var obj=req.body.internship;
        if(req.file==undefined){
            obj=req.body.internship
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        Internship.findByIdAndUpdate(req.params.id,obj,function(err,updatedInternship){
            if(err){
                res.redirect("/admin");
            }else{
                if(!obj.image_id){
                    res.redirect("/admin/internships/"+req.params.id);
                }else{
                    gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                    
                        res.redirect("/admin/internships/"+req.params.id);
                      });
                    
                }
                
            }
        })
    }
    if(req.params.page=="ourActivities"){
        var obj=req.body.activity;
        if(req.file==undefined){
            obj=req.body.activity
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        Activities.findByIdAndUpdate(req.params.id,obj,function(err,updatedActivities){
            if(err){
                res.redirect("/admin");
            }else{
                if(!obj.image_id){
                    res.redirect("/admin/ourActivities/"+req.params.id);
                }else{
                    gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                    
                        res.redirect("/admin/ourActivities/"+req.params.id);
                      });
                    
                }
                
            }
        })
    }
    if(req.params.page=="upcoming"){
        var obj=req.body.upcomingActivity;
        if(req.file==undefined){
            obj=req.body.upcomingActivity
        }
        else{
            obj.image=req.file.filename;
            obj.image_id=req.file.id;
        }
        Upcoming.findByIdAndUpdate(req.params.id,obj,function(err,updatedUpcoming){
            if(err){
                res.redirect("/admin");
            }else{
                if(!obj.image_id){
                    res.redirect("/admin/upcoming/"+req.params.id);
                }else{
                    gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                    
                        res.redirect("/admin/upcoming/"+req.params.id);
                      });
                    
                }
                
            }
        })
    }
    
})

//delete route

app.delete("/admin/:page/:id",isLoggedIn,function(req,res){
    if(req.params.page=="blogs"){
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/blogs");
            }else{     
                
                        
                    res.redirect("/admin/blogs");
               
            }
        })
    }
    if(req.params.page=="pic"){
        Pic.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/pic");
            }else{
               
                
                    res.redirect("/admin/pic");
                
                
            }
        })
    }
    if(req.params.page=="vid"){
        Vid.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/vid");
            }else{
                
                
                    res.redirect("/admin/vid");
                
                
                
                
                
                
            }
        })
    }
    if(req.params.page=="internships"){
        Internship.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/internships");
            }else{
                
                
                    res.redirect("/admin/internships");
               
               
            }
        })
    }
    if(req.params.page=="ourActivities"){
        Activities.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/ourActivities");
            }else{
                
                
                    res.redirect("/admin/ourActivities");
               
                
            }
        })
    }
    if(req.params.page=="upcoming"){
        Upcoming.findByIdAndRemove(req.params.id,function(err){
            if(err){
                console.log(err)
                res.redirect("/admin/upcoming");
            }else{
               
                    res.redirect("/admin/upcoming");
                
                
            }
        }) 
    }
    
})

app.delete("/admin/:page/:id/:imageId",isLoggedIn,function(req,res){
    if(req.params.page=="blogs"){
        Blog.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/blogs");
            }else{     
                gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                        return res.status(404).json({ err: err });
                    }
                        
                    res.redirect("/admin/blogs");
                });
            }
        })
    }
    if(req.params.page=="pic"){
        Pic.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/pic");
            }else{
                gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                
                    res.redirect("/admin/pic");
                });
                
            }
        })
    }
    if(req.params.page=="vid"){
        Vid.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/vid");
            }else{
                gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                
                    res.redirect("/admin/vid");
                });
                
                
                
                
                
            }
        })
    }
    if(req.params.page=="internships"){
        Internship.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/internships");
            }else{
                gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                
                    res.redirect("/admin/internships");
                });
               
            }
        })
    }
    if(req.params.page=="ourActivities"){
        Activities.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/admin/ourActivities");
            }else{
                gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                
                    res.redirect("/admin/ourActivities");
                });
                
            }
        })
    }
    if(req.params.page=="upcoming"){
        Upcoming.findByIdAndRemove(req.params.id,function(err){
            if(err){
                console.log(err)
                res.redirect("/admin/upcoming");
            }else{
                gfs.remove({_id:req.params.imageId, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                
                    res.redirect("/admin/upcoming");
                });
                
            }
        }) 
    }
    
})


// 

// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });

// ==================
// AUTH ROUTES
// ==================

// displays sign up form
app.get('/register', function(req, res){
	res.render('admin/registerPage');
})

// handles user sign up
app.post('/register', function(req, res){
  var newUser= new User({ username: req.body.username});

	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect('/admin');
		});
	})
})

// LOGIN ROUTES

// renders log in form
app.get('/login', function(req, res){
	res.render('admin/loginPage');
})

// login logic
app.post('/login', passport.authenticate('local', {
	successRedirect: '/admin',
	failureRedirect: '/login'
}), function(req, res){
	console.log(res);
})

// LOGOUT ROUTE

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/login');
})

// check if user is logged in and has access to secret page
// passed as middleware to secret route
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

// ===================
// Contact Us Route
// ===================
app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
          user: 'wayforlife6@gmail.com', 
          pass: '1way2for3life'  
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Way for life Mailer" <wayforlife6@gmail.com>', 
        to: 'crackerjackansh@gmail.com', // list of receivers, format- 'first@gmail.com,second@gmail.com,third@gmail.com' 
        subject: 'Way For Life - Contact Request', 
        text: 'Hello world?',
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render("success",{title:"Contact Request",body:"We have received your request , will contact you shortly.",back:"contactus"});
    });
});


// ====================
//  Newsletter Route
// ====================

app.post('/signup', (req, res) => {
  const { email } = req.body;

  // Make sure fields are filled
  if (!email) {
    res.render('fail',{title:"Newsletter Subscription",back:""})
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed'
      }
    ]
  };

  const postData = JSON.stringify(data);

  fetch('https://us2.api.mailchimp.com/3.0/lists/56b47cf548', {
    method: 'POST',
    headers: {
      Authorization: 'auth aacf93d1a08f2d8e5e690b8942c4eacc-us2'
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.render('success',{title:"Newsletter Subscription",body:"You have been subscribed to our newsletter",back:""}) :
      res.render('fail',{title:"Newsletter Subscription",back:""}))
    .catch(err => console.log(err))
})





const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`WayForLife serverstarted on ${PORT}`));
