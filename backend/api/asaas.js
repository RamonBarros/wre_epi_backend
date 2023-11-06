module.exports = app => {
    const axios = require('axios');
    const moment = require('moment');


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
                    access_token: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNjc0NjI6OiRhYWNoXzZlMWYxMjlhLWU5MDYtNDQ0NS1hZmU3LTE4ZWY3YzExZDJiOA=='
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
            res.json(response.data);

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
                .where({ cpf: cpfCnpj})
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
                .where({ userId: user_id})
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
        const dueDate = moment().add(3,'days').format('YYYY-MM-DD');
        console.log(infos,dueDate)
        try {
            const options = {

                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/payments',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNjc0NjI6OiRhYWNoXzZlMWYxMjlhLWU5MDYtNDQ0NS1hZmU3LTE4ZWY3YzExZDJiOA=='
                },
                data: {
                    billingType: 'BOLETO',
                    customer: infos.clientId,
                    dueDate: dueDate,
                    value: infos.total,
                    description: infos.description
                }
            };

            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data);
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
            console.log(infos,dueDate)
            const options = {

                method: 'POST',
                url: 'https://sandbox.asaas.com/api/v3/payments',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    access_token: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNjc0NjI6OiRhYWNoXzZlMWYxMjlhLWU5MDYtNDQ0NS1hZmU3LTE4ZWY3YzExZDJiOA=='
                },
                data: {
                    billingType: 'PIX',
                    customer: infos.clientId,
                    dueDate: dueDate,
                    value: infos.total,
                    description: infos.description
                }
            };

            const response = await axios.request(options);
            console.log(response.data);
            res.json(response.data);
            // Salvar o id da cobrança response.data.id , poderá ser utilizado caso seja necessario o estorno da cobrança, é necessario alterar o banco de dados para permitir salvar este campo.
            // Salvar o link de pagamento do pix, o campo é o invoiceUrl
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
                    access_token: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNjc0NjI6OiRhYWNoXzZlMWYxMjlhLWU5MDYtNDQ0NS1hZmU3LTE4ZWY3YzExZDJiOA=='
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
                    access_token: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNjc0NjI6OiRhYWNoXzZlMWYxMjlhLWU5MDYtNDQ0NS1hZmU3LTE4ZWY3YzExZDJiOA=='
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



    const getAsaasClientId = (req, res) => {

        try {

            const { cpfCNPJ } = req.params;
            const options = {
                method: 'GET',
                url: 'https://sandbox.asaas.com/api/v3/customers?cpfCnpj=' + cpfCNPJ + '&offset=0&limit=1',
                headers: {
                    accept: 'application/json',
                    access_token: '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNjc0NjI6OiRhYWNoXzZlMWYxMjlhLWU5MDYtNDQ0NS1hZmU3LTE4ZWY3YzExZDJiOA=='
                }
            };
            axios
                .request(options)
                .then(function (response) {
                    console.log(response.data.data[0].id);
                    res.json(response.data.data[0].id);
                })
                .catch(function (error) {
                    console.error(error);
                    res.status(500).json({ Error: 'Erro interno ao tentar recuperar client_id Asaas' })
                });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Requisição inválida, Erro ao tentar recuperar id do cliente Asaas' });
        }
    }



    return { credCardPayment, bankSlipPayment, pixPayment, listBill, returnPayment, getAsaasClientId }
}
