/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity, BackHandler, ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../../constants/Fonts';

export default class ViewPicScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor (props) {
        super(props)
        this.state = {
            image : ''
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    componentDidMount () {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({image : global.picture.datas})
    }
    handleBackButtonClick = () => {
        return true
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.back_button} onPress={() => this.goBack()}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={30 * metrics}></MaterialCommunityIcons>
                    </TouchableOpacity>
                </View>
                <View style={{flex : 1}}>
                    <Image
                        source={{uri : 'data:image/png;base64,' + this.state.image}}
                        style={{width : '100%', height : '100%' ,resizeMode : 'contain'}}
                    ></Image>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        width : '100%',
        height : '100%',
        flexDirection : 'column',
        alignSelf : 'center',
        backgroundColor : Colors.white_color,
    },
    header : {
        width : '100%',
        height : 60 * metrics,
    },
    back_button : {
        justifyContent : 'center',
        marginTop : 15 * metrics,
        marginLeft : 15 * metrics
    },
});