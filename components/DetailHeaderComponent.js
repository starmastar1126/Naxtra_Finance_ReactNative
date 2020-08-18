/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View, TouchableOpacity , Image ,TextInput} from 'react-native'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import global_style, { metrics } from '../constants/GlobalStyle'
import { BorderlessButton } from 'react-native-gesture-handler';
import {Fonts} from '../constants/Fonts'

export default class DetailHeaderComponent extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    onMessage = () => {
        this.props.navigation.navigate('Chat')
    }
    render() {
        return (
            <View style={global_style.detail_header}>
                {
                    this.props.title != 'My Beneficiaries' ? 
                    <View style={{flex : 1, flexDirection : 'row'}}>
                        {
                            this.props.type != 'personal_setting' ?
                            <BorderlessButton  onPress={() => this.props.goBack()} style={{flex : 0.15 , alignSelf : 'center',alignItems : 'center'}}>
                                <MaterialIcon name="arrow-left" size={28 * metrics} style={[global_style.left_arrow, {color : '#000'}]} ></MaterialIcon>
                            </BorderlessButton>
                            :
                            <BorderlessButton  onPress={() => this.props.goBack()} style={{flex : 0.2 , alignSelf : 'center',alignItems : 'center'}}>
                                <MaterialIcon name="arrow-left" size={28 * metrics} style={[global_style.left_arrow, {color : '#000'}]} ></MaterialIcon>
                            </BorderlessButton>    
                        }
                        {/* <BorderlessButton  onPress={() => this.props.goBack()} style={{flex : 0.15 , alignSelf : 'center',alignItems : 'center'}}>
                            <MaterialIcon name="arrow-left" size={28 * metrics} style={[global_style.left_arrow, {color : '#000'}]} ></MaterialIcon>
                        </BorderlessButton> */}
                        {
                            (this.props.title == 'Payment Link' || this.props.title == "Naxetra Account" || this.props.title == "Bank Account" || this.props.title == "Confirm Payment") && this.props.type != 'personal_setting' && this.props.type != 'account_setting' && this.props.type != 'price_setting' && this.props.type != 'company_setting' && this.props.type != 'chatting' && 
                            <View style={styles.header_right}>
                                <Text style={{fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean, fontWeight : '500', color : '#000'}}>{this.props.title}</Text>
                                <Text style={{fontSize : 14 * metrics,fontFamily : Fonts.adobe_clean, color : Colors.white_gray_color}}>Send Money</Text>
                            </View>
                        }
                        {
                            (this.props.title != "Confirm Payment" && this.props.title != 'Payment Link' && this.props.title != 'Naxetra Account' && this.props.title != 'Bank Account') &&  this.props.type != 'personal_setting' && this.props.type != 'account_setting' && this.props.type != 'price_setting' && this.props.type != 'company_setting' && this.props.type != 'chatting' &&
                            <View style={styles.header_right}>
                                <Text style={{fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean, fontWeight : '500', color : '#000'}}>{this.props.title}</Text>
                            </View>
                        }
                        {
                            this.props.type == 'chatting' &&
                            <View style={styles.header_center}>
                                <View style={{flex: 0.8, flexDirection : 'column', justifyContent : 'center'}}>
                                    <Text style={{fontWeight : '500',color : '#000', fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean, textAlign :'center'}}>Alex Sanchez</Text>
                                    <Text style={{fontSize : 15 * metrics , fontFamily : Fonts.adobe_clean,textAlign : 'center'}}>online</Text>
                                </View>
                                <BorderlessButton style={{flex : 0.2 ,justifyContent : 'center', alignItems :'center'}}>
                                    <MaterialIcon name="dots-vertical" size={30 * metrics}></MaterialIcon>
                                </BorderlessButton>
                            </View>
                        }
                        {
                            (this.props.type == 'personal_setting' || this.props.type == 'account_setting'  ||  this.props.type == 'price_setting' || this.props.type == 'company_setting') &&
                            <View style={{flexDirection : 'row', flex : 0.9}}>
                                <View style={{flex: 0.8, flexDirection : 'column', justifyContent : 'center'}}>
                                    <Text style={{fontWeight : '500',color : '#000', fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean, textAlign :'center'}}>
                                        {
                                            this.props.type == 'personal_setting' && "Personal Details"
                                        }
                                        {
                                            this.props.type == 'account_setting' && "Active"
                                        }
                                        {
                                            this.props.type == 'price_setting' && "Price Plan"
                                        }
                                        {
                                            this.props.type == 'company_setting' && "Company Detail"
                                        }
                                    </Text>
                                </View>
                                {/* <BorderlessButton style={{flex : 0.2 ,justifyContent : 'center', alignItems :'center'}}>
                                    <MaterialIcon name="dots-vertical" size={30 * metrics} color={"white"}></MaterialIcon>
                                </BorderlessButton> */}
                            </View>
                        }
                        {
                            (this.props.type != 'chatting' && this.props.title != 'Message' && (this.props.type != 'personal_setting' && this.props.type != 'account_setting'  &&  this.props.type != 'price_setting' && this.props.type != 'company_setting')) &&
                            <BorderlessButton style={styles.icon_btn} onPress={() => this.onMessage()}>
                                <Fontisto name="hipchat" size={24 * metrics} style={styles.icon}></Fontisto>
                            </BorderlessButton>
                        }
                        
                    </View>
                    : 
                    <View style={{flex : 1, flexDirection : 'row'}}>
                        <BorderlessButton  onPress={() => this.props.goBack()} style={{flex : 0.15 , alignSelf : 'center',alignItems : 'center'}}>
                            <MaterialIcon name="arrow-left" size={28 * metrics} style={[global_style.left_arrow, {color : '#000'}]} ></MaterialIcon>
                        </BorderlessButton>
                        <View style={styles.header_right}>
                            <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,fontWeight : '500', color : '#000'}}>{this.props.title}</Text>
                        </View>
                        <TouchableOpacity style={{flex : 0.15,justifyContent: 'center'}} onPress={() => {
                            global.isManager = true
                            this.props.navigation.navigate("AddBeneficiaryScreen")
                        }}>
                            <Text style={{textAlign : 'center', fontSize : 15 * metrics, fontFamily : Fonts.adobe_clean,color : Colors.main_color}}>Add</Text>
                        </TouchableOpacity>
                    </View>
                }
                
                
            </View>
        );
    }
}

DetailHeaderComponent.propType = {
	title: PropTypes.string,
    goBack : PropTypes.func,
    type : PropTypes.string
}
const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignSelf : 'center',
        height : 80 * metrics,
        width : '100%',
        //backgroundColor : 'red'
    },
    icon_btn : {
        flex : 0.1 , 
        justifyContent : 'center'
    },
    icon : {
        alignSelf : 'center'
    },
    header_right : {
        flex: 0.7,
        flexDirection : 'column',
        justifyContent : 'center',
    },
    header_center : {
        flex : 0.9, 
        height : '100%',
        flexDirection : 'row',
        alignSelf : 'center',
        //backgroundColor : 'blue'
    }
});