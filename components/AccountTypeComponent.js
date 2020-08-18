/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image ,TextInput,AsyncStorage} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import global_style, {metrics} from '../constants/GlobalStyle'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {Fonts} from '../constants/Fonts'
import { CheckBox } from 'react-native-elements'

export default class AccountTypeComponent extends Component {

  state = {
    accountType : -1,
    starter : false,
    standard : false,
    professional : false,
    voucher : ''
  }
  componentDidMount () {
    this.setState({accountType : -1})
  }
  changeAccountType = async(type) => {
    this.setState({accountType : type})
    global.accountType = type
    // if (this.state.starter)
    //   global.package = 1
    // if (this.state.standard)
    //   global.package = 2
    // if (this.state.professional)
    //   global.package = 3

    // if (this.state.voucher != '')
    //   global.voucher = this.state.voucher
    // else
    //   global.voucher = ''

    this.props.activeButton()
  }

  render() {
    return (
      <View style={styles.body}>
          <View style={{flex : 1}}>
            {/* <View style={{marginTop : 10 * metrics}}>
              <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics,fontWeight : '600'}}>Select Package</Text>
              <View style={styles.package_body}>
                <View style={styles.check_body}>
                  <CheckBox
                      title='Starter'
                      checked={this.state.starter}
                      containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                      textStyle={!this.state.starter ? styles.check_title : styles.checked_title}
                      checkedColor={Colors.main_color}
                      onPress={() => this.setState({starter : !this.state.starter, standard : false,professional : false})}
                  />
                </View>
                <View style={styles.check_body}>
                  <CheckBox
                      title='Standard'
                      checked={this.state.standard}
                      containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                      textStyle={!this.state.standard ? styles.check_title : styles.checked_title}
                      checkedColor={Colors.main_color}
                      onPress={() => this.setState({standard : !this.state.standard, starter : false,professional : false})}
                  />
                </View>
                <View style={styles.check_body}>
                  <CheckBox
                    title='Professional'
                    checked={this.state.professional}
                    containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                    textStyle={!this.state.professional ? styles.check_title : styles.checked_title}
                    checkedColor={Colors.main_color}
                    onPress={() => this.setState({starter : false, standard : false,professional : !this.state.professional})}
                  />
                </View>
              </View>
            </View>
            <View style={{marginTop : 10 * metrics, flexDirection : 'row', alignItems : 'center', marginBottom : 15 * metrics}}>
              <View style={{flex : 0.4}}>
                <Text style={{fontFamily: Fonts.adobe_clean, fontSize : 15 * metrics}}>Voucher (if any)</Text>
              </View>
              <View style={{flex : 0.05}}></View>
              <View style={{flex : 0.55, borderBottomWidth : 1, borderBottomColor : Colors.dark_gray}}>
                <TextInput
                  value={this.state.voucher}
                  placeholder={""}
                  style={{fontSize : 17 * metrics,height : 45 * metrics}}
                  onChangeText = {(value) => this.setState({voucher : value})}
                />
              </View>
            </View> */}
            <View style={{width : '100%', height : '100%',justifyContent : 'center'}}>
              <Text style={styles.title}>Select Account Type</Text>
              <View style={{marginTop : 40 * metrics}}></View>
              <View style={styles.sub_body}>
              <View style={styles.personal_body}>
                <TouchableOpacity style={ this.state.accountType == 0 ? styles.select : styles.not_select } onPress={() => this.changeAccountType(0)}>
                  <View style={{flex : 1,padding : 3 * metrics}}>
                    {
                      this.state.accountType == 0 ? 
                      <View style={{flex : 0.15, alignSelf : 'flex-end'}}>
                        <Image source={Images.checked_icon} style={global_style.checked_icon}></Image>
                      </View> : 
                      <View style={{flex : 0.15, alignSelf : 'flex-end'}}></View>
                    }
                    <View style={{flex : 0.7, justifyContent : 'center'}}>
                      <Image source={Images.person_img} style={global_style.accout_icon}></Image>
                      <Text style={{textAlign : 'center', marginTop : 4 * metrics}}>Personal</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>  
              <View style={styles.business_body}>
                <TouchableOpacity style={ this.state.accountType == 1 ? styles.select : styles.not_select } onPress={() => this.changeAccountType(1)}>
                  <View style={{flex : 1,padding : 3 * metrics}}>
                    {
                      this.state.accountType == 1 ? 
                      <View style={{flex : 0.15, alignSelf : 'flex-end'}}>
                        <Image source={Images.checked_icon} style={global_style.checked_icon}></Image>
                      </View> : 
                      <View style={{flex : 0.15, alignSelf : 'flex-end'}}></View>
                    }
                    <View style={{flex : 0.7, justifyContent : 'center'}}>
                      <Image source={Images.business_img} style={global_style.accout_icon}></Image>
                      <Text style={{textAlign : 'center', marginTop : 4 * metrics}}>Business</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>         
            </View>
            </View>
            
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body : {
    width : '80%',
    height : '100%',
    alignSelf : 'center',
  },
  title : {
    fontSize : 18 * metrics,
    fontFamily : Fonts.adobe_clean,
    textAlign : 'center',
    fontWeight : '500'
  },
  sub_body : {
    width : '90%',
    alignSelf : 'center',
    flexDirection : 'row',
  },
  personal_body : {
    flex : 0.5,
    height : 100 * metrics,
    justifyContent : 'center',
  },
  business_body : {
    flex : 0.5,
    height : 100 * metrics,
    justifyContent : 'center',
  },
  not_select : {
    width : 100 * metrics, 
    height : 100 * metrics , 
    borderColor : Colors.white_gray_color , 
    borderWidth : 1 , 
    flexDirection : 'column',
    alignSelf : 'center'
  },
  select : {
    width : 100 * metrics, 
    height : 100 * metrics , 
    flexDirection : 'column',
    borderColor : Colors.main_color , 
    borderWidth : 1 , 
    alignSelf : 'center'
  },
  package_body : {
    flexDirection : 'row',
    alignItems : 'center'
  },
  check_body : {
    flex : 0.333,
  },
  checked_title : {
    fontSize : 12 * metrics,
    fontFamily : Fonts.adobe_clean,
    color : Colors.main_color,
    textAlign : 'center'
  }, 
  check_title : {
      fontSize : 12 * metrics,
      fontFamily : Fonts.adobe_clean,
      color : Colors.dark_gray,
      textAlign : 'center'
  },
});

AccountTypeComponent.propType = {
  activeButton : PropTypes.func
}