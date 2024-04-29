const Joi = require('joi');

module.exports = app =>{
    const {existsOrError,notExistsOrError} = app.api.validation

    const save = async (req, res) =>{
        const category = {...req.body}
        console.log(category)
        if(req.params.id) category.id = req.params.id 

        const schema = Joi.object({
            name: Joi.string().required().messages({
                'any.required': 'Nome não inserido',
                'string.base': 'O campo Nome deve ser uma string.'
            })
        });

        try{
            const { error} = await schema.validateAsync(category);
            
            if (error) {
                console.error(error.message)
                throw new Error(error.message);
            } else {
                console.log("Validado");
            }
            
            if(category.id){
                await app.db('categories')
                .update(category)
                .where({id: category.id})
                res.status(204).send('Categoria Atualizada Com Sucesso!')
                
                
            }else{
                const categoryFromDB = await app.db('categories').select('name').where({name: category.name}).first();
                notExistsOrError(categoryFromDB, 'Categoria já cadastrada')
                await app.db('categories').insert(category)
                res.status(204).send('Categoria Salva Com Sucesso!')
            }
        }catch(error){
            console.error('Erro de validação:', error.message);
            return res.status(400).send({ message: error.message })
        }
    }

    const remove = async (req, res) => {
        try{
            existsOrError(req.params.id,'Id da categoria Não informado')

            const subCategory = await app.db('categories')
                .where({parentId:req.params.id})
            notExistsOrError(subCategory,'Categoria possui subcategorias')

            const articles = await app.db('articles')
                .where({categoryId:req.params.id})
            notExistsOrError(articles,'Categoria possui Produtos associados')

            const rowsDeleted = await app.db('categories')
                .where({id:req.params.id}).del()
            existsOrError(rowsDeleted, 'Categoria Informada Não encontrada')

            res.status(204).send()
        }catch(msg){
            return res.status(400).send(msg)
        }
    }

    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category =>{
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent){
                path = `&{parent.name} > &{path}`
                parent = getParent(categories, parent.parentId)
            }
            return {...category,path}
        })

        categoriesWithPath.sort((a,b)=>{
            if(a.path<b.path) return -1
            if(a.path>b.path) return 1
            return 0
        })
        return categoriesWithPath
    }

    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode =>{
            const isChild = node => node.parentId==parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req,res) => {
        app.db('categories')
        .then(categories => res.json(toTree(categories)))
        .catch(err => res.status(500).send(err))
    }


    return {save, remove, get, getById, getTree }
}