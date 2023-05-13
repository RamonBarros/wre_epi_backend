const bcrypt = require('bcrypt') 
const { request } = require('express')
const {authSecret} = require('../.env')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { json } = require('body-parser');
const baseApiUrl = "http://localhost:3000"

module.exports = app =>{
    //Importa as funções de validação de dados de validation.js
    const {existsOrError,notExistsOrError,equalsOrError} = app.api.validation
    
    //Função que retornará a senha do usuario encriptada
    const encryptPassword = (password) =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password,salt)
    }

    //api responsavel por criar,atualizar e apagar cadastros de usuarios
    const save = async (req,res) => {
        const user = {...req.body}//recebe os dados do usuario via corpo da requisição utilizando o bodyparser

        //verifica se foi passado o id do usuario na requisição
        //Caso positivo user.id recebe o id do usuario
        if(req.params.id) user.id = req.params.id 

        //Realiza a validação dos dados do usuarios
        //E verifica se será realizada a operação de registrar um novo usuario
        //ou atualizar um usuario já cadastrado
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.cpf, 'CPF não informado')
            existsOrError(user.empresa, 'Empresa não informada')
            existsOrError(user.telefone, 'Telefone não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha invalida')
            equalsOrError(user.password,user.confirmPassword, 'Senhas não conferem')
            
            //verifica se já existe um usuario com o email cadastrado(O email deve ser único)
            const userFromDB= await app.db('users')
                .where({email: user.email}).first()

            //verifica se na requisição foi passado o id do usuario
            //Caso negativo, verifica se existe um usuario com o email informado
            //Se existir retorna um erro informando que o usuario já está cadastrado
            if(!user.id){
                notExistsOrError(userFromDB,'Usuario já cadastrado')
            }

        } catch (msg) {
            //caso encontre algum erro na validação, retorna o erro 400(erro do cliente, falta de dado etc)
            //e retorna a mensagem do erro correspondente ao dado que está faltando
            return res.status(400).send(msg)
        }

        //Faz a encriptação da senha do usuario
        user.password = encryptPassword(user.password)
        //Deleta a confirmação da senha do usuario (não vai salvar)
        delete user.confirmPassword

        //Caso tenha sido informado o id do usuario é feito um update utilizando o id
        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_=>res.status(204).send())
                .catch(err=>res.status(500).send(err))
                //Caso encontre um erro retorna o erro de codigo 500(erro no servidor)
                //Caso não encontre retorna o status 204 (deu certo)
        }else{
            //Caso não tenha sido informado o id do usuario faz a inserção do usuario
            app.db('users')
                .insert(user)
                .then(_=>res.status(204).send())
                .catch(err=>res.status(500).send(err))
        }

    }

    //Metodo que retornará os dados dos usuarios
    const get = (req, res) => {
        app.db('users')
            .select('id','name','email','admin')
            .then(users =>res.json(users))
            .catch(err=>res.status(500).send(err))
    }
    
    const getById = (req, res) => {
        app.db('users')
            .select('id','name','email','admin')
            .where({id: req.params.id})
            .first()
            .then(users =>res.json(users))
            .catch(err=>res.status(500).send(err))
    
        }
    const getByEmail = (email) => {
        return app.db('users')
            .select('id','name','email','admin')
            .where({email: {email}})
            .first()
            .then(users =>res.json(users))
            .catch(err=>res.status(500).send(err))
         
    }

    function sendEmail(user, token) {

    //     const transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: 'ramonbarrosgomes1@gmail.com',
    //             pass: 'lkctrrzpzainbwcl',
    //         },
    //     });
        
        
    //     var msg = {
    //       from: "noreplay@gmail.com", // your email
    //       to: user.email,
    //       subject: "Solicitação de troca de senha",
    //       html:'<p> Click <a href="http://localhost:3000/forgot-password/'+token+'">'+token+'</a> to reset password<p/>'

    //      //html: '<p>Click <a href="http://localhost:3000/sessions/recover/' + recovery_token + '">here</a> to reset your password</p>'

    //      // I'm only going to use an (a tag) to make this easier to
    //      // understand but feel free to add any email templates 
    //      // in the `html` property
    //     };
        
    //     transporter.sendMail(msg,function(err){
    //         if (err) return res.status(400).json({
    //             erro: true,
    //             message:"Erro:E-mail não enviado!"})
    //     })
    //   return res.json({
    //     erro:false,
    //     message:"Email Enviado com sucesso!"
    //   })
    }


    const resetPassword = async (req, res) => {
        const user = {...req.body}//recebe os dados do usuario via corpo da requisição utilizando o bodyparser
        
        try{
            existsOrError(user.email, 'E-mail não informado')
            
            //verifica se já existe um usuario com o email cadastrado(O email deve ser único)
            const userFromDB= await app.db('users')
                .where({email: user.email}).first()

            //verifica se existe um usuario com o email informado
            //caso não exista retorna um erro informando 
            
            existsOrError(userFromDB,'E-mail Não Cadastrado')

            if(!userFromDB){
                res.status(404).json({error: 'E-mail não cadastrado'})
            } else{
                const resetLink = jwt.sign({user:user.email},
                    authSecret,{expiresIn: '10m'})
        
                    // //Atualiza o Token do usuario
                    await app.db('users')
                        .where({id: userFromDB.id})
                        .update({resetLink})
                        
                        //sendEmail(user,resetLink)

                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'ramonbarrosgomes1@gmail.com',
                                pass: 'lkctrrzpzainbwcl',
                            },
                        });
                        
                        
                        var msg = {
                          from: "noreplay@gmail.com", // your email
                          to: user.email,
                          subject: "Solicitação de troca de senha",
                          html:'<p> Click <a href="http://localhost:3000/forgot-password/'+resetLink+'">'+resetLink+'</a> to reset password<p/>'
                
                         //html: '<p>Click <a href="http://localhost:3000/sessions/recover/' + recovery_token + '">here</a> to reset your password</p>'
                
                         // I'm only going to use an (a tag) to make this easier to
                         // understand but feel free to add any email templates 
                         // in the `html` property
                        };
                        
                        transporter.sendMail(msg,function(err){
                            if (err) return res.status(400).json({
                                erro: true,
                                message:"Erro:E-mail não enviado!"})
                        })
                    

        res.status(200).json({ message: "Check your email"});            
        }

        } catch (msg) {
            //caso encontre algum erro retorna o status 500 e uma mensagem
            return res.status(500).send(msg)
        }
    }

    const validateResetPasswordToken = async (req,res) => {
        const resetLink=req.params.token
        const newPassword = req.body

        existsOrError(resetLink,'Token Não Informado')

        try {

            const decoded=jwt.verify(resetLink,authSecret)
            
            //verifica se já existe um usuario com o email cadastrado(O email deve ser único)
            const userFromDB= await app.db('users')
                .where({resetLink}).first()
            
            //verifica se existe um usuario com o token
            //caso não exista retorna um erro informando 
            existsOrError(userFromDB,'Link Inválido')

            const hashPassword = bcrypt.hashSync(newPassword.password,8)
            newPassword.password = hashPassword

            //Atualiza a senha do usuario

            const updatedCredentials = {
                password: newPassword.password,
                resetLink: null
              }
            app.db('users')
                .update(updatedCredentials)
                .where({id: userFromDB.id})
                .then(_=>res.status(204).json({message: 'Senha Alterada'}))
                .catch(err=>res.status(500).send(err))
            
        } catch (msg) {
            //caso encontre algum erro retorna o status 500 e uma mensagem
            return res.status(500).send(msg)
        }
    }

    return {save,get,getById,resetPassword, validateResetPasswordToken}
}