const bcrypt = require('bcrypt')
const { request } = require('express')
const { asaasPaymentApiKey, authSecret, emailAuth } = require('../.env')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { json } = require('body-parser');
const axios = require('axios') 
const Joi = require('joi');

module.exports = app => {
    //Importa as funções de validação de dados de validation.js
    const { existsOrError, notExistsOrError} = app.api.validation

    //Função que retornará a senha do usuario encriptada
    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    //api responsavel por criar,atualizar e apagar cadastros de usuarios
    const save = async (req, res) => {
        const user = { ...req.body }//recebe os dados do usuario via corpo da requisição utilizando o bodyparser
        console.log(user)
        //verifica se foi passado o id do usuario na requisição
        //Caso positivo user.id recebe o id do usuario
        if (req.params.id) user.id = req.params.id

        //Realiza a validação dos dados do usuarios
        //E verifica se será realizada a operação de registrar um novo usuario
        //ou atualizar um usuario já cadastrado
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'Nome não inserido',
                'string.base': 'O campo Nome deve ser uma string.'
            }),
            empresa: Joi.string().required().messages({
                'string.base': 'O campo Nome da Empresa deve ser uma string.',
                'any.required': 'Empresa não inserida'
            }),
            cpf: Joi.string().pattern(/^\d{11}$/).required().messages({
                'string.base': 'O campo CPF deve ser uma string.',
                'string.pattern.base': 'CPF inválido',
                'any.required': 'CPF não inserido'
            }),
            birth_date: Joi.date().iso().required().messages({
                'date.base': 'Data de nascimento inválida',
                'any.required': 'Data de nascimento não inserida'
            }),
            telefone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
                'string.base': 'O campo Telefone deve ser uma string.',
                'string.pattern.base': 'Telefone inválido',
                'any.required': 'Telefone não inserido'
            }),
            email: Joi.string().email().required().messages({
                'string.email': 'Email inválido',
                'any.required': 'Email não inserido'
            }),
            password: Joi.string().min(6).required().messages({
                'string.min': 'A senha deve ter pelo menos {#limit} caracteres',
                'any.required': 'Senha não inserida'
            }),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
                'any.only': 'A confirmação de senha deve ser igual à senha',
                'any.required': 'Confirmação de senha não inserida'
            })
        });



        try {

            const { error} = await schema.validateAsync(req.body);

            if (error) {
                console.error(error.message)
                throw new Error(error.message);
            } else {
                // console.log('Dados válidos:', value);
            }

            //Faz a encriptação da senha do usuario
            user.password = encryptPassword(user.password)
            //Deleta a confirmação da senha do usuario (não vai salvar)
            delete user.confirmPassword

            //Caso tenha sido informado o id do usuario é feito um update utilizando o id
            if (user.id) {

                app.db('users')
                    .update(user)
                    .where({ id: user.id })
                res.status(200).send({ message: "Usuário Atualizado com Sucesso!" })

            } else {
                //Caso não tenha sido informado o id do usuario faz a inserção do usuario
                //mas antes verifica se existe um usuario já cadastrado com o email informado
                //caso não tenha, cria o client_id da api do asaas

                //verifica se já existe um usuario com o email cadastrado(O email deve ser único)
                const userFromDB = await app.db('users')
                    .where({ email: user.email }).first()

                //verifica se na requisição foi passado o id do usuario
                //Caso negativo, verifica se existe um usuario com o email informado
                //Se existir retorna um erro informando que o usuario já está cadastrado

                if (!user.id) {
                    notExistsOrError(userFromDB, 'Usuario já cadastrado')
                }
                user.asaas_client_id = await createNewAsaasClient(user.name, user.cpf);
                app.db('users')
                    .insert(user)
                    res.status(201).send({ message: "Usuário Cadastrado Com Sucesso!" })
            }

        } catch (error) {
            //caso encontre algum erro na validação, retorna o erro 400(erro do cliente, falta de dado etc)
            //e retorna a mensagem do erro correspondente ao dado que está faltando
            console.error('Erro de validação:', error.message);
            return res.status(400).send({ message: error.message })
        }



    }

    //Metodo que retornará os dados dos usuarios
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin', 'cpf', 'empresa', 'telefone', 'birth_date')
            .where({ id: req.params.id })
            .first()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))

    }

    const resetPassword = async (req, res) => {
        const user = { ...req.body }//recebe os dados do usuario via corpo da requisição utilizando o bodyparser

        try {
            existsOrError(user.email, 'E-mail não informado')

            //verifica se já existe um usuario com o email cadastrado(O email deve ser único)
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()

            //verifica se existe um usuario com o email informado
            //caso não exista retorna um erro informando 

            existsOrError(userFromDB, 'E-mail Não Cadastrado')

            console.log(userFromDB)

            if (!userFromDB) {
                return res.status(404).json({ error: 'E-mail não cadastrado' })
            } else {
                const token = jwt.sign({ user: user.email },
                    authSecret, { expiresIn: '10m' })

                // //Atualiza o Token do usuario
                await app.db('users')
                    .where({ id: userFromDB.id })
                    .update({ resetLink: token })

                //sendEmail(user,resetLink)

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: emailAuth, 
                });


                var msg = {
                    from: "noreplay@gmail.com", // your email
                    to: user.email,
                    subject: "Solicitação de troca de senha",
                    html: '<p> Click <a href="http://localhost:80/change-password/' + token + '">' + token + '</a> to reset password<p/>'

                    //html:'<p> Click <a href="http://localhost:3000/forgot-password/'+resetLink+'">'+resetLink+'</a> to reset password<p/>'

                    // I'm only going to use an (a tag) to make this easier to
                    // understand but feel free to add any email templates 
                    // in the `html` property
                };

                try {
                    const email = await transporter.sendMail(msg);
                    console.log(email)
                    res.status(200).send({message:"Email enviado cheque seu email"});
                } catch (error) {
                    console.log(error.response)
                    res.status(500).send("Erro ao enviar Email")
                }
                  


            }

        } catch (error) {
            //caso encontre algum erro retorna o status 500 e uma mensagem
            return res.status(500).send(error.message)
        }
    }

    const validateResetPasswordToken = async (req, res) => {
        const token = req.params.token
        const newPassword = req.body
        existsOrError(token, 'Token Não Informado')

        try {
            const decoded = jwt.verify(token, authSecret)
            // console.log(decoded)
            //verifica se já existe um usuario com o Token
            const userFromDB = await app.db('users')
                .where({ resetLink: token }).first()
            console.log("verificado")
            //verifica se existe um usuario com o token
            //caso não exista retorna um erro informando 
            existsOrError(userFromDB, 'Link Inválido')

            console.log(newPassword)
            const hashPassword = bcrypt.hashSync(newPassword.newPassword, 8)
            newPassword.password = hashPassword
            //Atualiza a senha do usuario

            const updatedCredentials = {
                password: newPassword.password,
                resetLink: null
            }
            app.db('users')
                .update(updatedCredentials)
                .where({ id: userFromDB.id })
                .then(_ => res.status(204).json({ message: 'Senha Alterada' }))
                .catch(err => res.status(500).send(err))


        } catch (msg) {
            //caso encontre algum erro retorna o status 500 e uma mensagem
            console.log(msg)
            return res.status(500).send(msg)
        }
    }

    const createNewAsaasClient = async (clientName, clientCpfCnpj) => {
        try {
            const options = {
                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/customers',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: asaasPaymentApiKey
                },
                data: {
                    name: clientName,
                    cpfCnpj: clientCpfCnpj,
                }
            };
            console.log(clientName, clientCpfCnpj)

            const response = await axios.request(options);
            const clientId = response.data.id; // Obtendo o campo 'id' da resposta

            // Enviando apenas o campo 'id' na resposta JSON
            return clientId

        } catch (error) {
            console.error(error);
            throw new Error('Erro interno do servidor');
        }
    };

    return { save, get, getById, resetPassword, validateResetPasswordToken, createNewAsaasClient }
}