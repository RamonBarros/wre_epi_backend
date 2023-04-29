<template>
    <div class="footer">

      <div class="contato"> 
            <h4>Contato:</h4>
             <p>E-mail: wreppig@gmail.com <br>
                Telefone: 87 9604-8688
             </p>
        </div>

        <div class="empresa"> 
            <p>
                WRE-EPI &reg; - 2022 <br>
                Vale do São Francisco 
            </p>
        </div>

    </div>


  </template>
  
  <style>

  body{ background-color:  #FFFFFF; 
  
  }
  .footer{background-color: #3A9E3E ;
    color: #FFFFFF;
    padding: 12px;

    display:grid; 
    grid-template-columns: 1fr 1fr 1fr ;
    grid-gap: 0 0;
  }


  .contato {
    margin-top: 12px;
    margin-left: 90px;
    width: 200px;
  }

  .empresa{
    margin-top: 18px;
    text-align: center;

  }

  @media (max-width: 800px) {
      .footer-col{
        width:50%;
        margin-bottom: 30px;
      }
  }

  @media (max-width: 600px){
  .footer-col{
    width: 100%;
  }
}

  </style>



