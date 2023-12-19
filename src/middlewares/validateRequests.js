const knex = require('../database/conection')

const validateRequestBody = joinSchema => async (req, res, next) => {
    try {
        await joinSchema.validateAsync(req.body)
        next()
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



const validateEmailCpfUpdate = table => async (req, res, next) => {
    const { email, cpf } = req.body;
    const {id} = req.params;


    try {
        const lowerCaseEmail = email.toLowerCase().trim();
        const isEmailInUse = await knex(table).select('email').where('email', lowerCaseEmail).andWhere('id', '!=', id);

        
        
 if (cpf) {
            const isCpfInUse = await knex(table).select('email').where('cpf', cpf).andWhere('id', '!=', id);
            if(isCpfInUse.length > 0 && isEmailInUse.length > 0) {
                return res.status(409).json({ message: { cpf: 'CPF already registered', email: 'Email already registered' } });
            }
            else if (isCpfInUse.length > 0) {
                return res.status(409).json({ message: { cpf: 'CPF already registered' } });
            }
        }
          if (isEmailInUse.length > 0) {
            return res.status(409).json({ message: { email: 'Email already registered' } });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", details: error.message });
    }
}

const validateEmail = table => async(req, res, next) => {
    const {email} = req.body
    
    try {    
        if(email){
            const lowerCaseEmail = email.toLowerCase().trim();
            const singleEmail= await knex(table).where('email', lowerCaseEmail)
            if(singleEmail.length < 1){
                return next();
            }  
         }
        return res.status(409).json({ message: 'Email already registered' });   
    } catch (error) {
        return  res.status(500).json({ message: 'Error checking email' , details: error.message})
    }
 
}


module.exports = {
    validateRequestBody,
    validateEmail,
    validateEmailCpfUpdate
};

