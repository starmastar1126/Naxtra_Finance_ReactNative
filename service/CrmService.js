
import axios from 'axios';
import { WEB_API , CardKey} from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

const param = {
    params : {

    }
}

var CrmService = {
    getAllCrmList : function (token) {
        return axios.post(WEB_API + 'crm/lead/list/', param , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    getAllCustomerListBySearch : function (token, text) {
        var data = {
            params : {
                name : text
            }
        }
        return axios.post(WEB_API + 'customer/search', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    getCustomerList : function (token,offset, limit) {
        var data = {
            params : {
                limit : limit ,
                offset : offset
            }
        }
        return axios.post(WEB_API + 'customer/list/', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    setScaduleActivity : function (token, obj, id) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'customer/' + id + '/activity', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    createCustomerByCompany : function (token, obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'vendor', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    createCustomerWithoutContacts : function (token, obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'customer', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    updateCustomerWithoutContacts : function (token, obj,id) {
        console.log('id = ' , id)
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'update/customer/' + id, data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    }
}

export default CrmService