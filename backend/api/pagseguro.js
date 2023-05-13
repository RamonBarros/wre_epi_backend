module.exports = app =>{

    const credCardPayment = (req,res) => {
        const axios = require('axios');
        const data = JSON.stringify({
          "reference_id": "ex-00001",
          "description": "Motivo da cobrança",
          "amount": {
            "value": 1000,
            "currency": "BRL"
          },
          "payment_method": {
            "type": "CREDIT_CARD",
            "installments": 1,
            "capture": true,
            "card": {
              "number": "4111111111111111",
              "exp_month": "03",
              "exp_year": "2026",
              "security_code": "123",
              "holder": {
                "name": "Jose da Silva"
              }
            }
          }
        });
        
        const config = {
          method: 'POST',
            maxBodyLength: Infinity,
          url: 'https://sandbox.api.pagseguro.com/charges',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': '7945392F1AEF4AA289264B8BBAF19E46', 
            'x-api-version': '4.0', 
            'x-idempotency-key': ''
          },
          data : data
        };
        
        axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
        

    }

    const bankSlipPayment =(req,res)=>{
        const axios = require('axios');
        const data = JSON.stringify({
        "reference_id": "ex-00001",
        "description": "Motivo do pagamento",
        "amount": {
            "value": 100000,
            "currency": "BRL"
        },
        "payment_method": {
            "type": "BOLETO",
            "boleto": {
            "due_date": "2024-12-31",
            "instruction_lines": {
                "line_1": "Pagamento processado para DESC Fatura",
                "line_2": "Via PagSeguro"
            },
            "holder": {
                "name": "Jose da Silva",
                "tax_id": "22222222222",
                "email": "jose@email.com",
                "address": {
                "street": "Avenida Brigadeiro Faria Lima",
                "number": "1384",
                "locality": "Pinheiros",
                "city": "Sao Paulo",
                "region": "Sao Paulo",
                "region_code": "SP",
                "country": "Brasil",
                "postal_code": "01452002"
                }
            }
            }
        },
        "notification_urls": [
            "https://yourserver.com/nas_ecommerce/277be731-3b7c-4dac-8c4e-4c3f4a1fdc46/"
        ]
        });

        const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://sandbox.api.pagseguro.com/charges',
        headers: { 
            'Authorization': '7945392F1AEF4AA289264B8BBAF19E46', 
            'Content-Type': 'application/json', 
            'x-api-version': '4.0', 
            'x-idempotency-key': ''
        },
        data : data
        };

        axios(config)
        .then(function (response) {
        const boleto_link= JSON.stringify(response.data.links[0].href)
        res.redirect(boleto_link)
        console.log(boleto_link);
        })
        .catch(function (error) {
        console.log(error);
        });
        

        
    }

    const pixPayment= (req,res)=>{
        const axios = require('axios');
        
        const data = JSON.stringify({
            "reference_id": "ex-00001",
            "customer": {
                "name": "Jose da Silva",
                "email": "email@test.com",
                "tax_id": "12345678909",
                "phones": [
                    {
                        "country": "55",
                        "area": "11",
                        "number": "999999999",
                        "type": "MOBILE"
                    }
                ]
            },
            "items": [
                {
                    "name": "nome do item",
                    "quantity": 1,
                    "unit_amount": 500
                }
            ],
            "qr_codes": [
                {
                    "amount": {
                        "value": 500
                    },
                    "expiration_date": "2023-05-29T20:15:59-03:00",
                }
            ],
            "shipping": {
                "address": {
                    "street": "Avenida Brigadeiro Faria Lima",
                    "number": "1384",
                    "complement": "apto 12",
                    "locality": "Pinheiros",
                    "city": "São Paulo",
                    "region_code": "SP",
                    "country": "BRA",
                    "postal_code": "01452002"
                }
            },
            "notification_urls": [
                "https://meusite.com/notificacoes"
            ]

        });
        
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://sandbox.api.pagseguro.com/orders',
            headers: { 
                'Authorization': '7945392F1AEF4AA289264B8BBAF19E46', 
                'Content-Type': 'application/json'
            },
            data : data
            };
    
            axios(config)
            .then(function (response) {
            const pix_link= JSON.stringify(response.data.qr_codes[0].links[0].href)
            
            console.log(pix_link);
            })
            .catch(function (error) {
            console.log(error);
            });

    }


    return {credCardPayment,bankSlipPayment,pixPayment}

}