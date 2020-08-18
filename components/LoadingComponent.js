/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View, SafeAreaView , Image ,TextInput} from 'react-native'
import * as Colors from '../constants/Colors'
import { ActivityIndicator } from 'react-native-paper';
import {Fonts} from '../constants/Fonts'
export default class LoadingComponent extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={100} color="red"></ActivityIndicator>
                {/* <Progress.CircleSnail size={100} indeterminate={true} direction="clockwise" style={styles.loading}/> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignSelf : 'center',
    },
    loading : {
        marginTop : '60%',
        color : 'red',
        backgroundColor: 'white'
    }
});