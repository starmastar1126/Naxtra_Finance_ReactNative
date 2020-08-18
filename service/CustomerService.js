
import axios from 'axios';
import { WEB_API , CardKey} from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

const param = {
    params : {

    }
}

var CustomerService = {
    getAllCustomerList : function (token) {
        var data = {
                    params:{
                    name:"Mayur"
                }
            }       
        return axios.post(WEB_API + '/customer/search', data , {
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
    getAllCustomerInvoiceList : function (token) {
        return axios.post(WEB_API + '/customer_invoices/list/', param , {
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
    createInvoiceBill : function (token, obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + '/customer/' + obj.partner_id + '/Bill', data , {
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
    paymentTermsList : function (token) {
        return axios.post(WEB_API + '/payment_terms/list/', param , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'tz' : 'Canada/Eastern',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    getAllTaxes : function (token) {
        console.log('token = ' , token)
        return axios.post(WEB_API + '/taxes/list/', param , {
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

export default CustomerService