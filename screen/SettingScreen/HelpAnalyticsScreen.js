/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, View,Text, BackHandler,AsyncStorage} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'

export default class HelpAnalyticsScreen extends Component {

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
                    <Text style={global_style.help_title}>I am unable to create Analytics</Text>
                    <Text style={global_style.help_description}>
                        There are many validations of passeages of Loerm Ipsum available.
                        There are many validations of passeages of Loerm Ipsum available.
                        There are many validations of passeages of Loerm Ipsum available.
                        There are many validations of passeages of Loerm Ipsum available.
                        There are many validations of passeages of Loerm Ipsum available.
                        There are many validations of passeages of Loerm Ipsum available.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
}