
import axios from 'axios';
import { WEB_API } from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

// const headers = {
//     'Content-type': 'application/json',
//     'user-token' : global.token
// };


var CompanyService = {
    getCompanyList : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'companies_list/' , data , {
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
    getOfficerList : function (obj , token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'officers_list/' , data , {
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
    verificationOfficer : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'officers/verification/', data, {
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

export default CompanyService