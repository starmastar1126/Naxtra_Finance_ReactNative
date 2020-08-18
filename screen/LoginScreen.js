/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, View , Image , ActivityIndicator,AsyncStorage,TouchableOpacity, SafeAreaView,StatusBar,BackHandler, Alert} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import global_style, {metrics} from '../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import TextComponent from '../components/TextComponent'
import { validEmail , alertMessage} from '../utils/utils'
import UserService from '../service/UserService'
import { Fonts } from '../constants/Fonts'
import { StackActions, NavigationActions } from 'react-navigation'
// import FingerprintScanner from 'react-native-fingerprint-scanner'

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});

export default class LoginScreen extends Component {
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
      valid_url : true,
      valid_email : true,
      valid_password : true,
      invalid_email : false,
      isLoading : false,
      isShowFinger : false
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentWillReceiveProps () {
    this.componentDidMount()
  }
  async setLocalStorage () {
    await AsyncStorage.setItem('logout', '0')
    await AsyncStorage.setItem('token' , global.token)
    await AsyncStorage.setItem('register_user', JSON.stringify(global.user_info))
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

    //await AsyncStorage.setItem('upload_info' , "")
    //await AsyncStorage.setItem('business_info' , "")
    //await AsyncStorage.setItem('bio_info' , "")

    await AsyncStorage.setItem('personal_data', "")
    await AsyncStorage.setItem('login_data' , "")
    await AsyncStorage.setItem('is_signup' , "")
  }

  

  async componentDidMount () {
    
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    if (await AsyncStorage.getItem('finger_print') == 'true') {
      this.setState({isShowFinger : true})
    }
    this.initLocalStorage()
    this.setState({
      url : '',
      email : '',
      password : '',
      isReady : false,
      valid_url : true,
      valid_email : true,
      valid_password : true,
      invalid_email : false,
      isLoading : false
    })
  }
  forgotPassword () {
    this.props.navigation.navigate('ForgotPasswordScreen')
  }

  async SignUp () {
    this.props.navigation.navigate('SignUpScreen', {refresh : true})
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

  onLogin () {
    if (!this.state.isReady)
      return;
    // var obj = {
    //   login : this.state.email,
    //   password : this.state.password
    // }
    // var obj = {
    //   login : "snippetbucket@gmail.com",
    //   password : "tejas@7799"
    // }
    var obj = {
      login : "syamspuli@gmail.com",
      password : "Testacc7799"
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
          console.log('data = ', data)
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
                global.user_info.password = obj.password
                global.user_info.email = obj.login
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
        
        if (data.message == 'Unauthorized' || data == undefined) {
          alertMessage(ErrorMessage.error_find_not_user)
        } else {
          alertMessage(data.message)
        }
        this.setState({isLoading : false})
      }
    }).catch(error => {
      console.log('error = ', error)
      alertMessage(ErrorMessage.network_error)
      this.setState({isLoading : false})
    })
  }
  checkReady = (value) => {
    switch(value) {
      case 'email' :
        if (this.state.email != '')
          this.setState({valid_email : true})
        else
          this.setState({valid_email : false})

        if (this.state.email != '' && validEmail(this.state.email)) 
          this.setState({invalid_email : false})
        else
          this.setState({invalid_email : true})
        break;
      case 'password' :
        if (this.state.password.length < 6) 
          this.setState({valid_password : false})
        else
          this.setState({valid_password : true})
        break;
    }

    if (this.state.email != '' && this.state.password.length > 5 && validEmail(this.state.email)) {
      this.setState({isReady : true})
    } else {
      this.setState({isReady : false})
    }
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick () {
    return false
  }
  render() {
    return (
      <SafeAreaView style={{flex : 1, backgroundColor :'white'}}>
        <StatusBar
          //translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <View style={{flex : 1 , flexDirection : 'column'}}>
          <View style={{width : '100%' , height : '100%'}}>
            <View style={{flex : 1}}>
              <View style={{flex : 0.1}}></View>
              <View style={{flex : 0.2}}>
                <Image source={Images.splash_logo} style={global_style.lgLogo}></Image>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>Login</Text>
                <View style={{marginTop : 20 * metrics}}></View>
                <TextComponent
                  textPlaceHolder = "Email Address"
                  textValue={this.state.email}
                  textType="text"
                  ready={this.state.isReady}
                  onChangeText = {(value) => this.setState({email : value},()=> {this.checkReady('email')})}
                ></TextComponent>
                {
                  !this.state.valid_email && this.state.invalid_email && 
                  <Text style={global_style.error}>{ErrorMessage.error_email_required}</Text>
                }
                {
                  this.state.valid_email && this.state.invalid_email &&
                  <Text style={global_style.error}>{ErrorMessage.error_email_invalid}</Text>
                }
                <TextComponent
                  textPlaceHolder = "Password"
                  textValue={this.state.password}
                  textType="password"
                  ready={this.state.isReady}
                  onChangeText = {(value) => this.setState({password : value},()=> {this.checkReady('password')})}
                ></TextComponent>
                {
                  !this.state.valid_password &&
                  <Text style={global_style.error}>{ErrorMessage.error_password_max_length}</Text>
                }
                <View style={{width : '80%' , marginTop : 40 * metrics}}>
                  <TouchableOpacity onPress={() => this.forgotPassword()} style={{marginTop : 20 * metrics , width : '80%'}}>
                    <Text style={styles.forgotPassword}>Forgot Password</Text>
                  </TouchableOpacity>  
                </View>
                <View style={{width : '80%' , marginTop : 20 * metrics}}></View>
                <View style={{flexDirection : 'row', width : '100%'}}>
                  <View style={{flex : 0.5}}>
                    <TouchableOpacity onPress={() => this.SignUp()} style={styles.btn_signup}>
                      <Text style={{fontSize : 20 * metrics ,fontFamily : Fonts.adobe_clean, textAlign :'center' , color :Colors.main_color}}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
              </View>
              <View style={{flex : 0.1 , width : '85%', alignSelf :'center'}}>
                  <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onLogin()}>
                    <View style={global_style.btn_body}>
                      <Text style={global_style.left_text}>Login</Text>
                      <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                    </View>
                  </TouchableOpacity>
                </View>
              <View style={{height : 10}}></View>
            </View>
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
  }
});
