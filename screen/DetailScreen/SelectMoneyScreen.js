/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View  ,TouchableOpacity,ScrollView, ActivityIndicator ,BackHandler} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fonts } from '../../constants/Fonts';
import { CreditCardInput , LiteCreditCardInput} from 'react-native-credit-card-input'

export default class AddMoneyScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        isShowCardInput : false,
        card_info : null,
    }

    onChange (form) {
        this.setState({card_info : form})
    }
    onPayType (type) {
        if (type == 0) { //create card
            global.pay_type = 0
            this.setState({isShowCardInput : !this.state.isShowCardInput})
        } else if (type == 1 ) { // banking
            global.pay_type = 1
            this.setState({isShowCardInput : false})
            this.props.navigation.navigate('AddMoneyScreen', {refresh : true})
        } else if (type == 2) { //paypal
            global.pay_type = 2
            this.setState({isShowCardInput : false})
            this.props.navigation.navigate('AddMoneyScreen', {refresh : true})
        }   
        
    }
    onEnter () {
        if (this.state.card_info.valid) {
            global.card_number = this.state.card_info.values.number
            global.expiry = this.state.card_info.values.expiry
            global.cvc = this.state.card_info.values.cvc

            this.setState({isShowCardInput : false})
            this.props.navigation.navigate('AddMoneyScreen', {refresh : true})
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Select Payment Method"  goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                    <ScrollView style={{width : '100%' , height : '100%'}}>
                        <View style={styles.header}>
                            <Text>Select one of the payment methods</Text>
                        </View>
                        <View style={styles.body}>
                            <View style={styles.item_body}>
                                <View style={{marginTop : 20 * metrics}}></View>
                                <TouchableOpacity style={styles.item} onPress={() => this.onPayType(0)}>
                                    <MaterialCommunityIcons name="credit-card" size={35 * metrics} style={{flex : 0.1, alignSelf : 'center'}} color="#8200d3"></MaterialCommunityIcons>
                                    <View style={{flex : 0.8 , flexDirection : 'column', marginLeft : 10 * metrics, justifyContent : 'center'}}>
                                        <Text style={styles.title}>Credit Card</Text>
                                        <Text style={styles.des}>Pay with MasterCard.Visa or Visa Electron</Text>
                                    </View>
                                    <View style={{flex : 0.1, justifyContent : 'center', alignItems : 'flex-end'}}>
                                        <MaterialIcons name="keyboard-arrow-right" size={30 * metrics} style={{color: Colors.gray_color}}></MaterialIcons>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.item}  onPress={() => this.onPayType(1)}>
                                    <MaterialCommunityIcons name="bank" size={35 * metrics} style={{flex : 0.1, alignSelf : 'center'}} color="#00a7d9"></MaterialCommunityIcons>
                                    <View style={{flex : 0.8 , flexDirection : 'column', marginLeft : 10 * metrics, justifyContent : 'center'}}>
                                        <Text style={styles.title}>Internet Banking</Text>
                                        <Text style={styles.des}>Pay directly from your bank account</Text>
                                    </View>
                                    <View style={{flex : 0.1, justifyContent : 'center', alignItems : 'flex-end'}}>
                                        <MaterialIcons name="keyboard-arrow-right" size={30 * metrics} style={{color: Colors.gray_color}}></MaterialIcons>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.item}  onPress={() => this.onPayType(2)}>
                                    <MaterialCommunityIcons name="paypal" size={35 * metrics} style={{flex : 0.1, alignSelf : 'center'}} color="#00186a"></MaterialCommunityIcons>
                                    <View style={{flex : 0.8 , flexDirection : 'column', marginLeft : 10 * metrics, justifyContent : 'center'}}>
                                        <Text style={styles.title}>Paypal</Text>
                                        <Text style={styles.des}>Faster & selfer way to send money</Text>
                                    </View>
                                    <View style={{flex : 0.1, justifyContent : 'center', alignItems : 'flex-end'}}>
                                        <MaterialIcons name="keyboard-arrow-right" size={30 * metrics} style={{color: Colors.gray_color}}></MaterialIcons>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                        {
                            this.state.isShowCardInput &&
                            <View style={{marginTop : 40 * metrics, width : '90%', alignSelf : 'center'}}>
                                <CreditCardInput onChange={(form) => this.onChange(form)}></CreditCardInput>
                                <View style={{marginTop : 20 * metrics}}></View>
                                <TouchableOpacity style={styles.button} onPress={() => this.onEnter()}>
                                    <Text style={styles.button_txt}>OK</Text>
                                </TouchableOpacity>
                                <View style={{marginTop : 20 * metrics}}></View>
                            </View>
                        }
                    </ScrollView>
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
        backgroundColor : Colors.white_color
    },
    header : {
        width : '80%',
        flexDirection : 'column', 
        marginTop : 30 * metrics,
        alignSelf : 'center',
        marginBottom : 60 * metrics
    },
    body : {
        width : '100%',
        backgroundColor : 'white',
        // height : 450 * metrics,
        paddingBottom : 30 * metrics,
        flexDirection : 'column'
    },
    item_body : {
        width : '85%',
        alignSelf : 'center',
    },
    item : {
        flexDirection : 'row', 
        height : 50 * metrics,
        justifyContent : 'center',
        marginTop : 25 * metrics
    },
    title : {
        fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean
    },
    des : {
        fontSize : 14 * metrics, color : Colors.gray_color,fontFamily : Fonts.adobe_clean
    },
    button : {
        width :'85%',
        height : 55 * metrics,
        alignSelf : 'center',
        borderRadius : 15 * metrics,
        backgroundColor : Colors.main_color,
        justifyContent : 'center'
    },
    button_txt : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : 'white',
        alignSelf : 'center'
    }
});