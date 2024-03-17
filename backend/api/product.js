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

        try {
            existsOrError(product.name, 'Nome Não Informado')
            existsOrError(product.short_description, 'Descrição Curta Não Informada')
            existsOrError(product.long_description, 'Descrição Longa Não Informada')
            existsOrError(product.shortVideoUrl, 'Url do video curto Não Informada')
            existsOrError(product.longVideoUrl, 'Url do video longo Não Informada')
            existsOrError(product.categoryId, 'Categoria Não Informada')
            existsOrError(product.stock, 'Quantidade em estoque Não Informado')
            existsOrError(product.product_height, 'Altura do Produto Não informada')
            existsOrError(product.product_width, 'Largura do Produto Não Informada')
            existsOrError(product.product_length, 'Comprimento do Produto Não Informado')
            existsOrError(product.product_weight, 'Peso Liquido do Produto Não Informado')
            existsOrError(product.package_height, 'Altura da Embalagem do Produto Não Informada')
            existsOrError(product.package_weight, 'Peso Bruto do Produto Não Informado')
            existsOrError(product.package_length, 'Comprimento da Embalagem do Produto Não Informado')
            existsOrError(product.package_width, 'Largura da Embalagem do Produto Não Informado')



            if (req.params.id) {
                console.log("entrou")
                console.log(req.params.id)
                try {
                    console.log(product)
                    await app.db('products')
                        .update(product)
                        .where({ id: req.params.id })

                    if (images.images.length > 0) {
                        console.log("entrou aqui", product)
                        const nonNullImages = images.images.filter(url => url !== null && url !== undefined && url !== '');

                        const imageData = nonNullImages.map(url => ({
                            product_id: req.params.id,
                            url: url
                        }));
                        console.log(imageData)

                        await app.db('product_images').where({ product_id: req.params.id }).del();

                        await app.db('product_images').insert(imageData)
                    }

                    console.log("deu bom")
                } catch (error) {
                    res.status(500).send("Erro ao atualizar Produto", error)
                }

            } else {
                try {
                    const [productId] = await app.db('products')
                        .insert(product).returning("id")
                    product.id = productId.id
                    console.log(product.id)

                    if (images.images.length > 0) {
                        console.log("entrou aqui", product)
                        const nonNullImages = images.images.filter(url => url !== null && url !== undefined && url !== '');

                        const imageData = nonNullImages.map(url => ({
                            product_id: product.id,
                            url: url
                        }));

                        console.log(imageData)

                        await app.db('product_images').where({ product_id: product.id }).del();

                        await app.db('product_images').insert(imageData)
                    }
                } catch (error) {
                    console.log(error)
                }
            }


            res.status(200).send("Produto Salvo Com sucesso")

        } catch (msg) {
            res.status(500).send(msg)
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
    
    


    return { save, remove, get, getById, getByCategoryCart, searchBar }
}