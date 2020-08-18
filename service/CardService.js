
import axios from 'axios';
import { WEB_API , CardKey} from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

const param = {
    params : {

    }
}

var CardService = {
    getAllCardList : function (token) {
        return axios.post(WEB_API + '/card/list', param , {
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
    addCard : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'card', data , {
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
    getTransactionInformation : function(token, trans_id) {
        return axios.post(WEB_API + 'card/'+ trans_id +'/transaction' , param, {
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
    getShowCardPin : function (token , id) {
        console.log(WEB_API + 'card/'+ id +'/pin')
        return axios.post(WEB_API + '/card/'+ id +'/pin' , param, {
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
    activeCard : function (token , id,obj) {
        console.log('token = ' , token , '  id = ' , id)
        var data = {
            params : {
                user_card_image : obj
            }
        }
        return axios.post(WEB_API + '/card/'+ id +'/activation' , data, {
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
    suspendCard : function (token, obj, id) {
        console.log('token = ' , token , '  id = ' , id)
        var data = {
            params : obj
        }
        return axios.post(WEB_API + '/card/'+ id +'/suspend/' , data, {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token,
                'Authorization' : CardKey, 
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    blockCard : function (token, id) {
        return axios.post(WEB_API + '/card/'+ id +'/block/' , param, {
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
    unblockCard : function(token, id) {
        return axios.post(WEB_API + '/card/'+ id +'/unblock/' , param, {
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

export default CardService