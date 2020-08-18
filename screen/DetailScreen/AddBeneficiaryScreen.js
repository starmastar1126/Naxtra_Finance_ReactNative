
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet,Text, View , Image ,TouchableOpacity,ActivityIndicator,Picker} from 'react-native'
import * as Colors from '../../constants/Colors'
import DetailHeaderComponent from '../../components/DetailHeaderComponent'
import TextComponent from '../../components/TextComponent'
import { RadioButton } from 'react-native-paper'
import global_style, { metrics } from '../../constants/GlobalStyle'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckBox } from 'react-native-elements'
import TransactionService from '../../service/TransactionService'
import { alertMessage } from '../../utils/utils';
import { Fonts } from '../../constants/Fonts';
import CrmService from '../../service/CrmService';

export default class AddBeneficiaryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        isLoading : false,
        name : '',
        account_number : '',
        sort_code : '',
        show_sort_code : 'XX-XX-XX',
        isReady : false,
        pay_type : '',
        activeIdx : -1,
        check_coustomers : false,
        check_supplier : false,
        customer_list : [],
        customer_id : '',
        show_customer : false,
        is_error_account_number : false,
        is_error_sort_code : false,
        is_back_sort : false
    }
    // constructor(props) {
    //     super(props);
    //     this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    // }
    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }
    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    // }

    // handleBackButtonClick = () => {
    //     this.props.navigation.goBack()
    // }

    componentDidMount () {
        console.log(global.bank_name)
        if (global.bank_name != undefined && global.bank_name != '') {
            this.setState({name : global.bank_name})
        }
        CrmService.getCustomerList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({customer_list : data.response.records})
            } else {
                this.setState({customer_list : []})
            }
        }).catch(error => {
            console.log(error.message)
        })
    }

    selectType = (value) => {
        this.setState({pay_type : value})
    }

    checkReady = () => {
        console.log(this.state.sort_code)
        if (this.state.name != '' && this.state.sort_code != '' && this.state.account_number != '' && this.state.account_number.length == 8 && this.state.sort_code.length == 8) {
            this.setState({isReady : true})
        } else {

            this.setState({isReady : false})
        }
    }

    add = () => {
        if (!this.state.isReady) {
            return
        }
        if (global.user_info == '') {
            return
        }

        var sort_arr = this.state.sort_code.split('-')
        var res_sort_code = ''
        for (var i = 0 ; i < sort_arr.length ; i ++) {
            res_sort_code = res_sort_code + sort_arr[i]
        }

        var obj = {
            name : this.state.name,
            sort_code : res_sort_code,
            account_number : this.state.account_number,
            email : global.user_info.email,
            nick_name : global.user_info.first_name,
            telephone :global.user_info.phone,
            type : global.user_info.account_type,
            //token : global.token
        } 
        console.log('obj = ' , obj)
        this.setState({isLoading : true})
        TransactionService.addBeneficiary(obj, global.token).then(res => {
            var data = res.data.result
            if (typeof(data) == 'undefined') {
                alertMessage('You must enter correct informations.')
            } else {
                if (data.success) {
                    global.verify_type = "add_beneficiary"
                    global.beneficiary_id = data.response.beneficiary_id
                    this.props.navigation.navigate('VerfiyNumberScreen')
                } else {
                    alertMessage(data.message)
                }
            }
            
            this.setState({isLoading : false})
        }).catch(error => {
            alertMessage(error.message)
            this.setState({isLoading : false})
        })
    }

    onChangeCustomer () {
        if (!this.state.check_coustomers) {
            this.setState({check_coustomers : true}, () => this.checkCustomer())
        } else {
            this.setState({check_coustomers : false}, () => this.checkCustomer())
        }
    }

    onChangeSupplier () {
        if (!this.state.check_supplier) {
            this.setState({check_supplier : true}, () => this.checkCustomer())
        } else {
            this.setState({check_supplier : false}, () => this.checkCustomer())
        }
    }
    checkCustomer () {
        if (!this.state.check_coustomers && !this.state.check_supplier) {
            this.setState({show_customer : false})
        } else {
            this.setState({show_customer : true})
        }
    }

    setSortCode (text) {
        if (text.length > 8) {
            return
        }
        if (text.length == 2) {
            text = text + '-'
        }
        if (text.length == 5) {
            text = text + '-'
        }
        this.setState({sort_code : text} , () => this.checkReady())
    }

    setAccountNumber (text) {
        if (text.length != 8) {
            this.setState({is_error_account_number : true})
        } else {
            this.setState({is_error_account_number : false})
        }
        this.setState({account_number : text} , () => this.checkReady())
    }


    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <DetailHeaderComponent navigation={this.props.navigation}  title="Add New Beneficiary" goBack ={() => {
                        this.props.navigation.goBack()
                    }}></DetailHeaderComponent>
                    <View style={{flex : 1}}>
                        <View style={global_style.mgHuge}></View>
                        <View style={{flexDirection : 'column', width : '85%', height : '100%',alignSelf : 'center'}}>
                            <View style={{height : 30 * metrics, flexDirection : 'row' }}></View>
                            <TextComponent
                                textPlaceHolder = "Name"
                                textValue={this.state.name}
                                textType="text"
                                ready = {this.state.isReady}
                                onChangeText = {(value) => this.setState({name : value},() => {this.checkReady()})}
                            > </TextComponent>
                            <TextComponent
                                textPlaceHolder = "Account Number (8 digits)"
                                textValue={this.state.account_number}
                                textType="number"
                                ready = {this.state.isReady}
                                onChangeText = {(value) => this.setAccountNumber(value)}
                            > </TextComponent>
                            <View style={{marginTop : 5 * metrics}}></View>
                            {
                                this.state.is_error_account_number &&
                                <Text style={global_style.error}>Account Number must contains 8 digits</Text>
                            }
                            <TextComponent
                                textPlaceHolder = "Sort Code (6 digits)"
                                textValue={this.state.sort_code}
                                textType="number"
                                ready = {this.state.isReady}
                                textBackButton = {(value) => this.setState({sort_code : value})}
                                onChangeText = {(value) => this.setSortCode(value)}
                            > </TextComponent>
                            
                            {/* <View style={styles.check_body}>
                                <View style={styles.check_item}>
                                    <CheckBox
                                        title='Customers'
                                        checked={this.state.check_coustomers}
                                        containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                        textStyle={!this.state.check_coustomers ? styles.check_title : styles.checked_title}
                                        checkedColor={Colors.main_color}
                                        onPress={()=> this.onChangeCustomer()}
                                    />
                                </View>
                                <View style={styles.check_item}>
                                    <CheckBox
                                        title='Suppliers'
                                        checked={this.state.check_supplier}
                                        containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                        textStyle={!this.state.check_supplier ? styles.check_title : styles.checked_title}
                                        checkedColor={Colors.main_color}
                                        onPress={()=> this.onChangeSupplier()}
                                    />
                                </View>
                            </View> */}
                            {/* {
                                this.state.show_customer && 
                                <View style={{marginTop : 30 * metrics, borderBottomWidth : 1, borderBottomColor : Colors.gray_color}}>
                                    <Text style={styles.picker_text}>Add or Select Company</Text>
                                    <Picker
                                        selectedValue={this.state.customer_id}
                                        style={{borderBottomWidth : 1}}
                                        onValueChange={(itemValue) => this.setState({customer_id : itemValue})}
                                    >
                                        {
                                            this.state.customer_list.map((item, idx) => {
                                                return (
                                                    <Picker.Item label={item.name} value={item.id}></Picker.Item>
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                            } */}
                        </View>
                        <View style={styles.bottom}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.add()}>
                                <View style={global_style.btn_body}>
                                    <Text style={global_style.left_text}>Add</Text>
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
       width : '85%',position : 'absolute' ,bottom : 15, alignSelf : 'center'
    },
    check_body : {
        marginTop : 50 * metrics,
        flexDirection : 'row'
    },
    check_item : {
        flex : 0.5,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center'
    },
    checked_title : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_color,
    }, 
    check_title : {
        fontSize : 17 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.dark_gray,
    },
    picker_text : {
        marginBottom : -5 ,fontFamily : Fonts.adobe_clean, fontSize : 14 *  metrics , color : Colors.gray_color, marginLeft : 4 * metrics
    }
});