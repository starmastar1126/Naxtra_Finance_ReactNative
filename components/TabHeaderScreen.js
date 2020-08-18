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
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { TouchableOpacity ,BorderlessButton } from 'react-native-gesture-handler'
import {Fonts} from '../constants/Fonts'

export default class TabHeaderScreen extends Component {
    constructor () {
        super()
    }
    render() {
        return (
            <View style={this.props.headerTitle == 'Account' || this.props.headerTitle == 'Payments' ? global_style.tab_header : global_style.tab_header2}>
                <View style={styles.container}>
                    <BorderlessButton style={styles.icon_btn} onPress={() => this.onMenu()}>
                        <MaterialCommunityIcons name="menu" size={32 * metrics} style={styles.icon}></MaterialCommunityIcons>
                    </BorderlessButton>
                    {
                        this.props.headerTitle != 'Cards' ?
                        <View style={{flex : 0.8,justifyContent : 'center'}}>
                            <Text style={{marginLeft : 10 * metrics, fontSize : 18 * metrics, fontFamily: Fonts.adobe_clean}}>{this.props.headerTitle}</Text>
                        </View>
                        :
                        <View style={{flex : 0.65,justifyContent : 'center'}}>
                            <Text style={{marginLeft : 10 * metrics, fontSize : 18 * metrics, fontFamily: Fonts.adobe_clean}}>{this.props.headerTitle}</Text>
                        </View>
                    }
                    {/* <View style={{flex : 0.8,justifyContent : 'center'}}>
                        <Text style={{marginLeft : 10 * metrics, fontSize : 18 * metrics, fontFamily: Fonts.adobe_clean}}>{this.props.headerTitle}</Text>
                    </View> */}
                    {
                        this.props.headerTitle == 'Cards' &&
                        <BorderlessButton style={styles.icon_btn} onPress={() => this.onPlusBtn()}>
                            <SimpleLineIcons name="plus" size={26 * metrics} style={styles.icon}></SimpleLineIcons>
                        </BorderlessButton>        
                    }
                    <View style={{flex : 0.05}}></View>
                    <BorderlessButton style={styles.icon_btn} onPress={() => this.onMessage()}>
                        <Fontisto name="hipchat" size={24 * metrics} style={styles.icon}></Fontisto>
                    </BorderlessButton>    
                </View>
            </View>
        );
    }

    componentDidMount() {
    }
       
    componentWillUnmount() {
       
    }
    
    _onUnreadChange = ({ count }) => {
        
    }
    onMessage = () => {
        this.props.navigation.navigate('Chat')
        // Intercom.registerIdentifiedUser({ userId: global.user_info.email });
        // Intercom.logEvent('viewed_screen', { extra: 'metadata' });
        // Intercom.displayMessageComposer();
    }
    onMenu = () => {
        this.props.showDrawer()
    }
    onPlusBtn = () => {
        this.props.onPlusBtn()
    }
}

const styles = StyleSheet.create({
    icon_btn : {
        flex : 0.1 , 
        justifyContent : 'center'
    },
    icon : {
        alignSelf : 'center'
    },
    container : {
        height : '100%' , 
        paddingLeft : 20, 
        paddingRight : 20 , 
        width : '100%' ,
        flexDirection : 'row' ,
    }
});

TabHeaderScreen.propType = {
    headerTitle: PropTypes.string,
    showDrawer : PropTypes.func,
    onPlusBtn : PropTypes.func
}