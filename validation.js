const Joi = require ('joi');

const registerValidation = (data) => {
  const schema = Joi.object ({
    name: Joi.string ().min (2).required(),
    email: Joi.string ().min (10).required().email (),
    password: Joi.string ().min (7).required()
  });
  return schema.validate (data);
}

const loginValidation =(data) => {
  const schema = Joi.object ({
    email: Joi.string ().min (10).required().email (),
    password: Joi.string ().min (7).required()
  });
  return schema.validate (data);
}

const postValidation=(data)=>{
    const schema=Joi.object({
        title:Joi.string().required(),
        body:Joi.string().required()
    });
    
    return schema.validate(data);
}

module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation
module.exports.postValidation=postValidation