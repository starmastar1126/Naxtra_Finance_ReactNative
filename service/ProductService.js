
import axios from 'axios';
import { WEB_API , CardKey} from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

const param = {
    params : {

    }
}


var ProductService = {
    addProduct : function(token, obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + '/product', data, {
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
    getAllProducts : function (token) {
        var data = {
            params : {
                // name : ''
            }
        }
        return axios.post(WEB_API + '/product/search/', data, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    }
}

export default ProductService