module.exports = app => {
    const axios = require('axios');

   const shippingQuote=(req,res)=>{

    const apiUrl = 'https://api.frenet.com.br/shipping/quote';
    const token = '2BDBE3EERF6C5R429AR8E84RF28F7E4A439A';
    const cepOrig = "56306150"

    const cepDest= "23812310"

    const itensTotalValue = 320.685
    const itemsList = [
        {
            "Height": 2,
            "Length": 33,
            "Quantity": 1,
            "Weight": 1.18,
            "Width": 47,
            "SKU": "IDW_54626",
            "Category": "Running"
        },
        {
            "Height": 5,
            "Length": 15,
            "Quantity": 1,
            "Weight": 0.5,
            "Width": 29
        }
    ]

    const requestData = {
        "SellerCEP": cepOrig,
        "RecipientCEP": cepDest,
        "ShipmentInvoiceValue": itensTotalValue,
        "ShippingServiceCode": null,
        "ShippingItemArray": itemsList,
        "RecipientCountry": "BR"
    };

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': token
        },
        data: requestData
    };

    axios.request(apiUrl, config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

   }


   

   


    return {shippingQuote}
}