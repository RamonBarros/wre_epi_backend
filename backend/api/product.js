const Joi = require('joi');

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const info = { ...req.body }

        const keys = Object.keys(info);
        const valuesExceptLast = keys.slice(0, -1).map(key => info[key]);
        const lastKey = keys.slice(-1)[0];
        const lastValue = info[lastKey];

        const product = Object.fromEntries(keys.slice(0, -1).map(key => [key, info[key]]));
        const images = { [lastKey]: lastValue };


        // console.log(product);
        console.log(images.images);
        console.log(info)
        const schema = Joi.object({
            id: Joi.number().messages({
                'number.base': 'Id Não Informado',
                'number.positive': 'Id deve ser um número positivo'
            }),
            name: Joi.string().required().messages({
                'any.required': 'Nome Não Informado'
            }),
            short_description: Joi.string().required().messages({
                'any.required': 'Descrição Curta Não Informada'
            }),
            long_description: Joi.string().required().messages({
                'any.required': 'Descrição Longa Não Informada'
            }),
            imageUrl: Joi.string().required().messages({
                'any.required': 'imageurl'
            }),
            shortVideoUrl: Joi.string().required().messages({
                'any.required': 'Url do vídeo curto Não Informada'
            }),
            longVideoUrl: Joi.string().required().messages({
                'any.required': 'Url do vídeo longo Não Informada'
            }),
            categoryId: Joi.number().integer().positive().required().messages({
                'any.required': 'Categoria Não Informada',
                'number.base': 'Categoria deve ser um número',
                'number.integer': 'Categoria deve ser um número inteiro',
                'number.positive': 'Categoria deve ser um número positivo'
            }),
            stock: Joi.number().integer().positive().required().messages({
                'any.required': 'Quantidade em estoque Não Informada',
                'number.base': 'Quantidade em estoque deve ser um número',
                'number.integer': 'Quantidade em estoque deve ser um número inteiro',
                'number.positive': 'Quantidade em estoque deve ser um número positivo'
            }),
            price: Joi.number().integer().positive().required().messages({
                'any.required': 'Preço Não Informado',
                'number.base': 'Preço deve ser um número',
                'number.integer': 'Preço deve ser um número inteiro',
                'number.positive': 'Preço deve ser um número positivo'
            }),
            product_height: Joi.number().positive().required().messages({
                'any.required': 'Altura do Produto Não informada',
                'number.base': 'Altura do Produto deve ser um número',
                'number.positive': 'Altura do Produto deve ser um número positivo'
            }),
            product_width: Joi.number().positive().required().messages({
                'any.required': 'Largura do Produto Não Informada',
                'number.base': 'Largura do Produto deve ser um número',
                'number.positive': 'Largura do Produto deve ser um número positivo'
            }),
            product_length: Joi.number().positive().required().messages({
                'any.required': 'Comprimento do Produto Não Informado',
                'number.base': 'Comprimento do Produto deve ser um número',
                'number.positive': 'Comprimento do Produto deve ser um número positivo'
            }),
            product_weight: Joi.number().positive().required().messages({
                'any.required': 'Peso Liquido do Produto Não Informado',
                'number.base': 'Peso Liquido do Produto deve ser um número',
                'number.positive': 'Peso Liquido do Produto deve ser um número positivo'
            }),
            package_height: Joi.number().positive().required().messages({
                'any.required': 'Altura da Embalagem do Produto Não Informada',
                'number.base': 'Altura da Embalagem do Produto deve ser um número',
                'number.positive': 'Altura da Embalagem do Produto deve ser um número positivo'
            }),
            package_weight: Joi.number().positive().required().messages({
                'any.required': 'Peso Bruto do Produto Não Informado',
                'number.base': 'Peso Bruto do Produto deve ser um número',
                'number.positive': 'Peso Bruto do Produto deve ser um número positivo'
            }),
            package_length: Joi.number().positive().required().messages({
                'any.required': 'Comprimento da Embalagem do Produto Não Informado',
                'number.base': 'Comprimento da Embalagem do Produto deve ser um número',
                'number.positive': 'Comprimento da Embalagem do Produto deve ser um número positivo'
            }),
            package_width: Joi.number().positive().required().messages({
                'any.required': 'Largura da Embalagem do Produto Não Informado',
                'number.base': 'Largura da Embalagem do Produto deve ser um número',
                'number.positive': 'Largura da Embalagem do Produto deve ser um número positivo'
            })
        });

        try {
            // existsOrError(product.name, 'Nome Não Informado')
            // if (images.images.length === 0) {
            //     console.log('deu Erro')
            //     throw new Error({message:'Insira Pelo Menos uma Imagem para Salvar o Produto'});
            // }

            const { error } = await schema.validateAsync(product);

            if (error) {
                console.error(error.message)
                throw new Error(error.message);
            } else {
                console.log("OK")
            }


            if (req.params.id) {
                console.log("entrou")
                console.log(req.params.id)

                console.log(product)
                await app.db('products')
                    .update(product)
                    .where({ id: req.params.id }).catch(error=>{
                        throw new Error(error)
                    })

                if (images.images.length > 0) {
                    console.log("entrou aqui", product)
                    const nonNullImages = images.images.filter(url => url !== null && url !== undefined && url !== '');

                    const imageData = nonNullImages.map(url => ({
                        product_id: req.params.id,
                        url: url
                    }));
                    console.log(imageData)

                    await app.db('product_images').where({ product_id: req.params.id }).del().catch(error=>{
                        throw new Error(error.message)
                    });

                    await app.db('product_images').insert(imageData).catch(error=>{
                        throw new Error(error.message)
                    })
                }



            } else {

                const [productId] = await app.db('products')
                    .insert(product).returning("id")
                product.id = productId.id
                console.log(product.id)

                if (images.images.length > 0) {
                    const nonNullImages = images.images.filter(url => url !== null && url !== undefined && url !== '');

                    const imageData = nonNullImages.map(url => ({
                        product_id: product.id,
                        url: url
                    }));

                    console.log(imageData)

                    await app.db('product_images').where({ product_id: product.id }).del().catch(error=>{
                        throw new Error(error.message)
                    });;

                    await app.db('product_images').insert(imageData).catch(error=>{
                        throw new Error(error.message)
                    });
                }

            }

            res.status(200).send("Produto Salvo Com sucesso")

        } catch (error) {
            console.log(error.message)
            return res.status(500).send({ message: error.message })
        }

    }

    const remove = async (req, res) => {
        try {
            await app.db('product_images').where({ product_id: req.params.id }).del();

            const rowsDeleted = await app.db('products').where({ id: req.params.id }).del();
            existsOrError(rowsDeleted, 'Produto Não Foi Encontrado.');

            res.status(200).send("Produto Excluido Com Sucesso!");
        } catch (msg) {
            res.status(500).send(msg);
        }
    };


    // const limit = 10
    // const get = async (req, res) => {
    //     const page = req.query.page || 1

    //     const result = await app.db('products').count('id').first()
    //     const count = parseInt(result.count)

    //     app.db('products')
    //         .select('id', 'name', 'imageUrl', 'stock')
    //         .then(products => res.json(products))
    //         .catch(err => res.status(500).send(err))
    // }


    const get = async (req, res) => {
        try {
            const products = await app.db('products')
                .select('*')
                .groupBy('id')  // Agrupa os resultados por produto
                .orderBy('id')

            const images = await app.db('product_images')
                .select('product_id', 'url')

            //   Mapeia os resultados para formatar o array de imagens
            const formattedProducts = products.map(product => {

                const productImages = images
                    .filter(image => image.product_id === product.id)
                    .map(image => image.url);

                return {
                    ...product,
                    images: productImages,
                };
            });

            res.json(formattedProducts);
        } catch (err) {
            res.status(500).send(err);
        }
    };



    const getById = async (req, res) => {

        try {
            const product = await app.db('products')
                .select('*')
                .where('id', '=', req.params.id)
                .first();

            const images = await app.db('product_images')
                .select('url')
                .where('product_id', '=', req.params.id)

            //   Mapeia os resultados para formatar o array de imagens

            const formatedData = {
                product: product,
                images: images
            };

            res.json(formatedData);
        } catch (err) {
            res.status(500).send(err);
        }

    }
    const getProductById = async (req, res) => {
        try {
            const product = await app.db('products')
                .select('*')
                .where('id', '=', req.params.id)
                .first();
            res.json(product);
        } catch (err) {
            res.status(500).send(err);
        }

    }

    const getByCategoryCart = async (req, res) => {
        const categoryId = req.params.id

        app.db('products')
            .select('name', 'imageUrl', 'price', 'id')
            .where({ categoryId: categoryId })
            .then(products => res.json(products))
            .catch(err => res.status(500).send(err))

    }

    const searchBar = async (req, res) => {
        const page = req.query.page || 1;
        const perPage = 20;
        const searchContent = req.query.q;
        console.log(req.query)
        try {
            const totalItemsQuery = await app.db('products')
                .count('id as total')
                .where('name', 'ILIKE', `%${searchContent}%`)
                .first();

            const totalItems = totalItemsQuery.total;
            const totalPages = Math.ceil(totalItems / perPage);

            const products = await app.db('products')
                .select('id', 'name', 'price', 'imageUrl', 'stock')
                .where('name', 'ILIKE', `%${searchContent}%`)
                .limit(perPage)
                .offset((page - 1) * perPage);

            res.json({
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: perPage,
                items: products
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    };




    return { save, remove, get, getById, getByCategoryCart, searchBar, getProductById }
}