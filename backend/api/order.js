module.exports = app => {
    const { existsOrError } = app.api.validation
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

        const cartItem = await app.db('cart_items').where({ client_id: cart_item.client_id, product_id: cart_item.product_id })
        if (cartItem.length > 0) {//se existir algum cart_item com o client_id e o product_id fornecidos
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

    const editOrderStatus = async (req, res) => {
        existsOrError(req.body.orderId, "Informar id do pedido")
        existsOrError(req.body.newStatus, "Informar novo status do pedido")
        const data = { ...req.body }
        console.log(data);
        app.db('order')
            .update({ status: data.newStatus })
            .where('id', '=', data.orderId).then(_ =>
                res.status(200).send("Status do Pedido Alterado Com Sucesso!!"))
            .catch(error => res.status(500).send(error))

    }


    const remove = async (req, res) => {
        console.log(req.body.client_id, req.body.product_id)
        console.log(req.body)
        await app.db('cart_items')
            .where({ client_id: req.body.client_id, product_id: req.body.product_id }).del()
            .then(_ => {
                res.status(200).send("success")
            }).catch((err) => res.status(500).send(err))

    }


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

    const getByClientId = async (req, res) => {
        try {
            const cartItems = await app
                .db('order')
                .select('order.id as order_id', 'client_id as client_id', 'order.status as order_status', 'order.order_date', 'order.total', 'order.shipping_cost', 'products.name', 'products.imageUrl', 'products.price', 'order_items.quantity')
                .join('order_items', 'order.id', 'order_items.order_id')
                .join('products', 'order_items.product_id', 'products.id')
                .where({ client_id: req.params.client_id });

            cartItems.forEach(item => {
                const formattedDate = new Date(item.order_date).toLocaleDateString('pt-BR');
                item.order_date = formattedDate;

                item.total = parseFloat(item.total);
                item.shipping_cost = parseFloat(item.shipping_cost);

                item.valor_total = item.total + item.shipping_cost;

                // Removendo as propriedades não necessárias
                delete item.total;
                delete item.shipping_cost;
            });

            // Criar um objeto para armazenar os dados formatados
            const formattedData = {};

            // Iterar sobre os resultados e formatar os dados
            cartItems.forEach(item => {
                const { order_id, client_id, order_status, order_date, valor_total, shipping_cost, name, imageUrl, price, quantity } = item;

                // Se o order_id ainda não existe no objeto, crie uma entrada para ele
                if (!formattedData[order_id]) {
                    formattedData[order_id] = {
                        order_id,
                        client_id,
                        order_status,
                        order_date,
                        valor_total,
                        shipping_cost,
                        produtos: []
                    };
                }

                // Adicione as informações do produto ao array de produtos
                formattedData[order_id].produtos.push({
                    name,
                    imageUrl,
                    price,
                    quantity
                });
            });

            // Retorne os dados formatados como JSON
            res.json(Object.values(formattedData));
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao buscar os itens do Pedido.');
        }
    };


    return { save, remove, getById, getByClientId, editOrderStatus }
}