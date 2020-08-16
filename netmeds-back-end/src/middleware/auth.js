//auth middleware to check if user is logged in by checking session of user
const authsession = async (req,res,next) =>{
    try {
        if(!req.session.user){
            throw new Error()
        }
        next()
    } catch (error) {
        res.status(401).send('Authorization failed!')
    }
}

module.exports = authsession
