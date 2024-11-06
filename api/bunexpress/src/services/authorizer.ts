
import logger from '../logger'

export default function authorize(req, res, next) {

    if(!req.user) {
        logger.warn("Anonymous user for authorized area!");
        throw {
            name: 'AuthError',
            message: 'The user is not authorized!'
          };
    }
    
    next()
  }

