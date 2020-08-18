import React from 'react';
import {Text, View, Button, StyleSheet,TouchableOpacity, ScrollView, Image, ActivityIndicator} from 'react-native';
import HeaderComponent from '../../../components/HeaderComponent'
import global_style, {metrics} from '../../../constants/GlobalStyle'
import * as Images from '../../../constants/Image'
import * as Colors from '../../../constants/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Fonts } from '../../../constants/Fonts';
import { TextInput } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { RadioButton } from 'react-native-paper'
import DateTimePicker from "react-native-modal-datetime-picker"
import { convertDate ,alertMessage, changeNumber,paramDate} from '../../../utils/utils'
import CrmService from '../../../service/CrmService'
import CustomerService from '../../../service/CustomerService'
import VenderService from '../../../service/VenderService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const placeholder_terms = {
    label : 'Payment Terms',
    value : null,
    color : 'gray'
}
const placeholder_tax = {
    label : 'Tax is   (Excluded from amounts)',
    value : null,
    color : 'gray'
}


export default class BillPayment extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    middle_info = ''
    total_balance = 0
    inv_date = ''
    due_date = ''

    invoice_product_arr = []
    state = {
        isLoading : false,
        isReady : false,
        name : '',
        email : '',
        terms_arr : [],
        tax_arr : [],
        vat : '',
        activeIdx : 0,
        repeat_util : '',
        reference : '',
        notes : '',
        address : '',
        phone : '',
        isInvDatePickerVisible : false,
        isDueDatePickerVisible : false,
        inv_date : '',
        due_date : '',
        invoice_num : '',
        is_show_supplier : false,
        supplier_arr : [],
        select_idx : -1,
        invoice_arr : [],
        total_balance : '0',
        beneficiary_info : '',
        supplier_info : '',

        house_number : '',
        building_name : '',
        address_info : '',
        street : '',
        street2 : '',
        city : '',
        zip : '',
        country : '',
        website : '',
        invoice_data_date : '',
        due_data_date : '',
        all_supplier_list : [],
        search_text : '',
        bill_num : '',
        is_preview : false,
        bill_info : ''
    }
    proceed () {
        if (!this.state.isReady) return

        var obj = {
            name: this.state.name,
            vat: "",
            house_number: this.state.house_number,
            building_name: this.state.building_name,
            address_info: this.state.address_info,
            street: this.state.street,
            street2: this.state.street2,
            city: this.state.city,
            zip: this.state.zip,
            country: "231",
            phone: this.state.phone,
            email: this.state.email,
            website: this.state.website,
            rb_uk_account_number: this.state.beneficiary_info.rb_uk_account_number,
            rb_uk_sort_code: this.state.beneficiary_info.rb_uk_sort_code,
            rb_iban: "",
            rb_bic_swift: "",
            inv_name: this.state.invoice_num,
            invoice_date: this.state.invoice_data_date,
            due_date: this.state.due_data_date,
            invoice_line_ids: this.invoice_product_arr,
            document_type: "Text",
            transaction_urn: "",
            date_stamp: "08/04/2020",
            transaction_reference: "",
            img_link: "",
            zeva_system_ref: "",
            acc_num: "",
            vat_charge: "",
            supplier_urn: "",
            nx_url: "",
            pay_later: "",
            already_pay_method: "Banking",
            pay_now_status: "",
            pay_now_date: "",
            meta_data: "",
        }
        this.middle_info = obj
        this.setState({isLoading : true})
        VenderService.addVender(global.token, obj).then(res => {
            var data = res.data.result
            if (data.success) {
                console.log ('OK = ' , data.response.invoice)
                this.getBillNumber(data.response.invoice)

            } else {
                console.log('message = ', res)
            }
            
        }).catch(err => {
            console.log('error = ' , err.message)
            this.setState({isLoading : false})
        })
    }
    initState () {
        this.setState({
            isLoading : false,
            isReady : false,
            name : '',
            email : '',
            terms_arr : [],
            tax_arr : [],
            vat : '',
            activeIdx : 0,
            repeat_util : '',
            reference : '',
            notes : '',
            address : '',
            phone : '',
            isInvDatePickerVisible : false,
            isDueDatePickerVisible : false,
            inv_date : '',
            due_date : '',
            invoice_num : '',
            is_show_supplier : false,
            supplier_arr : [],
            select_idx : -1,
            total_balance : '0',
            beneficiary_info : '',
            supplier_info : '',

            house_number : '',
            building_name : '',
            address_info : '',
            street : '',
            street2 : '',
            city : '',
            zip : '',
            country : '',
            website : '',
            invoice_data_date : '',
            due_data_date : '',
            all_supplier_list : [],
            search_text : '',
            bill_num : '',
            is_preview : false,
            bill_info : ''
        })
    }
    getBillNumber (id) {
        VenderService.getAllVenderInvoice(global.token).then(res => {
            var data =res.data.result
            if (data.success) {
                var arr = data.response.records
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length ; i ++) {
                        if (id == arr[i].id) {
                            console.log('arr = ' , arr[i])
                            this.setState({bill_num : arr[i].number, bill_info : arr[i]})
                            break;
                        }
                    }
                }
            } else {

            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
        })
    }
    getBillNumber1 (id) {
        VenderService.getAllVenderInvoice(global.token).then(res => {
            var data =res.data.result
            if (data.success) {
                var arr = data.response.records
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length ; i ++) {
                        if (id == arr[i].id) {
                            console.log('arr = ' , arr[i])
                            global.cat_name = arr[i].number
                            this.props.navigation.navigate('NaxetraAccount')
                            break;
                        }
                    }
                }
            } else {

            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
        })
    }
    checkReady () {
        if (this.state.name != '' && this.state.inv_date != '' && this.state.beneficiary_info != '' && this.state.invoice_arr.length > 0) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    hideInvDatePicker = () => {
        this.setState({ isInvDatePickerVisible: false });
    };
    handleInvDatePicked = date => {
        this.inv_date = convertDate(date)
        this.setState({inv_date : convertDate(date), invoice_data_date : paramDate(date)}, () => this.checkReady())
        this.hideInvDatePicker();
    };
    hideDueDatePicker = () => {
        this.setState({ isDueDatePickerVisible: false });
    };
    handleDueDatePicked = date => {
        this.due_date = convertDate(date)
        this.setState({due_date : convertDate(date), due_data_date : paramDate(date)}, () => this.checkReady())
        this.hideDueDatePicker()
    }
    sortCRMList (data) {
        if (data.length > 0) {
            var arr = []
            for (var i = 0 ; i < data.length ; i++) {
                if (data[i].supplier) {
                    arr.push(data[i])
                }
            }
            this.setState({supplier_arr : arr, all_supplier_list : arr})
        }
    }

    showSupplierList () {
        this.setState({is_show_supplier : true})
        CrmService.getCustomerList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.sortCRMList(data.response.records)
            } else {
                alertMessage(data.message)
            }
        }).catch(error => {
            console.log('error = ' , error)
        })
    }
    clickedCancel () {
        this.setState({is_show_supplier : false})
    }

    clickedOK () {
        var data = this.state.supplier_arr[this.state.select_idx]

        this.setState({ 
            supplier_info : data, 
            name : data.name, 
            email : data.email, 
            address : data.address_info,
            phone: data.phone, 
            house_number : !data.house_number ? '' : data.house_number,
            building_name : !data.building_name ? '' : data.building_name,
            street : !data.street ? '' : data.street,
            street2 : !data.street2 ? '' : data.street2,
            city : !data.city ? '' : data.city,
            country : !data.country_id ?'' : data.country_id,
            zip : !data.zip ? '' : data.zip,
            website : !data.website ? '' : data.website,
            is_show_supplier : false,
        }, () => {
            this.setState({address : this.state.house_number + ' ' + this.state.building_name + ' ' + this.state.street + ' ' + this.state.street2 + ' ' + this.state.city + ' ' + (!data.country_id ? '' : data.country_id[1])})
            this.checkReady()
        })
    }

    componentDidMount () {
        global.invoice_arr = []
        global.beneficiary_info = ''
        this.setState({invoice_arr : []})
        this.getTaxesArr()
    }
    getTaxesArr () {
        this.setState({isLoading : true})
        CustomerService.getAllTaxes(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var arr = data.response.records
                global.original_tax_arr = arr
                var result_arr = []
                if (arr.length > 0) {
                    for (var i =0; i < arr.length ; i++) {
                        var obj = {
                            label : arr[i].name + ' ( £ ' + changeNumber(arr[i].amount)  + ')',
                            value : arr[i].id,
                            amount : arr[i].amount,
                            color : 'black'
                        }
                        result_arr.push(obj)
                    }
                    global.tax_arr = result_arr
                }
            } else {

            }
            this.setState({isLoading :false})
        })
    }

    onChangeState () {
        var total_count = 0
        var tax_count = 0
        if (global.invoice_arr.length > 0) {
            var data = global.invoice_arr
            for (var i = 0; i < data.length ; i++) {
                total_count += Number(data[i].price / data[i].quantity) * Number(data[i].quantity)
                tax_count += (Number(data[i].price / data[i].quantity) * Number(data[i].quantity)) * (data[i].tax / 100)
                var obj = {
                    product_id: data[i].id,
                    description: data[i].description,
                    quantity: data[i].quantity,
                    price:  Number(data[i].price) + Number(data[i].price * (data[i].tax / 100))
                }
                this.invoice_product_arr.push(obj)
            }
        }
        this.total_balance = total_count + tax_count
        this.setState({invoice_arr : global.invoice_arr, beneficiary_info : global.beneficiary_info,total_balance : total_count + tax_count}, () => this.checkReady())
    }

    addProduct(value, item, idx) {
        global.is_add = true
        global.item = item
        global.idx = idx
        this.props.navigation.navigate('AddProduct')
    }
    removeProduct (idx) {
        var arr = this.state.invoice_arr
        var result_arr = []
        if (arr.length > 0) {
            for (var i = 0 ; i < arr.length ; i++) {
                if (i != idx) {
                    result_arr.push(arr[i])
                }
            }
            console.log('result_arr = ' , result_arr)
            this.setState({
                invoice_arr : result_arr
            }, () => {
                global.invoice_arr = result_arr
            })
        }
    }
    searchList () {
        if (this.state.search_text == '') {
            this.setState({supplier_arr : this.state.all_supplier_list})
        } else {
            if (this.state.all_supplier_list.length > 0) {
                var arr = []
                for (var i =0 ; i < this.state.all_supplier_list.length ; i++) {
                    if(this.state.all_supplier_list[i].name.toLowerCase().indexOf(this.state.search_text.toString().toLowerCase())!=-1) { 
                        arr.push(this.state.all_supplier_list[i])
                    }
                }
                this.setState({supplier_arr : arr})
            }
        }
    }

    payNow () {
        if (this.state.supplier_info == '') {
            alertMessage('Please input supplier information.')
            return
        }

        if (this.state.beneficiary_info == '') {
            alertMessage('Please input bank details.')
            return
        }
        
        if (this.state.invoice_arr.length == 0) {
            alertMessage('Please add Products.')
            return
        }
        if (this.state.invoice_arr.length > 0) {
            var arr = []
            for (var i = 0 ; i < this.state.invoice_arr.length;i++) {
                arr.push(this.state.invoice_arr[i].id)
            }
        }
        var objs = {
            amount : this.state.total_balance,
            beneficiary_id : this.state.beneficiary_info.id,
            rb_invoice_ids:arr,
            reference: this.state.invoice_num,
        }
        global.send_money_invoice = true
        global.bill_payment = objs
        
        if (this.state.bill_num == '') {
            var obj = {
                name: this.state.name,
                vat: "",
                house_number: this.state.house_number,
                building_name: this.state.building_name,
                address_info: this.state.address_info,
                street: this.state.street,
                street2: this.state.street2,
                city: this.state.city,
                zip: this.state.zip,
                country: "231",
                phone: this.state.phone,
                email: this.state.email,
                website: this.state.website,
                rb_uk_account_number: this.state.beneficiary_info.rb_uk_account_number,
                rb_uk_sort_code: this.state.beneficiary_info.rb_uk_sort_code,
                rb_iban: "",
                rb_bic_swift: "",
                inv_name: this.state.invoice_num,
                invoice_date: this.state.invoice_data_date,
                due_date: this.state.due_data_date,
                invoice_line_ids: this.invoice_product_arr,
                document_type: "Text",
                transaction_urn: "",
                date_stamp: "08/04/2020",
                transaction_reference: "",
                img_link: "",
                zeva_system_ref: "",
                acc_num: "",
                vat_charge: "",
                supplier_urn: "",
                nx_url: "",
                pay_later: "",
                already_pay_method: "Banking",
                pay_now_status: "",
                pay_now_date: "",
                meta_data: "",
            }
            this.middle_info = obj
            console.log('obj = ' , obj)
            this.setState({isLoading : true})
            VenderService.addVender(global.token, obj).then(res => {
                var data = res.data.result
                if (data.success) {
                    this.getBillNumber1(data.response.invoice)
                } else {
                    console.log('message = ', res)
                }
                
            }).catch(err => {
                console.log('error = ' , err.message)
                this.setState({isLoading : false})
            })
        } else {
            global.cat_name = this.state.bill_num
            this.setState({bill_num : ''})
            this.props.navigation.navigate('NaxetraAccount')
        }
        
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                <View style={{flex : 1}}>
                    {
                        !this.state.is_preview ?
                        <View style={{flex : 0.85,paddingTop : 20 * metrics}}>
                            <ScrollView style={{flex : 1}}>
                                <View style={styles.top_setting}>
                                    <TouchableOpacity style={styles.setting_item} onPress={() => this.setState({is_preview : true})}>
                                        <Image source={Images.preview_icon} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Preview Invoice</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.setting_item}>
                                        <Image source={Images.draft_icon} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Save Draft</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.setting_item}>
                                        <Image source={Images.email_invoice} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Email Invoice</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.setting_item}>
                                        <Image source={Images.notes} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Add Notes</Text>
                                    </TouchableOpacity>
                                    <View style={styles.right_setting}>
                                        <TouchableOpacity style={styles.pay_btn} onPress={() => this.payNow()}>
                                            <Text style={styles.pay_text}>Pay Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    this.state.bill_num != '' && this.state.bill_num != false &&
                                    <Text style={{marginLeft : 25 * metrics,marginTop : 15 * metrics, fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, fontWeight : 'bold'}}>{this.state.bill_num}</Text>
                                }
                                <View style={styles.customer}>
                                    <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                        <Text style={{flex : 0.9, fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics}}>Supplier *</Text>
                                        <TouchableOpacity style={{flex : 0.1,alignItems : 'flex-end'}} onPress={() => {
                                            global.is_supplier = true
                                            this.props.navigation.navigate('CreateCRMScreen')
                                        }}>
                                            <MaterialCommunityIcons name="plus-box" size={40 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.2}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Name</Text>
                                        </View>
                                        <View style={{flex : 0.7,padding : 5 * metrics}}>
                                            <TextInput
                                                placeholder="Please enter supplier name"
                                                value={this.state.name}
                                                onChangeText={(text) => this.setState({name : text})}
                                                style={{width : '100%', height : 45 * metrics, backgroundColor : 'transparent', fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean}}
                                            />
                                        </View>
                                        <TouchableOpacity style={{flex : 0.15,alignItems : 'flex-end'}} onPress={() => this.showSupplierList()}>
                                            <FontAwesome5 name="eye" size={30 * metrics} color={Colors.main_color}></FontAwesome5>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.2, justifyContent : 'center'}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Address</Text>
                                        </View>
                                        <View style={{flex : 0.7,padding : 5 * metrics}}>
                                            <TextInput
                                                placeholder="Please enter supplier address"
                                                value={this.state.address}
                                                onChangeText={(text) => this.setState({address : text})}
                                                style={{width : '100%', height : 45 * metrics, backgroundColor : 'transparent', fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean}}
                                            />
                                        </View>
                                        <View style={{flex : 0.15}}></View>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.2, justifyContent : 'center'}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Phone</Text>
                                        </View>
                                        <View style={{flex : 0.7,padding : 5 * metrics}}>
                                            <TextInput
                                                placeholder="Please enter supplier phone"
                                                value={this.state.phone}
                                                onChangeText={(text) => this.setState({phone : text})}
                                                style={{width : '100%', height : 45 * metrics, backgroundColor : 'transparent', fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean}}
                                            />
                                        </View>
                                        <View style={{flex : 0.15}}></View>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.2, justifyContent : 'center'}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Email</Text>
                                        </View>
                                        <View style={{flex : 0.7,padding : 5 * metrics}}>
                                            <TextInput
                                                placeholder="Please enter supplier email"
                                                value={this.state.email}
                                                onChangeText={(text) => this.setState({email : text})}
                                                style={{width : '100%', height : 45 * metrics, backgroundColor : 'transparent', fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean}}
                                            />
                                        </View>
                                        <View style={{flex : 0.15}}></View>
                                    </View>
                                    <View style={{alignItems : "flex-end", justifyContent : 'center'}}>
                                        <TouchableOpacity style={styles.bank_detail_btn} onPress={() => {
                                            global.is_accounting = true
                                            global.bank_name = this.state.name
                                            this.props.navigation.navigate('ManageBeneficiary')
                                        }}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : 'white'}}>Bank Details</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                <View style={styles.invoice_body}>
                                    <TextInput
                                        value={this.state.invoice_num}
                                        onChangeText={(value) => this.setState({invoice_num : value})}
                                        style={{height : 55 * metrics,borderBottomWidth : 0, backgroundColor : 'white',paddinLeft : 20 * metrics, paddingRight : 20 * metrics}}
                                        placeholder={"Invoice Number"}
                                        underlineColorAndroid = "transparent"
                                    />
                                </View>
                                
                                <View style={styles.date}>
                                    <TouchableOpacity style={styles.date_item} onPress={() => this.setState({isInvDatePickerVisible : true})}>
                                        <View style={{flex : 0.05}}></View>
                                        <Text style={{flex : 0.75, fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>{this.state.inv_date == '' ? "Inv Date" : this.state.inv_date}</Text>
                                        <FontAwesome name="calendar" size={25 * metrics} style={{flex : 0.2}} color={Colors.main_color}></FontAwesome>
                                        <DateTimePicker
                                            mode="date"
                                            isVisible={this.state.isInvDatePickerVisible}
                                            onConfirm={this.handleInvDatePicked}
                                            onCancel={this.hideInvDatePicker}
                                        />
                                    </TouchableOpacity>
                                    <View style={{flex : 0.1}}></View>
                                    <TouchableOpacity style={styles.date_item} onPress={() => this.setState({isDueDatePickerVisible : true})}>
                                        <View style={{flex : 0.05}}></View>
                                        <Text style={{flex : 0.75, fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>{this.state.due_date == '' ? "Due on" : this.state.due_date}</Text>
                                        <FontAwesome name="calendar" size={25 * metrics} style={{flex : 0.2}} color={Colors.main_color}></FontAwesome>
                                        <DateTimePicker
                                            mode="date"
                                            isVisible={this.state.isDueDatePickerVisible}
                                            onConfirm={this.handleDueDatePicked}
                                            onCancel={this.hideDueDatePicker}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.payment_detail}>
                                    <Text style={styles.detail_title}>Payment details : </Text>
                                    <Text style={styles.detail_text}>Bank Name : {this.state.name}</Text>
                                    <Text style={styles.detail_text}>Account Name : {this.state.beneficiary_info == '' ? '' : this.state.beneficiary_info.rb_name}</Text>
                                    <Text style={styles.detail_text}>Sort Code : {this.state.beneficiary_info == '' ? '' : this.state.beneficiary_info.rb_uk_sort_code}</Text>
                                    <Text style={styles.detail_text}>Account Number : {this.state.beneficiary_info == '' ? '' : this.state.beneficiary_info.rb_uk_account_number}</Text>
                                </View>
                                
                                <View style={styles.vat}>
                                    <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Total Balance Due</Text>
                                    <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.dark_gray, fontWeight : 'bold', textAlign : 'right'}}>£ {Number(this.state.total_balance).toFixed(2)}</Text>
                                </View>

                                <TouchableOpacity style={styles.add_product} onPress={() => {
                                    global.is_add = false
                                    global.item = ''
                                    global.idx = -1
                                    this.props.navigation.navigate('AddProduct')
                                    global.tab_name = 'Expenses'
                                }}>
                                    <FontAwesome5 name="plus-circle" size={35 * metrics} color={"green"}></FontAwesome5>
                                    <View style={{marginLeft : 20 * metrics}}></View>
                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 19 * metrics, color : 'green'}}>Add product or service *</Text>
                                </TouchableOpacity>
                                {
                                    this.state.invoice_arr.length != 0 && 
                                    <View style={styles.inovice_body}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics,color : Colors.dark_gray}}>Invoice Items</Text>
                                        {
                                            this.state.invoice_arr.map((item, idx) => {
                                                return(
                                                    <View style={styles.invoice_item} key={idx}>
                                                        <View style={{flexDirection : 'row', alignItems : 'center',marginTop : 10 * metrics}}>
                                                            <Text style={{flex : 0.6 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}}>{item.name}</Text>
                                                            <TouchableOpacity style={{flex : 0.2,justifyContent :'center', alignItems : 'center'}} onPress={() => this.addProduct('edit', item, idx)}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.red_color}}>Edit</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{flex : 0.2,justifyContent :'center', alignItems : 'center'}} onPress={() => this.removeProduct(idx)}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.main_blue_color}}>Remove</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                        <View style={{flexDirection : 'row', alignItems : 'center',marginTop : 10 * metrics}}>
                                                            <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}}>{item.quantity} X £ {changeNumber(item.price/ item.quantity)}</Text>
                                                            <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray, textAlign : 'right'}}>£ {changeNumber(item.price)}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                }
                            </ScrollView>
                        </View>
                        :
                        <View style={{flex: 1 ,paddingTop : 20 * metrics}}>
                            <ScrollView style={{flex : 1}}>
                                <View style={styles.top_setting}>
                                    <TouchableOpacity style={styles.setting_item} onPress={() => this.setState({is_preview : false})}>
                                        <Image source={Images.preview_icon} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Go Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.setting_item}>
                                        <Image source={Images.draft_icon} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Save Draft</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.setting_item}>
                                        <Image source={Images.email_invoice} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Email Invoice</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.setting_item}>
                                        <Image source={Images.notes} style={styles.item_img}></Image>
                                        <Text style={styles.item_text}>Add Notes</Text>
                                    </TouchableOpacity>
                                    <View style={styles.right_setting}>
                                        <TouchableOpacity style={styles.pay_btn} onPress={() => this.payNow()}>
                                            <Text style={styles.pay_text}>Pay Now</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.customer, {padding : 10 * metrics}]}>                                    
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.5}}>
                                            <Text style={[styles.custom_text, {color : 'black'}]}>Supplier</Text>
                                        </View>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_value}>{this.state.bill_num}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 15 * metrics}}>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_text}>Name</Text>
                                        </View>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_value}>{this.middle_info.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_text}>Address</Text>
                                        </View>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_value}>{this.middle_info.address}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_text}>Phone</Text>
                                        </View>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_value}>{this.middle_info.phone}</Text>
                                        </View>
                                    </View>
                                    <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_text}>Email</Text>
                                        </View>
                                        <View style={{flex : 0.5}}>
                                            <Text style={styles.custom_value}>{this.middle_info.email}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.invoice_view}>
                                    <Text style={{flex : 0.5, fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics}}>Invoice Number</Text>
                                    <Text style={{flex : 0.5, fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}}>{this.middle_info.inv_name}</Text>
                                </View>
                                <View style={[styles.date, {marginTop : 20 * metrics}]}>
                                    <View style={styles.date_view}>
                                        <Text style={styles.custom_value}>INV Date</Text>
                                    </View>
                                    <View style={{flex : 0.1}}></View>
                                    <View style={styles.date_view}>
                                        <Text style={styles.custom_value}>Due on</Text>
                                    </View>
                                </View>
                                <View style={styles.date}>
                                    <View style={styles.date_item}>
                                        <Text style={styles.custom_value}>{this.inv_date}</Text>
                                    </View>
                                    <View style={{flex : 0.1}}></View>
                                    <View style={styles.date_item}>
                                        <Text style={styles.custom_value}>{this.due_date}</Text>
                                    </View>
                                </View>
                                <View style={{marginTop : 15 * metrics, flexDirection : 'row', alignItems : 'center', alignSelf : 'flex-end', marginRight : 20 * metrics}}>
                                    <Text style={[styles.custom_text, {fontSize : 20 * metrics, marginRight : 20 * metrics}]}>Tax </Text>
                                    <Text style={[styles.custom_value]}>£ {Number(this.state.bill_info == '' ? 0 : this.state.bill_info.amount_tax).toFixed(2)}</Text>
                                </View>
                                <View style={styles.vat}>
                                    <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}}>Total Balance Due</Text>
                                    <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.red_color, fontWeight : 'bold', textAlign : 'right'}}>£ {Number(this.total_balance).toFixed(2)}</Text>
                                </View>
                                {
                                    this.state.invoice_arr.length != 0 && 
                                    <View style={styles.inovice_body}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics,color : Colors.dark_gray}}>Invoice Items</Text>
                                        {
                                            this.state.invoice_arr.map((item, idx) => {
                                                return(
                                                    <View style={styles.invoice_item} key={idx}>
                                                        <View style={{flexDirection : 'row', alignItems : 'center',marginTop : 10 * metrics}}>
                                                            <Text style={{flex : 0.6 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}}>{item.name}</Text>
                                                            <Text style={{flex : 0.2,justifyContent :'center', textAlign : 'center', fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics}}>
                                                                Tax
                                                            </Text>
                                                            <Text style={{flex : 0.2,justifyContent :'center',textAlign : 'right', fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, color : Colors.dark_gray}}>
                                                                £ {Number(item.price * (item.tax / 100)).toFixed(2)}
                                                            </Text>
                                                        </View>
                                                        <View style={{flexDirection : 'row', alignItems : 'center',marginTop : 10 * metrics}}>
                                                            <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}}>{item.quantity} X £ {changeNumber(item.price/ item.quantity)}</Text>
                                                            <Text style={{flex : 0.5 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray, textAlign : 'right'}}>£ {changeNumber(item.price)}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                }
                                <View style={{height : 60 * metrics}}></View>
                            </ScrollView>
                        </View>
                    }
                    {
                        !this.state.is_preview &&
                        <View style={global_style.bottom_button_body}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.proceed()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Proceed</Text>
                                    <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {
                    this.state.is_show_supplier && !this.state.is_preview && 
                    <View style={global_style.modal_bg}>
                        <View style={styles.modal_body}>
                            <View style={styles.customer_body}>
                                <View style={{flex : 0.2}}>
                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 19 * metrics, color : Colors.dark_gray, fontWeight : '600'}}>Supplier List</Text>
                                    <View style={{marginTop : 15 * metrics}}></View>
                                    <TextInput
                                        style={{height : 45 * metrics}}
                                        value={this.state.search_text}
                                        placeholder={"Search Supplier"}
                                        onChangeText = {(value) => this.setState({search_text : value}, () => this.searchList())}
                                    />
                                </View>
                                <View style={{flex : 0.6}}>
                                    <ScrollView>
                                        {
                                            this.state.supplier_arr.map((item , idx) => {
                                                return (
                                                    <TouchableOpacity style={idx == this.state.select_idx ? styles.active_customer_item : styles.customer_item} key={idx} onPress={() => this.setState({select_idx : idx})}>
                                                        <Text style={ idx == this.state.select_idx ? {fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.main_color} : {fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics}}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                    
                                </View>
                                <View style={{flex : 0.2, justifyContent : 'flex-end', flexDirection : 'row', alignItems : 'flex-end'}}>
                                    <TouchableOpacity style={styles.okay_btn} onPress={() => this.clickedOK()}>
                                        <Text style={{fontSize : 16 * metrics, fontFamily : Fonts.adobe_clean, color : 'white'}}>OK</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancel_btn} onPress={() => this.clickedCancel()}>
                                        <Text style={{fontSize : 16 * metrics, fontFamily : Fonts.adobe_clean, color : 'white'}}>CANCEL</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                }
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                        <Text style={global_style.loading_text}>Loading ...</Text>
                    </View>
                }
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    top_setting : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1, 
        borderRadius : 10 * metrics,
        flexDirection : 'row',
        padding : 7 * metrics,
        borderColor : Colors.dark_gray,
        alignItems : 'center',
        marginTop : 20 * metrics
    },
    setting_item : {
        flex : 0.13,
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'center'
    },
    item_img : {
        width : 30 * metrics, height : 30 * metrics
    },
    item_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 11 * metrics,
        textAlign : 'center',
        color : Colors.gray_color,
        marginTop : 5 * metrics
    },
    right_setting : {
        flex : 0.5,
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center',
        marginLeft : 5 * metrics
    },
    right_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 13 * metrics,
    },
    customer : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 10 * metrics
    },
    payment_terms : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        marginTop : 15 * metrics,
        flexDirection : 'column',
    },
    invoice_body : {
        width : '90%',
        alignSelf : 'center',
        marginTop : 15 * metrics,
        borderWidth : 1,
        height : 55 * metrics,
        borderColor : Colors.dark_gray,
    },
    invoice_view : {
        width : '90%',
        alignSelf : 'center',
        marginTop : 15 * metrics,
        borderWidth : 1,
        height : 55 * metrics,
        borderColor : Colors.dark_gray,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 15 * metrics
    },
    date : {
        width : '90%',
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row'
    },
    date_item : {
        flex : 0.45,
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        flexDirection : 'row',
        padding : 10 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        minHeight : 50 * metrics
    },
    date_view : {
        flex : 0.45,
        flexDirection : 'row',
        // justifyContent : 'center',
        alignItems : 'center',
    },
    vat : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 2,
        minHeight : 55 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row',
        padding : 10 * metrics,
        alignItems : 'center'
    },
    add_product : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row',
        padding : 10 * metrics,
        alignItems : 'center'
    },
    payment_detail : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 12 * metrics,
        alignItems : 'flex-start',
        borderRadius : 10 * metrics
    },
    detail_title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.dark_gray,
        marginBottom : 15 * metrics
    },
    detail_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 15 * metrics,
        color : 'black',
        marginBottom : 8 * metrics
    },
    plan_setting : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 10 * metrics,
        alignItems : 'flex-start',
        backgroundColor : "#fbf6f6"
    },
    check_box : {
        flexDirection : 'row',
        width : '100%',
        alignSelf : 'center'
    },
    plan_payment : {
        flex : 0.45,
        borderRadius : 10 * metrics,
        borderWidth : 1,
        borderColor : Colors.dark_gray,
        justifyContent : 'flex-end',
        minHeight : 30 * metrics
    },
    plan_payment_term : {
        fontSize : 12 * metrics,
        fontFamily : Fonts.adobe_clean,
        width : '100%',
        borderBottomWidth : 1,
        borderColor : Colors.gray_color,
        flexDirection : 'row'
    },
    plan_item : {
        marginTop :15 * metrics,
        flexDirection : 'row',
        width : '90%',
        alignSelf : 'center',
    },


    pay_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 16 * metrics,
        color : 'white'
    },
    pay_btn : {
        width : '90%', 
        borderWidth : 1, 
        borderRadius : 30 * metrics, 
        height : 45 * metrics, 
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.red_color
    },
    product_item : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        minHeight : 120 * metrics,
        marginTop : 15 * metrics,
        borderColor : Colors.dark_gray,
        padding : 20 * metrics
    },
    product_item_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : Colors.dark_gray
    },
    modal_body : {
        width : '90%',
        alignSelf : 'center',
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems :'center',
        marginTop : 50 * metrics
    },
    customer_body : {
        width : '100%',
        minHeight : 580 * metrics,
        alignSelf : 'center',
        backgroundColor : 'white',
        padding : 20 * metrics
    },
    customer_item : {
        padding : 10 * metrics,
        justifyContent : 'center',
        borderWidth : 1,
        borderRadius : 10 * metrics,
        borderColor : Colors.gray_color,
        marginTop : 10 * metrics
    },
    active_customer_item : {
        padding : 10 * metrics,
        justifyContent : 'center',
        borderWidth : 1,
        borderRadius : 10 * metrics,
        borderColor : Colors.main_color,
        marginTop : 10 * metrics
    },
    okay_btn : {
        width : 100 * metrics,
        height : 40 * metrics,
        borderWidth : 1,
        borderRadius : 10 * metrics,
        borderColor : Colors.dark_gray,
        backgroundColor : Colors.main_blue_color,
        justifyContent : 'center',
        alignItems : 'center'
    },
    cancel_btn : {
        marginLeft : 20 * metrics,
        width : 100 * metrics,
        height : 40 * metrics,
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        borderRadius : 10 * metrics,
        backgroundColor : Colors.red_color,
        justifyContent : 'center',
        alignItems : 'center'
    },
    inovice_body : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 1,
        minHeight : 70 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'column',
        padding : 10 * metrics,
        paddingLeft : 20 * metrics,
    },
    invoice_item : {
        width : '95%',
        alignSelf : 'center',
        minHeight : 80 * metrics,
        marginTop : 15 * metrics,
    },
    bank_detail_btn : {
        width : 140 * metrics,
        height : 45 * metrics,
        borderRadius : 20 * metrics,
        borderColor : Colors.dark_gray,
        marginTop : 15 * metrics,
        marginRight : 15 * metrics,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.main_color
    },
    custom_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.dark_gray,
        fontWeight : 'bold'
    },
    custom_value : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.dark_gray
    }
})