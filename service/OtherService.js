
import axios from 'axios';
import { WEB_API , CardKey} from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

const param = {
    params : {

    }
}


var OtherService = {
    getBanner : function(token) {
        return axios.post(WEB_API + '/banner_display', param, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    getOTPByCompanydetail : function(token) {
        return axios.post(WEB_API + 'company_details/verify_OTP/',param, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    updateCompanyDetail : function (token, data) {
        var params = {
            params : data
        }
        return axios.post(WEB_API + 'company_details/',params, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    getOTPPersonal : function (token) {
        return axios.post(WEB_API + 'personal_details/verify_OTP/',param, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    updatePersonal : function (token, data) {
        var params = {
            params : data
        }
        return axios.post(WEB_API + 'personal_details/',params, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
}

export default OtherService