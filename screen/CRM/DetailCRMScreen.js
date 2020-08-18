/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Dimensions,Text, Platform, TouchableOpacity, ScrollView, Image} from 'react-native'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import global_style, { metrics } from '../../constants/GlobalStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Fonts } from '../../constants/Fonts';
import { CheckBox } from 'react-native-elements'
import CRMHeaderComponent from '../../components/CRMHeaderComponent';

export default class DetailCRMScreen extends Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        crm_idx : 0,
        crm_list : [],
        detail_info : '',
        beneficiary : false
    }

    componentDidMount () {
        this.setState({crm_idx : global.crm_idx , crm_list : global.crm_list, detail_info : global.crm_list[global.crm_idx]})
        console.log('item = ' , global.crm_list[global.crm_idx])
    }

    setNextData () {
        if (this.state.crm_idx == 0) 
            return
        
        var index = this.state.crm_idx - 1
        this.setState({crm_idx : index , detail_info : global.crm_list[index]})
    }

    setBeforeData () {
        if (this.state.crm_idx + 1 == this.state.crm_list.length) {
            return
        }
        var index = this.state.crm_idx + 1
        this.setState({crm_idx : index , detail_info : global.crm_list[index]})
    }

    gotoEdit () {
        global.is_edit = true
        global.detail_info = this.state.detail_info
        this.props.navigation.navigate('CreateCRMScreen')
    }

    render() {
        //const source = {uri:'file://' + global.pdf.filePath};
        return (
            <SafeAreaView style={styles.container}>
                <CRMHeaderComponent 
                        navigation={this.props.navigation} 
                        goBack={() => this.props.navigation.goBack()} 
                        ref={(ref) => this.header_ref = ref} 
                        type={0}
                ></CRMHeaderComponent>
                <View style={styles.body}>
                    <ScrollView style={{flex : 0.85}}>
                        <View style={styles.main_body}>
                            <View style={styles.card_body}>
                                <View style={styles.icon_body}>
                                    {
                                        this.state.detail_info.company_type == 'person' ?
                                        <Image source={Images.user_icon} style={{width : 35 * metrics, height : 35 * metrics}}></Image>
                                        :
                                        <Image source={Images.company_icon} style={{width : 35 * metrics, height : 35 * metrics}}></Image>    
                                    }
                                </View>
                                <View style={styles.name_body}>
                                    <Text style={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}} numberOfLines={1}>{this.state.detail_info.name}</Text>
                                </View>
                                <View style={styles.val_body}>
                                    {
                                        Number(this.state.detail_info.total_invoiced) < 0 &&
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.red_color}}> - £{Math.abs(this.state.detail_info.total_invoiced).toFixed(2)}</Text>
                                    }
                                    {
                                        Number(this.state.detail_info.total_invoiced) == 0 &&
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.dark_gray}}>£ {Number(this.state.detail_info.total_invoiced).toFixed(2)}</Text>
                                    }
                                    {
                                        Number(this.state.detail_info.total_invoiced) > 0 &&
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : 'green'}}> + £{Math.abs(this.state.detail_info.total_invoiced).toFixed(2)}</Text>
                                    }
                                </View>
                            </View>
                            <View style={styles.check_box_body}>
                                <View style={styles.check_body}>
                                    <CheckBox
                                        title='Suppliers'
                                        checked={this.state.detail_info.supplier}
                                        containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                        textStyle={!this.state.detail_info.supplier ? styles.check_title : styles.checked_title}
                                        checkedColor={Colors.main_color}
                                    />
                                </View>

                                <View style={styles.check_body}>
                                    <CheckBox
                                        title='Customers'
                                        checked={this.state.detail_info.customer}
                                        containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                        textStyle={!this.state.detail_info.customer ? styles.check_title : styles.checked_title}
                                        checkedColor={Colors.main_color}
                                    />
                                </View>

                                <View style={styles.check_body}>
                                    <CheckBox
                                        title='Beneficiary'
                                        checked={this.state.beneficiary}
                                        containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                        textStyle={!this.state.beneficiary ? styles.check_title : styles.checked_title}
                                        checkedColor={Colors.main_color}
                                    />
                                </View>
                            </View>
                            <View style={styles.detail_body}>
                                <View style={styles.edit_button}>
                                    <TouchableOpacity style={styles.button} onPress={() => this.gotoEdit()}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : 'white'}}>EDIT</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{marginTop : 20 * metrics}}></View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>Company Name</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.name ? '' : this.state.detail_info.name}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>House Number</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.house_number ? '' : this.state.detail_info.house_number}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>Street Name</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.street ? '' : this.state.detail_info.street}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>City</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.city ? '' : this.state.detail_info.city}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>County</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.county ? '' : this.state.detail_info.county}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>Postcode</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.zip ? '' : this.state.detail_info.zip}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>Country</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.country_id ? '' : this.state.detail_info.country_id}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={styles.title}>Website</Text>
                                    <View style={{flex : 0.05}}></View>
                                    <Text style={styles.value}>{!this.state.detail_info.website ? '' : this.state.detail_info.website}</Text>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={[styles.title, { flex : 0.3}]}>Phone</Text>
                                    <View style={{flex : 0.7, flexDirection : 'row', alignItems : 'center'}}>
                                        <Image source ={Images.phone_img} style={styles.icon_sms}></Image>
                                        <View style={{marginLeft : 15 * metrics}}></View>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize  :16 * metrics}}>{!this.state.detail_info.phone ? '' : this.state.detail_info.phone}</Text>
                                    </View>
                                </View>
                                <View style={styles.detail_item}>
                                    <Text style={[styles.title, { flex : 0.3}]}>Email</Text>
                                    <View style={{flex : 0.7, flexDirection : 'row', alignItems : 'center'}}>
                                        <Image source ={Images.sms_img} style={styles.icon_sms}></Image>
                                        <View style={{marginLeft : 15 * metrics}}></View>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize  :16 * metrics}}>{!this.state.detail_info.email ? '' : this.state.detail_info.email}</Text>
                                    </View>
                                </View>
                            </View>
                            
                        </View>
                    </ScrollView>
                    <View style={[global_style.bottom_button_body, {flexDirection : 'row'}]}>
                        <View style={{flex : 0.2, justifyContent : 'center', alignItems : 'center'}}>
                            <TouchableOpacity onPress={() => this.setBeforeData()}>
                                <FontAwesome5 name="arrow-left" size={30 * metrics}></FontAwesome5>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex : 0.6}}></View>
                        <View style={{flex : 0.2, justifyContent : 'center', alignItems : 'center'}}>
                            <TouchableOpacity onPress={() => this.setNextData()}>
                                <FontAwesome5 name="arrow-right" size={30 * metrics}></FontAwesome5>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    body : {
        flexDirection : 'column',
        width : '100%',
        flex : 1
    },
    main_body : {
        width : '95%',
        alignSelf : 'center',
        marginTop : 30 * metrics
    },
    card_body : {
        width : '100%',
        height : 70 * metrics,
        paddingLeft : 10 * metrics,
        paddingRight : 10 * metrics,
        borderRadius : 5 * metrics,
        backgroundColor : 'white',
        borderWidth : 1, 
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        borderColor : Colors.white_gray_color
    },
    icon_body : {
        flex : 0.15, 
        justifyContent : 'center',
        alignItems : 'center',
    },
    name_body : {
        flex : 0.5,
        justifyContent : 'center',
        marginLeft : 15 * metrics
    },
    val_body : {
        flex : 0.35, 
        justifyContent : 'center',
        alignItems : 'flex-end',
        marginRight : 10 * metrics
    },
    check_box_body : {
        flexDirection : 'row',
        marginTop : 15 * metrics
    },
    check_body : {
        flex : 0.333,
    },
    checked_title : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_color,
        textAlign : 'center'
    }, 
    check_title : {
        fontSize : 15 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.dark_gray,
        textAlign : 'center'
    },
    detail_body : {
        width : '95%',
        alignSelf : 'center'
    },
    edit_button : {
        marginTop : 20 * metrics,
        alignItems : 'flex-end'
    },
    button : {
        width : 120 * metrics,
        height : 45 * metrics,
        borderWidth : 1,
        borderRadius : 25 * metrics,
        backgroundColor : Colors.red_color,
        justifyContent : 'center',
        alignItems : 'center'
    },
    detail_item : {
        flexDirection : 'row',
        height : 50 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        paddingLeft : 10 * metrics
    },
    title : {
        flex : 0.4,fontFamily : Fonts.adobe_clean, fontWeight :'600', color : Colors.dark_gray, fontSize : 16 * metrics
    },
    value : {
        flex : 0.55,fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics
    },
    icon_sms : {
        width : 35 * metrics,
        height : 35 * metrics,
        resizeMode : 'contain',
    },
});