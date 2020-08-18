/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View,ActivityIndicator,AsyncStorage ,TouchableOpacity,ScrollView} from 'react-native'
import * as ErrorMessage from '../constants/ErrorMessage'
import * as Colors from '../constants/Colors'
import { alertMessage } from '../utils/utils';
import global_style, {metrics} from '../constants/GlobalStyle'
import UserService from '../service/UserService'
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { BorderlessButton } from 'react-native-gesture-handler';
import TransactionService from '../service/TransactionService';
import {Fonts} from '../constants/Fonts'

const resetAction = (routeName) => StackActions.reset({
	index: 0,
	actions: [
		NavigationActions.navigate({ routeName: routeName }),
	]
});


export default class ActivityScreen extends Component {
  static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
  };

  state = {
    user_info : null,
    isLoading : false,
    balance : '',
    active_idx : 0
  }

  async initLocalStorage () {

  }

  getBalance () {
    // var obj = {
    //   token : global.token//global.token
    // }
    console.log('token = ' , global.token)
    TransactionService.getAllBalance(global.token).then(res => {
      var data = res.data.result
      if (data.success) {
        this.setState({balance : data.response})
      } else {
        this.setState({balance : 0})
      }
    }).catch(error => {
      console.log(error)
      this.setState({balance : '0'})
    })
  }
  gotoLink = () => {
    
  }
  componentDidMount () {
    global.tabIdx = 1
    this.getBalance ()
  }
  gotoLogin = () => {
    this.props.navigation.dispatch(resetAction('LoginScreen'));
  }
  render() {
    return (
      <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
        {
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.header_icon}>
                <BorderlessButton style={styles.left_icon} onPress={() => {
                  global.time = 0
                  this.props.navigation.dispatch(resetAction('TabScreen'));
                }}>
                  <MaterialCommunityIcons name="menu-open" size={35 * metrics} ></MaterialCommunityIcons>
                </BorderlessButton>
                <View style={{flex : 0.8}}></View>
                <BorderlessButton style={styles.right_icon}>
                  <Fontisto name="hipchat" size={28 * metrics}></Fontisto>
                </BorderlessButton>
              </View>
              <View style={styles.header_body}>
                <Text style={styles.value}>£ {Number(this.state.balance).toFixed(2)}</Text>
                <Text style={styles.text}>CurrentBalance</Text>
              </View>
            </View>
            <View style={styles.body}>
              <ScrollView style={{flex : 1}}>
                <View style={{flexDirection : 'column' , flex : 1}}>
                  <View style={styles.active_body}>
                    <Text style={{color : 'white',fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics}}>In-active</Text>
                    <Text style={{width : '80%', textAlign : 'center',fontFamily : Fonts.adobe_clean, fontSize : 15 * metrics, color : 'white', marginTop : 20 * metrics, marginBottom : 10 * metrics}}>Your account is pending for approval.Our customer support term will get call you within 24 hours for verification.</Text>
                  </View>
                  <View style={{marginTop : 20 * metrics}}></View>
                  <View style={{flexDirection : 'row' , width : '85%', alignSelf : 'center'}}>
                    <TouchableOpacity style={styles.tabBtn} onPress={() => this.setState({active_idx : 0})}>
                      <Text style={this.state.active_idx == 0 ? styles.active_tab : styles.tab}>Domestic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabBtn} onPress={() => this.setState({active_idx : 1})}>  
                      <Text style={this.state.active_idx == 1 ? styles.active_tab : styles.tab}>International</Text>
                    </TouchableOpacity>
                  </View>
                  {
                    this.state.active_idx == 0 &&
                    <View style={{marginTop : 30 * metrics}}>
                      <View style={styles.card_body}>
                        <View style={styles.card}>
                          <TouchableOpacity onPress={() => this.gotoLink()}>
                            <MaterialCommunityIcons name="share-variant" size={25 * metrics} color={Colors.main_color} style={{alignSelf : 'flex-end'}}></MaterialCommunityIcons>
                          </TouchableOpacity>
                          <View style={styles.name_body}>
                            <Text style={{color : Colors.gray_color}}>Beneficiary</Text>
                            {
                              global.user_info != '' &&
                              <Text>
                                {
                                  (global.user_info.account_type == 'business' || global.user_info.account_type == 'Business') ? 
                                    global.user_info.company_name : 
                                    global.user_info.account_name
                                }
                              </Text>
                            }
                          </View>
                          <View style={styles.account_body}>
                            <View style={{flex : 0.5}}>
                              <Text style={{color : Colors.gray_color}}>Account</Text>
                              <Text>{global.user_info != '' ? global.user_info.account_number : ''}</Text>
                            </View>
                            <View style={{flex : 0.5}}>
                              <Text style={{color : Colors.gray_color}}>Sort code</Text>
                              <Text>{global.user_info != '' ? global.user_info.sort_code : ''}</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={{marginTop : 20 * metrics}}></View>
                      <Text style={{fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean, color : Colors.gray_color, textAlign : 'center'}}>For Domestic Transfers only</Text>
                      
                      <View style={{marginTop : 20 * metrics}}></View>

                      <View style={styles.sub_card}>
                        <View style={styles.sub_card_item}>
                          <MaterialCommunityIcons name="flag-variant" size={25 * metrics} style={{flex : 0.1}}></MaterialCommunityIcons>
                          <Text style={styles.sub_card_text}>This account supports incoming payments via SWIFT only</Text>
                        </View>
                        <View style={styles.sub_card_item}>
                          <FontAwesome5 name="coins" size={20 * metrics} style={{flex : 0.1}}></FontAwesome5>
                          <Text style={styles.sub_card_text}>Your bank may charge you for international payments</Text>
                        </View>
                        {/* <View style={styles.sub_card_item}>
                          <MaterialCommunityIcons name="clock" size={20 * metrics} style={{flex : 0.1}}></MaterialCommunityIcons>
                          <Text style={styles.sub_card_text}>Transfers may take 1 - 3 business days to appear on your Revolut account.</Text>
                        </View>
                        <View style={styles.sub_card_item}>
                          <MaterialCommunityIcons name="file-document" size={20 * metrics} style={{flex : 0.1}}></MaterialCommunityIcons>
                          <Text style={styles.sub_card_text}>if your bank asks for your intermediary BIC, it's BARCGB22</Text>
                        </View> */}
                      </View>
                    </View>
                  }
                  {
                    this.state.active_idx == 1 && 
                    <View style={{marginTop : 30 * metrics}}>
                      <View style={styles.card_body}>
                        <View style={styles.card}>
                        <TouchableOpacity onPress={() => this.gotoLink()}>
                            <MaterialCommunityIcons name="share-variant" size={25 * metrics} color={Colors.main_color} style={{alignSelf : 'flex-end'}}></MaterialCommunityIcons>
                          </TouchableOpacity>
                          <View style={styles.name_body}>
                            <Text style={{color : Colors.gray_color}}>Beneficiary</Text>
                            {
                              global.user_info != '' && 
                              <Text>{global.user_info.account_type == 'Business' ? global.user_info.company_name : global.user_info.account_name}</Text>
                            }
                          </View>
                          <View style={{marginTop : 10 * metrics}}></View>
                          <View style={{flexDirection : 'column'}}>
                            <View style={{flex : 1}}>
                              <Text style={{color : Colors.gray_color}}>IBAN</Text>
                              <Text>{global.user_info != '' ? global.user_info.iban : ''}</Text>
                            </View>
                            <View style={{marginTop : 10 * metrics}}></View>
                            <View style={{flex : 1}}>
                              <Text style={{color : Colors.gray_color}}>Sort code</Text>
                              <Text>{global.user_info != '' ? global.user_info.bic_swift : ''}</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={{marginTop : 20 * metrics}}></View>

                      <Text style={{fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean, color : Colors.gray_color, textAlign : 'center'}}>For International Transfers only</Text>
                      
                      <View style={{marginTop : 20 * metrics}}></View>

                      <View style={styles.sub_card}>
                        <View style={styles.sub_card_item}>
                          <MaterialCommunityIcons name="flag-variant" size={25 * metrics} style={{flex : 0.1}}></MaterialCommunityIcons>
                          <Text style={styles.sub_card_text}>This account supports incoming payments via SWIFT only</Text>
                        </View>
                        <View style={styles.sub_card_item}>
                          <FontAwesome5 name="coins" size={20 * metrics} style={{flex : 0.1}}></FontAwesome5>
                          <Text style={styles.sub_card_text}>Your bank may charge you for international payments</Text>
                        </View>
                        {/* <View style={styles.sub_card_item}>
                          <MaterialCommunityIcons name="clock" size={20 * metrics} style={{flex : 0.1}}></MaterialCommunityIcons>
                          <Text style={styles.sub_card_text}>Transfers may take 1 - 3 business days to appear on your Revolut account.</Text>
                        </View>
                        <View style={styles.sub_card_item}>
                          <MaterialCommunityIcons name="file-document" size={20 * metrics} style={{flex : 0.1}}></MaterialCommunityIcons>
                          <Text style={styles.sub_card_text}>if your bank asks for your intermediary BIC, it's BARCGB22</Text>
                        </View> */}
                      </View>
                    </View>
                  }
                </View>
              </ScrollView>
            </View>
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
  title : {
    fontSize : 20 * metrics , color : 'black',flex : 0.4,fontFamily : Fonts.adobe_clean,
  },
  value : {
    fontSize : 20 * metrics, color : Colors.main_blue_color, flex : 0.6,fontFamily : Fonts.adobe_clean,
  },
  item : {
    flexDirection :'row',
    marginTop : 10 * metrics   
  },
  header : {
    width : '100%',
    height : 150 * metrics,
    backgroundColor : 'white',
    elevation : 3.5
  },
  header_icon : {
    width : '95%',
    height : 50 * metrics,
    flexDirection : 'row',
    alignSelf : 'center',
  },
  header_body : {
    width : '95%',
    height : 100 * metrics,
    flexDirection : 'column',
    alignSelf : 'center',
    alignItems : 'center',
    justifyContent : 'center'
  },
  value : {
    fontSize : 25 * metrics,
    fontFamily : Fonts.adobe_clean,
  },
  text : {
    marginTop : 10 * metrics,
    fontFamily : Fonts.adobe_clean,
    fontSize : 18 * metrics,
    color : Colors.gray_color
  },
  left_icon : {
    flex : 0.1,
    marginTop : 5 * metrics
  },
  right_icon : {
    flex : 0.1,
    marginTop : 10 * metrics
  },
  body : {
    flex : 1,
    flexDirection : 'column'
  },
  active_body : {
    width : '100%',
    minHeight : 120 * metrics,
    backgroundColor : Colors.main_color,
    alignSelf : 'center',
    justifyContent : 'center',
    alignItems : 'center'
  },
  card_body : {
    flex : 1,
    flexDirection : 'column',
    justifyContent : 'center',
    marginTop : -50 * metrics,
    alignItems : 'center'
  },
  sub_card : {
    minHeight : 200 * metrics,
    backgroundColor : 'white',
    width : '85%',
    alignSelf : 'center',
    marginBottom : 20 * metrics
  },
  card : {
    width : '85%',
    minHeight : 120 * metrics,
    marginTop : 30 * metrics,
    backgroundColor : 'white',
    elevation : 3.5,
    flexDirection : 'column',
    padding : 10 * metrics,
    paddingBottom : 20 * metrics
  },
  name_body : {
    flexDirection : 'column',
    marginBottom : 10 * metrics
  },
  account_body : {
    flexDirection : 'row'
  },
  tabBtn : {
    width : 100 * metrics, 
    height : 30 * metrics,
    marginRight : 10 * metrics,
  },
  active_tab : {
    fontFamily : Fonts.adobe_clean,
    fontSize : 15 * metrics,
    color : Colors.main_color
  },
  tab : {
    fontFamily : Fonts.adobe_clean,
    fontSize : 15 * metrics,
    color : '#000'
  },
  sub_card_item : {
    width : '95%',
    alignSelf : 'center',
    height : 45 * metrics,
    marginTop : 15 * metrics,
    flexDirection : 'row',
  },
  sub_card_text: {
    flex : 0.9,
    fontFamily : Fonts.adobe_clean,
    fontSize : 15 * metrics,
    color : Colors.dark_gray
  }
});
