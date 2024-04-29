module.exports = app =>{
    function existsOrError(value,msg){
        if(!value) throw new Error(msg);
        if(Array.isArray(value)&& value.length===0) throw new Error(msg);
        if(typeof value ==='string' && !value.trim()) throw new Error(msg);
    }

    function notExistsOrError(value,msg){
        try{
            existsOrError(value,msg)
        }catch(msg){
            return
        }
        throw new Error(msg)
    }

    function equalsOrError(valueA,valueB,msg){
        if(valueA !== valueB) throw new Error(msg)
    }

    const validateData = async (dados) => {
        try {
            return await schema.validateAsync(dados, { abortEarly: false });
        } catch (error) {
            console.error('Erro de validação:', error);
            throw error.message;
        }
    };

    return {existsOrError,notExistsOrError,equalsOrError,validateData}
}