export function getAllDocumentListArray(dataBundle) {
    var localArray = [];
   
    for (var i = 0; i < dataBundle.length; i++) {
        localArray.push({
           

            "Document_Type_ID": dataBundle[i].Document_Type_ID,
            "Document_Type_description": dataBundle[i].Document_Type_description,
            "default_historic_display": dataBundle[i].default_historic_display,
            "available_for_historic_display": dataBundle[i].available_for_historic_display,
            "Display_order": dataBundle[i].Display_order,
            "Active": dataBundle[i].Active,
            "document_pref": dataBundle[i].document_pref,
            "core_document": dataBundle[i].core_document,

        })
    }
    return localArray;

}