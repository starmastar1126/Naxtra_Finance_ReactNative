/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , ActivityIndicator ,TouchableOpacity, BackHandler, ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import TextComponent from '../../components/TextComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Fonts} from '../../constants/Fonts'
import CardService from '../../service/CardService'
import { alertMessage } from '../../utils/utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class RequestDebitCardScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        amount : '',
        message : '',
        isReady : false,
        pay_type : '',
        card_arr : [
            {
                img : Images.sliver_card,
                card_name : 'Silver Debit Card'
            },
            {
                img : Images.platium_card,
                card_name : 'Platinum Debit Card'
            },
            {
                img : Images.platium_sliver_card,
                card_name : 'Platinum Silver Debit Card'
            },
            {
                img : Images.gold_card,
                card_name : 'Gold Silver Debit Card'
            },
            {
                img : Images.star_card,
                card_name : 'All Star Debit Card'
            },
        ],
        firstname : global.user_info.first_name,
        lastname : global.user_info.last_name,
        card_type : global.card_type,
        monthly_limit : '',
        transaction_limit : '',
        address_region : 'England',
        address_iso_country : 'GBR',
        address_number : global.user_info.house_no,
        address_postal_code  :global.user_info.post_code,
        address_refinement : 'First Floor',
        address_street : global.user_info.street_name,
        address_city : global.user_info.city,
        isReady : false,
        isLoading : false
    }
    selectCard = (item) => {
        global.item = item
        this.props.navigation.navigate('CardDetailScreen')
    }
    goBack () {
        this.props.navigation.navigate('TabScreen')
    }
    checkReady () {
        if (this.state.firstname != '' && this.state.last_name != '' && this.state.address_region != '' && this.state.address_iso_country != '' && this.state.address_number != '' && this.state.address_postal_code != '' && this.state.address_street != '' && this.state.address_city != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    componentDidMount () {
        this.checkReady()
    } 
    createCard () {
        if (!this.state.isReady)
            return

        var obj = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            employee_id: global.user_info.id,
            card_type: this.state.card_type,
            monthly_limit: this.state.monthly_limit,
            transaction_limit:  this.state.transaction_limit,
            address_region: this.state.address_region,
            address_iso_country: this.state.address_iso_country,
            address_number: this.state.address_number,
            address_postal_code: this.state.address_postal_code,
            address_refinement: this.state.address_refinement,
            address_street: this.state.address_street,
            address_city: this.state.address_city,
        }
        this.setState({isLoading : true})
        CardService.addCard(obj , global.token).then(res => {
            var data = res.data.result
            console.log('datas = ' , data)
            if (data.success) {
                this.props.navigation.navigate('TabScreen', {refresh : true})
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
        })
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                    <View style={styles.container}>
                        <DetailHeaderComponent navigation={this.props.navigation}  title="Create Card"  goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                        <View style={styles.body}>
                            <View style={{flex: 0.05}}></View>
                            <View style={{flex: 0.7, flexDirection : 'column'}}>
                                <ScrollView style={{flex : 1}}>
                                    <View style={{width : '80%', height : '100%' , alignSelf : 'center'}}>
                                        <TextComponent
                                            textPlaceHolder = "First Name"
                                            textValue={this.state.firstname}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({firstname : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "Last Name"
                                            textValue={this.state.lastname}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({lastname : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "Monthly Limit"
                                            textValue={this.state.monthly_limit}
                                            textType="number"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({monthly_limit : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "Transaction Limit"
                                            textValue={this.state.transaction_limit}
                                            textType="number"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({transaction_limit : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "Address Region"
                                            textValue={this.state.address_region}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({address_region : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "House Number"
                                            textValue={this.state.address_number}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({address_number : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "Post Code"
                                            textValue={this.state.address_postal_code}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({address_postal_code : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        {/* <TextComponent
                                            textPlaceHolder = "Refinement"
                                            textValue={this.state.address_refinement}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({address_refinement : value},() => {this.checkReady()})}
                                        > </TextComponent> */}
                                        <TextComponent
                                            textPlaceHolder = "Street"
                                            textValue={this.state.address_street}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({address_street : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                        <TextComponent
                                            textPlaceHolder = "City"
                                            textValue={this.state.address_city}
                                            textType="text"
                                            ready ={ this.state.isReady}
                                            onChangeText = {(value) => this.setState({address_city : value},() => {this.checkReady()})}
                                        > </TextComponent>
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={{flex : 0.25, width : '85%', justifyContent :'center', alignSelf : 'center'}}>
                                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.createCard()}>
                                    <View style={global_style.btn_body}>
                                        <Text style={global_style.left_text}>Create Card</Text>
                                        <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
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
                </KeyboardAwareScrollView>
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
        flex : 0.5, 
        backgroundColor : 'white', 
        elevation : 3.5,
        flexDirection : 'column',
    },
    body :{
        height : '100%',
        flexDirection : 'column',
        width : '100%',
        alignSelf : 'center',
    },
    name : {
        fontSize : 16 * metrics,fontFamily : Fonts.adobe_clean,
        color : Colors.gray_color
    },
    value : {
        fontSize : 18 * metrics,fontFamily : Fonts.adobe_clean,
        color : '#000',
        marginTop : 7 * metrics
    },
    button : {
        width : '100%' , 
        height : 55 * metrics ,
        borderRadius : 7 ,
        borderWidth : 1, 
        borderColor : Colors.main_color,
        flexDirection : 'row',
        justifyContent : 'center',
    },
    card_body : {
        width : '100%', 
        height : 210 * metrics , 
        alignSelf  : 'center',
        resizeMode : 'stretch'
    },  
    title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 15 * metrics,
    },
    card_title : {
        marginLeft : 15 * metrics,
        marginTop : 10 * metrics,
        marginBottom : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontSize : 13 * metrics
    }
});