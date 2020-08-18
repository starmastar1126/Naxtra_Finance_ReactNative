/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , ActivityIndicator ,TouchableOpacity, AsyncStorage} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as ErrorMessage from '../../constants/ErrorMessage'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import TextComponent from '../../components/TextComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../../constants/Fonts'
import UserService from '../../service/UserService'
import { alertMessage } from '../../utils/utils'
import CodePin from 'react-native-pin-code'


export default class ChangePinScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        isReady : false,
        new_pin_code : '',
        old_pin_code : '',
        isLoading : false
    }

    selectType = (value) => {
        
    }
    constructor(props) {
        super(props);
    }
    componentWillUnmount() {
        
    }
    componentDidMount() {
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack()
    }
    checkReady = () => {
        if (this.state.old_pin_code.length == 5 && this.state.new_pin_code.length == 5) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    changePincode = async() => {
        var login_info = JSON.parse(await AsyncStorage.getItem('finger_user'))
        if (!this.state.isReady) return
        if (login_info.pin_code != this.state.old_pin_code) {
            alertMessage('You must input correctly old pin code')
            this.setState({old_pin_code : '' , isReady : false} , () => this.old_ref.clean())
            return
        }
        login_info.pin_code = this.state.new_pin_code
        await AsyncStorage.setItem('finger_user', JSON.stringify(login_info))
        this.props.navigation.goBack()
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex : 1}}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Back" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={{flex : 1}}>
                        <View style={{flex : 0.1}}>
                            
                        </View>
                        <View style={{flex : 0.1 , width : '85%' ,flexDirection : 'column', alignSelf : 'center'}}>
                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 25 * metrics , color : '#000', fontWeight : '500'}}>Change PIN Code</Text>
                        </View>
                        <View style={{flex : 0.6, flexDirection : 'column', width : '85%' ,alignSelf : 'center'}}>
                            <CodePin
                                containerStyle ={{width : '100%', alignSelf : 'center', justifyContent : 'center', alignItems : 'center' , backgroundColor : 'transparent'}}
                                pinStyle = {{backgroundColor : 'white', borderWidth : 1, borderColor : Colors.dark_gray}}
                                keyboardType="numeric"
                                ref={ref => this.old_ref = ref}
                                number={5} // You must pass number prop, it will be used to display 4 (here) inputs
                                checkPinCode={(code, callback) =>this.setState({old_pin_code : code} , () => callback(code !== '')) }
                                success={() => this.checkReady()} // If user fill '2018', success is called
                                text="Old PIN Code" // My title
                                error="You fail" // If user fail (fill '2017' for instance)
                                autoFocusFirst={false} // disabling auto-focus
                            />
                            <CodePin
                                containerStyle ={{width : '100%', alignSelf : 'center', justifyContent : 'center', alignItems : 'center' , backgroundColor : 'transparent'}}
                                pinStyle = {{backgroundColor : 'white', borderWidth : 1, borderColor : Colors.dark_gray}}
                                keyboardType="numeric"
                                ref={ref => this.new_ref = ref}
                                number={5} // You must pass number prop, it will be used to display 4 (here) inputs
                                checkPinCode={(code, callback) =>this.setState({new_pin_code : code} , () => callback(code !== '')) }
                                success={() => this.checkReady()} // If user fill '2018', success is called
                                text="New PIN Code" // My title
                                error="You fail" // If user fail (fill '2017' for instance)
                                autoFocusFirst={false} // disabling auto-focus
                            />
                        </View>
                        <View style={styles.bottom}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.changePincode()}>
                                <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Confirm</Text>
                                    <MaterialIcon style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialIcon>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
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
    },
    bottom : {
        flex : 0.2 , width : '85%', alignSelf : 'center', justifyContent : 'center'
    }
});