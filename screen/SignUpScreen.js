/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,Image ,TouchableOpacity , AsyncStorage,ActivityIndicator, StatusBar,SafeAreaView, DatePickerAndroid,DatePickerIOSBase, DatePickerIOS, Platform} from 'react-native'
import * as Colors from '../constants/Colors'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckBox } from 'react-native-elements'
import global_style, {metrics} from '../constants/GlobalStyle'
import { ScrollView } from 'react-native-gesture-handler'
import HeaderComponent from '../components/HeaderComponent'
import TextComponent from '../components/TextComponent'
import PhoneInput from 'react-native-phone-input';
import * as ErrorMessage from '../constants/ErrorMessage'
import { validEmail , alertMessage , removePlusCharacter, paramDate} from '../utils/utils'
import { Fonts } from '../constants/Fonts'
import { convertDate } from '../utils/utils'
import UserService from '../service/UserService'
import DateTimePicker from "react-native-modal-datetime-picker"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class SignUpScreen extends Component {

  static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
  };

  state = {
    first_name : '',
    last_name : '',
    middle_name : '',
    email: '',
    phone_number : '',
    password : '',
    isReady : false,
    birthDay : '',
    country_code : '',
    isDateTimePickerVisible : false,
    isLoading : false,
    dob : '',
    term_condition : false,
    tips : false,

    valid_f_name : true,
    valid_l_name : true,
    valid_m_name : true,
    valid_email : true,
    isValidEmail : false,
    valid_phone : true,
    isValidPhone : true,
    valid_birth : true,
    valid_password : true,
    duplicate_f_name : false,
    duplicate_l_name : false,
    duplicate_m_name : false,
    //showIOS
    date : new Date(1970, 1, 1) 
  }
  onDateChange (date) {

  }
  onSubmit() {
    // global.verify_step = 3
    // this.props.navigation.navigate('VerifyScreen')
    // return

    if (!this.state.isReady)
      return
    this.setState({isLoading : true})

    var phone_num = removePlusCharacter(this.state.phone_number, this.state.country_code)

    global.signup_urn = new Date().getTime()
    var params = {
      first_name : this.state.first_name,
      last_name : this.state.last_name,
      middle_name : this.state.middle_name,
      email : this.state.email,
      phone : this.state.country_code + phone_num,
      dob : this.state.dob,
      password : this.state.password,
      termsconditions : this.state.term_condition,
      tipsalert : this.state.tips,
      // packages : 2,
			// voucher : "GHRW12"
    }
    UserService.signUpNormal(params).then(res => {
      var data = res.data.result
      if (data.Success) {
        global.user_info = params
        global.user_id = data.user_id
        global.applicant_id = data.applicant_id
        global.verify_step = 1
        this.saveUserData(params)
        var obj = {
          login : params.email,
          password : params.password
        }
        UserService.loginUser(obj).then(res => {
          var data = res.data.result
          if (data.success) {
            global.token = data.token
            console.log('token = ', global.token)
            this.props.navigation.navigate('VerifyScreen')
          }
        })

        
      } else {
        alertMessage(data.message)
      }
      this.setState({isLoading : false})
      
    }).catch(error => {
      this.setState({isLoading : false})
      console.log(error.message)
      alertMessage(ErrorMessage.network_error)//
    })
    
  }
  async saveUserData (user_data) {
    await AsyncStorage.setItem('register_user' , JSON.stringify(user_data))
    await AsyncStorage.setItem('applicant_id' , '')
    await AsyncStorage.setItem('steps' , 'VerifyScreen')
    await AsyncStorage.setItem("verify_step" , '1')
    await AsyncStorage.setItem("is_signup", 'true')
  }

  async initLocalStorage() {
    await AsyncStorage.setItem("steps", "LoginScreen")
    await AsyncStorage.setItem("register_user" , "")
    await AsyncStorage.setItem("applicant_id" , "")
    await AsyncStorage.setItem('verify_step', "")
    await AsyncStorage.setItem("signup_step", '')
  }

  checkReady = (value) => {
    this.showErrorMessage(value)
    if (value == 't&c' && this.state.term_condition) {
      this.props.navigation.navigate('TermScreen')
    }
    if (this.state.first_name != '' && this.state.last_name != '' && this.state.email != '' && validEmail(this.state.email) && this.state.phone_number !='' && this.state.isValidPhone && this.state.password != '' && this.state.password.length > 5 && this.state.first_name != this.state.middle_name && this.state.first_name != this.state.last_name && this.state.middle_name != this.state.last_name) {
      this.setState({isReady : true})
    } else {
      this.setState({isReady : false})
    }
  }
  componentWillReceiveProps () {
    this.initLocalStorage()
    this.componentDidMount()
  }
  componentDidMount () {
    this.setState({
      first_name : '',
      last_name : '',
      middle_name : '',
      email: '',
      phone_number : '',
      password : '',
      isReady : false,
      birthDay : '',
      country_code : '',
      isDateTimePickerVisible : false,
      isLoading : false,
      isoCode : '',

      valid_f_name : true,
      valid_l_name : true,
      valid_m_name : true,
      valid_email : true,
      isValidEmail : false,
      valid_phone : true,
      isValidPhone : true,
      valid_birth : true,
      valid_password : true
    })
  }

  changeMobileNumber = (value) => {
		this.setState({ isValidPhone : this.phone.isValidNumber() })
    this.setState({ country_code: '+' + this.phone.getCountryCode() })
    this.setState({ phone_number: value })
    this.checkReady('phone')
  }
  
  showErrorMessage (value) {
    switch(value) {
      case 'f_name' :
        if (this.state.first_name != '') {
          if (this.state.first_name != this.state.middle_name && this.state.first_name != this.state.last_name) {
            if (this.state.first_name != this.state.middle_name && this.state.duplicate_m_name) {
              this.setState({duplicate_m_name : false})
            }
            if (this.state.first_name != this.state.last_name && this.state.duplicate_l_name) {
              this.setState({duplicate_l_name : false})
            }
            if (this.state.middle_name == this.state.last_name && this.state.middle_name != '' && this.state.last_name != '') {
              this.setState({duplicate_m_name : true})
            }
            this.setState({valid_f_name : true, duplicate_f_name : false})
          } else {
            this.setState({valid_f_name : true , duplicate_f_name : true})
          }           
        }
        else 
          this.setState({valid_f_name : false})
        break;
      case 'l_name' :
        if (this.state.last_name != '') {
          if (this.state.last_name != this.state.middle_name && this.state.last_name != this.state.first_name) {
            if (this.state.last_name != this.state.middle_name && this.state.duplicate_l_name) {
              this.setState({duplicate_l_name : false})
            }
            if (this.state.first_name != this.state.last_name && this.state.duplicate_f_name) {
              this.setState({duplicate_f_name : false})
            }
            if (this.state.middle_name == this.state.first_name  && this.state.middle_name != '' && this.state.first_name != '') {
              this.setState({duplicate_m_name : true})
            }
            this.setState({valid_l_name : true, duplicate_l_name : false})
          } else {
            this.setState({valid_l_name : true , duplicate_l_name : true})
          }           
        }
        else 
          this.setState({valid_l_name : false})
        break;
      case 'm_name' :
        if (this.state.middle_name != '')
        {
          if (this.state.middle_name != this.state.first_name && this.state.middle_name != this.state.last_name) {
            if (this.state.first_name != this.state.middle_name && this.state.duplicate_f_name) {
              this.setState({duplicate_f_name : false})
            }
            if (this.state.middle_name != this.state.last_name && this.state.duplicate_l_name) {
              this.setState({duplicate_l_name : false})
            }
            if (this.state.first_name == this.state.last_name && this.state.last_name != '' && this.state.last_name != '') {
              this.setState({duplicate_l_name : true})
            }
            this.setState({valid_m_name : true, duplicate_m_name : false})
          } else {
            this.setState({valid_m_name : true , duplicate_m_name : true})
          }      
        }
        else 
          this.setState({valid_m_name : false})
        break;
      case 'email' :
        if (this.state.email != '')
          this.setState({valid_email : true})
        else
          this.setState({valid_email : false})
        
        if (this.state.email != '' && validEmail(this.state.email))
          this.setState({isValidEmail : false})
        else
          this.setState({isValidEmail : true})
        break;
      case 'phone' :
        if (this.state.phone_number != '')
          this.setState({valid_phone : true})
        else 
          this.setState({valid_phone : false})
      
        break;
      case 'birth' :
        if (this.state.birthDay != '')
          this.setState({valid_birth : true})
        else
          this.setState({valid_birth : false})
        break;
      case 'password' :
        if (this.state.password.length < 6)
          this.setState({valid_password : false})
        else
          this.setState({valid_password : true})
        break;
    }
  }

  showDateTimePicker = async() => {
    if (Platform.OS == 'ios') {
      this.setState({ isDateTimePickerVisible: true });
    } else {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: this.state.date,
          mode : 'spinner'
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          var mon = month + 1
          var days = day
  
          if (mon < 10) 
            mon = '0' + mon
          if (day < 10 )
            days = '0' + day
  
          var time = year + '-' + mon + '-' + days
          var date = new Date(time)
          this.handleDatePicked(date)
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  
  handleDatePicked = date => {
      this.setState({
        birthDay : convertDate(date) ,
        dob : paramDate(date),
        date : date
      })
      this.hideDateTimePicker();
  };

  render() {
    return (
      <SafeAreaView style={{flex : 1}}>
        <StatusBar
          //translucent
          backgroundColor="white"
          barStyle="dark-content"
          />
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{flex : 1}}
            scrollEnabled={false}
        >
          <View style={styles.container}>
            <HeaderComponent backTitle="Go back to Login" goBack={() => {
              this.props.navigation.navigate('LoginScreen')
            }}></HeaderComponent>
            <View style={{flex : 1}}>
              <View style={{flex : 0.9}}>
                <ScrollView style={{flex : 1}}>
                  <View style={styles.body}>
                    <Text style={styles.title}>Create an account</Text>
                    <TextComponent
                      textPlaceHolder = "First Name"
                      textValue={this.state.first_name}
                      textType="text"
                      ready ={ this.state.isReady}
                      onChangeText = {(value) => this.setState({first_name : value},() => {this.checkReady('f_name')})}
                    > </TextComponent>
                    {
                      !this.state.valid_f_name && 
                      <Text style={global_style.error }>{ErrorMessage.error_first_name_required}</Text>
                    }
                    {
                      this.state.valid_f_name && this.state.duplicate_f_name &&
                      <Text style={global_style.error }>{ErrorMessage.error_duplicate_first_name}</Text>
                    }

                    <TextComponent
                      textPlaceHolder = "Middle Name"
                      textValue={this.state.middle_name}
                      textType="text"
                      ready ={ this.state.isReady}
                      onChangeText = {(value) => this.setState({middle_name : value},() => {this.checkReady('m_name')})}
                    > </TextComponent>
                    {/* {
                      !this.state.valid_m_name && 
                      <Text style={global_style.error }>{ErrorMessage.error_middle_name_required}</Text>
                    } */}
                    {
                      this.state.valid_m_name && this.state.duplicate_m_name &&
                      <Text style={global_style.error }>{ErrorMessage.error_duplicate_middle_name}</Text>
                    }
                    <TextComponent
                      textPlaceHolder = "Last Name"
                      textValue={this.state.last_name}
                      textType="text"
                      ready ={ this.state.isReady}
                      onChangeText = {(value) => this.setState({last_name : value},() => {this.checkReady('l_name')})}
                    > </TextComponent>
                    {
                      !this.state.valid_l_name && 
                      <Text style={global_style.error }>{ErrorMessage.error_last_name_required}</Text>
                    }
                    {
                      this.state.valid_l_name && this.state.duplicate_l_name &&
                      <Text style={global_style.error }>{ErrorMessage.error_duplicate_last_name}</Text>
                    }
                    
                    <TextComponent
                      textPlaceHolder = "Email"
                      textValue={this.state.email}
                      textType="text"
                      ready ={ this.state.isReady}
                      onChangeText = {(value) => this.setState({email : value},() => {this.checkReady('email')})}
                    > </TextComponent>
                    {
                      !this.state.valid_email &&
                      <Text style={global_style.error }>{ErrorMessage.error_email_required}</Text>
                    }
                    {
                      this.state.valid_email && this.state.isValidEmail &&
                      <Text style={global_style.error }>{ErrorMessage.error_email_invalid}</Text>
                    }

                    <PhoneInput
                      ref={ref => {
                        this.phone = ref;
                      }}
                      textProps={{ placeholder: "Phone number" }}
                      style={this.state.isReady ? [global_style.text_input_active, { marginTop : 10 * metrics}] : [global_style.text_input, { marginTop : 10 * metrics}]}
                      value={this.state.phone_number}
                      onSelectCountry={(value) => console.log(value)}
                      onChangePhoneNumber={(value) => this.changeMobileNumber(value)}
                      initialCountry={"gb"}
                      textStyle ={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                    />
                    {
                      this.state.phone_number != '' && !this.state.isValidPhone &&
                      <Text style={global_style.error }>{ErrorMessage.error_phone_number_invalid}</Text>
                    }
                    <View style={{marginTop : 15 * metrics}}></View>
                    <View style={this.state.isReady ? styles.date_active_body : styles.date_body}>
                      <TouchableOpacity onPress={() => this.showDateTimePicker()} style={{flex : 1, justifyContent : 'center'}}>
                        <Text style={this.state.birthDay != '' ? styles.fullType : styles.emptyType}>{this.state.birthDay != '' ? this.state.birthDay : 'Date of Birth'}</Text>
                      </TouchableOpacity>
                      {
                        Platform.OS == 'ios' && 
                        <DateTimePicker
                          isVisible={this.state.isDateTimePickerVisible}
                          onConfirm={this.handleDatePicked}
                          onCancel={this.hideDateTimePicker}
                          date = {this.state.date}
                          mode = "date"
                          minDate="1981-01-01"
                          maxDate="2012-06-01"
                        />
                      }
                    </View> 
                    {
                      !this.state.valid_birth &&
                      <Text style={global_style.error }>{ErrorMessage.error_birthday_required}</Text>
                    }

                    <TextComponent
                      textPlaceHolder = "Password"
                      textValue={this.state.password}
                      textType="password"
                      ready = { this.state.isReady }
                      onChangeText = {(value) => this.setState({password : value},() => {this.checkReady('password')})}
                    > </TextComponent>
                    {
                      !this.state.valid_password &&
                      <Text style={global_style.error }>{ErrorMessage.error_password_max_length}</Text>
                    }
                    <View style={{marginTop : 30 * metrics}}></View>
                    <View style={{flexDirection : 'row' ,  width: '100%' , height : 60 * metrics}}>
                      <CheckBox
                        title='Terms & conditions'
                        checked={this.state.term_condition}
                        containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                        textStyle={{color: Colors.gray_color, fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics}}
                        checkedColor={Colors.main_color}
                        onPress={()=> {this.setState({term_condition : !this.state.term_condition}, () => this.checkReady('t&c'))}}
                      />
                    </View>

                    <View style={{marginTop : 40 * metrics}}></View>
                  </View>
                </ScrollView>
              </View>
              <View style={{flex : 0.1, width : '85%', alignSelf : 'center'}}>
                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onSubmit()}>
                  <View style={global_style.btn_body}>
                    <Text style={global_style.left_text}>Submit</Text>
                    <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                  </View>
                </TouchableOpacity>  
              </View>
            </View>
          </View>
          {
            this.state.isLoading && 
            <View style={global_style.loading_body}>
                <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
            </View>
          }
        </KeyboardAwareScrollView>
      </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : Platform.OS == 'ios' ? 'transparent' : '#fff'
  },
  body : {
    flex : 1, 
    width : '85%', 
    alignSelf : 'center',
    paddingTop : 40 * metrics
  },
  title : {
    fontSize : 25 * metrics,
    fontFamily : Fonts.adobe_clean,
    fontWeight : '500'
  },
  fullType : {
    fontSize : 18 * metrics,
    fontFamily : Fonts.adobe_clean,
    marginLeft : 5 * metrics,
  },
  emptyType : {
    fontSize : 17 * metrics,
    fontFamily : Fonts.adobe_clean,
    color : Colors.gray_color,
    marginLeft : 5 * metrics,
  },
  date_body : {
    flex : 1, height : 50 * metrics ,marginTop : 5 * metrics, borderBottomWidth: 1, borderBottomColor : Colors.gray_color
  },
  date_active_body : {
    flex : 1, height : 50 * metrics ,marginTop : 5 * metrics, borderBottomWidth: 1, borderBottomColor : Colors.main_color
  }
});
