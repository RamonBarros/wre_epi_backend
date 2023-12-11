module.exports = app =>{
    const {existsOrError} = app.api.validation

    const save = async (req, res) => {
      const cart_item = { ...req.body };
      if (req.params.client_id) {
        cart_item.client_id = req.params.client_id;
      }

      console.log(cart_item)
    
      try {
        existsOrError(cart_item.product_id, 'Id do Produto Não Informado');
        existsOrError(cart_item.client_id, 'Id do Cliente Não Informado');
        existsOrError(cart_item.quantity, 'Quantidade Não Informada');
    
        const product = await app.db('products').where({ id: cart_item.product_id }).first();
        // const client = await app.db('users').where({ id: cart_item.client_id }).first();
    
        existsOrError(product, 'Id do Produto não encontrado');
        // existsOrError(client, 'Id do Cliente não encontrado');
      } catch (msg) {
        return res.status(400).send(msg); // Adicionado o 'return' aqui
      }

      const cartItem= await app.db('cart_items').where({client_id: cart_item.client_id,product_id: cart_item.product_id})
      if (cartItem.length>0) {//se existir algum cart_item com o client_id e o product_id fornecidos
        app.db('cart_items')//o cart_item será atualizado com os novos dados
          .update(cart_item)
          .where({ client_id: cart_item.client_id, product_id: cart_item.product_id })
          .then(_ => res.status(200).send("success"))
          .catch(err => res.status(500).send(err));
          return;
      } else {
        app.db('cart_items')
          .insert(cart_item)
          .then(_ => res.status(200).send("success"))
          .catch(err => res.status(500).send(err));
          return;
      }
    };
    

    const remove = async (req, res) => {
      console.log(req.body.client_id, req.body.product_id)
        try{
          console.log(req.body)
            const rowsDeleted = await app.db('cart_items')
              .where({client_id: req.body.client_id, product_id:req.body.product_id}).del()
            existsOrError(rowsDeleted,'Produto Não Foi Encontrado.')
            res.status(200).send("success")
            return;
        }catch(msg){
            res.status(500).send("falhou")
            return;
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

      const getCountByClientId = async (client_id) => {
        try {
          const count = await app.db('cart_items')
            .count()
            .where('client_id', client_id)
            .first();
      
          return count;
        } catch (error) {
          throw error;
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

    // const getByClientId = async (req, res) => {
    //   console.log(req.params);
    //     try {
    //       const cartItem = await app.db('cart_items').where({ client_id: req.params.client_id })
    //       console.log("entrou");
    //       if (!cartItem) {
    //         return res.status(404).json({ error: 'Não Existe Carrinho de Compras Com o client_id Fornecido' });
    //       }
    //       res.json(cartItem);
    //     } catch (msg) {
    //       res.status(500).send(msg);
    //     }
    //   };

    const getByClientId = async (req, res) => {
      try {
        const cartItems = await app
          .db('cart_items')
          .where({ client_id: req.params.client_id })
          .select('cart_items.*', 'products.name', 'products.imageUrl', 'products.price')
          .join('products', 'cart_items.product_id', 'products.id');

    
        res.json(cartItems);
      } catch (error) {
        res.status(500).send(error);
      }
    };

    return {save,remove,get,getById,getByClientId,getCountByClientId}
}