/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View , Image , ActivityIndicator,AsyncStorage,TouchableOpacity, SafeAreaView,StatusBar,BackHandler, Alert} from 'react-native'
import CodePin from 'react-native-pin-code'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import global_style, {metrics} from '../constants/GlobalStyle'
import { validEmail , alertMessage} from '../utils/utils'
import UserService from '../service/UserService'
import { Fonts } from '../constants/Fonts'
import { StackActions, NavigationActions } from 'react-navigation'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { RadioButton } from 'react-native-paper'

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});

export default class FingerScreen extends Component {
  static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
  };
  constructor(props) {
    super(props);
    this.state = {
      url : '',
      email : '',
      password : '',
      isReady : false,
      isLoading : false,
      activeIdx : 1,
      pin_code : ''
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentWillReceiveProps () {
    this.componentDidMount()
  }
  async initLocalStorage() {
    await AsyncStorage.setItem('steps', 'SplashScreen')
    await AsyncStorage.setItem('accountType' , '-1')
    await AsyncStorage.setItem('business_status', '0')
    await AsyncStorage.setItem('personal_status', '0')
    await AsyncStorage.setItem('proof_status', '0')
    await AsyncStorage.setItem('verification_state', '0')

    await AsyncStorage.setItem('token', "")
    await AsyncStorage.setItem('register_user', "")
    await AsyncStorage.setItem('applicant_id' , "")
    await AsyncStorage.setItem('verify_step' , "")

    await AsyncStorage.setItem('upload_info' , "")
    await AsyncStorage.setItem('business_info' , "")
    await AsyncStorage.setItem('bio_info' , "")

    await AsyncStorage.setItem('personal_data', "")
    await AsyncStorage.setItem('login_data' , "")
  }

  

  async componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    var login_info = JSON.parse(await AsyncStorage.getItem('finger_user'))
    this.setState({pin_code : login_info.pin_code, email : login_info.email, password : login_info.password})
    this.setState({
      isReady : false,
      isLoading : false
    })
  }
  forgotPassword () {
    this.props.navigation.navigate('ForgotPasswordScreen')
  }

  async SignUp () {
    this.props.navigation.navigate('SignUpScreen', {refresh : true})
  }

  onLogin () {
    var obj = {
      login : this.state.email,
      password : this.state.password
    }
    global.header_info.nxid = new Date().getTime()
    this.setState({isLoading : true})
    UserService.loginUser(obj).then(result => {
      var data = result.data.result
      if (data.success) {
        global.token = data.token
        global.time = new Date().getTime()
        UserService.getUserInfo(data.token).then(res => {
            var data = res.data.result
            if (data.success) {
                global.user_info = data.response
                if (!global.user_info.is_emailvalidated) {
                  global.user_id = data.user_id
                  global.applicant_id = data.applicant_id
                  global.verify_step = 1
                  global.user_info.password = obj.password
                  this.props.navigation.navigate('VerifyScreen')
                } else if (!global.user_info.is_phonevalidated) {
                  global.user_id = data.user_id
                  global.applicant_id = data.applicant_id
                  global.verify_step = 2
                  global.user_info.password = obj.password
                  this.props.navigation.navigate('VerifyScreen')
                } else if (!global.user_info.account_type && global.user_info.is_phonevalidated && global.user_info.is_emailvalidated) {
                    global.user_id = data.user_id
                    global.applicant_id = data.applicant_id
                    global.verify_step = 3
                    global.user_info.password = obj.password
                    this.props.navigation.navigate('VerifyScreen')
                  //}
                } else {
                  global.tabIdx = 1
                  global.verify_type = ''
                  global.time = new Date().getTime()
                  global.user_info.password = obj.password
                  this.props.navigation.dispatch(resetAction('TabScreen'));
                }
            } else {
                global.user_info = ''
            }
            this.setState({isLoading : false})
        }).catch(error => {
            global.user_info = ''
            this.setState({isLoading : false})
        })
      } else {
        if (data.message == 'Unauthorized') {
          alertMessage(ErrorMessage.error_find_not_user)
        } else {
          alertMessage(data.message)
        }
        this.setState({isLoading : false})
      }
    }).catch(error => {
      alertMessage(error.message)
      this.setState({isLoading : false})
    })
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    FingerprintScanner.release();
  }
  handleBackButtonClick () {
  }
  gotoFingerPrint () {
    FingerprintScanner
      .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
      .then(() => {
        this.authenticateUser()
      })
      .catch((error) => {
        FingerprintScanner.release();
        alert(error.message);
      });
  }
  async authenticateUser () {
    var user = JSON.parse(await AsyncStorage.getItem('finger_user'))
    this.setState({email : user.email , password : user.password, isReady : true}, () => {
      FingerprintScanner.release();
      this.onLogin()
    })
  }
  render() {
    return (
      <SafeAreaView style={{flex : 1}}>
        <StatusBar
          //translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <View style={{flex : 1 , flexDirection : 'column', backgroundColor : 'white'}}>
            <View style={{flexDirection : 'column' , flex : 1}}>
                <View style={{flex : 0.2}}></View>
                <View style={{flex : 0.1, justifyContent : 'center'}}>
                    <Image source={Images.splash_logo} style={global_style.lgLogo}></Image>
                </View>
                <View style={{flex : 0.6 ,justifyContent : 'center'}}>
                    <View style={{flexDirection : 'column', flex : 1, justifyContent : 'center'}}>
                        <View style={{flex : 0.2}}></View>
                        <View style={{flex : 0.2, flexDirection : 'row'}}>
                            <TouchableOpacity style={{flex : 0.5, flexDirection : 'row', justifyContent : 'center'}} onPress={() => this.setState({activeIdx : 1})}>
                                <View style={{justifyContent : 'center'}}>
                                    <RadioButton
                                        value="first"
                                        status={this.state.activeIdx == 1 ? 'checked' : 'unchecked'}
                                        color={Colors.main_color}
                                        onPress={() => this.setState({activeIdx : 1})}
                                    />
                                </View>
                                
                                <View style={{justifyContent : 'center'}}>
                                    <Text>PIN Code</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex : 0.5, flexDirection : 'row'}} onPress={() => this.setState({activeIdx : 2})}>
                                <View style={{justifyContent : 'center'}}>
                                    <RadioButton
                                        value="first"
                                        status={this.state.activeIdx == 2 ? 'checked' : 'unchecked'}
                                        color={Colors.main_color}
                                        onPress={() => this.setState({activeIdx : 2})}
                                    />
                                </View>
                                
                                <View style={{justifyContent : 'center'}}>
                                    <Text>Fingerprint</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex : 0.5,justifyContent : 'center'}}>
                            {
                                this.state.activeIdx == 1 ?
                                <CodePin
                                    containerStyle ={{width : '100%', alignSelf : 'center', justifyContent : 'center', alignItems : 'center'}}
                                    keyboardType="numeric"
                                    number={4} // You must pass number prop, it will be used to display 4 (here) inputs
                                    checkPinCode={(code, callback) => callback(code === this.state.pin_code)}
                                    success={() => this.onLogin()} // If user fill '2018', success is called
                                    text="Enter your security code to unlock" // My title
                                    error="You fail" // If user fail (fill '2017' for instance)
                                    autoFocusFirst={false} // disabling auto-focus
                                /> : 
                                <View style={{justifyContent : 'center', alignItems : 'center', alignSelf : 'center'}}>
                                    <TouchableOpacity onPress={() => this.gotoFingerPrint()}>
                                        <Image source={Images.fingerprint} style={styles.fingerprint}></Image>
                                    </TouchableOpacity>
                                </View>
                            }
                            
                        </View>    
                        <View style={{flex : 0.1}}></View>
                    </View>
                </View>
                {/* <View style={{flex : 0.2}}>
                </View> */}
            </View>
        </View>
        {
            this.state.isLoading && 
            <View style={global_style.loading_body}>
                <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                <Text style={global_style.loading_text}>Signing in. Please wait</Text>
            </View>
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  body : {
    width : '80%',
    alignSelf : 'center',
    flex : 0.6,
  },
  title : {
    fontSize : 24 * metrics,
    fontFamily : Fonts.adobe_clean,
    fontWeight : '500'
  },
  forgotPassword : {
    fontSize : 20 * metrics, 
    fontFamily : Fonts.adobe_clean,
    color : Colors.main_blue_color
  },
  btn_signup : {
    width : 130 * metrics,
    height : 55 * metrics,
    borderColor : '#e96e2c',
    borderWidth : 2,
    borderRadius : 10,
    marginTop : 20 * metrics,
    alignSelf : 'flex-start',
    justifyContent : 'center'
  },
  fingerprint : {
      width : 140 * metrics,
      height : 140 * metrics,
      resizeMode : 'stretch'
  }
});
