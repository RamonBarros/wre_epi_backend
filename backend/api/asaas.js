module.exports = app => {
    const axios = require('axios');
    const moment = require('moment');
    const { asaasPaymentApiKey } = require('../.env')


    const credCardPayment = async (req, res) => {
        const infos = { ...req.body }
        const dueDate = moment().format('YYYY-MM-DD');
        let holderInfo, holderAddressInfo;
        try {

            try {
                holderInfo = await getUserData(infos.cpfCnpj)
                try {
                    holderAddressInfo = await getUserAddressData(holderInfo.id)
                } catch (error) {
                    console.error(error.message)
                }
            } catch (error) {
                console.error(error.message)
            } 

            const options = {

                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/payments/',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: asaasPaymentApiKey
                },
                data: {
                    billingType: 'CREDIT_CARD',
                    creditCard: {
                        holderName: infos.name,
                        number: infos.cardNumber,
                        expiryMonth: infos.expireMonth,
                        expiryYear: infos.expireYear,
                        ccv: infos.ccv,
                    },
                    creditCardHolderInfo: {
                        name: infos.name,
                        email: holderInfo.email,
                        cpfCnpj: infos.cpfCnpj,
                        postalCode: holderAddressInfo.zipCode,
                        addressNumber: holderAddressInfo.number,
                        addressComplement: null,
                        phone: holderInfo.telefone,
                    },
                    customer: infos.clientId,
                    dueDate: dueDate,
                    installmentCount: infos.installmentCount, //Quantidade de parcelas
                    installmentValue: infos.installmentValue, //Valor de cada Parcela
                    description: infos.description,
                }
            };

            const response = await axios.request(options);
            console.log(response.data);

            res.json(response.data.invoiceUrl);

            let paymentData={
                external_id: response.data.id,
                status: response.data.status,
                totalValue: infos.installmentCount*infos.installmentValue,
                type: response.data.billingType
            }
        
            
            const orderData = {
                external_id: response.data.id,
                client_id: infos.client_id,
                status: response.data.status,
                total: infos.installmentCount*infos.installmentValue,
                order_date: response.data.dateCreated
                //O certo é utilizar o status da api de frete: enviado, entregue, em transito e etc. E o external_id deve ser o id do pedido de frete da api de frete
            }
            
            console.log(orderData);

            let orderItems = await app.db('cart_items')
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
                        return orderItem;  
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

            // Salvar o id da cobrança response.data.id , poderá ser utilizado caso seja necessario o estorno da cobrança, é necessario alterar o banco de dados para permitir salvar este campo.
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    const getUserData = async (cpfCnpj) => {
        try {
            const data_user = await app.db('users')
                .select('email', 'telefone', 'id')
                .where({ cpf: cpfCnpj })
                .first();

            if (data_user) {
                return data_user;
            } else {
                throw new Error('Usuário não encontrado');
            }
        } catch (error) {
            throw error;
        }
    };

    const getUserAddressData = async (user_id) => {
        try {
            const data_user = await app.db('user_address')
                .select('number', 'zipCode')
                .where({ userId: user_id })
                .first();

            if (data_user) {
                return data_user;
            } else {
                throw new Error('Endereço não encontrado');
            }
        } catch (error) {
            throw error;
        }
    };


    const bankSlipPayment = async (req, res) => {
        const infos = { ...req.body }
        const dueDate = moment().add(3, 'days').format('YYYY-MM-DD');
        console.log(infos, dueDate)
        try {
            const options = {

                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/payments',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: asaasPaymentApiKey
                },
                data: {
                    billingType: 'BOLETO',
                    customer: infos.clientId,
                    dueDate: dueDate,
                    value: infos.total,
                    description: infos.description
                }
            };
            console.log(options)

            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data.invoiceUrl);

            let paymentData={
                external_id: response.data.id,
                status: response.data.status,
                totalValue: response.data.value, 
                type: response.data.billingType
            }
        
            
            const orderData = {
                external_id: response.data.id,
                client_id: infos.client_id,
                status: response.data.status,
                total: response.data.value,
                order_date: response.data.dateCreated
                //O certo é utilizar o status da api de frete: enviado, entregue, em transito e etc. E o external_id deve ser o id do pedido de frete da api de frete
            }
            
            console.log(orderData);

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


            // Salvar o id da cobrança response.data.id , poderá ser utilizado caso seja necessario o estorno da cobrança, é necessario alterar o banco de dados para permitir salvar este campo.
            // Salvar o link do boleto, também é possivel pagar o boleto via pix, o campo é o invoiceUrl
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


    const pixPayment = async (req, res) => {
        try {
            const dueDate = moment().format('YYYY-MM-DD');
            const infos = { ...req.body }
            console.log(infos)
            const options = {

                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/payments',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: asaasPaymentApiKey
                },
                data: {
                    billingType: 'PIX',
                    customer: infos.clientId,
                    dueDate: dueDate,
                    value: infos.total,
                    description: infos.description
                }
            };

            console.log(options)

            const response = await axios.request(options);
            console.log(response.data);
            // console.log(response.data.invoiceUrl);
            res.json(response.data.invoiceUrl);

            let paymentData={
                external_id: response.data.id,
                status: response.data.status,
                totalValue: response.data.value,
                type: response.data.billingType
            }
            
            const orderData = {
                external_id: response.data.id,
                client_id: infos.client_id,
                status: response.data.status,
                total: response.data.value,
                order_date: response.data.dateCreated
                //O certo é utilizar o status da api de frete: enviado, entregue, em transito e etc. E o external_id deve ser o id do pedido de frete da api de frete
            }
            
            console.log(orderData);

            let orderItems = await app
                .db('cart_items')
                .select('product_id', 'quantity')
                .where({ client_id: infos.client_id });

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
            //     // Lide com o erro de acordo com seus requisitos
            // }


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


    const listBill = async (req, res) => {
        try {
            const options = {

                method: 'GET',
                url: 'https://sandbox.asaas.com/api/v3/payments?customer=id_client',
                headers: {
                    accept: 'application/json',
                    access_token: asaasPaymentApiKey
                }
            };
            //Será utilizado o cliente_id salvo no banco de dados ao criar o novo cliente
            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    const paymentQrCode = async (req, res) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://sandbox.asaas.com/api/v3/payments/id/pixQrCode',
                headers: {
                    accept: 'application/json',
                    access_token: asaasPaymentApiKey
                }
            };
            //Será utilizado o cliente_id salvo no banco de dados ao criar o novo cliente
            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    const bankSlipLink = async (req, res) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://sandbox.asaas.com/api/v3/payments/id/pixQrCode',
                headers: {
                    accept: 'application/json',
                    access_token: asaasPaymentApiKey
                }
            };
            //Será utilizado o cliente_id salvo no banco de dados ao criar o novo cliente
            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    const returnPayment = async (req, res) => {
        try {
            const options = {

                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/payments/id_cobrança/refund',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: asaasPaymentApiKey
                },
                data: { description: 'Motivo do estorno' }//adicionar o value:valor do estorno, no data, caso não seja estornado o valor inteiro.
            };
            // Será utilizado o payment_id salvo no banco de dados no momento que foi criada a cobrança.
            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }



    const getAsaasClientId = async (req, res) => {
        console.log(req.params)
        try {
            const response = await app.db('users')
                .select('asaas_client_id')
                .where({ cpf: req.params.cpfCNPJ });
                res.json(response)
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Erro ao tentar recuperar id do cliente Asaas' });
        }
    }



    return { credCardPayment, bankSlipPayment, pixPayment, listBill, returnPayment, getAsaasClientId, paymentQrCode, bankSlipLink }
}
