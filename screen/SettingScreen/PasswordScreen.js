/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , ActivityIndicator ,TouchableOpacity,AsyncStorage} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as ErrorMessage from '../../constants/ErrorMessage'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import TextComponent from '../../components/TextComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../../constants/Fonts'
import UserService from '../../service/UserService'
import { alertMessage } from '../../utils/utils'


export default class PasswordScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        old_password : '',
        new_password : '',
        confirm_password : '',
        isReady : false,
        valid_old_password : true,
        valid_new_password : true,
        valid_confirm_password : true,
        valid_compare : true,
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

    errorMessage (value) {
        switch(value) {
            case 'old' :
                if (this.state.old_password.length > 5 ) 
                    this.setState({valid_old_password : true}, () => {this.setReady()})
                else
                    this.setState({valid_old_password : false}, () => {this.setReady()}) 
                break
            case 'new' : 
                if (this.state.new_password.length > 5 ) {
                    this.setState({valid_new_password : true}, () => {this.setReady()})
                    if (this.state.new_password != this.state.confirm_password) {
                        this.setState({valid_compare : false}, () => {this.setReady()})
                    } else {
                        this.setState({valid_compare : true}, () => {this.setReady()})
                    }
                }
                else
                    this.setState({valid_new_password : false}, () => {this.setReady()})
                break
            case 'confirm' : 
                if (this.state.confirm_password.length > 5 ) {
                    this.setState({valid_confirm_password : true}, () => {this.setReady()})
                    if (this.state.new_password != this.state.confirm_password) {
                        this.setState({valid_compare : false}, () => {this.setReady()})
                    } else {
                        this.setState({valid_compare : true}, () => {this.setReady()})
                    }
                }
                else
                    this.setState({valid_confirm_password : false}, () => {this.setReady()})
                break
        }
    }

    checkReady = (value) => {
        this.errorMessage(value)
    }

    setReady = () => {
        if (this.state.old_password.length > 5 && this.state.confirm_password.length > 5 && this.state.new_password.length > 5 && this.state.new_password == this.state.confirm_password && this.state.valid_old_password && this.state.valid_new_password && this.state.valid_confirm_password && this.state.valid_compare) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    async setLocalStorage () {
        var userinfo = JSON.parse(await AsyncStorage.getItem('finger_user'))
        userinfo.password = global.user_info.password
        await AsyncStorage.setItem('finger_user', JSON.stringify(userinfo))
    }
    changePassword = () => {
        if (!this.state.isReady) return
        var obj = {
            login : global.user_info.email,
            old_passwd : this.state.old_password,
            new_passwd : this.state.new_password
        }
        this.setState({isLoading : true})
        UserService.resetPassword(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                global.user_info.password = obj.new_passwd
                this.setLocalStorage()
                alertMessage('Update new password successfully.')
                this.setState({
                    old_password : '',
                    new_password : '',
                    confirm_password : '',
                    isReady : false
                })
            } else {
                alertMessage (data.message)
            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{flex : 1}}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Change Password" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <View style={{flex : 1}}>
                        <View style={{flex : 0.1}}>
                            
                        </View>
                        <View style={{flex : 0.1 , width : '85%' ,flexDirection : 'column', alignSelf : 'center'}}>
                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 25 * metrics , color : '#000', fontWeight : '500'}}>Change Password</Text>
                        </View>
                        <View style={{flex : 0.6, flexDirection : 'column', width : '85%' ,alignSelf : 'center'}}>

                            <TextComponent
                                textPlaceHolder = "Old Password"
                                textValue={this.state.old_password}
                                textType="password"
                                ready = {this.state.isReady}
                                onChangeText = {(value) => this.setState({old_password : value},() => {this.checkReady('old')})}
                            > </TextComponent>
                            {
                                !this.state.valid_old_password &&
                                <Text style={global_style.error}>{ErrorMessage.error_password_max_length}</Text>
                            }
                            <TextComponent
                                textPlaceHolder = "New Password"
                                textValue={this.state.new_password}
                                textType="password"
                                ready = {this.state.isReady}
                                onChangeText = {(value) => this.setState({new_password : value},() => {this.checkReady('new')})}
                            > </TextComponent>
                            {
                                !this.state.valid_new_password &&
                                <Text style={global_style.error}>{ErrorMessage.error_password_max_length}</Text>
                            }
                            <TextComponent
                                textPlaceHolder = "Confirm Password"
                                textValue={this.state.confirm_password}
                                textType="password"
                                ready = {this.state.isReady}
                                onChangeText = {(value) => this.setState({confirm_password : value},() => {this.checkReady('confirm')})}
                            > </TextComponent>
                            {
                                !this.state.valid_confirm_password &&
                                <Text style={global_style.error}>{ErrorMessage.error_password_max_length}</Text>
                            }
                            {
                                !this.state.valid_compare && this.state.valid_confirm_password &&
                                <Text style={global_style.error}>{ErrorMessage.mismatch_password}</Text>
                            }
                        </View>
                        <View style={styles.bottom}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.changePassword()}>
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