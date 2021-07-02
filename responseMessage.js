/**
 * This is just an object to organize the response message
 */
module.exports =  {
    /**
     * Just response a message with status and token
     * @param {response} response 
     * @param {token} token 
     * @param {string} message 
     * @param {boolean} success 
     */
    token: (response, token, message = 'success', success = true) => {
        response.json({
            success: success,
            token: token,
            message: message
        })
    },

    /**
     * Just response a message with status
     * @param {response} response 
     * @param {string} message 
     * @param {boolean} success 
     */
    message: (response, message = 'success', success = true) => {
        response.json({
            success: success,
            message: message
        })
    },

    /**
     * Just response a error message with status = false
     * @param {response} response 
     * @param {string} message 
     * @param {boolean} success 
     */
    error: (response, message = 'not success') => {
        response.json({
            success: false,
            message: message
        })
    },

    /**
     * @param {response} response 
     * @param {number} stat 
     * @param {string} message 
     * @param {boolean} success 
     */
    status: (response, stat, message = 'not successful', success = false) => {
        response.status(stat).json({
            success: success,
            message: message
        })
    },

    /**
     * response the User information
     * @param {response} response
     * @param {json} uesr
     * @param {string} message
     * @param {boolean} success
     */
    user: (response, uesr, message, success = true) => {
        response.json({
            success: success,
            user: uesr,
            message: message
        })
    }
}