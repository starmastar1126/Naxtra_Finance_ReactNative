
import axios from 'axios';
import { WEB_API } from '../utils/keyInfo'

const param = {
    params : {

    }
}

var UserService = {
    signUpNormal : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/preinfo/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    loginUser : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'login/', data, {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },

    logoutUser : function (token) {
        return axios.post(WEB_API + 'logout/', param, {
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

    getUserInfo : function (token) {
        return axios.post( WEB_API + 'get_user_information/', param ,{
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
    verifyEmail : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/emailverification/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    resendEmailOTP : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'email/resend_otp/' , data, {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    verifyPhoneNumber : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/mobileverification/' , data, {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    resendMobilOTP : function(obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'mobile/resend_otp/', data, {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    getAddressInfo : function (obj) {
        var data = {
            params : {
                post_code : obj.post_code
            }
        }
        return axios.post(WEB_API + 'post_code/', data , {
            headers : {
                'Content-type': 'application/json',
                'user-token' : obj.token,
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            },
        })
    },
    signupPostInfo : function(obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/postinfo/' , data, {
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
    getCountryList : function(token) {
        return axios.post(WEB_API + 'country/list/' , param, {
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
    getNationalityList : function(token) {
        var data = {
            params : {
            }
        }

        return axios.post(WEB_API + 'nationality/list/' , data, {
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
    getBusinessType : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'business/types/' , data , {
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
    signUpUnregistered : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'unregistered_account/', data , {
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
    signUpPersonalDetail : function(obj, token) {
        var data = {
            params : obj
        }

        return axios.post(WEB_API + 'signup/address/', data , {
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
    uploadProof : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/upload_proof/', data , {
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
    uploadBiometic : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/biometric/' , data , {
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
    resetPassword : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'reset_password/' , data , {
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
    forgotPassword : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'forget_password/' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    forgotPasswordVerify : function (obj) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'forget_password/verify' , data , {
            headers : {
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    },
    setPackage : function (obj, token) {
        var data = {
            params : obj
        }
        return axios.post(WEB_API + 'signup/setpackage' , data , {
            headers : {
                'user-token' : token,
                'Content-type': 'application/json',
                'nxid' : global.header_info.nxid,
                'nxi' : global.header_info.nxi,
                'nxd' : global.header_info.nxd,
                'nxos' : global.header_info.nxos
            }
        })
    }
}

export default UserService