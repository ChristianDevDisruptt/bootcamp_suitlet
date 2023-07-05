/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            const response = {
                code : 200
            }
            const request = JSON.parse(scriptContext.request.body);
            try {                
                log.debug('request', request);
                record.submitFields({
                    type: record.Type.EMPLOYEE,
                    id: request.id,
                    values: {
                       'comments' : request.note
                    }
                });                
            } catch (error) {
                log.error('error', error)
                response.code = 400;
                response.message = error.message;
            }

            return scriptContext.response.write(JSON.stringify(response));

        }

        return {onRequest}

    });
