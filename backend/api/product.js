module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const info = { ...req.body }
        if (req.params.id) {
            info.product.id = req.params.id
        }
        console.log(info)

        try {
            existsOrError(info.product.name, 'Nome Não Informado')
            existsOrError(info.product.short_description, 'Descrição Curta Não Informada')
            existsOrError(info.product.long_description, 'Descrição Longa Não Informada')
            existsOrError(info.product.shortVideoUrl, 'Url do video curto Não Informada')
            existsOrError(info.product.longVideoUrl, 'Url do video longo Não Informada')
            existsOrError(info.product.categoryId, 'Categoria Não Informada')
            existsOrError(info.product.stock, 'Quantidade em estoque Não Informado')
            existsOrError(info.product.product_height, 'Altura do Produto Não informada')
            existsOrError(info.product.product_width, 'Largura do Produto Não Informada')
            existsOrError(info.product.product_length, 'Comprimento do Produto Não Informado')
            existsOrError(info.product.product_weight, 'Peso Liquido do Produto Não Informado')
            existsOrError(info.product.package_height, 'Altura da Embalagem do Produto Não Informada')
            existsOrError(info.product.package_weight, 'Peso Bruto do Produto Não Informado')
            existsOrError(info.product.package_length, 'Comprimento da Embalagem do Produto Não Informado')
            existsOrError(info.product.package_width, 'Largura da Embalagem do Produto Não Informado')

            if (info.product.id) {
                console.log("entrou")

                app.db('products')
                    .update(info.product)
                    .where({ id: info.product.id })
            } else {
                const [productId] = await app.db('products')
                    .insert(info.product).returning("id")
                info.product.id = productId.id
            }
            if (info.images.length > 0 && info.images != null) {
                const imageData = info.images.map(url => ({
                    product_id: info.product.id,
                    url: url
                }));
                console.log(imageData)
                
                await app.db('product_images').where({product_id: info.product.id }).del();
                
                await app.db('product_images').insert(imageData)
            }

            res.status(200).send();

        } catch (msg) {
            res.status(400).send(msg)
        }





    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('products')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Produto Não Foi Encontrado.')

            res.status(200).send()
        } catch (msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('products').count('id').first()
        const count = parseInt(result.count)

        app.db('products')
            .select('id', 'name', 'imageUrl', 'stock')
            .then(products => res.json(products))
            .catch(err => res.status(500).send(err))
    }

    const getById = async (req, res) => {
        app.db('products')
            .where({ id: req.params.id })
            .then(product => product = res.json(product))
            .catch(err => res.status(500).send(err))
    }

    const getByCategoryCart = async (req, res) => {
        const categoryId = req.params.id

        app.db('products')
            .select('name', 'imageUrl', 'price', 'id')
            .where({ categoryId: categoryId })
            .then(products => res.json(products))
            .catch(err => res.status(500).send(err))

    }


    return { save, remove, get, getById, getByCategoryCart }
}