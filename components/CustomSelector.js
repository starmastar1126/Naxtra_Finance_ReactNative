/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import { RadioButton } from 'react-native-paper'
import * as Colors from '../constants/Colors'
import global_style, {metrics} from '../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../constants/Fonts'
export default class CustomSelector extends Component {
    state = {
        checked : true
    }
    render() {
        return (
            <View style={styles.body}>
                <View style={{flex : 0.15, justifyContent : 'center'}}>
                    <RadioButton
                        value="first"
                        status={this.props.activeIdx == 1 ? 'checked' : 'unchecked'}
                        color={Colors.main_color}
                        onPress={() => this.props.activeButton(this.props.index)}
                    />
                </View>
                <View style={{flex : 0.85}}>
                    <Text style={global_style.company_name}>{this.props.textName}</Text>
                    <View style={{flexDirection : 'row', marginTop : 3 * metrics}}>
                        <Text style={{marginRight : 10 * metrics , fontSize :15 * metrics,fontFamily : Fonts.adobe_clean, color : 'black'}}>{this.props.textNumber}</Text>
                        <Text style={{color : Colors.gray_color , fontSize : 13 * metrics,fontFamily : Fonts.adobe_clean, marginTop : 2}}>{this.props.textDate}</Text>
                    </View>
                    <Text style={{marginTop : 3 * metrics, marginBottom : 5 * metrics}}>{this.props.textDescription}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  body : {
    width : '100%',
    borderBottomColor : Colors.white_gray_color,
    borderBottomWidth : 1,
    flexDirection : 'row',
  }
});

CustomSelector.propType = {
    index : PropTypes.number,
    textName: PropTypes.string,
    textDate: PropTypes.string,
    textNumber: PropTypes.string,
    textDescription: PropTypes.string,
    activeIdx : PropTypes.number,
    goBack : PropTypes.func,
    activeButton : PropTypes.func
}