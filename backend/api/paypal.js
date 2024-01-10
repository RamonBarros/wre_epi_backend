module.exports = app => {
    const axios = require('axios');
    const moment = require('moment');
    const { payPalPaymentApiKey, CLIENT_ID, CLIENT_SECRET } = require('../.env')
    const base = "https://api-m.sandbox.paypal.com";

    const getAccessToken = async (req, res) => {

        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            const data = 'grant_type=client_credentials';

            const auth = {
                username: CLIENT_ID,
                password: CLIENT_SECRET,
            };

            const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', data, { headers, auth })
           
            return response.data.access_token;

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }


    }

    const captureOrder = async (req,res) => {
        const {orderID} = req.params
        const infos = { ...req.body }

        console.log(orderID,infos)
        try {
            const accessToken = await getAccessToken();
            

            const options = {
                url : `${base}/v2/checkout/orders/${orderID}/capture`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
                    // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
                    // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
                    // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
                    // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
                },
                
            }
            const response = await axios.post(options.url, null,{ headers: options.headers });
            console.log(response.data.purchase_units[0].payments.captures[0].create_time)
            res.json(response.data)
             

            let paymentData={
                external_id: response.data.id,
                status: response.data.status,
                totalValue: response.data.purchase_units[0].payments.captures[0].amount.value,
                type: "PAYPAL"
            }
            
            const orderData = {
                external_id: orderID,
                client_id: infos.client_id,
                status: response.data.status,
                total: response.data.purchase_units[0].payments.captures[0].amount.value,
                order_date: response.data.purchase_units[0].payments.captures[0].create_time
                //O certo é utilizar o status da api de frete: enviado, entregue, em transito e etc. E o external_id deve ser o id do pedido de frete da api de frete
            }
            
            console.log(orderData);
            console.log(paymentData);


            let orderItems = await app
                .db('cart_items')
                .select('product_id', 'quantity')
                .where({ client_id: infos.client_id });

                console.log(orderItems);

            const orderId = await app.db('order')
                .insert(orderData)
                .returning('id')
                .then(async (orderId) => {
                    console.log(orderId[0].id);

                    orderItems = orderItems.map((orderItem) => {
                        orderItem.order_id = orderId[0].id;
                        return orderItem;  // Retorne o orderItem modificado
                    });

                    paymentData.order_id = orderId[0].id;



                    console.log(orderItems);

                    // Use o método insert para inserir múltiplos registros
                    await app.db('order_items').insert(orderItems);
                    await app.db('payments').insert(paymentData);

                });

            //RESETA O CARRINHO DE COMPRA APÓS CONFIRMAR O PEDIDO

            // try {
            //     await app.db('cart_items')
            //         .where({ client_id: infos.client_id })
            //         .delete();

            //     console.log('Itens do carrinho excluídos com sucesso.');
            // } catch (error) {
            //     console.error('Erro ao excluir itens do carrinho:', error);
            // }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }


    };









    const saveOrderDetails = async (req, res) => {
        const infos = { ...req.body }
        const dueDate = moment().add(3, 'days').format('YYYY-MM-DD');
        console.log(infos, dueDate)
        try {
            const token = await getAccessToken()
            // console.log(token)

            const options = {
                url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/' + infos.order_id,
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
                }
              };
              
              // Faça a solicitação GET usando axios
              const response = await axios.get(options.url, { headers: options.headers });
              
            console.log(response.data);
            // res.json(response.data.invoiceUrl);

            // let paymentData={
            //     external_id: infos.id,
            //     status: response.data.status,
            //     totalValue: response.purchase_units[0].value, 
            //     type: "PAYPAL"
            // }


            // const orderData = {
            //     external_id: infos.id,
            //     client_id: infos.client_id,
            //     status: response.data.status,
            //     total: response.purchase_units[0].value, 
            //     order_date: response.data.create_time
            //     //O certo é utilizar o status da api de frete: enviado, entregue, em transito e etc. E o external_id deve ser o id do pedido de frete da api de frete
            // }

            // console.log(orderData);
            // console.log(paymentData);


            // let orderItems = await app
            //     .db('cart_items')
            //     .select('product_id', 'quantity')
            //     .where({ client_id: infos.client_id });

            //     console.log(orderItems);

            // const orderId = await app.db('order')
            //     .insert(orderData)
            //     .returning('id')
            //     .then(async (orderId) => {
            //         console.log(orderId[0].id);

            //         orderItems = orderItems.map((orderItem) => {
            //             orderItem.order_id = orderId[0].id;
            //             return orderItem;  // Retorne o orderItem modificado
            //         });

            //         paymentData.order_id = orderId[0].id;



            //         console.log(orderItems);

            //         // Use o método insert para inserir múltiplos registros
            //         await app.db('order_items').insert(orderItems);
            //         await app.db('payments').insert(paymentData);

            //     });

            //RESETA O CARRINHO DE COMPRA APÓS CONFIRMAR O PEDIDO

            // try {
            //     await app.db('cart_items')
            //         .where({ client_id: infos.client_id })
            //         .delete();

            //     console.log('Itens do carrinho excluídos com sucesso.');
            // } catch (error) {
            //     console.error('Erro ao excluir itens do carrinho:', error);
            // }


            // Salvar o id da cobrança response.data.id , poderá ser utilizado caso seja necessario o estorno da cobrança, é necessario alterar o banco de dados para permitir salvar este campo.
            // Salvar o link do boleto, também é possivel pagar o boleto via pix, o campo é o invoiceUrl
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }



    return { saveOrderDetails, getAccessToken, captureOrder }
}