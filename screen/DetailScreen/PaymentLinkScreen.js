/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {BackHandler, StyleSheet,Text, View , SafeAreaView ,TouchableOpacity,ActivityIndicator, TextInput, ScrollView} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import RNPickerSelect from 'react-native-picker-select';
import { Avatar } from 'react-native-elements'
import { alertMessage } from '../../utils/utils'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import TextComponent from '../../components/TextComponent'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TransactionService from '../../service/TransactionService';
import {Fonts} from '../../constants/Fonts'

const placeholder = {
    label : 'Select currency',
    value : null,
    color : 'gray'
}

export default class PaymentLinkScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    handleBackButtonClick = () => {
        //this.props.navigation.goBack()
    }
    state = {
        currency_arr : [
            {
                value : 0,
                label : 'GBP'
            },
            {
                value : 1,
                label : 'USD'
            },
            {
                value : 2,
                label : 'EUR'
            },
            {
                value : 3,
                label : 'RMB'
            }
        ],
        category_arr : [],
        isLoading : false,
        amount : '',
        message : '',
        isReady : false,
        pay_type : 0,
        isLoading : false,
        category_name : '',
        is_subScreen : false,
        selectCatID : -1,
        selectCatIcon : '',
        selectCatName : ''
    }

    selectType = (value) => {
        if (value == null) {
            return
        }
        this.setState({pay_type : value})
    }

    checkReady = () => {
        if (this.state.amount != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    gotoBack () {
        this.setState({
            is_subScreen : false
        })
    }


    componentDidMount () {
        this.getAllCategories()
    }

    getAllCategories() {
        this.setState({isLoading : true})
        TransactionService.getAllTransactionCategories(global.token).then(res => {
            var data = res.data.result
            console.log('data = ', data)
            if (data.success) {
                this.setState({category_arr : data.response.records})
            } else {
                this.setState({category_arr : []})
            }
            this.setState({isLoading : false})
        }).catch(error => {
            console.log('error = ' , error.message)
            this.setState({category_arr : []})  
            this.setState({isLoading : false})
        })
    }

    generateLink = () => {
        if (!this.state.isReady)
            return;
        
        var obj = {
            amount : this.state.amount,
            reference : this.state.message,
            currency: this.state.currency_arr[this.state.pay_type].label,
            name : global.user_info.first_name + ' ' + global.user_info.last_name
        }
        console.log(global.user_info.phone)
        
        this.setState({isLoading : true})
        TransactionService.paymentLink(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                global.transaction_id = data.response.transaction_id
                global.verify_type = "payment_link"
                this.props.navigation.navigate('VerfiyNumberScreen')
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }

    onSelectCategory (item) {
        this.setState({
            selectCatID : item.id,
            selectCatName : item.name,
            category_name : item.name,
            selectCatIcon : item.image_variant
        }, () => this.checkReady())
    }

    render() {
        return (
            <SafeAreaView>
                {
                    !this.state.is_subScreen &&
                    <View style={styles.container}>
                        <DetailHeaderComponent navigation={this.props.navigation}  title="Payment Link" goBack ={() => this.props.navigation.goBack()}></DetailHeaderComponent>
                        <View style={{flex : 1}}>
                            <View style={{flex : 0.2}}></View>
                            <View style={{flex : 0.6, flexDirection : 'column', width : '85%' ,alignSelf : 'center'}}>
                                <View style={styles.sel_category_body}>
                                    <View style={{flex : 0.45,justifyContent : 'center', alignItems : 'center'}}>
                                        <Text style={styles.categroy_text}>Select Category *</Text>
                                    </View>
                                    <View style={{flex : 0.1}}></View>
                                    <View style={{flex : 0.45,justifyContent : 'center', alignItems : 'center'}}>
                                        <TouchableOpacity style={styles.category_btn} onPress={() => this.setState({is_subScreen : true})}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.main_blue_color}} numberOfLines={1}>{this.state.category_name == '' ? 'Select Category' : this.state.category_name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginTop : 15 * metrics}}></View>

                                <View style={!this.state.isReady ? global_style.selector_normal : global_style.selector_main}>
                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 14 *  metrics , color : Colors.gray_color,marginTop : 10 * metrics,marginBottom : 5 * metrics}}>Currency</Text>
                                    <RNPickerSelect
                                        onValueChange={(value) => this.selectType(value)}
                                        items={this.state.currency_arr}
                                        placeholderTextColor={'#000'}
                                        placeholder = {placeholder}
                                        value={this.state.currency_arr[this.state.pay_type].value}
                                        textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                    />
                                </View>


                                <TextComponent
                                    textPlaceHolder = "Amount"
                                    textValue={this.state.amount}
                                    textType="number"
                                    ready = {this.state.isReady}
                                    onChangeText = {(value) => this.setState({amount : value},() => {this.checkReady()})}
                                > </TextComponent>
                                <TextComponent
                                    textPlaceHolder = "Message Optional"
                                    textValue={this.state.message}
                                    textType="text"
                                    ready = {this.state.isReady}
                                    onChangeText = {(value) => this.setState({message : value},() => {this.checkReady()})}
                                > </TextComponent>
                            </View>
                            <View style={styles.bottom}>
                                <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.generateLink()}>
                                    <View style={global_style.btn_body}>
                                        <Text style={global_style.left_text}>Generate Link</Text>
                                        <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                {
                    this.state.is_subScreen && 
                    <View style={styles.category_screen}>
                        <View style={styles.back_btn}>
                            <TouchableOpacity style={{marginLeft : 10 * metrics}} onPress={() => this.setState({is_subScreen : false})}>
                                <MaterialCommunityIcons name="keyboard-backspace" size={25 * metrics}></MaterialCommunityIcons>
                            </TouchableOpacity>
                            <Text style={styles.back_txt}>Is this category correct?</Text>
                        </View>
                        <View style={styles.search_body}>
                            <TextInput
                                underlineColorAndroid = "transparent"
                                autoCapitalize="none"
                                placeholder = "Search transaction category"
                                placeholderTextColor = {Colors.gray_color}
                                value={this.state.search_text}
                                onChangeText = {(text) => this.onChangeSearchText(text)}
                                style={styles.search_text}
                            />
                        </View>
                        <View style={styles.category_body}>
                            <ScrollView style={{flex : 1}}>
                                <View style={{width : '100%', height : '100%', flexWrap : 'wrap' , flexDirection : 'row'}}>
                                    {
                                        this.state.category_arr.map((item, idx) => {
                                            return(
                                                <TouchableOpacity style={styles.category_item} key={idx} onPress={() => this.onSelectCategory(item)}>
                                                    {
                                                        !item.image_variant ? 
                                                        <Avatar
                                                            rounded
                                                            overlayContainerStyle={this.state.selectCatID == item.id ? { backgroundColor: '#dfdfdf',opacity : 1 } : { backgroundColor: '#dfdfdf',opacity : 0.8 }}
                                                            size="xlarge"
                                                            source={Images.default_icon}
                                                            resizeMode={'stretch'}
                                                            containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                            style={styles.l_img}
                                                        /> :
                                                        <Avatar
                                                            rounded
                                                            overlayContainerStyle={this.state.selectCatID == item.id ? { backgroundColor: '#dfdfdf',opacity : 1 } : { backgroundColor: '#dfdfdf',opacity : 0.8 }}
                                                            size="xlarge"
                                                            source={{uri : 'data:image/png;base64,' + item.image_variant}}
                                                            resizeMode={'stretch'}
                                                            containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                            style={styles.l_img}
                                                        />
                                                    }
                                                    <Text style={this.state.selectCatID != item.id ? styles.normal_text : styles.item_text}>{item.name}</Text>
                                                </TouchableOpacity>            
                                            )
                                        })
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        <View style={styles.proceed_btn}>
                            <TouchableOpacity style={styles.proceed} onPress={() => this.gotoBack()}>
                                <Text style={{color : 'white', fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics}}>Proceed</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
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
    },
    sel_category_body : {
        marginTop : 30 * metrics, 
        width : '100%',
        flexDirection : 'row',  
        height : 40 * metrics, 
    },
    categroy_text : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean
    },
    category_btn : {
        borderWidth : 1,
        borderColor : Colors.main_blue_color,
        borderRadius : 10 * metrics,
        width : '100%',
        height : '100%',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 10 * metrics
    },
    category_screen : {
        width : '100%',
        height : '100%',
        backgroundColor : 'white',
        flexDirection : 'column'
    },
    back_btn : {
        width : '100%',
        flex : 0.1,
        flexDirection  : 'row',
        alignItems : 'center',
        //justifyContent: 'center'
    },
    back_txt : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        marginLeft : 10 * metrics
    },
    search_body : {
        width : '90%',
        height : '100%',
        alignSelf : 'center',
        flex : 0.1,
        backgroundColor : 'white'
    },
    search_text : {
        backgroundColor : 'white'
    },
    category_body : {
        width : '90%',
        height : '100%',
        alignSelf : 'center',
        flex : 0.65,
    },
    proceed_btn : {
        flex : 0.15,
        justifyContent : 'center',
    },
    category_item : {
        width : '30%', 
        margin : 5 * metrics, 
        minHeight : 150 * metrics,
        flexDirection : 'column',
        alignSelf : 'center',
    },
    l_img : {
        width : 60 * metrics,
        height : 60 * metrics,
        borderRadius : 50 ,
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
        marginTop : 10 * metrics,
        alignSelf : 'center'
    },
    icon_img : {
        width : 25 * metrics,
        height : 25 * metrics,
        borderRadius : 50 ,
        resizeMode : "stretch",
        justifyContent : 'center',
        elevation : 3.5,
        alignSelf : 'center'
    },
    item_text : {
        textAlign : 'center',
        marginTop : 10 * metrics,
        fontSize : 15 * metrics
    },
    proceed : {
        width : 150 * metrics, 
        height : 50 * metrics, 
        backgroundColor : Colors.main_color, 
        borderRadius : 7 * metrics,
        marginLeft : 15 * metrics,
        alignItems : 'center',
        justifyContent : 'center'
    },
    normal_text : {
        textAlign : 'center',
        marginTop : 10 * metrics,
        fontSize : 15 * metrics,
        color : Colors.white_gray_color
    }
});