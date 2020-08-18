/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, SafeAreaView , Image ,TextInput, TouchableOpacity} from 'react-native'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import global_style, {metrics} from '../constants/GlobalStyle'
import FeatherIcon from 'react-native-vector-icons/Feather'
import {Fonts} from '../constants/Fonts'
export default class TextComponent extends Component {
    
    state = {
        showPassword : false,
        value : '',
    }

    constructor (props) {
        super(props)

        this.inputRef = null
    }

    onChangeText = (val) => {
        this.setState({value : val})
        this.props.onChangeText(val)
    }
    onChangeBackSpace () {
    }
    render() {
        return (
            <View style={{width : '100%', marginTop : 15 * metrics}}>
                {
                    this.props.textValue != '' &&
                    <Text style={{marginBottom : -5 ,fontFamily : Fonts.adobe_clean, fontSize : 14 *  metrics , color : Colors.gray_color, marginLeft : 4 * metrics}}>{this.props.textPlaceHolder}</Text> 
                }
                <View style={{flexDirection : 'row'}}>
                    <TextInput 
                        onKeyPress={({ nativeEvent }) => {
                            if(nativeEvent.key === 'Backspace'){
                                this.onChangeBackSpace()
                                if (this.props.textPlaceHolder == 'Sort Code') {
                                    this.props.onChangeText(this.state.value)
                                }
                            }
                        }}
                        ref={ this.inputRef}
                        underlineColorAndroid = "transparent"
                        autoCapitalize="none"
                        placeholder = {this.props.textPlaceHolder}
                        placeholderTextColor = {Colors.gray_color}
                        autoCapitalize = {this.props.textPlaceHolder == 'Middle Name' || this.props.textPlaceHolder == 'First Name' || this.props.textPlaceHolder == 'Last Name' ? 'sentences' : 'none'}
                        value={this.props.textValue.toString()}
                        keyboardType={this.props.textType == 'number' ? 'numeric' : ''}
                        multiline = {this.props.multiple ? true : false}
                        maxLength={this.props.textPlaceHolder == "Transaction Reference" ? 18 : 300}
                        secureTextEntry={this.props.textType == 'text' || this.props.textType == 'number' || this.state.showPassword ? false : true}
                        onChangeText={(text) => this.onChangeText(text)}
                        style={this.props.ready ? global_style.text_input_active : global_style.text_input}
                    />
                    {
                        this.props.textType == 'password' && (this.props.textPlaceHolder != 'Old Password' && this.props.textPlaceHolder != 'New Password' && this.props.textPlaceHolder != 'Confirm Password') && 
                        <TouchableOpacity style={styles.eye} onPress={() => {
                            this.setState({showPassword : !this.state.showPassword})
                        }}>
                            {
                                !this.state.showPassword ? 
                                <FeatherIcon name="eye" size={23 * metrics} color={Colors.gray_color}></FeatherIcon>
                                :
                                <FeatherIcon name="eye-off" size={23 * metrics} color={Colors.gray_color}></FeatherIcon>
                            }
                            
                        </TouchableOpacity>
                    }
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
    fontSize : 24 * metrics,
    fontFamily : Fonts.adobe_clean,
    fontWeight : '500'
  },
  eye : {
    marginLeft : -20,
    alignSelf : 'center',
  }
});

TextComponent.propType = {
	textPlaceHolder: PropTypes.string,
    textTitle: PropTypes.string,
    textValue : PropTypes.string,
    textType : PropTypes.string,
    multiple : PropTypes.bool,
    ready : PropTypes.bool,
    textStyle : PropTypes.string,
    onChnageText : PropTypes.func,
    textBackButton : PropTypes.func
}