const Joi = require('joi');

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const saveBanners = async (req, res) => {
        const info = Object.values({ ...req.body });
        console.log(info)

        const inputSchema = Joi.object({
            banner_link: Joi.string().uri().required().messages({
                'string.uri': 'Informe um URL válido para o link do banner.',
                'any.required': 'O campo Link do Banner não pode estar vazio.'
            }),
            banner_image_url: Joi.string()
                .uri()
                .regex(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
                .required()
                .messages({
                    'string.uri': 'Informe um URL válido para a imagem do banner.',
                    'string.pattern.base': 'O Link da Imagem do Banner deve ser um URL válido e estar em um dos formatos suportados: gif, jpg, jpeg, tiff, png, webp, bmp.',
                    'any.required': 'O campo URL da Imagem do Banner não pode estar  vazio.'
                }),
        });
        try {
            for (let i = 0; i < info.length; i++) {
                const { error } = await inputSchema.validateAsync(info[i]); // Validate only banner_link
                if (error) {
                    console.error(error.message)
                    throw new Error(error.details.map(detail => detail.message).join(', '));
                } else {
                    console.log('Dados válidos');
                }
            }

            await app.db('banners').del();
            await app.db('banners').insert(info);

            res.status(200).send("banners salvos com sucesso!");
        } catch (error) {
            console.error(error.message); 
            return res.status(500).send({ message: error.message })
        }

    }

    const removeBanners = async (req, res) => {
        try {
            //   await app.db('product_images').where({ product_id: req.params.id }).del();

            //   const rowsDeleted = await app.db('products').where({ id: req.params.id }).del();
            //   existsOrError(rowsDeleted, 'Produto Não Foi Encontrado.');

            res.status(200).send("Produto Excluido Com Sucesso!");
        } catch (msg) {
            res.status(500).send(msg);
        }
    };


    const getBanners = async (req, res) => {
        try {
            const banners = await app.db('banners')
                .select('banner_image_url', 'banner_link')
                .groupBy('id')  // Agrupa os resultados por produto
                .orderBy('id')
            res.json(banners);
        } catch (err) {
            res.status(500).send(err);
        }
    };

    const saveCarousel = async (req, res) => {
        const info = Object.values({ ...req.body });
        const inputSchema = Joi.object({
            carousel_image_link: Joi.string()
                .trim()
                .allow('')
                .when(Joi.string().empty(), {
                    then: Joi.string().allow(''),
                    otherwise: Joi.string().uri().messages({
                        'string.uri': 'Informe um URL válido para o link do banner.'
                    })
                }),
            carousel_image_url: Joi.string()
            .trim()
            .uri()  // Validate as a URL first
            .allow('')  // Allow empty string if validation fails
            .when(Joi.string().empty(), {
                then: Joi.string().allow(''),
                otherwise: Joi.string()
                    .regex(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
                    .messages({
                        'string.uri': 'Informe um URL válido para a imagem do banner.',
                        'string.pattern.base': 'O Link da Imagem do Banner deve ser um URL válido e estar em um dos formatos suportados: gif, jpg, jpeg, tiff, png, webp, bmp.'
                    })
            })
        });

        try {
            for (let i = 0; i < info.length; i++) {
                // const { carousel_image_link, carousel_image_url } = info[i];
                const { error } = await inputSchema.validateAsync(info[i]);
                if (error) {
                    console.error(error.message);
                    throw new Error(error.message);
                }

            }
            await app.db('carousel_images').del();
            await app.db('carousel_images').insert(info)
            res.status(200).send("Carrossel salvos com sucesso!");
        } catch (error) {
            console.log(error.message);
            res.status(500).send(error.message);
        }

    }

    const removeCarousel = async (req, res) => {
        try {
            //   await app.db('product_images').where({ product_id: req.params.id }).del();

            //   const rowsDeleted = await app.db('products').where({ id: req.params.id }).del();
            //   existsOrError(rowsDeleted, 'Produto Não Foi Encontrado.');

            res.status(200).send("Produto Excluido Com Sucesso!");
        } catch (msg) {
            res.status(500).send(msg);
        }
    };


    const getCarouselToEdit = async (req, res) => {
        try {
            const carroussel = await app.db('carousel_images')
                .select('carousel_image_url', 'carousel_image_link')
                .groupBy('id')
                .orderBy('id')
            res.json(carroussel);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    };


    const getCarousel = async (req, res) => {
        try {
            const response = await app.db('carousel_images')
                .select('carousel_image_url', 'carousel_image_link')
                .orderBy('id');

            const imagesUrls = [];
            const imagesLinks = [];

            response.forEach(item => {
                if (item.carousel_image_url.trim() !== '' && item.carousel_image_link.trim() !== '') {
                    imagesUrls.push({ image: item.carousel_image_url });
                    imagesLinks.push({ link: item.carousel_image_link });
                }
            });

            const carousel_data = {
                imagesUrls: imagesUrls,
                imagesLinks: imagesLinks
            };

            res.json(carousel_data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    };




    return { saveBanners, removeBanners, getBanners, saveCarousel, removeCarousel, getCarousel, getCarouselToEdit }
}