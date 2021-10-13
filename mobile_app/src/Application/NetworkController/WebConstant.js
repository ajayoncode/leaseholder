class WebConstant {
    // Constant for request type
    static GET = "GET";
    static POST = "POST";
    static Multipart = "Multipart";
    static DELETE = "Delete";
    static ORDER = "ORDER";
    static PUT = "PUT"

    // Web Constant base url
    static SERVER_BASE = "https://api.myblockonline.co.uk";
    static SERVER_CORE = "https://myblockonline.co.uk";

    static SERVER_API_V1 = WebConstant.SERVER_BASE + "/api/v1/portal/";

    // PDF Content
    static PDF_PREFIX_URL = WebConstant.SERVER_CORE + "/rel3/application/block_documents/";
    static APPLICATION = "application/";
    static BLOCK_DOCUMENT = "block_documents/";
    static BLK = "BLK";

    //OAuth2 token
    static oauth2_token = WebConstant.SERVER_BASE + "/oauth/token";
    //POST request
    static action_Login = WebConstant.SERVER_API_V1 + "BlockLogin/loginAjax";
    //GET Register Access Code : Step 1
    static access_Code = WebConstant.SERVER_API_V1 + "BlockLogin/verifyUnitAccessCode";
    //POST Register Access Code : Step 2
    static complete_registration = WebConstant.SERVER_API_V1 + "BlockLogin/completeRegistration";
    //POST Forgot Password 
    static forgot_password = WebConstant.SERVER_API_V1 + "BlockLogin/forgotPasswordAjax"

    //GET Document list
    static document_list_prifix = WebConstant.SERVER_API_V1 + "Documents/getPublishedDocumentsApp/"
    static document_list_suffix = ''

    //GET Message List
    static message_list_prifix = WebConstant.SERVER_API_V1 + "Messages/index/"

    //GET agent list
    static agentblock_list_prefix = WebConstant.SERVER_API_V1 + "Dashboard/RegisteredAgents"

    //select from  agent list
    static select_agent_list_prefix = WebConstant.SERVER_API_V1 + "Dashboard/RegisteredBlocksLogin"

    //GET block list

    static select_block_list_prifix = WebConstant.SERVER_API_V1 + "owner/RegisteredBlocks/registeredBlocks/"
    static select_agent_list_suffix = '/true'
    static branding = WebConstant.SERVER_API_V1 + "Dashboard/getBranding"
    static messages_list_prifix = WebConstant.SERVER_API_V1 + "Messages/"
    static all_message = "getAllMessagesApp/"
    static agent_message = "getAgentMessagesApp/"
    static ticket_message = "getTicketApp/"
    static post_message = "getPostApp/"

    //GET Comments
    static comment_list_prifix = WebConstant.SERVER_API_V1 + "Messages/getCommentsApp/"

    //PUT update profile
    static update_profile = WebConstant.SERVER_API_V1 + 'Settings/profileUpdate'

    //POST update password
    static update_password = WebConstant.SERVER_API_V1 + 'Settings/updatePassword'

    //Get report problem
    static report_problem = WebConstant.SERVER_API_V1 + 'Reportproblem/index'
    static report_problem_Ticket_visiblity = WebConstant.SERVER_API_V1 + 'Myaccount/branchSettings'

    //Post create report problem
    static create_report_problem = WebConstant.SERVER_API_V1 + 'Reportproblem/createReportproblem'

    //  GET home data
    static home_data = WebConstant.SERVER_API_V1 + 'Dashboard/getAgentMessagesApp/5/'
    static balance_data = WebConstant.SERVER_API_V1 + 'Dashboard/getUnitBalanceApp/'

    //GET profile
    static get_profile = WebConstant.SERVER_API_V1 + 'Settings/profileApp'

    //Get directory list
    static directory = WebConstant.SERVER_API_V1 + 'Directorys'
    static isTicketModuleSubscribed = WebConstant.SERVER_API_V1 + 'Dashboard/isTicketModuleSubscribed'
    static isCommentEnabledForTicket = WebConstant.SERVER_API_V1 + 'Dashboard/isCommentEnabledForTicket'
    static isReportProblemEnabled = WebConstant.SERVER_API_V1 + 'Dashboard/isReportProblemEnabled'
    static LastPaymentReceived = WebConstant.SERVER_API_V1 + 'Dashboard/getUnitLastPaymentAPP'
    static propertyDetail = WebConstant.SERVER_API_V1 + 'Dashboard/getPropertyDetailsApp'

    static accountStatement = WebConstant.SERVER_API_V1 + 'Myaccount/getMyAccountStatement/8,9,130/'
    static myAccountStatement = WebConstant.SERVER_API_V1 + 'Myaccount/displayMyaccountStatement'
    static add_post = WebConstant.SERVER_API_V1 + "Messages/createPost"

    static report_message = WebConstant.SERVER_API_V1 + "Dashboard/reportAbusiveMessageApp"
    static agree_to_terms = WebConstant.SERVER_API_V1 + "Dashboard/updateTermsofService"
    static save_fcm = WebConstant.SERVER_API_V1 + "BlockLogin/setFCMtoken/"
    static get_Notification = WebConstant.SERVER_API_V1 + "Dashboard/getUserNotification"
    static mark_read = WebConstant.SERVER_API_V1 + "Dashboard/markNotificationAsRead"
    static remove_fcm = WebConstant.SERVER_API_V1 + "BlockLogin/removeFCMToken"
    static addDemand = WebConstant.SERVER_API_V1 + "Setting/update/true"
    static userPermissions = WebConstant.SERVER_API_V1 + "Myaccount/permissions"
    static editComment = WebConstant.SERVER_API_V1 + "Messages/updateComment"
    static removeComment = WebConstant.SERVER_API_V1 + "Messages/removeComment"
    static access_api = WebConstant.SERVER_API_V1 + "Myaccount/permissions"
    static updateMessage = WebConstant.SERVER_API_V1 + "Messages/updateMessage"
    static deletePost = WebConstant.SERVER_API_V1 + "Messages/deletePost"
    static messageComment = WebConstant.SERVER_API_V1 + "Messages/addComment"
    static allApiDocument = WebConstant.SERVER_API_V1 + "BlockLogin/removeFCMToken/37317"
    static onPostTest = WebConstant.SERVER_API_V1 + "Dashboard/reportAbusiveMessageApp/83098/TICKET"
    static termsOfService = WebConstant.SERVER_CORE + "/rel3/owner/TermsOfService/view"
    //APP constant
    static iOSApplicationVersionNo = '1.7';
    static AndroidApplicationVersionNo = '1.2';
    static timeout = 30000;

    static callAPI = 'callAPI'
    static itemSelected = 'itemSelected';
    static onGetMessages = 'onGetMessages';

    // personal setting
    static getAllPersonalSettingData = WebConstant.SERVER_API_V1 + "Settings/getPortalSettings"
    static updateUserPreferences = WebConstant.SERVER_API_V1 + "Settings/updateUserPreferences"

}
export default WebConstant;


