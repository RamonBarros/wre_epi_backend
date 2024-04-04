const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

module.exports = app =>{
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe Usuário e Senha!');
        }
    
        const user = await app.db('users')
            .where({ email: req.body.email })
            .first();
        console.log(user);
        if (!user) {
            return res.status(401).send('Usuário não encontrado!');
        }
    
        const isMatch = bcrypt.compareSync(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).send('Email/Senha Inválidos!');
        }
    
        const now = Math.floor(Date.now() / 1000);
    
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            isAdmin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        };
    
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        });
    };
    

    const validateToken = (req, res) => {
        const userData = req.body || null;
        console.log(userData);
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret);
                if (new Date(token.exp * 1000) > new Date()) {
                    const isAdmin = userData.isAdmin;
                    return res.send({valid:true, isAdmin});
                }
            }
        } catch (error) {
            console.error("Erro na validação:", error.message);
            return res.status(500).send('Erro na validação do token');
        }
        res.send(false);
    };
    

    return {signin, validateToken}
}