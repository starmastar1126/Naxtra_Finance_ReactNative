/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View, TouchableOpacity , Image ,TextInput} from 'react-native'
import global_style, { metrics } from '../constants/GlobalStyle'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Colors from '../constants/Colors'
import * as Images from '../constants/Image'
import PropTypes from 'prop-types'
import { BorderlessButton } from 'react-native-gesture-handler';
import {Fonts} from '../constants/Fonts'
import { CheckBox } from 'react-native-elements'

export default class CRMHeaderComponent extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    constructor (props) {
        super(props)
        this.state = {
            check_supplier : false,
            check_customer : false,
            check_beneficiay : false,
            show_checkbox : true,
            header_title : 'CRM'
        }
    }

    onChangeSupplier () {
        this.setState({check_supplier : !this.state.check_supplier, check_customer : false, check_beneficiay : false}, () => {
            if (this.state.check_supplier) {
                this.props.checkSupplier(true)
            } else {
                this.props.checkSupplier(false)
            }
        })
    }
    onChangeCustomer () {
        this.setState({check_customer : !this.state.check_customer, check_supplier : false, check_beneficiay : false}, () => {
            if (this.state.check_customer) {
                this.props.checkCustomer(true)
            } else {
                this.props.checkCustomer(false)
            }
        })
    }
    onChangeBeneficairy () {
        this.setState({check_beneficiay : !this.state.check_beneficiay, check_customer : false, check_supplier : false}, () => {
            if (this.state.check_beneficiay) {
                this.props.checkBeneficiary(true)
            } else {
                this.props.checkBeneficiary(false)   
            }
        })
    }

    onChangeState (idx) {
        
    }

    componentDidMount () {
        if (this.props.type == 0) { //list
            this.setState({
                header_title : 'CRM',
                show_checkbox : true
            })
        } else if (this.props.type == 1){ //create
            this.setState({
                header_title : 'Customer',
                show_checkbox : false
            })
        } else if (this.props.type == 2) {
            this.setState({
                header_title : 'Activity',
                show_checkbox : false
            })
        } else if (this.props.type == 3) {
            this.setState({
                header_title : 'CRM',
                show_checkbox : false
            })
        }
    }
    render() {
        return (
            <View style={styles.header_container}>
                <View style={styles.back}>
                    <BorderlessButton  onPress={() => this.props.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={32 * metrics} style={[global_style.left_arrow, {color : Colors.main_color}]} ></MaterialCommunityIcons>
                    </BorderlessButton>
                </View>
                {
                    this.state.show_checkbox ?
                    <View style={styles.back_title}>
                        <Text style={styles.back_text}>{this.state.header_title}</Text>
                    </View>
                    :
                    <View style={{flex : 0.4,justifyContent : 'center'}}>
                        <Text style={styles.back_text}>{this.state.header_title}</Text>
                    </View>
                }
                
                {
                    this.state.show_checkbox ? 
                    <View style={styles.check_box}>
                        <View style={{marginBottom : 7 * metrics}}></View>
                        <TouchableOpacity style={styles.check_body} onPress={() => this.onChangeSupplier()}>
                            <CheckBox
                                title=' '
                                checked={this.state.check_supplier}
                                wrapperStyle={{width : 23 * metrics, height : 23 * metrics}}
                                containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'white'}}
                                textStyle={{color: Colors.main_color}}
                                checkedColor={Colors.main_color}
                                onPress={()=> this.onChangeSupplier()}
                            />
                            <Text style={this.state.check_supplier ? styles.checked_title:styles.check_title}>Suppliers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.check_body} onPress={() => this.onChangeCustomer()}>
                            <CheckBox
                                title=' '
                                checked={this.state.check_customer}
                                wrapperStyle={{width : 23 * metrics, height : 23 * metrics}}
                                containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'white'}}
                                textStyle={{color: Colors.main_color}}
                                checkedColor={Colors.main_color}
                                onPress={()=> this.onChangeCustomer()}
                            />
                            <View style={{width : '100%'}}>
                                <Text style={this.state.check_customer ? styles.checked_title:styles.check_title}>Customers</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.check_body} onPress={() => this.onChangeBeneficairy()}>
                            <CheckBox
                                title=' '
                                checked={this.state.check_beneficiay}
                                wrapperStyle={{width : 23 * metrics, height : 23 * metrics}}
                                containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'white'}}
                                textStyle={{color: Colors.main_color}}
                                checkedColor={Colors.main_color}
                                onPress={()=> this.onChangeBeneficairy()}
                            />
                            <Text style={this.state.check_beneficiay ? styles.checked_title:styles.check_title} numberOfLines={1}>Beneficiary</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{flex : 0.5}}></View>
                }
                {
                    this.props.type == 0 &&
                    <View style={{flex : 0.2, justifyContent : 'center'}}>
                        <TouchableOpacity style={styles.add_btn} onPress={() => this.props.navigation.navigate('ActiveScreen')}>
                            <Image source={Images.active_icon} style={{width:50 * metrics, height: 50 * metrics}}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.add_btn} onPress={() => {
                            global.is_edit = false
                            this.props.navigation.navigate('CreateCRMScreen')
                        }}>
                            <MaterialCommunityIcons name="plus-box" size={55 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

CRMHeaderComponent.propType = {
	title: PropTypes.string,
    goBack : PropTypes.func,
    type : PropTypes.string,
    checkSupplier : PropTypes.func,
    checkCustomer : PropTypes.func,
    checkBeneficiary : PropTypes.func
}
const styles = StyleSheet.create({
    header_container : {
        width : '100%',
        height: 130 * metrics,
        backgroundColor : 'white',
        alignSelf: 'center',
        borderBottomWidth : 1,
        borderColor : Colors.white_gray_color,
        flexDirection : 'row',
        paddingLeft : 20 * metrics,
        paddingRight : 20 * metrics
    },
    back : {
        flex : 0.1,
        justifyContent : 'center',
        alignSelf : 'center',
    },
    back_title : {
        flex : 0.2,
        justifyContent : 'center',
    },
    back_text : {
        marginLeft : 5 * metrics,
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : Colors.main_color
    },
    check_box : {
        flex : 0.7,
        flexDirection : 'column',
        justifyContent : 'center',
        marginLeft : 5 * metrics
    }, 
    check_body :{
        height : 35 * metrics,
        marginBottom : 4 * metrics,
        width : '100%',
        flexDirection : 'row',
        alignItems : 'center',
    },
    check_title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.gray_color
    },
    checked_title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.main_color,
        width : '100%',
    },
    add_btn : {
        flex : 0.5,
        justifyContent : 'center',
        alignSelf : 'center'
    }
});