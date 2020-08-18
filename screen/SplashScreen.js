/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,Image ,TouchableOpacity ,AsyncStorage, StatusBar,SafeAreaView,ActivityIndicator,BackHandler,Alert} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import global_style, {metrics} from '../constants/GlobalStyle'
import DeviceInfo from 'react-native-device-info'
import { Fonts } from '../constants/Fonts';
import CodePin from 'react-native-pin-code'
import * as ErrorMessage from '../constants/ErrorMessage'
import { validEmail , alertMessage} from '../utils/utils' 
import UserService from '../service/UserService'
import { StackActions, NavigationActions } from 'react-navigation'
import FingerprintScanner from 'react-native-fingerprint-scanner'

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});


export default class SplashScreen extends Component {
  static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
  };

  constructor (props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async initLocalStorage() {
    // await AsyncStorage.setItem('steps', 'SplashScreen')
    // await AsyncStorage.setItem('accountType' , '-1')
    // await AsyncStorage.setItem('business_status', '0')
    // await AsyncStorage.setItem('personal_status', '0')
    // await AsyncStorage.setItem('proof_status', '0')
    // await AsyncStorage.setItem('verification_state', '0')

    // await AsyncStorage.setItem('token', "")
    // await AsyncStorage.setItem('register_user', "")
    // await AsyncStorage.setItem('applicant_id' , "")
    // await AsyncStorage.setItem('verify_step' , "")

    // await AsyncStorage.setItem('upload_info' , "")
    // await AsyncStorage.setItem('business_info' , "")
    // await AsyncStorage.setItem('bio_info' , "")

    // await AsyncStorage.setItem('personal_data', "")
    // await AsyncStorage.setItem('login_data' , "")
  }

  state = {
    isAlreadyLogin : false,
    login_info : false,
    email : '',
    password : '',
    pin_code : '',
    isLoading : false
  }
  goLogin () {
    this.props.navigation.navigate('LoginScreen')
  }
  goSignUp() {
    this.props.navigation.navigate('SignUpScreen')
  }
  async getStorageData () {
    var steps = await AsyncStorage.getItem('steps')
    global.pay_type = 2
    if (steps == null || steps == '' || steps == "LoginScreen" || steps == 'SplashScreen') {
      global.steps = "SplashScreen"
    } else {
      global.user_info = JSON.parse(await AsyncStorage.getItem('register_user'))
      this.changePhoneNumber()
      global.user_id = await AsyncStorage.getItem('user_id')
      global.applicant_id = await AsyncStorage.getItem('applicant_id')
      global.verify_step = Number(await AsyncStorage.getItem('verify_step'))
      
      global.token = await AsyncStorage.getItem('token')
      global.personal_data = await AsyncStorage.getItem('personal_data')

      if (global.user_info == null || global.applicant_id == null || global.user_info == '' || global.applicant_id == '' || global.verfiy_step == null || global.verfiy_step == '' || global.token == null || global.token == '') {
        global.steps == "SplashScreen"
      } else {
        global.steps = steps
      }
    }
  }

  getDeviceInfo () {
    global.header_info = ''
    console.log('name = ' ,DeviceInfo.getModel())
    DeviceInfo.getDeviceName().then(device_name => {
      console.log('device_name = ', device_name)
      let systemVersion = DeviceInfo.getSystemVersion();
      var header_info = {
        nxid : new Date().getTime(),
        nxi : 'M',
        nxd : device_name,
        nxos : systemVersion
      }
      global.header_info = header_info
    })
  }
  async checkTrustDevice () {
    var finger = await AsyncStorage.getItem('finger_print')
    if (finger == 'true') {
      var login_info = JSON.parse(await AsyncStorage.getItem('finger_user'))
      if (login_info != '')
        this.setState({isAlreadyLogin : true, login_info : login_info , pin_code : login_info.pin_code , email : login_info.email, password : login_info.password} , () => this.gotoFingerPrint())
    } else {
      this.setState({isAlreadyLogin : false})
    }
  }

  async authenticateUser () {
    FingerprintScanner.release();
    this.onLogin()
  }

  async getSignUpStep () {
    var obj = JSON.parse(await AsyncStorage.getItem('signup_step'))
    console.log('obj = ', obj)
    if (obj != '') {
      if (obj.user.email == global.user_info.email) {
        if (obj.personal_status == "1") {
          await AsyncStorage.setItem('personal_status' , '1')
        }
        if (obj.proof_status == "1") {
          await AsyncStorage.setItem('proof_status' , '1')
        }
        if (obj.verification_state == "1") {
          await AsyncStorage.setItem('verification_state' , '1')
        }
        if (obj.business_status == '1') {
          await AsyncStorage.setItem('business_status' , '1')
        }
      }
    }
    if (global.user_info.account_type == 'Business')
      await AsyncStorage.setItem('accountType' , '1')
    else
      await AsyncStorage.setItem('accountType' , '0')
    
    this.props.navigation.navigate('WelcomeScreen')
  }
  
  onLogin () {
    var obj = {
      login : this.state.email,
      password : this.state.password
    }
    console.log('email = ' , this.state.email, this.state.password)
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
                this.changePhoneNumber()
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
                } else if (global.user_info.account_type == 'Business' && global.user_info.business_type == false && global.user_info.sort_code == false && global.user_info.iban == false) { //step is not working
                  global.user_id = data.user_id
                  global.user_info.password = obj.password
                  this.getSignUpStep()
                } else if (global.user_info.account_type != 'Business' && global.user_info.sort_code == false && global.user_info.iban == false) { //step is not working
                  global.user_id = data.user_id
                  global.user_info.password = obj.password
                  this.getSignUpStep()
                } else {
                  global.tabIdx = 1
                  global.verify_type = ''
                  global.time = new Date().getTime()
                  global.user_info.email = obj.login
                  global.user_info.password = obj.password
                  this.setLocalStorage()
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
  async setLocalStorage () {
    await AsyncStorage.setItem('logout', '0')
    await AsyncStorage.setItem('token' , global.token)
    await AsyncStorage.setItem('register_user', JSON.stringify(global.user_info))
  }
  gotoFingerPrint () {
    FingerprintScanner
      .authenticate({ description: 'Scan your fingerprint on the device scanner to continue' })
      .then(() => {
        this.authenticateUser()
      })
      .catch((error) => {
        FingerprintScanner.release();
        if (error.message == 'Authentication could not start because Fingerprint Scanner has no enrolled fingers.') {
          this.setState({isAlreadyLogin : false})
        } else {
          if (error.message != 'Authentication was canceled by the user - e.g. the user tapped Cancel in the dialog.')
            alert(error.message);
        }
      });
  }
  changePhoneNumber () {
    var phone = global.user_info.phone
    var result = ''
    for (var i = 0 ; i < phone.length ; i++) {
      if (phone[i] == '0' && i == 3) {

      } else {
        result = result + phone[i]
      }
    }
    global.user_info.phone = result
  }

  async componentDidMount () {
    var flag = await AsyncStorage.getItem('is_signup')

    await this.getDeviceInfo()

    var login_user = await AsyncStorage.getItem('register_user')
    var token = await AsyncStorage.getItem('token')
    var flag_logout = await AsyncStorage.getItem('logout')

    // if (login_user != '' && login_user != null &&  login_user != undefined && token != '' && token != undefined && token != null && flag_logout == '0') {
    //   global.tabIdx = 1
    //   global.verify_type = ''
    //   global.time = new Date().getTime()

    //   global.user_info = JSON.parse(login_user)
    //   this.changePhoneNumber()
    //   global.token = token
    //   this.props.navigation.dispatch(resetAction('TabScreen'));
    //   return
    // } 

    if (flag != 'true') {
      await this.checkTrustDevice() // check already user
    } else {
      //await this.initLocalStorage()    
      await this.getStorageData()     
      this.props.navigation.navigate(global.steps)
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick () {
    if (this.state.isAlreadyLogin) {
      this.setState({isAlreadyLogin : false})
      return true
    } else {
      return false
    }
  }

  render() {
    
    return (
      
      <SafeAreaView style={!this.state.isAlreadyLogin ? styles.container : styles.already_container}>
        {
          !this.state.isAlreadyLogin ?
          <View>
            <StatusBar
              //translucent
              backgroundColor={Colors.main_color}
              barStyle="light-content"
            />
            <View style={global_style.mgHuge}></View>
            <Image source={Images.splash_logo2} style={global_style.mgLogo}></Image>
            
            <View style={global_style.mgHuge}></View>
            <Text style={global_style.spHint}>SMARTER & BETTER BANKING</Text>
            <TouchableOpacity style={global_style.spButton1} onPress={() => this.goLogin()}>
              <Text style={global_style.spButton1Label}>LOGIN</Text>
            </TouchableOpacity>
            <View style={{marginTop : 20}}></View>
            <TouchableOpacity style={global_style.spButton2} onPress={() => this.goSignUp()}>
              <Text style={global_style.spButton2Label}>SIGN UP</Text>
            </TouchableOpacity>
          </View>  :
          <View style={{flex : 1, flexDirection : 'column'}}>
            <StatusBar
              //translucent
              backgroundColor='white'
              barStyle="dark-content"
            />
            {/* <View style={{flex : 0.15}}></View> */}
            <View style={{flex : 0.25 ,alignItems : 'center', justifyContent : 'flex-end'}}>
              <Image source={Images.default_icon} style={global_style.other_logo}></Image>
            </View>
            <View style={{flex : 0.75, alignItems : 'center', justifyContent: 'center'}}>
              <Text style={global_style.spHint1}>START BANKING TODAY!</Text>
              <View style={styles.another_body}>
                <CodePin
                  containerStyle ={{width : '100%', alignSelf : 'center', justifyContent : 'center', alignItems : 'center'}}
                  pinStyle = {{backgroundColor : 'white', borderWidth : 1, borderColor : Colors.dark_gray}}
                  keyboardType="numeric"
                  number={5} // You must pass number prop, it will be used to display 4 (here) inputs
                  checkPinCode={(code, callback) => callback(code === this.state.pin_code)}
                  success={() => this.onLogin()} // If user fill '2018', success is called
                  text="Enter your security code to unlock" // My title
                  error="You fail" // If user fail (fill '2017' for instance)
                  autoFocusFirst={false} // disabling auto-focus
                />
                {/* <View style={{flex :0.4}}>
                  <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('FingerScreen')}>
                    <SimpleLineIcons name="user" size={35 * metrics} color={Colors.dark_gray}></SimpleLineIcons>
                    <View style={{flexDirection : 'column', marginLeft : 20 * metrics}}>
                      <Text style={styles.name}>{this.state.login_info.username}</Text>
                      <Text style={styles.other_name}>{this.state.login_info.email}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{flex :0.1}}></View>
                <View style={{flex :0.4}}>
                  <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('LoginScreen')}>
                    <SimpleLineIcons name="plus" size={35 * metrics} color={Colors.dark_gray}></SimpleLineIcons>
                    <View style={{flexDirection : 'column', marginLeft : 20 * metrics}}>
                      <Text style={styles.name}>User another account</Text>
                    </View>
                  </TouchableOpacity>
                </View> */}
              </View>
              <View style={{justifyContent : 'center', alignItems : 'center', alignSelf : 'center'}}>
                  <TouchableOpacity onPress={() => this.gotoFingerPrint()}>
                      <Image source={Images.fingerprint} style={styles.fingerprint}></Image>
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        }  
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
  container: {
    flex: 1,
    backgroundColor : Colors.main_color
  }, 
  already_container : {
    flex: 1,
    backgroundColor : 'white'
  },
  another_body : {
    width : '80%' , 
    minHeight : 150 * metrics,
    paddingTop : 10 * metrics, 
    paddingBottom : 10 * metrics,
    alignSelf : 'center', 
    borderRadius : 10 * metrics, 
    flexDirection : 'column', 
    justifyContent : 'center'
  },
  button : {
    width : '90%',
    flexDirection : 'row',
    height : '100%',
    alignSelf : 'center',
    alignItems : 'center',
  },
  name : {
    fontFamily : Fonts.adobe_clean,
    fontSize : 17 * metrics,
    fontWeight : '500'
  },
  other_name : {
    fontFamily : Fonts.adobe_clean,
    fontSize : 15 * metrics,
    color : Colors.gray_color
  },
  fingerprint : {
    width : 140 * metrics,
    height : 140 * metrics,
    resizeMode : 'stretch'
}
});
