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

    const saveCarrousel = async (req, res) => {
        const info = Object.values({ ...req.body });
        console.log(info)

        try {
                // await app.db('carrousel_images').del();
                await app.db('carrousel_images').insert(info)
            res.status(200).send("banners salvos com sucesso!");
        } catch (error) {
            console.log(error);
            res.status(500).send("Erro ao Salvar Banners" + error.message);
        }

    } 

    const removeCarrousel = async (req, res) => {
        try {
        //   await app.db('product_images').where({ product_id: req.params.id }).del();
      
        //   const rowsDeleted = await app.db('products').where({ id: req.params.id }).del();
        //   existsOrError(rowsDeleted, 'Produto Não Foi Encontrado.');
      
          res.status(200).send("Produto Excluido Com Sucesso!");
        } catch (msg) {
          res.status(500).send(msg);
        }
      };


    const getCarrousel = async (req, res) => {
        try {
            const banners = await app.db('carrousel_images')
                .select('carrousel_image_url','carrousel_image_link')
                .groupBy('id')  
                .orderBy('id')

            res.json(banners);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    };

    
    


    return { saveBanners, removeBanners, getBanners, saveCarrousel, removeCarrousel, getCarrousel }
}