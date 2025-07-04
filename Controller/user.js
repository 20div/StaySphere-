const User = require("../modules/user");

module.exports.Rendersignup = (req,res) =>{
    res.render("User/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");  
        }) } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.Renderlogin = (req,res) =>{
    res.render("User/login.ejs");
};

module.exports.loginForm = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res ,next)=>{
    req.logout((err) =>{
        if(err) {
            next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    })};