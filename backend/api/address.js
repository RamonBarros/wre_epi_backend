module.exports = app => {
    const {existsOrError,notExistsOrError} = app.api.validation

    const save = (req,res) => {
        const address = {...req.body}
        if(req.params.id){
            address.id = req.params.id
        }

        try{
            existsOrError(address.city, 'Cidade Não Informada')
            existsOrError(address.country, 'País Não Informado')
            existsOrError(address.number, 'Número Não Informado')
            existsOrError(address.district, 'Bairro Não Informado')
            existsOrError(address.state, 'Estado Não Informado')
            existsOrError(address.street, 'Rua Não Informada')
            existsOrError(address.zipCode, 'Cep Não Informado')
            existsOrError(address.complement, 'Complemento Não Informado')
            existsOrError(address.userId, 'Id do usuario Não Informado')
        }catch(msg){
            res.status(400).send(msg)
        }
        if(address.id){
            app.db('user_address')
                .update(address)
                .where({id: address.id})
                .then(_=> res.status(200).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('user_address')
                .insert(address)
                .then(_=> res.status(200).send())
                .catch(err=> res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            const rowsDeleted = await app.db('user_address')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted,'Produto Não Foi Encontrado.')

            res.status(200).send()
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('user_address').count('id').first()

        app.db('user_address')
            .select('id','city', 'country','district','number','state','zipCode','complement','street','userId')
            .then(user_address => res.json(user_address))
            .catch(err =>res.status(500).send(err))
    }

    const getById = (req,res) => {
        app.db('user_address')
            .where({id: req.params.id})
            .first()
            .then(address => {
                address.content = address.content.toString()
                return res.json(address)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req,res) => {
        const categoryId = req.params.id
        
        app.db('user_address')
            .select('name','imageUrl','price')
            .where({categoryId:categoryId})
            .then(user_address => res.json(user_address))
            .catch(err => res.status(500).send(err)) 

    }
    return {save, remove, get, getById, getByCategory}
}