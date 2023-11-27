let jwt  =  require('jsonwebtoken');
const JWT_Secret = 'SainiShab';

const fetchuser = (req, res, next) =>{
//get user from JWT token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "please authenticate using a validtoken"})
    }
    try{const data  =  jwt.verify(token, JWT_Secret);
        req.user = data.user;
        next();
    }catch(error){
        res.status(401).send({error: "please authenticate using a validtoken"})
    }
    
}

module.exports = fetchuser;