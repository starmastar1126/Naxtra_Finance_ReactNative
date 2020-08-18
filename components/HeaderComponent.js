/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image ,TextInput} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import global_style, {metrics} from '../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Fonts} from '../constants/Fonts'

export default class HeaderComponent extends Component {
    render() {
        return (
            <View style={global_style.header}>
                <View style={{flex : 1 , flexDirection : 'row', marginTop : 10 * metrics , marginLeft : 20 * metrics}}>
                    <View style={{flex : 0.7,justifyContent : 'center',flexDirection : 'row'}}>
                        <View style={{flex : 0.15}}>
                            <TouchableOpacity style={{justifyContent : 'center',marginTop : 15 * metrics}} onPress={() => this.props.goBack()}>
                                <MaterialIcon name="arrow-left" size={20 * metrics} style={global_style.left_arrow}  ></MaterialIcon>
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={{ flex : 0.8, fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,marginTop : 15 * metrics , color : Colors.main_color}}>{this.props.backTitle}</Text>
                    </View>
                    <View style={{flex : 0.1}}></View>
                    <View style={{flex : 0.2 ,justifyContent : 'center'}}>
                        <Image source={Images.header_icon} style={{alignSelf : 'center'}}></Image>
                    </View>
                    <View style={{flex : 0.1}}></View>
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
  body : {
    paddingLeft : 30 * metrics,
    paddingRight : 30 * metrics,
  },
  title : {
    fontSize : 24 * metrics,fontFamily : Fonts.adobe_clean,
    fontWeight : '500'
  }
});

HeaderComponent.propType = {
	backTitle: PropTypes.string,
    goBack : PropTypes.func
}