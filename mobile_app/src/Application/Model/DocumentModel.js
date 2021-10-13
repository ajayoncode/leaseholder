import { WebConstant } from "NetworkHelper";

export function getAllDocumentArray(dataBundle) {
    var localArray = [];
    for (var i = 0; i < dataBundle.length; i++) {

        var pdfUrl = WebConstant.PDF_PREFIX_URL + ((dataBundle[i].core_document) ? 'core/' : '2019/') + WebConstant.BLK + dataBundle[i].Block_ID + "/" + ataBundle[i].doc_name;

        localArray.push({
            "Block_ID": dataBundle[i].Block_ID,
            "Document_ID": dataBundle[i].Document_ID,
            "doc_name": dataBundle[i].doc_name,
            "Document_Prefix": dataBundle[i].Document_Prefix,
            "Document_Description": dataBundle[i].Document_Description,
            "Document_type_ID": dataBundle[i].Document_type_ID,
            "Date_posted": dataBundle[i].Date_posted,
            "Posted_by": dataBundle[i].Posted_by,
            "doc_archived": dataBundle[i].doc_archived,
            "archived_media": dataBundle[i].archived_media,
            "publish_to_client": dataBundle[i].publish_to_client,
            "Document_Type_ID": dataBundle[i].Document_Type_ID,
            "Document_Type_description": dataBundle[i].Document_Type_description,
            "default_historic_display": dataBundle[i].default_historic_display,
            "available_for_historic_display": dataBundle[i].available_for_historic_display,
            "Display_order": dataBundle[i].Display_order,
            "Active": dataBundle[i].Active,
            "document_pref": dataBundle[i].document_pref,
            "core_document": dataBundle[i].core_document,
            "pdfUrl": pdfUrl,
        })
    }
    return localArray;

}