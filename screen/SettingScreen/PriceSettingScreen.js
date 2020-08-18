/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {BackHandler, View,Text, TouchableOpacity,ActivityIndicator, StyleSheet,SafeAreaView} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import { CheckBox } from 'react-native-elements'
import {Fonts} from '../../constants/Fonts'
import { ScrollView } from 'react-native-gesture-handler';
export default class PriceSettingScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };

    state = {
        issue : '',
        isReady : false,
        isLoading : false,
        checked : false,
        title : 'Starter Package',
        description : 'This package offers FREE Banking CRM, Accounting'
    }

    checkReady = () => {
        if (this.state.issue != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    onChangeCheckbox = () => {
        this.setState({checked : !this.state.checked})
    }
    onSubmit = () => {

    }

    render() {
        return (
            <SafeAreaView>
                <View style={{width : '100%' , height : '100%'}}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="" type="price_setting" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <ScrollView style={{flex : 0.85}}>
                        <View style={{width : '90%' , alignSelf : 'center',marginTop : 80 * metrics}}>
                            <View style={styles.item}>
                                <TouchableOpacity style={{flexDirection : 'row',alignItems : 'center'}}  onPress={() => this.onChangeCheckbox()}>
                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics,marginTop : 10 * metrics}}>{this.state.title}</Text>
                                    <View style={{width : 20 * metrics, height : 20 * metrics}}>
                                        <CheckBox
                                            title=' '
                                            checked={this.state.checked}
                                            containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                            textStyle={{color: Colors.main_blue_color}}
                                            checkedColor={Colors.main_blue_color}
                                            onPress={()=> this.onChangeCheckbox()}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                                <View style={{paddingTop : 10 * metrics , flexDirection : 'column'}} >
                                    <Text style={{marginLeft : 30 * metrics, marginTop : 10 * metrics}}>{this.state.description}</Text>
                                </View>
                            </View>
                        </View>
                    
                        <View style={{width : '85%', alignSelf : 'center', marginTop : 120 * metrics}}>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, fontWeight : '600', marginLeft : 10 * metrics}}>Do you want to upgrade?</Text>
                            <View style={{marginTop : 15 * metrics}}></View>
                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray, marginLeft : 10 * metrics}}>Contact customer support to upgrade your package</Text>
                        </View>
                    </ScrollView>
                    <View style={global_style.bottom_button_body}>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('SettingScreen')}>
                            <Text style={{color : 'white',textAlign : 'center' , fontSize : 20 * metrics, fontFamily : Fonts.adobe_clean}}>Upgrade Package</Text>
                        </TouchableOpacity>
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
    item : {
        width : '90%' ,
        alignSelf : 'center', 
        height : 90 * metrics , 
        marginBottom : 20 * metrics,
        flexDirection : 'column'
    },
    button : {
        width : '75%' , 
        alignSelf : 'center' ,
        height : 55 * metrics, 
        backgroundColor : Colors.main_color, 
        borderRadius : 5 * metrics,
        justifyContent: 'center'
    }
})