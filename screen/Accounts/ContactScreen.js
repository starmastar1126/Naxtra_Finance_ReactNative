import React from 'react';
import {Text, View, Button,StyleSheet, TouchableOpacity, Platform, ScrollView} from 'react-native';
import WebView from 'react-native-webview';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation'
import global_style, {metrics} from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import AccountTabHeaderScreen from '../../components/AccountTabHeaderScreen';
import { Fonts } from '../../constants/Fonts';
import { changeNumber } from '../../utils/utils';
import CRMListScreen from '../CRM/CRMListScreen'

export default class ContactScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    componentDidMount () {
        global.disable_backbtn = true
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
                <AccountTabHeaderScreen headerTitle="Accounts" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()}></AccountTabHeaderScreen>
                <View style={{flex : 1}}>
                    <CRMListScreen navigation={this.props.navigation}></CRMListScreen>
                    <View style={{marginTop : 60 * metrics}}></View>
                </View>
            </SafeAreaView>
        );
    }
}