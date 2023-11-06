module.exports = app => {
    const {existsOrError,notExistsOrError} = app.api.validation

    const save = (req,res) => {
        const product = {...req.body}
        if(req.params.id){
            product.id = req.params.id
        }

        try{
            existsOrError(product.name, 'Nome Não Informado')
            existsOrError(product.short_description, 'Descrição Curta Não Informada')
            existsOrError(product.long_description, 'Descrição Longa Não Informada')
            existsOrError(product.shortVideoUrl, 'Url do video curto Não Informada')
            existsOrError(product.longVideoUrl, 'Url do video longo Não Informada')
            existsOrError(product.categoryId, 'Categoria Não Informada')
            existsOrError(product.price, 'Preço Não Informado')
        }catch(msg){
            res.status(400).send(msg)
        }
        if(product.id){
            app.db('products')
                .update(product)
                .where({id: product.id})
                .then(_=> res.status(200).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('products')
                .insert(product)
                .then(_=> res.status(200).send())
                .catch(err=> res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            const rowsDeleted = await app.db('products')
                .where({id: req.params.id}).del()
            existsOrError(rowsDeleted,'Produto Não Foi Encontrado.')

            res.status(200).send()
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    const limit = 10
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('products').count('id').first()
        const count = parseInt(result.count)

        app.db('products')
            .select('id','name', 'imageUrl','stock')
            .then(products => res.json(products))
            .catch(err =>res.status(500).send(err))
    }

    const getById = async (req,res) => {
        app.db('products')
            .where({id: req.params.id})
            .then(product => product = res.json(product))
            .catch(err => res.status(500).send(err))
    }

    const getByCategoryCart = async (req,res) => {
        const categoryId = req.params.id
        
        app.db('products')
            .select('name','imageUrl','price','id')
            .where({categoryId:categoryId})
            .then(products => res.json(products))
            .catch(err => res.status(500).send(err)) 

    } 

   
    return {save, remove, get, getById, getByCategoryCart}
}