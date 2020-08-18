import React, {Component} from 'react'
import {Platform, View,Image,Text, TextInput,StyleSheet ,TouchableOpacity , AsyncStorage,ActivityIndicator,StatusBar,SafeAreaView} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import global_style, { metrics } from '../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import VerifyEmailComponent from '../components/VerifyEmailComponent'
import VerifyPhoneNumberComponent from '../components/VerifyPhoneNumberComponent'
import AccountTypeComponent from '../components/AccountTypeComponent'
import UserService from '../service/UserService'
import {Fonts} from '../constants/Fonts'
import { alertMessage } from '../utils/utils'

export default class VerifyScreen extends Component {
    
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    
    state = {
        verify_step : 1,
        isReady : false,
        isLoading : false,
        user_name : '',
        showing_time : false
    }

    async componentDidMount () {
        this.setState({user_name : global.user_info.first_name + ' ' + global.user_info.middle_name + ' ' + global.user_info.last_name})
        if (global.verify_step == 0) {
            this.setState({verify_step : 1})    
        } else
            this.setState({verify_step : global.verify_step}) //global.verify_step
    }

    async setFunc () {
        await AsyncStorage.setItem("verify_step" , (global.verify_step).toString())
        await this.setState({verify_step : global.verify_step})     
    }
    
    gotoNextStep = async() => {
        this.setState({showing_time : true}, () => {
            setTimeout(() => {
                global.verify_step = global.verify_step + 1
                this.setFunc()
                this.setState({showing_time : false})
            }, 2000);
        })
    } 
    activeButton = () => {
        this.setState({isReady : true})
    }
    async gotoWelcome() {
        global.business_status = false
        global.personal_status = false
        global.proof_status = false
        global.verification_state = false
    
        await AsyncStorage.setItem('steps', 'WelcomeScreen')
        await AsyncStorage.setItem('accountType' , global.accountType.toString())
        await AsyncStorage.setItem('business_status', '0')
        await AsyncStorage.setItem('personal_status', '0')
        await AsyncStorage.setItem('proof_status', '0')
        await AsyncStorage.setItem('verification_state', '0')

        // this.setState({isLoading : false})
        // if (!this.state.isReady)
        //     return;

        // var obj = {
        //     package_id : global.package,
        //     voucher_code : global.voucher
        // }
        // this.setState({isLoading : true})
        // UserService.setPackage(obj,global.token).then(res => {
        //     var data =res.data.result
        //     if (data.success) {
                
        //     } else {
        //         alertMessage(data.message)
        //     }
        //     this.setState({isLoading : false})
        // }).catch(err => {
        //     console.log(err.message)
        //     this.setState({isLoading : false})
        // })
        this.props.navigation.navigate('WelcomeScreen')
    }

    render() {
        return (
            <SafeAreaView style={{flex :1}}>
                <StatusBar
                    //translucent
                    backgroundColor={"white"}
                    barStyle="dark-content"
                />
                <View style={{flex : 1, flexDirection : 'column'}}>
                    <View style={{flex : 0.05}}></View>
                    <View style={{flex : 1}}>
                        <View style={{flex : 0.4}}>
                            <Image source={Images.person_verify_icon} style={styles.verify_img}></Image>
                            <View style={styles.verify_body}>
                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 17 * metrics , color : Colors.white_color}}>{this.state.user_name}</Text>
                            </View>
                            <View style={styles.verify_description}>
                                <Text style={{fontFamily : Fonts.adobe_clean,textAlign : 'center', fontSize : 16 * metrics}}>You are just three steps away from joining the best banking community ever</Text>
                            </View>
                        </View>
                        <View style={{flex : 0.6}}>
                            <View style={{flex : 0.02}}></View>
                            <View style={styles.verify_step}>
                                <View style={{flex : 0.1}}></View>
                                <View style={{flex : 0.25}}>
                                    <View style={this.state.verify_step == 1 ? styles.verify_step_body_active : styles.verify_step_body}>
                                        <Text style={this.state.verify_step == 1 ? styles.verify_step_text_active : styles.verify_step_text}>1</Text>
                                    </View>
                                </View>
                                <View style={{flex : 0.25}}>
                                    <View style={this.state.verify_step == 2 ? styles.verify_step_body_active : styles.verify_step_body}>
                                        <Text style={this.state.verify_step == 2 ? styles.verify_step_text_active : styles.verify_step_text}>2</Text>
                                    </View>
                                </View>
                                <View style={{flex : 0.25}}>
                                    <View style={this.state.verify_step == 3 ? styles.verify_step_body_active : styles.verify_step_body}>
                                        <Text style={this.state.verify_step == 3 ? styles.verify_step_text_active : styles.verify_step_text}>3</Text>
                                    </View>
                                </View>
                                <View style={{flex : 0.1}}></View>
                            </View>
                            <View style={styles.body}>
                                {
                                    this.state.verify_step == 2 && 
                                    <VerifyEmailComponent onChangeLoadingBar={(value) => this.setState({isLoading: value})} textEmail={global.user_info.email} changeVerifyStep={() => this.gotoNextStep()}></VerifyEmailComponent>
                                }
                                {
                                    this.state.verify_step == 1 && 
                                    <VerifyPhoneNumberComponent onChangeLoadingBar={(value) => this.setState({isLoading : value})} textPhoneNumber={global.user_info.phone} changeVerifyStep={() => this.gotoNextStep()}></VerifyPhoneNumberComponent>
                                }
                                {
                                    this.state.verify_step == 3 && 
                                    <AccountTypeComponent activeButton={() => this.activeButton()}></AccountTypeComponent>
                                }
                            </View>
                            
                        </View>
                        
                    </View>
                    <View style={{flex : 0.1, marginBottom : 5 * metrics}}>
                        {
                            this.state.verify_step == 3 ? 
                            <View style={{width : '80%', alignSelf : 'center'}}>
                                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.gotoWelcome()}>
                                    <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Submit</Text>
                                    <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{width : '100%', marginTop : 15 * metrics, alignItems : 'center'}}>
                                {
                                    this.state.showing_time &&
                                    <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}}>
                                        <MaterialIcon name="check-circle-outline" size={25 * metrics} color={Colors.main_blue_color} style={{marginRight : 8 * metrics}}></MaterialIcon>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.main_blue_color}}>OTP is verified.</Text>
                                    </View>
                                    
                                }
                            </View>
                        }
                    </View>
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
    verify_img : {
        width : 150 * metrics , 
        height : 150 * metrics,
        alignSelf : 'center',
        borderRadius : 200 * metrics
    },
    verify_body : {
        //minWidth : 250 * metrics, 
        height : 45 * metrics , 
        backgroundColor : Colors.main_color, 
        alignSelf : 'center', 
        marginTop : -20 * metrics,
        borderRadius : 50,
        paddingLeft : 20 * metrics,
        paddingRight : 20 * metrics,
        justifyContent : 'center',
        alignItems : 'center'
    },
    verify_description : {
        marginTop : 15 * metrics,
        width : '70%' ,
        alignSelf : 'center',
        textAlign : 'center', 
        height : 55 * metrics, 
        backgroundColor : 'transparent'
    },
    verify_step : {
        flex : 0.1 ,
        flexDirection : 'row', 
        alignSelf : 'center' , 
        height : 50 * metrics
    },
    verify_step_body : {
        width : 45 * metrics, 
        height : 45 * metrics , 
        backgroundColor :Colors.white_color, 
        alignSelf : 'center',
        borderRadius : 50,
        borderWidth : 2,
        borderColor : Colors.white_gray_color,
        justifyContent : 'center'
    },
    verify_step_body_active : {
        width : 45 * metrics, 
        height : 45 * metrics , 
        backgroundColor :Colors.main_color, 
        alignSelf : 'center',
        borderRadius : 50,
        justifyContent : 'center'
    },
    verify_step_text_active: {
        fontSize : 28 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.white_color,
        textAlign : 'center'
    },
    verify_step_text : {
        fontSize : 28 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.dark_gray,
        textAlign : 'center'
    },
    body : {
        flex : 0.85,
        marginTop : 15 * metrics
    }
})