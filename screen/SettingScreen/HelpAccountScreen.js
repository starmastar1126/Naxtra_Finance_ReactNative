/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, View,Text, BackHandler,Image} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
export default class HelpAccountScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    render() {
        return (
            <SafeAreaView style={{width : '100%' , height : '100%'}}>
                <DetailHeaderComponent navigation={this.props.navigation}  title="Back" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                <View style={global_style.help_body}>
                    <Text style={global_style.help_title}>{ global.help_account.name }</Text>
                    <Text style={global_style.help_description}>
                        { global.help_account.note }
                    </Text>
                    <Image source={global.help_account.icon} style={{width : 300, height : 300}}></Image>
                </View>
            </SafeAreaView>
        );
    }
}