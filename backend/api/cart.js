module.exports = app =>{
    const {existsOrError} = app.api.validation

    const save = async (req,res) => {
        const cart_item = {...req.body}
        if(req.params.id){
            cart_item.id = req.params.id
        }

        try{
            existsOrError(cart_item.product_id, 'Id do Produto Não Informado')
            existsOrError(cart_item.client_id, 'Id do Cliente Não Informado')
            existsOrError(cart_item.quantity, 'Quantidade Não Informada')

            const product = await app.db('products').where({id: cart_item.product_id}).first()
            const client = await app.db('users').where({id: cart_item.client_id}).first()

            existsOrError(product, 'Id do Produto não encontrado')
            existsOrError(client, 'Id do Cliente não encontrado')

        }catch(msg){
            res.status(400).send(msg)
        }
        if(cart_item.id){
            app.db('cart_items')
                .update(cart_item)
                .where({id: cart_item.id})
                .then(_=> res.status(200).send())
                .catch(err=> res.status(500).send(err))
        } else{
            app.db('cart_items')
                .insert(cart_item)
                .then(_=> res.status(200).send())
                .catch(err=> res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try{
            const rowsDeleted = await app.db('cart_items')
                .where({id: req.params.id}).del()
                
            existsOrError(rowsDeleted,'Produto Não Foi Encontrado.')

            res.status(200).send()
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    const get = async (req, res) => {
        try {
          const result = await app.db('cart_items');
      
          if (result.length === 0) {
            return res.status(404).json({ error: 'Nenhum Carrinho de Compras encontrado' });
          }
      
          res.json(result);
        } catch (err) {
          res.status(500).send(err);
        }
      };
      
      

    const getById = async (req, res) => {
        try {
          const cartItem = await app.db('cart_items').where({ id: req.params.id }).first();
      
          if (!cartItem) {
            return res.status(404).json({ error: 'Carrinho de compras não encontrado' });
          }
      
          res.json(cartItem);
        } catch (msg) {
          res.status(500).send(msg);
        }
      };

    

    return {save,remove,get,getById}
}