'use strict';

import { Dimensions, Platform } from 'react-native';
import React, {Component} from 'react';
import * as Colors from './Colors'
import { Fonts } from '../constants/Fonts'
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ratioX = screenWidth / 450;
const ratioY = screenHeight / 896;

export var screen_width = screenWidth
export var screen_height = screenHeight
export var metrics = ratioX

export default {
    mgLogo : {
        width : '80%',
        height : 150 * metrics, 
        resizeMode :'stretch', 
        alignSelf : 'center',
    },
    other_logo : {
        width : 100 * metrics,
        height : 100 * metrics,
        resizeMode :'stretch', 
        alignSelf : 'center',
    },
    mgSmall : {
        marginTop : 40 * metrics
    },
    mgMid : {
        marginTop : 70 * metrics
    },
    mgHuge : {
        marginTop : 110 * metrics
    },
    //splash
    spButton1 : {
        width : '80%' ,
        height : 55 * metrics , 
        backgroundColor : Colors.main_blue_color,
        alignSelf : 'center',
        borderRadius : 50,
        borderWidth : 2,
        borderColor : Colors.white_color,
        justifyContent:'center'
    },
    spButton1Label : {
        color : Colors.white_color,
        fontSize : 23 * metrics,
        alignSelf : 'center',
        fontFamily : Fonts.adobe_clean
    },
    spButton2Label : {
        color : Colors.main_color,
        fontSize : 23 * metrics,
        alignSelf : 'center',
        fontFamily : Fonts.adobe_clean
    },
    spButton2 : {
        width : '80%' ,
        height : 55 * metrics , 
        backgroundColor : Colors.white_color,
        borderRadius : 50,
        alignSelf : 'center',
        justifyContent:'center'
    },
    spHint : {
        alignSelf : 'center',
        marginBottom : 80 * metrics,
        fontSize : 21 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.white_color 
    },
    spHint1 : {
        alignSelf : 'center',
        marginBottom : 35 * metrics,
        fontSize : 21 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_color 
    },
    lgLogo : {
        width : '60%' , 
        height : 80 * metrics , 
        resizeMode : 'stretch' , 
        alignSelf : 'center'
    },
    text_input : {
        fontSize : 18 * metrics,
        fontFamily : Fonts.adobe_clean,
        minHeight : 50 * metrics,
        width : '100%',
        borderBottomWidth : 1,
        borderColor : Colors.gray_color,
        flexDirection : 'row'
    },
    text_input_active : {
        fontSize : 18 * metrics,
        fontFamily : Fonts.adobe_clean,
        minHeight : 50 * metrics,
        width : '100%',
        borderBottomWidth : 1,
        borderColor : Colors.main_color,
        flexDirection : 'row'
    },
    bottom_btn : {
        width : '100%',
        height : 50 * metrics,
        backgroundColor : Colors.disable_btn_color,
        justifyContent : 'center',
        borderRadius : 5 
    },
    bottom_active_btn : {
        width : '100%',
        height : 50 * metrics,
        backgroundColor : Colors.main_color,
        justifyContent : 'center',
        borderRadius : 5 
    },
    bottom_submit_btn : {
        width : '100%',
        height : 55 * metrics,
        backgroundColor : Colors.disable_btn_color,
        justifyContent : 'center',
        borderRadius : 30 
    },
    bottom_active_submit_btn : {
        width : '100%',
        height : 55 * metrics,
        backgroundColor : Colors.main_color,
        justifyContent : 'center',
        borderRadius : 30 
    },
    bottom_button_body : {
        flex : 0.15, width : '85%' , alignSelf : 'center', justifyContent : 'center'
    },
    btn_body : {
        width : '80%',
        height : '100%',
        alignSelf : 'center',
        flexDirection : 'row'
    },
    left_text : {
        fontSize : 18 * metrics, 
        fontFamily : Fonts.adobe_clean,
        color : Colors.white_color , 
        alignSelf : 'center' , 
        fontWeight : '500', 
        flex : 0.9
    },
    right_icon : {
        color : Colors.white_color, 
        alignSelf : 'center', 
        flex : 0.1
    },
    left_arrow : {
        color : Colors.main_color, 
        justifyContent : 'center'
    },
    header : {
        width : '100%',
        height : 75 * metrics, 
        justifyContent : 'center',
        elevation :Platform.OS == 'android' ? 3.5 : 0.8,
        backgroundColor : Platform.OS == 'ios' ? 'transparent' : Colors.white_color
    },
    tab_header : {
        width : '100%',
        flexDirection : 'row',
        height : 80 * metrics,
        // elevation :Platform.OS == 'android' ? 3.5 : 0.8,
        backgroundColor : Colors.white_color,
    },
    tab_header2 : {
        width : '100%',
        flexDirection : 'row',
        height : 100 * metrics,
        backgroundColor : Colors.white_color,
        // elevation : Platform.OS == 'android' ? 3.5 : 0.8,
        // shadowOffset : { width : 0 , height : -20},
        // shadowOpacity : 0.5,
        // shadowRadius : 10
    },
    detail_header : {
        width : '100%',
        height : 60 * metrics, 
        justifyContent : 'center',
        elevation :Platform.OS == 'android' ? 3.5 : 0.8,
        backgroundColor : Colors.white_color
    },
    vbody : {
        flex : 0.9, 
        marginTop : 30 * metrics,
        marginLeft : 30 * metrics,
        marginRight : 30 * metrics,
        flexDirection : 'column'
    },
    accout_icon : {
        width : 40 * metrics,
        height : 48 * metrics,
        resizeMode : "stretch",
        alignSelf : 'center'
    },
    checked_icon : {
        width : 14 * metrics,
        height : 14 * metrics,
        resizeMode : "stretch"
    },
    input_body : {
        flex : 1, 
        width : '85%', 
        alignSelf : 'center',
    },
    input_title : {
        fontSize : 23 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontWeight : '500'
    },
    help_body : {
        flex : 1, 
        width : '100%', 
        alignSelf : 'center',
        marginTop : 40 * metrics
    },
    help_title : {
        fontSize : 18 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontWeight : '600',
        color : '#000',
        fontWeight : '500'
    },
    help_description : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : 'gray',
        marginTop : 20 * metrics
    },
    help_attachment : {
        flex : 0.3, 
        backgroundColor : 'white',
        elevation : 1,
        justifyContent : 'center'
    },
    company_name : {
        color : Colors.main_blue_color,
        fontSize : 20 *  metrics,
        fontFamily : Fonts.adobe_clean,
    },
    error : {
        fontSize : 15 * metrics, 
        fontFamily : Fonts.adobe_clean,
        marginTop : 5 * metrics, 
        color : 'red',
        marginLeft : 3 * metrics
    },
    no_error : {
        color : 'white'
    },
    loading_body : {
        position : 'absolute', 
        backgroundColor :'black', 
        opacity : 0.5 , 
        width : '100%' , 
        height: '110%',
        zIndex : 999,
        elevation : Platform.OS == 'android' ? 3.5 : 0.8,
        justifyContent : 'center'
    },
    black_body : {
        position : 'absolute',
        backgroundColor : Colors.dark_gray,
        width: '100%',
        height : '100%',
        elevation : Platform.OS == 'android' ? 3.5 : 0.8,
        justifyContent : 'center',
        alignItems : 'center'
    },
    card_obj : {
        width : '80%',
        minHeight : 200 * metrics,
        backgroundColor : 'white',
        alignSelf : 'center'
    },
    search_icon : {
        alignSelf : 'center'
    },
    activityIndicator : {
        alignSelf : 'center',
    },
    search_btn : {
        position : "absolute",
        width : 35 * metrics,
        height: 35 * metrics,
        right : 0,
        top : 20 * metrics,
        justifyContent : 'center'
    },
    search_move_btn : {
        position : "absolute",
        width : 35 * metrics,
        height: 35 * metrics,
        right : 0,
        top : 30 * metrics,
        
        justifyContent : 'center'
    },
    balace_body : {
        width : '100%',
        height : 200 * metrics,
        flexDirection : 'column',
        
        // borderBottomWidth : 1,
        //borderBottomColor : Colors.white_gray_color
    },
    no_balance_body : {
        width : '100%',
        height : 150 * metrics,
        flexDirection : 'column',
        alignItems : 'center',
    },
    total_balance : {
        fontSize : 30 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontWeight : '500',
        textAlign : 'center',
        marginBottom : 1 * metrics
    },
    md_title : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'center',
        marginTop : 10 * metrics
    },
    list_body : {
        flex : 1 , 
        flexDirection : 'column',
        marginBottom : 55 * metrics,
    },
    roundIcon : {
        borderRadius : 50,
        width : 35 * metrics,
        height : 35 * metrics,
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        justifyContent : 'center',
        alignSelf : 'center',
        marginBottom : 10 * metrics,
    },
    icon_style : {
        color : Colors.main_color,
        alignSelf : 'center'
    },
    opacityBg : {
        position : 'absolute', 
        width : '100%', 
        height : '100%',
        // backgroundColor :'black',
        // opacity : 0.8
    },
    modal_bg : {
        position : 'absolute', 
        width : '100%', 
        height : '100%',
        backgroundColor :'black',
        opacity : Platform.OS == 'android' ? 0.95 : 0.95
    },
    p_balance : {
        fontSize : 16 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'right',
        color : 'green'
    },
    m_balance : {
        fontSize : 16 * metrics,
        fontFamily : Fonts.adobe_clean,
        textAlign : 'right',
        color : Colors.main_color
    },
    btn_text: {
        textAlign : 'center' , 
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
    },
    selector_normal : {
        borderBottomWidth : 1, 
        borderBottomColor : Colors.gray_color,
        minHeight : 55 * metrics,
        paddingBottom : Platform.OS == 'android' ? 0 * metrics : 10 * metrics
    } ,
    selector_main : {
        //minHeight : Platform.OS == 'ios' && 70 * metrics,
        // justifyContent : 'center',
        borderBottomWidth : 1, borderBottomColor : Colors.main_color,
        minHeight : 55 * metrics,
        paddingBottom : Platform.OS == 'android' ? 0 * metrics : 10 * metrics
    },
    textarea : {
        textAlignVertical: 'top',  // hack android
        height: 200 * ratioX,
        fontSize: 14 * ratioX,
        color: '#333',
        borderWidth : 1,
        borderColor : '#eae5e5',
        borderRadius: 15,
        padding : 15 * metrics,
        marginTop : 10,
        backgroundColor : '#f1f6f9'
    },
    save_button : {
        width : 120 * metrics,
        height : 45 * metrics,
        backgroundColor : Colors.main_color,
        borderRadius : 5 * metrics,
        justifyContent : 'center'
    },
    cancel_button : {
        width : 120 * metrics,
        height : 45 * metrics,
        backgroundColor : Colors.dark_gray,
        borderRadius : 5 * metrics,
        justifyContent : 'center'
    },
    rn_selector : {
        minHeight : 60 * metrics,
        backgroundColor : 'red',
        width : '10%'
    },
    loading_text : {
        fontFamily : Fonts.adobe_clean, 
        fontSize : 20 * metrics, 
        color : 'white', 
        textAlign : 'center', 
        zIndex : 999 ,
        marginTop : 15 * metrics
    }
}