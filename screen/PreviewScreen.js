/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,ActivityIndicator,AsyncStorage ,TouchableOpacity,ScrollView, Image,SafeAreaView} from 'react-native'
import * as ErrorMessage from '../constants/ErrorMessage'
import * as Colors from '../constants/Colors'
import { alertMessage } from '../utils/utils';
import global_style, {metrics} from '../constants/GlobalStyle'
import HeaderComponent from '../components/HeaderComponent'
import UserService from '../service/UserService'
import { StackActions, NavigationActions } from 'react-navigation'
import {Fonts} from '../constants/Fonts'
import MaterialIcon  from  'react-native-vector-icons/MaterialCommunityIcons'
import { changeDatefromServer } from '../utils/utils';

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});


export default class PreviewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
  };

  state = {
    user_info : null,
    upload_info : '',
    bio_info : '',
    business_info : '',
    isLoading : false
  }

  async initLocalStorage () {
    await AsyncStorage.setItem('steps', 'SplashScreen')
    await AsyncStorage.setItem('accountType' , '-1')
    await AsyncStorage.setItem('business_status', '0')
    await AsyncStorage.setItem('personal_status', '0')
    await AsyncStorage.setItem('proof_status', '0')
    await AsyncStorage.setItem('verification_state', '0')
    await AsyncStorage.setItem('signup_step', '')

    await AsyncStorage.setItem('token', "")
    await AsyncStorage.setItem('register_user', "")
    await AsyncStorage.setItem('applicant_id' , "")
    await AsyncStorage.setItem('verify_step' , "")

    await AsyncStorage.setItem('upload_info' , "")
    await AsyncStorage.setItem('business_info' , "")
    await AsyncStorage.setItem('bio_info' , "")
    await AsyncStorage.setItem('personal_data', "")
    await AsyncStorage.setItem('is_signup', "")
  }
  async getUploadsInfo () {
    if (await AsyncStorage.getItem('upload_info') != '' && typeof(await AsyncStorage.getItem('upload_info')) != 'undefined') {
      this.setState({upload_info : JSON.parse(await AsyncStorage.getItem('upload_info'))})
    } else {
      this.setState({upload_info : ''})
    }
  }
  async getBusinessInfo () {
    if (await AsyncStorage.getItem('business_info') != '' && typeof(await AsyncStorage.getItem('business_info')) != 'undefined') {
      this.setState({business_info : JSON.parse(await AsyncStorage.getItem('business_info'))})
    } else {
      this.setState({business_info : ''})
    }
   
  }
  async getBioInfo () {
    if (await AsyncStorage.getItem('bio_info') != '' && typeof(await AsyncStorage.getItem('bio_info')) != 'undefined') {
      this.setState({bio_info : JSON.parse(await AsyncStorage.getItem('bio_info'))})
    } else {
      this.setState({bio_info : ''})
    }
  }

  async getAccountType () {
    global.accountType = Number(await AsyncStorage.getItem('accountType'))
  }

  componentDidMount () {
    this.getAccountType ()
    this.getUploadsInfo()
    this.getBioInfo()
    if (global.accountType == 1)
      this.getBusinessInfo()
   
    
    this.setState({isLoading : true})
    UserService.getUserInfo(global.token).then(result => {
      var data = result.data.result
      if (data.success) {
        global.user_info = data.response
        this.setState({user_info : data.response})
      } else {
        if (data.message == '')
          alertMessage(ErrorMessage.network_error)
        else
          alertMessage(ErrorMessage.network_error)
      }
      this.setState({isLoading : false})
    }).catch(error => {
      alertMessage(ErrorMessage.network_error)
      this.setState({isLoading : false})
    })
  }
  gotoLogin = () => {
    this.props.navigation.dispatch(resetAction('ActivityScreen'));
    this.initLocalStorage ()
  }
  render() {
    return (
      <SafeAreaView style={{flex : 1}}>
        {
          this.state.user_info != null &&
          <View style={styles.container}>
            <HeaderComponent backTitle="Go Back" goBack={() => this.props.navigation.goBack()}></HeaderComponent>
            <ScrollView style={{flex : 1}}>
                <View style={{marginTop : 40 * metrics}}></View>
                <Text style={[global_style.input_title,{alignSelf : 'center', width : '85%'}]}>Preview</Text>
                <View style={{marginTop : 15 * metrics}}></View>
                <View style={styles.personal}>
                    <Text style={{fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean, marginLeft : 25 * metrics}}>Personal Detail</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.item}>
                        <Text style={styles.title}>First Name</Text>
                        <Text style={styles.value}>{this.state.user_info.first_name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Middle Name</Text>
                        <Text style={styles.value}>{this.state.user_info.middle_name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Last Name</Text>
                        <Text style={styles.value}>{this.state.user_info.last_name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Email ID</Text>
                        <Text style={styles.value}>{this.state.user_info.email}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Phone Number</Text>
                        <Text style={styles.value}>{this.state.user_info.phone}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Date of Birth</Text>
                        <Text style={styles.value}>{changeDatefromServer(this.state.user_info.dob)}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Account Type</Text>
                        <Text style={styles.value}>{this.state.user_info.account_type == 'business' ? "Business" : "Personal"}</Text>
                    </View>
                    
                    <View style={styles.item}>
                        <Text style={styles.title}>House No</Text>
                        <Text style={styles.value}>{this.state.user_info.house_no}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Address Info</Text>
                        <Text style={styles.value}>{this.state.user_info.address_info}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Street Name</Text>
                        <Text style={styles.value}>{this.state.user_info.street_name}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>City</Text>
                        <Text style={styles.value}>{this.state.user_info.city}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Country</Text>
                        <Text style={styles.value}>{this.state.user_info.country}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Post Code</Text>
                        <Text style={styles.value}>{this.state.user_info.post_code.toUpperCase()}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.title}>Nationality</Text>
                        <Text style={styles.value}>{this.state.user_info.nationality}</Text>
                    </View>
                    {/* nationality */}
                </View>
                <View style={{marginTop : 30 * metrics}}></View>
                <View style={styles.personal}>
                    <Text style={{fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean, marginLeft : 25 * metrics}}>Uploads</Text>
                </View>
                
                <View style={styles.body}>
                  <View style={styles.uploads_item}>
                    <View style={{flex : 0.4, flexDirection : 'column',paddingTop : 25 * metrics }}>
                      <Text style={styles.header}>Identitiy Proof</Text>
                      <Text style={styles.text}>{this.state.upload_info.id_proof_type}</Text>
                    </View>
                    <View style={{flex : 0.6}}>
                      <Image source={this.state.upload_info.id_proof} style={styles.img}></Image>
                    </View>
                  </View>

                  <View style={styles.uploads_item}>
                    <View style={{flex : 0.4, flexDirection : 'column',paddingTop : 25 * metrics }}>
                      <Text style={styles.header}>Address Proof</Text>
                      <Text style={styles.text}>{this.state.upload_info.address_proof_type}</Text>
                    </View>
                    <View style={{flex : 0.6}}>
                      <Image source={this.state.upload_info.address_proof} style={styles.img}></Image>
                    </View>
                  </View>

                  <View style={styles.uploads_item}>
                    <View style={{flex : 0.4, flexDirection : 'column',paddingTop : 25 * metrics }}>
                      <Text style={styles.header}>Selfie</Text>
                      <Text style={styles.text}>{new Date().getTime() + '.jpg'}</Text>
                    </View>
                    <View style={{flex : 0.6}}>
                      <Image source={this.state.bio_info.selfie} style={styles.img}></Image>
                    </View>
                  </View>

                  <View style={styles.uploads_item}>
                    <View style={{flex : 0.4, flexDirection : 'column',paddingTop : 25 * metrics }}>
                      <Text style={styles.header}>Video</Text>
                      <Text style={styles.text}>Vidoe.mp4</Text>
                    </View>
                    <View style={{flex : 0.6}}>
                      <Image source={this.state.bio_info.video_img} style={styles.img}></Image>
                      <View style={{position : "absolute", alignItems : 'center', justifyContent : 'center', width : '100%', height : '100%'}}>
                          <MaterialIcon name="play-circle-outline" size={30 * metrics} style={{alignSelf : 'center'}} color={Colors.gray_color}></MaterialIcon>
                      </View>
                    </View>
                  </View>
                </View>
                {
                  global.accountType == 1 &&
                  <>
                    <View style={{marginTop : 30 * metrics}}></View>
                    <View style={styles.personal}>
                        <Text style={{fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean, marginLeft : 25 * metrics}}>Business</Text>
                    </View>
                    <View style={styles.body}>
                      <View style={styles.item}>
                          <Text style={styles.title}>Business Name</Text>
                          <Text style={styles.value}>{this.state.user_info.company_name}</Text>
                      </View>
                      <View style={styles.item}>
                          <Text style={styles.title}>Co. Number</Text>
                          <Text style={styles.value}>{this.state.user_info.company_number}</Text>
                      </View>
                      <View style={styles.item}>
                          <Text style={styles.title}>Address</Text>
                          <Text style={styles.value}>{this.state.business_info.company_address}</Text>
                      </View>
                      <View style={styles.item}>
                          <Text style={styles.title}>Officer Name</Text>
                          <Text style={styles.value}>{this.state.user_info.account_name}</Text>
                      </View>
                      
                      {
                        this.state.business_info != '' && this.state.business_info != null &&
                        <View style={styles.item}>
                          <Text style={styles.title}>Appointed Date</Text>
                          {
                            this.state.business_info.officer_list.items.length == 0 ?
                            <Text style={styles.value}></Text>
                            :
                            <Text style={styles.value}>{changeDatefromServer(this.state.business_info.officer_list.items[0].appointed_on)}</Text>  
                          }
                        </View>
                      }
                      {
                        this.state.business_info != '' && this.state.business_info != null &&
                        <View style={styles.item}>
                          <Text style={styles.title}>Role</Text>
                          {
                            this.state.business_info.officer_list.items.length == 0 ?
                            <Text style={styles.value}></Text>
                            :
                            <Text style={styles.value}>{this.state.business_info.officer_list.items[0].officer_role}</Text>  
                          }
                        </View>
                      }
                      
                      <View style={styles.item}>
                          <Text style={styles.title}>Status</Text>
                          <Text style={styles.value}>{this.state.user_info.company_status}</Text>
                      </View>
                    </View>
                  </> 
                }
                <View style={{marginTop : 40 * metrics}}></View>
                <TouchableOpacity style={[global_style.bottom_active_btn, {width : '80%' , alignSelf :'center'}]} onPress={() => this.gotoLogin()}>
                    <Text style={{fontSize : 23 * metrics,fontFamily : Fonts.adobe_clean, color : Colors.white_color,alignSelf : 'center' , fontWeight : '500'}}>Confirm Detail</Text>
                </TouchableOpacity>
                <View style={{marginTop : 30 * metrics}}></View>
            </ScrollView>
            
          </View>
        }
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
  body : {
    flex : 1, 
    width : '85%', 
    alignSelf : 'center',
    marginTop : 15 * metrics
  },
  personal : {
      height : 30 * metrics,
      backgroundColor : Colors.white_gray_color,
      justifyContent : 'center'
  },
  uploads_item : {
    flex : 1, 
    height : 130 * metrics, 
    flexDirection : 'row',
    marginBottom : 20 * metrics
  },
  header : {
    fontFamily : Fonts.adobe_clean , 
    fontSize : 18 * metrics , 
    color : 'black'
  },
  text : {
    color : Colors.main_blue_color , 
    fontFamily : Fonts.adobe_clean , 
    fontSize : 15 * metrics, fontWeight : '700'
  },
  img : {
    width: '100%',height : '100%', resizeMode : 'cover'
  },
  title : {
    fontSize : 18 * metrics , color : 'black',flex : 0.45,fontFamily : Fonts.adobe_clean,
  },
  value : {
    fontSize : 18 * metrics, color : Colors.main_blue_color, flex : 0.55,fontFamily : Fonts.adobe_clean,
  },
  item : {
    flexDirection :'row',
    marginTop : 10 * metrics   
  }
});
