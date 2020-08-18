/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text,StyleSheet,Image,TouchableOpacity,SafeAreaView, ActivityIndicator, Keyboard,Linking, ToastAndroid} from 'react-native';
import global_style , { metrics } from '../../constants/GlobalStyle'
import { BorderlessButton, ScrollView } from 'react-native-gesture-handler'
import * as Colors from '../../constants/Colors'
import * as Images from '../../constants/Image'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { Fonts } from '../../constants/Fonts'
import { WebView } from 'react-native-webview';
import CRMHeaderComponent from '../../components/CRMHeaderComponent';
import CrmService from '../../service/CrmService';
import CustomerService from '../../service/CustomerService';
import Swipeout from 'react-native-swipeout';
import { TextInput } from 'react-native-paper';
import { alertMessage } from '../../utils/utils';

export default class CRMListScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isSelectedType : -1, // all - 0 : companies , 1 : individuals
            isReady : true,
            company_list : [],
            individual_list : [],
            total_list : [],
            item_arr : [],
            middle_arr : [],
            isLoading : false,
            supplier : false,
            customer : false,
            beneificary : false,
            search_text : '',
            swipe_idx : -1,
            hide_backbtn : false,
            limit : 19,
            offset : 0,
            pagenation : false,
            is_limit : false,
            show_pagenation : true
        }

        this.header_ref = null
    }
    componentWillReceiveProps () {
        this.componentDidMount()
    }
    componentDidMount () {
        if (global.disable_backbtn) {
            this.setState({hide_backbtn : true})
        }
        this.setState({middle_arr : [], origin_arr : [], offset : 0, limit : 19}, () => {
            this.getCustomerList()
        })
    }

    getCustomerList () {
        var middle_arr = this.state.middle_arr
        if (this.state.middle_arr.length == 0) {
            this.setState({isLoading : true, pagenation : false})
        } else {
            this.setState({isLoading : false, pagenation : true})
        }
        
        CrmService.getCustomerList(global.token, this.state.offset, this.state.limit).then(res => {
            var data = res.data.result
            if (data.success) {
                if (Number(data.response.records.length) < 20) {
                    this.setState({is_limit : true})
                } else {
                    this.setState({is_limit : false})
                }

                if (data.response.records.length > 0) {
                    for (var i = 0 ; i < data.response.records.length ; i++) {
                        middle_arr.push(data.response.records[i])
                    }
                }

                this.sortCRMList(middle_arr)
                this.setState({item_arr : this.state.total_list, middle_arr : middle_arr, isSelectedType : -1,})
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false, pagenation : false})
        }).catch(error => {
            console.log(error.message)
            this.setState({isLoading : false, pagenation : false})
        })
    }
    sortCRMList (data) {
        if (data.length > 0) {
            var arr1 = []
            var arr2 = []
            var arr3 = []
            for (var i = 0 ;i < data.length ;i ++) {
                var res = null
                if (data[i].company_type  != 'company') { //individuals
                    arr1.push(data[i])
                } else {
                    arr2.push(data[i])
                }
                arr3.push(data[i])
            }
            this.setState({individual_list : arr1 , company_list : arr2, total_list : arr3, item_arr : arr3, middle_arr : arr3})
        }
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    }
    goBack = () => {
        global.tabIdx = 1
        this.props.navigation.navigate('TabScreen')
    }

    onChangeTab = (idx) => {
        this.setState({isSelectedType : idx}, () => {
            if (idx == -1) {
                this.header_ref.onChangeState(idx)
                this.setState({item_arr :this.state.middle_arr, show_pagenation : true})
            } else if (idx == 0) {
                this.header_ref.onChangeState(idx)
                this.setState({item_arr :this.state.company_list,show_pagenation : false})
            } else if (idx == 1) {
                this.header_ref.onChangeState(idx)
                this.setState({item_arr :this.state.individual_list,show_pagenation : false})
            }
        })
    }

    onConfirm = () => {
        
    }

    callSMS (idx) {
        const url='mailto:' + this.state.item_arr[idx].email
        Linking.openURL(url)
    }

    callPhone (idx) {
        const url='tel:' + this.state.item_arr[idx].phone
        Linking.openURL(url)
    }

    onChangeCheckBox (val, flag) {
        if (val == '1') { //supplier
            if (flag) {
                this.setState({customer : false, beneificary : false,supplier : flag}, () => this.calculateArr())
            } else {
                this.setState({supplier : flag}, () => this.calculateArr())
            }
        } else if (val == '2') { //customer
            if (flag) {
                this.setState({supplier : false, beneificary : false,customer : flag}, () => this.calculateArr())
            } else {
                this.setState({customer : flag}, () => this.calculateArr())
            }
        } else {
            if (flag) {
                this.setState({supplier : false, customer : false,beneificary : flag}, () => this.calculateArr())
            } else {
                this.setState({beneificary : flag}, () => this.calculateArr())
            }
        }
        
    }

    calculateArr() {
        if (this.state.middle_arr.length > 0) {
            if (!this.state.supplier && !this.state.customer && !this.state.beneificary) {
                this.setState({item_arr : this.state.middle_arr})
            } else {
                var arr = []
                for (var i =0 ; i < this.state.middle_arr.length ; i++) {
                    if (this.state.supplier && this.state.middle_arr[i].supplier == this.state.supplier) {
                        arr.push(this.state.middle_arr[i])
                    } else if (this.state.customer && this.state.middle_arr[i].customer == this.state.customer) {
                        arr.push(this.state.middle_arr[i])
                    } else if (this.state.beneificary && this.state.middle_arr[i].beneificary == this.state.beneificary) {
                        //arr.push(this.state.middle_arr[i])
                    }
                }
                console.log('len = ' , arr.length)
                this.setState({item_arr : arr})
            }
        }
    }

    gotoDetailCRM (idx) {
        //global value
        global.crm_idx = idx
        global.crm_list = this.state.item_arr
        this.props.navigation.navigate('DetailCRMScreen')
    }

    isCloseToBottom ({layoutMeasurement, contentOffset, contentSize}) {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    render() {
        return (
            <View style={{flex : 1}}>
                <SafeAreaView style={{width : '100%' , height : '100%'}}>
                    <CRMHeaderComponent 
                        navigation={this.props.navigation} 
                        goBack={() => this.goBack()} 
                        ref={(ref) => this.header_ref = ref} 
                        type={0}
                        checkSupplier={(flag) => this.onChangeCheckBox('1',flag)}
                        checkCustomer={(flag) => this.onChangeCheckBox('2',flag)}
                        checkBeneficiary={(flag) => this.onChangeCheckBox('3',flag)}
                    ></CRMHeaderComponent>
                    <View style={{flexDirection :'column' , flex : 1}}>
                        <View style={styles.tab_bar}>
                            <TouchableOpacity style={styles.all_item} onPress={() => this.onChangeTab(-1)}>
                                <Text style={this.state.isSelectedType == -1 ? styles.select_all_text : styles.all_text}>All</Text>
                                <View style={this.state.isSelectedType == -1 ? styles.active_line : styles.normal_line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tab_item} onPress={() => this.onChangeTab(0)}>
                                <Text style={this.state.isSelectedType == 0 ? styles.select_all_text : styles.all_text}>Companies</Text>
                                <View style={this.state.isSelectedType == 0 ? styles.active_line : styles.normal_line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.tab_item} onPress={() => this.onChangeTab(1)}>
                                <Text style={this.state.isSelectedType == 1 ? styles.select_all_text : styles.all_text}>Individuals</Text>
                                <View style={this.state.isSelectedType == 1 ? styles.active_line : styles.normal_line}></View>
                            </TouchableOpacity>
                        </View>
                        <View style={this.state.isSelectedType == -1 ? styles.o_body : styles.o_body}>
                            <View style={{marginTop : 15 * metrics}}></View>
                            <ScrollView style={{flex : 1}}
                                onScroll={({nativeEvent}) => {
                                    if (this.isCloseToBottom(nativeEvent)) {
                                        if (this.state.pagenation || this.state.is_limit || !this.state.show_pagenation)
                                            return
                                        this.setState({offset : this.state.offset + 20, limit : this.state.limit + 20}, () => this.getCustomerList())
                                    }
                                }}
                            >
                                {
                                    this.state.item_arr.map((item, idx) => {
                                        return (
                                            <Swipeout
                                                style={styles.swipe_item}
                                                onOpen={() => this.setState({swipe_idx : idx})}
                                                close={this.state.swipe_idx != idx}
                                                right={[
                                                    {   
                                                        component : 
                                                        <TouchableOpacity style={styles.swipe_right_body} onPress={() => this.callSMS(idx)}>
                                                            <Image source ={Images.sms_img} style={styles.swipe_icon_sms}></Image>
                                                        </TouchableOpacity>
                                                    },
                                                    {   
                                                        component : 
                                                        <TouchableOpacity style={styles.swipe_right_body} onPress={() => this.callPhone(idx)}>
                                                            <Image source ={Images.phone_img} style={styles.swipe_icon_phone}></Image>
                                                        </TouchableOpacity>
                                                    }
                                                ]}
                                                
                                            >
                                                <View style={styles.list_item} key={idx}>
                                                    
                                                    <View style={styles.icon_body}>
                                                        {
                                                            item.company_type == 'person' ?
                                                            <Image source={Images.user_icon} style={{width : 35 * metrics, height : 35 * metrics}}></Image>
                                                            :
                                                            <Image source={Images.company_icon} style={{width : 35 * metrics, height : 35 * metrics}}></Image>    
                                                        }
                                                        
                                                    </View>
                                                    <TouchableOpacity style={styles.name_body} onPress={() => this.gotoDetailCRM(idx)}>
                                                        <Text style={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}} numberOfLines={1}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                    <View style={styles.val_body}>
                                                        {
                                                            Number(item.total_invoiced) < 0 &&
                                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.red_color}}> - £{Math.abs(item.total_invoiced).toFixed(2)}</Text>
                                                        }
                                                        {
                                                            Number(item.total_invoiced) == 0 &&
                                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.dark_gray}}>£ {Number(item.total_invoiced).toFixed(2)}</Text>
                                                        }
                                                        {
                                                            Number(item.total_invoiced) > 0 &&
                                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : 'green'}}> + £{Math.abs(item.total_invoiced).toFixed(2)}</Text>
                                                        }
                                                    </View>
                                                </View>
                                            </Swipeout>
                                        )
                                    })
                                }
                                {
                                    this.state.pagenation &&
                                    <View>
                                        <ActivityIndicator size={30} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                                        <View style={{marginBottom : 20 * metrics}}></View>
                                    </View>
                                }
                            </ScrollView>
                        </View>
                        {/* <View style={global_style.bottom_button_body}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onConfirm()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Confirm</Text>
                                    <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </SafeAreaView>
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tab_bar : {
        flex : 0.1,
        width : '95%',
        alignSelf : 'center',
        flexDirection : 'row',
    },
    all_item : {
        flex : 0.2,
        justifyContent : 'center',
        flexDirection : 'column'
    },
    tab_item : {
        flex : 0.4,
        justifyContent : 'center',
    },
    select_all_text :{ 
        fontFamily : Fonts.adobe_clean,
        fontSize : 22 * metrics,
        color : Colors.red_color,
        textAlign : 'center'
    },
    all_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 22 * metrics,
        color : Colors.gray_color,
        textAlign : 'center',
    },
    active_line : {
        width : '70%' ,alignSelf : 'center', height : 2 * metrics, backgroundColor : Colors.red_color
    },
    normal_line : {
        width : '70%' ,alignSelf : 'center', height : 2 * metrics, backgroundColor : 'transparent'
    },
    body : {
        flex : 0.65,
        width : '93%',
        alignSelf : 'center'
    },
    o_body : {
        flex : 0.9,
        width : '93%',
        alignSelf : 'center'
    },
    list_item : {
        width : '100%',
        height : 70 * metrics,
        backgroundColor : 'white',
        marginBottom : 10 * metrics,
        flexDirection : 'row'
    },
    swipe_item : {
        width : '100%',
        height : 70 * metrics,
        backgroundColor : 'white',
        marginBottom : 10 * metrics,
        flexDirection : 'column'
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
    swipe_icon_sms : {
        width : 50 * metrics,
        height : 50 * metrics,
        resizeMode : 'contain',
        marginTop : -10 * metrics
    },
    swipe_icon_phone : {
        width : 45 * metrics,
        height : 45 * metrics,
        resizeMode : 'contain',
        marginTop : -10 * metrics
    },
    swipe_right_body : {
        flexDirection : 'column' , justifyContent: 'center',alignItems : 'center', height : '100%', backgroundColor : 'white'
    }
})