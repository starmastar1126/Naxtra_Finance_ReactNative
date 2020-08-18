
import axios from 'axios';
import { WEB_API } from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

var HelpService = {
    getTermsConditions : function () {
        var data = {
            params : {}
        }
        return axios.post(WEB_API + 'terms_conditions/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    getPrivacys : function () {
        var data = {
            params : {}
        }
        return axios.post(WEB_API + 'privacy_policy/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    getFaqs : function() {
        var data = {
            params : {}
        }
        return axios.post(WEB_API + 'faq/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    getAllAccount : function () {
        var data = {
            params : {}
        }
        return axios.post(WEB_API + 'help/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    addPersonalIssue : function (params) {
        var data = {
            params : params
        }
        return axios.post(WEB_API + 'personal/issue/', data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    sendSupportTicket : function (token, obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'support_ticket', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token': token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    }
}

export default HelpService