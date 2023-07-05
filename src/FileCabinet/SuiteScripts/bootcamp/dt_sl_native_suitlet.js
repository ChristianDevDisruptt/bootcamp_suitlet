/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/https', 'N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/ui/message', 'N/url', 'N/ui/serverWidget'],
    /**
 * @param{https} https
 * @param{record} record
 * @param{redirect} redirect
 * @param{runtime} runtime
 * @param{search} search
 * @param{message} message
 * @param{url} url
 */
    (https, record, redirect, runtime, search, message, url, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            //Get Context
            if (scriptContext.request.method === 'GET') {
                try {
                    createForm(scriptContext)
                } catch (error) {
                    log.error('error', error);
                }
            }

        }

        const createForm = (scriptContext) => {
            //Get params
            const params = scriptContext.request.parameters;

            log.debug('params', params);

            //Instance Form
            const form = serverWidget.createForm({
                title: 'Suitlet Nativo'
            });

            form.clientScriptFileId = 63936;

            //Group fields
            const fieldgroup = form.addFieldGroup({
                id: 'fieldgroup_filters',
                label: 'Filtros'
            });


            //Add fields 
            let fieldEmployee = form.addField({
                id: 'custpage_employee',
                type: serverWidget.FieldType.SELECT,
                label: 'Empleado',
                container: "fieldgroup_filters",
                source: 'employee'
            });
            fieldEmployee.defaultValue = params.employee;

            let fieldEmployeeSearch = form.addField({
                id: 'custpage_employee_search',
                type: serverWidget.FieldType.SELECT,
                label: 'Empleado Busqueda',
                container: "fieldgroup_filters",
            });
            getEmployees(fieldEmployeeSearch);
            fieldEmployeeSearch.defaultValue = params.employeeSearch;


            //Add Sublist
            let sublist = form.addSublist({
                id: 'custpage_sublits_employee',
                type: serverWidget.SublistType.LIST, //LIST EDITOR INLINEEDITOR
                label: 'Información Empleado'
            });

            sublist.addField({
                id: 'custpage_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Nombre',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_email',
                type: serverWidget.FieldType.EMAIL,
                label: 'Correo',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE
            });

            sublist.addField({
                id: 'custpage_phone',
                type: serverWidget.FieldType.PHONE,
                label: 'Telefono',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.DISABLED
            });

            sublist.addField({
                id: 'custpage_notes',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'Notas',
            }).updateDisplayType({
                displayType: serverWidget.FieldDisplayType.ENTRY
            });


            //Add SublistValues
            if (!!params.employee) {
                //Search Data
                let employeeData = getDataEmployee(params.employee);
                log.debug('employeeData', employeeData);

                for (let i = 0; i < employeeData.length; i++) {
                    let employee = employeeData[i];
                    sublist.setSublistValue({
                        id: 'custpage_name',
                        line: i,
                        value: employee.name || ' '
                    });

                    sublist.setSublistValue({
                        id: 'custpage_email',
                        line: i,
                        value: employee.email || ' '
                    });

                    sublist.setSublistValue({
                        id: 'custpage_phone',
                        line: i,
                        value: employee.phone || ' '
                    });

                    sublist.setSublistValue({
                        id: 'custpage_notes',
                        line: i,
                        value: employee.notes || ' '
                    });

                }

                form.addButton({
                    id: 'custpage_edit_cs',
                    label: 'Editar CS',
                    functionName: 'editCS("' + params.script + '","' + params.deploy + '")'
                });

                form.addButton({
                    id: 'custpage_edit_suitlet',
                    label: 'Editar SL',
                    functionName: 'editSL("' + params.script + '","' + params.deploy + '")'
                });

                form.addButton({
                    id: 'custpage_edit_restlet',
                    label: 'Edit RL',
                    functionName: 'editRL("' + params.script + '","' + params.deploy + '")'
                });


            }



            //Add btns
            let strFuncName = 'searchEmployee("' + params.script + '","' + params.deploy + '")';
            form.addButton({
                id: 'custpage_search',
                label: 'Buscar',
                functionName: strFuncName
            });


            //Render page
            scriptContext.response.writePage(form);
        }


        const getEmployees = (objEmployeeSearch) => {
            let employeeSearchObj = search.create({
                type: "employee",
                filters:
                    [
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({ name: "entityid", label: "Name" })
                    ]
            });
            let searchResultCount = employeeSearchObj.runPaged().count;
            log.debug("employeeSearchObj result count", searchResultCount);
            employeeSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results

                //Add values 
                objEmployeeSearch.addSelectOption({
                    value: result.getValue({ name: "internalid", label: "Internal ID" }),
                    text: result.getValue({ name: "entityid", label: "Name" })
                });

                return true;
            });

        }

        const getDataEmployee = (id) => {
            let employeeSearchObj = search.create({
                type: "employee",
                filters:
                    [
                        ["internalid", "anyof", id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "entityid", label: "Name" }),
                        search.createColumn({ name: "email", label: "Email" }),
                        search.createColumn({ name: "phone", label: "Phone" }),
                        search.createColumn({ name: "comments", label: "Comments" })
                    ]
            });
            let searchResultCount = employeeSearchObj.runPaged().count;
            log.debug("employeeSearchObj result count", searchResultCount);
            let data = [];
            employeeSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                let obj = {};
                obj.name = result.getValue({ name: "entityid", label: "Name" });
                obj.email = result.getValue({ name: "email", label: "Email" });
                obj.phone = result.getValue({ name: "phone", label: "Phone" });
                obj.notes = result.getValue({ name: "comments", label: "Comments" });
                data.push(obj);

                return true;
            });

            return data;
        }

        return { onRequest }

    });
