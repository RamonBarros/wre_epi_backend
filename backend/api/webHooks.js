module.exports = app =>{
    
    const paymentUpdate = (res,req) =>{
        const data = {...req.body}
        console.log("HEBHOOK FUNCIONOU")
        console.log(data)


    }

    return {paymentUpdate}
}