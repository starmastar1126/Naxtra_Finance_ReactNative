
import axios from 'axios';
import { WEB_API } from '../utils/keyInfo'

const headers = {
    ContentType: 'application/json',
};

const param = {
    params : {

    }
}
var TransactionService = {
    getAllBeneficiary : function(token) {
        return axios.post(WEB_API + 'payee/list',param, {
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
    addBeneficiary : function(obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'payee/post', data, {
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
    activeBeneficiary : function (obj) {
        var data = {
            params : obj
        }

        return axios.post(WEB_API + 'beneficiaries/active/', data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    deactiveBeneficiary : function (obj) {
        var data = {
            params : obj
        }

        return axios.post(WEB_API + 'beneficiaries/deactivate/', data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    createTransactionsFund : function (obj) {
        var data = {
            params : obj
        }
        
        return axios.post(WEB_API + 'create_transaction/add_fund/', data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    transactionsFund : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'api/transaction/send_money/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    sendMoneyByBeneficiary : function(obj, token) {
        var data = {
            params : obj
        }
        
        return axios.post(WEB_API + 'create_transaction/send_money/', data ,{
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
    senMoneyWithInvoice : function (token, obj) {
        var data = {
            params : obj
        }
        
        return axios.post(WEB_API + 'create_transaction/send_money/with_invoices', data ,{
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
    verifySendMoney : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/send_money/', data , {
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
    getAllTransactions : function (token, offset, limit) {
        var data = {
            params : {
                offset : offset,
                limit : limit
            }
        }
        return axios.post(WEB_API + 'transaction/list/' , data , {
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
    getTransactionsByCountry : function (token) {
        return axios.post(WEB_API + 'transaction/bycountry/', param, {
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
    getTransactionsByMerchant : function (token) {
        return axios.post(WEB_API + 'transaction/bymerchant/', param, {
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
    getTransactionsByCategory : function (token) {
        return axios.post(WEB_API + 'transaction/bycategory/', param, {
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
    getAllBalance :function(token) {
        return axios.post(WEB_API + 'current/balance/' , param , {
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
    hideTransactions : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/hide/', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token
            },
        })
    },
    showTransactions : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/show/', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : token
            },
        })
    },
    updateTransactions : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/update/' , data, {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    addMoney : function(obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'add_money/', data , {
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
    paymentLink : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'payment_link/', data, {
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
    generatePaymentLink : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'generate/payment_link/' , data, {
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
    recentBeneficiaries : function (token) {
        return axios.post(WEB_API + 'recent_beneficiaries/', param, {
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
    verfiyBeneficiary : function(obj, id , token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'payee/'+ id +'/verify', data, {
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
    getNote : function(id, token) {
        return axios.post(WEB_API + 'transaction/' + id + '/note/' , param, {
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
    getTransactionDetail : function(token, id) {
        return axios.post(WEB_API + '/transaction/list/' + id , param, {
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
    getTransactionDetailById : function (token, id) {
        var data = {
            params : {
                "transaction_id": id
            }
        }
        return axios.post(WEB_API + '/transaction/details/', data, {
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
    getAllMerchantLogo : function (token) {
        return axios.post(WEB_API + '/merchant-logo', param, {
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
    getTransactionViewAll : function (token,id) {
        var obj = {
            params : {
                transaction_id : id
            }
        }
        return axios.post(WEB_API + '/transaction/view-all', obj , {
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
    removeAttach : function (token, id) {
        return axios.post(WEB_API + 'transaction/attach/' + id + '/remove/', param , {
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
    getAttach : function (id , token) {
        return axios.post(WEB_API + 'transaction/' + id + '/attach/', param , {
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
    getRating : function (id , token) {
        return axios.post(WEB_API + 'transaction/' + id + '/rate/', param , {
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
    addAttach : function (obj , token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/attach', data, {
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
    addRating : function (obj , token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/rate', data , {
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
    addNote : function (obj , token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'transaction/note', data , {
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
    downlodReceiptFile : function (id, token) {
        return axios.post(WEB_API + 'transaction/download_receipt/' + id , param , {
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
    cardCharge : function (obj) {
        const uri = 'https://stark-cove-10185.herokuapp.com/paystripe/';
        return axios.post(uri, JSON.stringify(obj), {
            headers : { 
                'Content-Type': 'application/json',
            }
        })
    },
    getAllTransactionCategories : function(token) {
        return axios.post(WEB_API + 'transaction/account_category/', param , {
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
    updateCategoryInTransaction : function (token, category_id, trans_id) {
        console.log('category_id = ', category_id)
        console.log('trans_id = ' , trans_id)
        console.log('token = ', token)
        var data = {
            parmas : {
                category_id : category_id
            }
        }
        var data = {
            "params": {
                "category_id" : category_id
            }
        }
        console.log('datae = ', data)
        console.log('url = ' , WEB_API + 'transaction/'+ trans_id +'/category/')
        return axios.post(WEB_API + 'transaction/'+ trans_id +'/category/', data , {
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
    generatePDF : function (token, id) {
        console.log('token = ' , token, '   ' , id)
        

        // return axios.post(WEB_API + 'generate_statement/' + id + '/', param, {
        //     headers : {
        //         'Content-type': 'application/pdf',
        //         'Accept': 'application/pdf',
        //         'user-token' : token,
        //         'nxid' : global.header_info.nxid,
        //         'nxi' : global.header_info.nxi,
        //         'nxd' : global.header_info.nxd,
        //         'nxos' : global.header_info.nxos
        //     },
        // })

        // return axios({
        //     url: "https://www.tutorialspoint.com/javascript/javascript_tutorial.pdf",
        //     method: 'POST',
        //     responseType: 'blob', // important
        // })
        
    }

}

export default TransactionService