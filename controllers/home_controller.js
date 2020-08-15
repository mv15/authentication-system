module.exports.home = function(req, res) {
    // console.log(req.cookies);

    // res.cookie('user_id', 25);
    
    return res.render('home', {
        title: "Authentication System for any Web App"
    });
}