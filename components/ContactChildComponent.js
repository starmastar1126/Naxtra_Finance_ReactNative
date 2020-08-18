/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image ,TextInput,AsyncStorage,TouchableOpacity,ScrollView, Dimensions} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import * as ErrorMessage from '../constants/ErrorMessage'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'
import global_style, {metrics} from '../constants/GlobalStyle'
import {Fonts} from '../constants/Fonts'
import TextComponent from './TextComponent'
import PhoneInput from 'react-native-phone-input';
import { RadioButton } from 'react-native-paper'

export default class ContactChildComponent extends Component {
  state = {
    first_name : '',
    last_name : '',
    title : '',
    job_position : '',
    contact_email : '',
    exist_email : true,
    invalid_email : false,
    contact_phonenumber : '',
    isValidContactPhone : true,
    isReady : false,
    notes : '',
    contact_type : 0
  }
  checkReady () {

  }
  componentDidMount () {

  }

  initData () {

  }
  render() {
    return (
        <View style={styles.body}>
            <View style={{flex : 1, justifyContent : 'center'}}>
                <View style={{flex : 0.1, justifyContent : 'center',paddingLeft : 20 * metrics}}>
                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.main_color}}>Contacts</Text>
                </View>
                
                <View style={styles.tool_body}>
                    <TouchableOpacity style={{flex : 0.5, flexDirection : 'row',alignItems : 'center'}} onPress={() => this.setState({contact_type : 0}, () => this.initData())}>
                        <View style={{justifyContent : 'center'}}>
                            <RadioButton
                                value="first"
                                status={this.state.contact_type == 0 ? 'checked' : 'unchecked'}
                                color={Colors.main_color}
                                onPress={() => this.setState({contact_type : 0}, () => this.initData())}
                            />
                        </View>
                        
                        <View style={{justifyContent : 'center'}}>
                            <Text style={this.state.contact_type == 0 ? styles.active_option : styles.option}>Contact</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex : 0.5, flexDirection : 'row',alignItems : 'center'}} onPress={() => this.setState({contact_type : 1}, () => this.initData())}>
                        <View style={{justifyContent : 'center'}}>
                            <RadioButton
                                value="first"
                                status={this.state.contact_type == 1 ? 'checked' : 'unchecked'}
                                color={Colors.main_color}
                                onPress={() => this.setState({contact_type : 1}, () => this.initData())}
                            />
                        </View>
                        
                        <View style={{justifyContent : 'center'}}>
                            <Text style={this.state.contact_type == 1 ? styles.active_option : styles.option}>Invoice Address</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex : 0.7, justifyContent : 'center'}}>
                    <ScrollView style={{marginBottom : 10 * metrics}}>
                        {
                            this.state.contact_type == 0 ? 
                            <View style={{padding : 20 * metrics}}>
                                <TextComponent
                                    textPlaceHolder = "Title"
                                    textValue={this.state.title}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({title : value},() => {this.checkReady()})}
                                />
                                <TextComponent
                                    textPlaceHolder = "First Name"
                                    textValue={this.state.first_name}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({first_name : value},() => {this.checkReady()})}
                                />
                                <TextComponent
                                    textPlaceHolder = "Last Name"
                                    textValue={this.state.last_name}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({last_name : value},() => {this.checkReady()})}
                                />
                                <TextComponent
                                    textPlaceHolder = "Job Position"
                                    textValue={this.state.job_position}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({job_position : value},() => {this.checkReady()})}
                                />
                                
                                <TextComponent
                                    textPlaceHolder = "Email"
                                    textValue={this.state.contact_email}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({contact_email : value},() => {
                                        if (this.state.contact_email != '')
                                            this.setState({exist_email : true})
                                        else
                                            this.setState({exist_email : false})
                                        
                                        if (this.state.contact_email != '' && validEmail(this.state.contact_email)) 
                                            this.setState({invalid_email : false})
                                        else
                                            this.setState({invalid_email : true})
                                        this.checkReady()
                                    })}
                                />
                                {
                                    !this.state.exist_email && this.state.invalid_email && 
                                    <Text style={global_style.error}>{ErrorMessage.error_email_required}</Text>
                                }
                                {
                                    this.state.exist_email && this.state.invalid_email &&
                                    <Text style={global_style.error}>{ErrorMessage.error_email_invalid}</Text>
                                }

                                {
                                    this.state.phone_number != '' &&
                                    <Text style={{marginTop : 15 * metrics ,fontFamily : Fonts.adobe_clean, fontSize : 14 *  metrics , color : Colors.gray_color, marginLeft : 4 * metrics}}>PhoneNumber</Text>
                                }
                                <PhoneInput
                                    ref={ref => {
                                        this.contact_phone = ref;
                                    }}
                                    textProps={{ placeholder: "Phone number" }}
                                    style={this.state.isReady ? [global_style.text_input_active, { marginTop : 10 * metrics}] : [global_style.text_input, { marginTop : 10 * metrics}]}
                                    value={this.state.contact_phonenumber}
                                    onSelectCountry={(value) => console.log(value)}
                                    onChangePhoneNumber={(value) => this.changeContactNumber(value)}
                                    initialCountry={"gb"}
                                    textStyle ={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                />
                                {
                                    this.state.contact_phonenumber != '' && !this.state.isValidContactPhone &&
                                    <Text style={global_style.error }>{ErrorMessage.error_phone_number_invalid}</Text>
                                }
                                <TextComponent
                                    textPlaceHolder = "Notes"
                                    textValue={this.state.notes}
                                    textType="text"
                                    ready={this.state.isReady}
                                    onChangeText = {(value) => this.setState({notes : value},() => {this.checkReady()})}
                                />
                            </View>
                            :
                            <View style={{padding : 20 * metrics}}>

                            </View>
                        }
                        </ScrollView>
                </View>
                <View style={{flexDirection : 'row', flex : 0.1, justifyContent : 'center', alignItems : 'center', padding : 10 * metrics}}>
                    <View style={{flex: 0.3}}></View>
                    <View style={{flex : 0.3}}>
                        <TouchableOpacity style={styles.save_btn}>
                            <Text style={styles.save_text}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex : 0.1}}></View>
                    <View style={{flex : 0.3}}>
                        <TouchableOpacity style={styles.cancel_btn} onPress={() => this.props.gotoList()}>
                            <Text style={styles.cancel_text}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    body : {
        width : '100%',
        height : Dimensions.get('window').height * 0.7,
        alignSelf : 'center',
        backgroundColor : 'white',
    },
    save_btn : {
        width : '100%', height : 50 * metrics, backgroundColor : 'green',borderWidth : 1, borderRadius : 10 * metrics, borderColor : Colors.gray_color,
        justifyContent : 'center', alignItems : 'center'
    },
    save_text :{
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : 'white'
    },
    cancel_btn : {
        width : '100%', height : 50 * metrics, backgroundColor : Colors.red_color,borderWidth : 1, borderRadius : 10 * metrics, borderColor : Colors.gray_color,
        justifyContent : 'center', alignItems : 'center'
    },
    cancel_text :{
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : 'white'
    },
    tool_body : {
        flex : 0.1, justifyContent :'center',flexDirection : 'row', alignItems : 'center', width : '80%',alignSelf : 'center'
    },
    active_option : {
        fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.main_color
    },
    option : {
        fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray
    },
});

ContactChildComponent.propType = {
  gotoList : PropTypes.func
}