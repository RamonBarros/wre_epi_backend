module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const saveBanners = async (req, res) => {
        const info =Object.values({ ...req.body });
        console.log(info)
        // const formattedData = info.forEach((element)=>{
        //     console.log(element)
        // })
        try {
                await app.db('banners').del();
                await app.db('banners').insert(info)
            
            res.status(200).send("banners salvos com sucesso!");
        } catch (error) {
            console.log(error);
            res.status(500).send("Erro ao Salvar Banners" + error.message);
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
                .select('banner_image_url','banner_link')
                .groupBy('id')  // Agrupa os resultados por produto
                .orderBy('id')
            res.json(banners);
        } catch (err) {
            res.status(500).send(err);
        }
    };

    const saveCarousel = async (req, res) => {
        const info = Object.values({ ...req.body });
        console.log(info);

        try {
                await app.db('carousel_images').del();
                await app.db('carousel_images').insert(info)
            res.status(200).send("Carrossel salvos com sucesso!");
        } catch (error) {
            console.log(error);
            res.status(500).send("Erro ao Salvar Carrossel" + error.message);
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
                .select('carousel_image_url','carousel_image_link')
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
    
    


    return { saveBanners, removeBanners, getBanners, saveCarousel, removeCarousel, getCarousel,getCarouselToEdit }
}