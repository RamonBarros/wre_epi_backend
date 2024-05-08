module.exports = app => {
    const axios = require('axios');
    const { frenetToken } = require('../.env')

    const shippingQuote = async (req, res) => {
        const info = { ...req.body }
        console.log(info)
        const apiUrl = 'https://api.frenet.com.br/shipping/quote';
        // const token = '2BDBE3EERF6C5R429AR8E84RF28F7E4A439A';

        const cepOrig = "56306150"

        // const cepDest = "23812310"
        const cepDest = info.zipCode

        // const itensTotalValue = 990
        const itensTotalValue = info.total

        
        const productIds = info.products.map(product => product.product_id);

        const itemsList = await app.db('products')
            .select('package_weight as Weight', 'package_height as Height', 'package_width as Width', 'package_length as Length')
            .whereIn('id', productIds);




        // const itemsList = [
        //     {
        //         "Height": 24,
        //         "Length": 24,
        //         "Quantity": 1,
        //         "Weight": 1,
        //         "Width": 24,
        //         "SKU": "IDW_54626",
        //         "Category": "Running"
        //     },
        //     {
        //         "Height": 16,
        //         "Length": 31,
        //         "Quantity": 1,
        //         "Weight": 0.3,
        //         "Width": 24
        //     }
        //     ,
        //     {
        //         "Height": 16,
        //         "Length": 31,
        //         "Quantity": 1,
        //         "Weight": 0.35,
        //         "Width": 24
        //     }
        //     ,
        //     {
        //         "Height": 16,
        //         "Length": 31,
        //         "Quantity": 5,
        //         "Weight": 0.35,
        //         "Width": 24
        //     }
        // ]
        // const itemsList = info.products

        const requestData = {
            "SellerCEP": cepOrig,
            "RecipientCEP": cepDest,
            "ShipmentInvoiceValue": info.Total,
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
                'token': frenetToken
            },
            data: requestData
        };

        console.log(config)

        function transformElementToQuote(element) {
            return {
                ServiceCode: element.ServiceCode,
                ServiceDescription: element.ServiceDescription,
                Name: element.Carrier,
                Price: element.ShippingPrice,
                DeliveryTime: element.DeliveryTime +' a '+ (parseInt(element.DeliveryTime)+2) + ' dias úteis'
            };
        }
        
        axios.request(apiUrl, config)
            .then((response) => {
                const shippingQuote = response.data.ShippingSevicesArray
                    .filter(element => element.Error === false && element.AllowBuyLabel === true)
                    .map(transformElementToQuote);
                
                console.log(shippingQuote);
                res.status(200).send(shippingQuote);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(error);
            });
    }







    return { shippingQuote }
}