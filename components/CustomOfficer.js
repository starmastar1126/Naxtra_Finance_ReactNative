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
import { changeDatefromServer , changeMonthfromServer} from '../utils/utils';
export default class CustomOfficer extends Component {
    state = {
        checked : true,
        birth_day : '',
        appoint_day : ''
    }
    componentDidMount () {
        if (typeof(this.props.textBirth) == 'undefined' || this.props.textBirth == '') {
            this.setState({birth_day : ''})
        } else {
            this.setState({birth_day : changeMonthfromServer(this.props.textBirth.month) + ' ' + this.props.textBirth.year})
        }

        if (typeof(this.props.textAppoint) == 'undefined' || this.props.textAppoint == '') {
            this.setState({appoint_day : ''})
        } else {
            this.setState({appoint_day : this.props.textAppoint})
        }
    }
    render() {
        return (
            <View style={styles.body}>
                <View style={{flex : 0.15, justifyContent : 'flex-start'}}>
                    <RadioButton
                        value="first"
                        status={this.props.activeIdx == 1 ? 'checked' : 'unchecked'}
                        color={Colors.main_color}
                        onPress= {() => this.props.activeButton(this.props.index)}
                    />
                </View>
                <View style={{flex : 0.85}}>
                    <Text style={global_style.company_name}>{this.props.textName}</Text>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>correspondence Address</Text>
                        <Text style={styles.value}>{this.props.textAddress}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>Role</Text>
                        <Text style={styles.value}>{this.props.textRole}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>Date of Birth</Text>
                        <Text style={styles.value}>{this.state.birth_day}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>Appointed on</Text>
                        <Text style={styles.value}>{changeDatefromServer(this.state.appoint_day)}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>Nationality</Text>
                        <Text style={styles.value}>{this.props.textNation}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>Country of Residence</Text>
                        <Text style={styles.value}>{this.props.textResidence}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sub_text}>Occupation</Text>
                        <Text style={styles.value}>{this.props.textOccupation}</Text>
                    </View>
                    <Text style={{marginTop : 3 * metrics}}>{this.props.textDescription}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  body : {
    width : '100%',
    //height : 85 * metrics,
    borderBottomColor : Colors.white_gray_color,
    borderBottomWidth : 1,
    flexDirection : 'row'
  },
  item : {
    flexDirection : "column", 
    marginTop : 8 * metrics
  },
  sub_text : {
    marginLeft : 2 * metrics , 
    fontSize :13 * metrics, fontFamily : Fonts.adobe_clean,
    color : Colors.gray_color
  },
  value : {
    color : 'black' , fontSize : 15 * metrics, fontFamily : Fonts.adobe_clean,marginTop : 2
  }
});

CustomOfficer.propType = {
    index : PropTypes.number,
    textName: PropTypes.string,
    textAddress: PropTypes.string,
    textRole: PropTypes.string,
    textBirth: PropTypes.string,
    textAppoint : PropTypes.string,
    textNation : PropTypes.string,
    textResidence : PropTypes.string,
    textOccupation : PropTypes.string,
    activeIdx : PropTypes.number,
    goBack : PropTypes.func,
    activeButton : PropTypes.func
}