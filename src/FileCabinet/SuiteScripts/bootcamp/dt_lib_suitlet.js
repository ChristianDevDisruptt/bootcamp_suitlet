/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/format', 'N/https', 'N/record', 'N/runtime', 'N/search', 'N/ui/message', 'N/url'],
    /**
     * @param{currentRecord} currentRecord
     * @param{format} format
     * @param{https} https
     * @param{record} record
     * @param{redirect} redirect
     * @param{runtime} runtime
     * @param{search} search
     * @param{message} message
     * @param{url} url
     */
    function (currentRecord, format, https, record, runtime, search, message, url) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {

        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        const searchEmployee = (scId, dpId) => {
            debugger;
            //Get current record
            const rec = currentRecord.get();

            //Get Value
            let idEmployee = rec.getValue('custpage_employee') || null;
            let idEmployeeSearch = rec.getValue('custpage_employee_search') || null;


            //Generate URL
            let script = url.resolveScript({
                scriptId: scId,
                deploymentId: dpId,
                returnExternalUrl: false,
                params: {
                    employee: idEmployee,
                    employeeSearch: idEmployeeSearch
                }
            });

            // Refresh whit params
            window.onbeforeunload = false;
            window.location.href = script;
        }

        const editCS = (scId, dpId) => {
            debugger;

            const objRecord = currentRecord.get();

            //Get Employee
            const idEmployee = objRecord.getValue('custpage_employee')

            //Get Lines of Sublist
            const linesPrice = objRecord.getLineCount({ sublistId: 'custpage_sublits_employee' });

            let note = ''
            for (let i = 0; i < linesPrice; i++) {
                note = objRecord.getSublistValue({
                    sublistId: "custpage_sublits_employee",
                    fieldId: "custpage_notes",
                    line: i
                });
            }

            //Load Record
            const loadRecordPromise = record.load.promise({
                type: record.Type.EMPLOYEE,
                id: idEmployee,
                isDynamic: true
            });

            loadRecordPromise.then(function (objRecord) {
                //Set Value
                objRecord.setValue({
                    fieldId: 'comments',
                    value: note
                });

                //Save Record
                let recordId = objRecord.save();
            }, function (e) {
                console.log(e)
            });


        }

        const editSL = (scId, dpId) => {
            debugger;
            const objRecord = currentRecord.get();

            //Get Employee
            const idEmployee = objRecord.getValue('custpage_employee')

            //Get Lines of Sublist
            const linesPrice = objRecord.getLineCount({ sublistId: 'custpage_sublits_employee' });

            let note = ''
            for (let i = 0; i < linesPrice; i++) {
                note = objRecord.getSublistValue({
                    sublistId: "custpage_sublits_employee",
                    fieldId: "custpage_notes",
                    line: i
                });
            }


            let headerObj = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            //Get SL endpoint
            let urlReslet = url.resolveScript({
                scriptId: 'customscript_dt_sl_update_suitlet',
                deploymentId: 'customdeploy_dt_sl_update_suitlet',
                returnExternalUrl: true
            });

            let objBody = {
                id: idEmployee,
                note: note
            };

            //Make Request
            let response = https.post({
                url: urlReslet,
                body: JSON.stringify(objBody),
                headers: headerObj
            });

            console.log(response);
        }

        let wasSubmit = true;
        const editRL = (scId, dpId) => {

            debugger;
            const objRecord = currentRecord.get();

            //Valid btn was submit
            if (!wasSubmit) {
                message.create({
                    title: 'Corriendo Proceso',
                    message: 'Favor de no volver a presionar el boton, hasta que el proceso termine.',
                    type: message.Type.WARNING

                }).show({
                    duration: 10000 // will disappear after 5s
                });
                return;
            }

            //Get Employee
            const idEmployee = objRecord.getValue('custpage_employee')

            //Get Lines of Sublist
            const linesPrice = objRecord.getLineCount({ sublistId: 'custpage_sublits_employee' });

            let note = ''
            for (let i = 0; i < linesPrice; i++) {
                note = objRecord.getSublistValue({
                    sublistId: "custpage_sublits_employee",
                    fieldId: "custpage_notes",
                    line: i
                });
            }

            //Change var 
            wasSubmit = false;
            //Generate Msg
            message.create({
                title: 'Actualizando Empleado',
                message: 'El espere unos minutos, por favor.',
                type: message.Type.CONFIRMATION

            }).show({
                duration: 10000 // will disappear after 5s
            });


            let headerObj = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            //Get RL endpoint
            let urlReslet = url.resolveScript({
                scriptId: 'customscript_dt_rl_update_restlet',
                deploymentId: 'customdeploy_dt_rl_update_restlet',
                // returnExternalUrl: true
            });

            let objBody = {
                id: idEmployee,
                note: note
            };

            //Make Request
            https.post.promise({
                url: urlReslet,
                body: JSON.stringify(objBody),
                headers: headerObj
            })
                .then(function (response) {
                    debugger;
                    console.log(response)
                    let responseRl = JSON.parse(response.body);
                    //Valid response
                    if (responseRl.code == "200" || response.code == 200) {
                        //Create URL to redirect
                        let idAcount = runtime.accountId;
                        let urlHost = `https://${idAcount}.app.netsuite.com`;
                        let urlRecord = url.resolveRecord({
                            recordType: 'employee',
                            recordId: idEmployee,
                            isEditMode: false
                        });

                        //Redirect
                        urlHost += urlRecord;
                        window.onbeforeunload = false;
                        window.location.href = urlHost;

                    } else {
                        //Error code
                        message.create({
                            title: 'Error al actualizar el empleado.',
                            message: `Algo ocurrio al actualizar el empleado, favor de revisar la información. ${responseRl.message}`,
                            type: message.Type.WARNING

                        }).show({
                            duration: 10000 // will disappear after 5s
                        });
                    }
                })
                .catch(function onRejected(reason) {
                    console.log(reason)
                    message.create({
                        title: 'Error al actualizar el empleado.',
                        message: `Algo ocurrio al actualizar el empleado, favor de revisar la información. ${reason}`,
                        type: message.Type.WARNING

                    }).show({
                        duration: 10000 // will disappear after 5s
                    });
                })
        }

        return {
            pageInit: pageInit,
            searchEmployee: searchEmployee,
            editCS: editCS,
            editSL: editSL,
            editRL: editRL
            // fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });
