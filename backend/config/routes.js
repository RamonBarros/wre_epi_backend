module.exports = app =>{
    app.post('/signup', app.api.user.save)
    app.post('/forgot-password', app.api.user.resetPassword)
    app.post('/forgot-password/:token',app.api.user.validateResetPasswordToken)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)


    //por estar usando consign nao é necessario usar o require de user
    //ao acessar a rota /user chamará a função save
    app.route('/users')
        //.all(app.config.passport.authenticate())
    //faz uma requisição do tipo Post utilizando o metodo save
        .post(app.api.user.save)
    //faz uma requisição do tipo Get utilizando o metodo get
        .get(app.api.user.get)
    app.route('/users/:id')
    //.all(app.config.passport.authenticate())
    //O metodo save é utilizado tanto para salvar um novo usuario como para
    //alterar o cadastro de um usuario já cadastrado, com a diferença sendo
    //se é passado o id do usuario na url da requisição
    //Se é passado o id do usuario na url o metodo realizará um update
    //que é o caso abaixo
    //diferença de put e post é apenas semantica, put geralmente é utilizado 
    //quando se quer ATUALIZAR um dado, e post que se quer inserir
        .put(app.api.user.save)
        .get(app.api.user.getById)

    app.route('/address')
        //.all(app.config.passport.authenticate())
        .post(app.api.address.save)
        .get(app.api.address.get)
    app.route('/address/:id')
        //.all(app.config.passport.authenticate())
        .put(app.api.address.save)
       // .get(app.api.address.getById)
    
    app.route('/address/:userId')
        //.all(app.config.passport.authenticate())
        .get(app.api.address.getByClientId)
        
    app.route('/categories')
        //.all(app.config.passport.authenticate())
        .post(app.api.category.save)
        .get(app.api.category.get)

    app.route('/categories/tree')
        //.all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        //.all(app.config.passport.authenticate())
        .put(app.api.category.save)
        .get(app.api.category.getById)
        .delete(app.api.category.remove)
    
    app.route('/cart')
        //.all(app.config.passport.authenticate())
        .get(app.api.cart.get)
        .post(app.api.cart.save)
        .delete(app.api.cart.remove)
        
    app.route('/cart/:client_id')
        //.all(app.config.passport.authenticate())
        .post(app.api.cart.save)
        .get(app.api.cart.getByClientId)

    app.route('/cart/count/:client_id')
        //.all(app.config.passport.authenticate())
        .get(app.api.cart.getCountByClientId)

    app.route('/cart/update')
        //.all(app.config.passport.authenticate())
        .put(app.api.cart.save)
        
    app.route('/products')
        //.all(app.config.passport.authenticate())
        .get(app.api.product.get)
        .post(app.api.product.save)

    app.route('/products/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.product.getById)
        .put(app.api.product.save)
        .delete(app.api.product.remove)

    app.route('/categories/:id/products-cart')
        //.all(app.config.passport.authenticate())
        .get(app.api.product.getByCategoryCart)

    app.route('/credCard-payment')
        //.all(app.config.passport.authenticate())
        .post(app.api.asaas.credCardPayment)
   
    app.route('/client-id/:cpfCNPJ')
       //.all(app.config.passport.authenticate())
       .get(app.api.asaas.getAsaasClientId)
    
    app.route('/bankSlip-payment')
        //.all(app.config.passport.authenticate())
        .post(app.api.asaas.bankSlipPayment)

    app.route('/pix-payment')
        //.all(app.config.passport.authenticate())
        .post(app.api.asaas.pixPayment)
        
    // app.route('/order-consult')
    //     //.all(app.config.passport.authenticate())
    //     .get(app.api.asaas.orderConsult)
    // app.route('/charge-consult')
    //     //.all(app.config.passport.authenticate())
    //     .get(app.api.asaas.chargeConsult)
    // app.route('/cancel-charge')
    //     //.all(app.config.passport.authenticate())
    //     .get(app.api.asaas.cancelCharge)
}