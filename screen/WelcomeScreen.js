/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,Image ,TouchableOpacity,ScrollView , ActivityIndicator, AsyncStorage,StatusBar,SafeAreaView} from 'react-native'
import * as Images from '../constants/Image'
import * as ErrorMessage from '../constants/ErrorMessage'
import * as Colors from '../constants/Colors'
import global_style, {metrics} from '../constants/GlobalStyle'
import { alertMessage } from '../utils/utils'
import UserService from '../service/UserService';
import {Fonts} from '../constants/Fonts'

export default class WelcomeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
            const { state } = navigation;
            return {
                header: null,
            }
    };

    state = {
        accountType : -1,
        personal_status : false,
        business_status : false,
        proof_status : false,
        verification_state : false,
        isReady : false,
        isLoading : false,
        user_name : '',
        error_message : '',

        addressProof : null,
        biometric_data : null,
        idProof : null

    }

    componentWillReceiveProps () {
        this.componentDidMount()
    }

    async componentWillMount() {
        this.getCompanyType()
    }

    getCompanyType () {
        var obj = {
            login : global.user_info.email,
            password : global.user_info.password
        }
        
        UserService.loginUser(obj).then(result => {
            var data = result.data.result
            if (data.success) {
                console.log('token = ' , data.token)
                global.token = data.token
            }
        })
    }

    async componentDidMount () {
        //new 
        console.log('user_info = ' , global.user_info)
        global.address_proof = ''
        global.id_proof = ''
        global.video_img = ''
        global.selfie = ''
        global.id_proof_type = ''
        global.address_proof_type = ''
        //
        
        if (global.user_info.middle_name != '') {
            this.setState({user_name : global.user_info.first_name + ' ' +  global.user_info.middle_name +  ' ' + global.user_info.last_name})
        } else {
            this.setState({user_name : global.user_info.first_name + ' ' + global.user_info.last_name})
        }
        await this.initLocalStorage()
        await this.nextStep()
    }
    async nextStep () {
        if (typeof(global.personal_status) == 'undefined' || global.personal_status == false)
            this.setState({personal_status : false},() => {this.checkReady()})
        else
            this.setState({personal_status : true},() => {this.checkReady()})
        if (global.accountType == 0) {
            this.setState({accountType : 0})
        } else {
            this.setState({accountType : 1})
            if (!global.business_status) {
                this.setState({business_status : false},() => {this.checkReady()})
            } else
                this.setState({business_status : true},() => {this.checkReady()})
        }
        if (global.proof_status) 
            this.setState({proof_status : true},() => {this.checkReady()})
        else
            this.setState({proof_status : false},() => {this.checkReady()})

        if (global.verification_state)
            this.setState({verification_state : true}, ()=> {this.checkReady()})
        else
            this.setState({verification_state : false}, ()=> {this.checkReady()})
    }
    async initLocalStorage () {
        global.accountType = Number(await AsyncStorage.getItem('accountType'))
        if (await AsyncStorage.getItem('personal_status') == '1') {
            global.personal_status = true
        } else {
            global.personal_status = false
        }

        if (await AsyncStorage.getItem('business_status') == '1') {
            global.business_status = true
        } else {
            global.business_status = false
        }
        
        if (await AsyncStorage.getItem('proof_status') == '1') {
            global.proof_status = true
        } else {
            global.proof_status = false
        }
        
        if (await AsyncStorage.getItem('verification_state') == '1') {
            global.verification_state = true
        } else {
            global.verification_state = false
        }
    }
    gotoPersonalDetail () {
        if (this.state.personal_status)
            return
        this.props.navigation.navigate('PersonalDetail')
    }
    gotoBusinessDetail () {
        if (!this.state.personal_status)
            return
        this.props.navigation.navigate('BusinessDetail')
    }

    async init () {
        await AsyncStorage.setItem('proof_data', '')
        await AsyncStorage.setItem('proof_status', '0')
    }

    gotoUploadID () {
        if (!this.state.personal_status) {
            return
        }
        this.props.navigation.navigate('UploadProof')
    }

    gotoVerification () {
        if (!this.state.proof_status)
            return
        this.props.navigation.navigate('BiometricScreen')
    }

    checkReady () {
        if (this.state.personal_status && this.state.proof_status && this.state.verification_state && global.accountType == 0) {
            this.setState({isReady : true})
        } else if (this.state.personal_status && this.state.business_status && this.state.verification_state && this.state.proof_status  && global.accountType == 1){
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    preview = async() => {
        if (!this.state.isReady)
            return     
        this.props.navigation.navigate('PreviewScreen')       
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <StatusBar
                    //translucent
                    backgroundColor={"white"}
                    barStyle="dark-content"
                />
                <View style={styles.container}>
                    <Image source={Images.small_logo} style={styles.img}></Image>
                    <ScrollView style={styles.body}>
                        <Text style={styles.title}>Hello</Text>
                        <Text style={styles.name}>{this.state.user_name}</Text>
                        <Text style={styles.description}> We appreciate the confidence and trust you have placed in us and we look forward to helping you in creating bank account with us. </Text>
                        <Text style={styles.description2}>Please Update the details required in below mentioned sections.</Text>
                        <View style={styles.control_body}>
                            <TouchableOpacity onPress={() => this.gotoPersonalDetail()} style={this.state.personal_status ? styles.button_active :styles.button}>
                                <View style={styles.button_body}>
                                    <Text style={styles.btn_text}>Enter Personal Details</Text>
                                    <Text style={this.state.personal_status ? styles.btn_status_text_active : styles.btn_status_text}>{this.state.personal_status ? 'Complete' : 'Pending'}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{marginTop : 20 * metrics}}></View>
                            {
                                <TouchableOpacity onPress={() => this.gotoUploadID()}  style={this.state.proof_status ? styles.button_active : styles.button}>
                                    <View style={styles.button_body}>
                                        <Text style={styles.btn_text}>Enter Document Proofs</Text>
                                        <Text style={this.state.proof_status ? styles.btn_status_text_active : styles.btn_status_text}>{this.state.proof_status ? 'Complete' : 'Pending'}</Text>
                                    </View>
                                    
                                </TouchableOpacity>
                            }
                            <View style={{marginTop : 20 * metrics}}></View>
                            {
                                <TouchableOpacity onPress={() => this.gotoVerification()}  style={this.state.verification_state ? styles.button_active : styles.button}>
                                    <View style={styles.button_body}>
                                        <Text style={styles.btn_text}>Enter Biomatric Verification</Text>
                                        <Text style={this.state.verification_state ? styles.btn_status_text_active : styles.btn_status_text}>{this.state.verification_state ? 'Complete' : 'Pending'}</Text>
                                    </View>
                                    
                                </TouchableOpacity>
                            }
                            <View style={{marginTop : 20 * metrics}}></View>
                            {
                                global.accountType == 1 && 
                                <TouchableOpacity onPress={() => this.gotoBusinessDetail()}  style={this.state.business_status ? styles.button_active : styles.button}>
                                    <View style={styles.button_body}>
                                        <Text style={styles.btn_text}>Enter Business Details</Text>
                                        <Text style={this.state.business_status ? styles.btn_status_text_active : styles.btn_status_text}>{this.state.business_status ? 'Complete' : 'Pending'}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{marginTop : 50 * metrics}}></View>
                        <TouchableOpacity style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={() => this.preview()}>
                            <Text style={{fontSize : 23 * metrics,fontFamily : Fonts.adobe_clean, color : Colors.white_color,alignSelf : 'center' , fontWeight : '500'}}>Preview and Submit</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : Colors.white
    }, 
    img : {
        width : 170 * metrics,
        height : 50 * metrics,
        resizeMode : "stretch",
        alignSelf : 'center',
        marginTop : 40 * metrics
    },
    title : {
        fontSize : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        alignSelf : 'center'
    },
    name : {
        fontSize : 24 * metrics,
        fontFamily : Fonts.adobe_clean,
        alignSelf : 'center',
        textAlign: 'center',
        marginTop : 20 * metrics,
        color : 'black',
        fontWeight : '500'
    },
    description : {
        alignSelf :'center',
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'center',
        marginTop : 15 * metrics
    },
    description2 : {
        alignSelf : 'center',
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'center',
        marginTop : 20 * metrics
    },
    body : {
        width : '80%',
        alignSelf : 'center',
        marginTop : 40 * metrics,
        marginBottom : 20 * metrics,
        flexDirection : 'column'
    },
    control_body : {
        marginTop : 40 * metrics,
        width : '100%',
    },
    button : {
        width : '100%',
        height : 60 * metrics,
        borderWidth : 1,
        borderColor : Colors.gray_color,
        borderRadius : 5,
        borderStyle : 'dashed',
        flexDirection : 'column',
        justifyContent : 'center',
    },
    button_active: {
        width : '100%',
        height : 60 * metrics,
        borderWidth : 1,
        borderColor : Colors.main_color,
        borderRadius : 5 ,
        borderStyle : "solid",
        flexDirection : 'column',
        justifyContent : 'center'
    },
    btn_text : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : 'black',
    },
    btn_status_text : {
        fontSize : 13 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_blue_color
    },
    btn_status_text_active : {
        fontSize : 13 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_color
    },
    btn_submit : {
        width : '100%' , 
        height : 50 * metrics, 
        backgroundColor : Colors.white_gray_color, 
        borderRadius : 5, justifyContent : 'center'
    },
    btn_ready_submit : {
        width : '100%' , 
        height : 50 * metrics, 
        backgroundColor : Colors.main_color, 
        borderRadius : 5, 
        justifyContent : 'center'
    },
    button_body : {
        width : '90%' , 
        height : '100%', 
        alignSelf : 'center', 
        justifyContent : 'center'
    }
});
