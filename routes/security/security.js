
const jwt = require('jsonwebtoken'),
      path = require('path'),
      { userService } = require(path.join(__dirname, '..','..','services'));

exports.verifyToken  = (req, res, next) => {
    const token = req.header('access-token');
    if(!token) {
        next(new Error('Access denied'));
    }

    try{
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = verified.id;
        next();
    }
    catch(err) { res.send(err)};
    
}

exports.authorize = (req, res, next) => {
    userService.getUserById(req.userId)
               .then(u => {
                    if (u.role !== 'ADMIN') {
                        return res.status(401).json({ message: 'Unauthorized ADMIN'});
                    } 
                    next(); 
               }).catch(err => res.send(err));
     

}