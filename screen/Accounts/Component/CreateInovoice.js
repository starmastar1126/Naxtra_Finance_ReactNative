import React from 'react';
import {Text, View, Button, StyleSheet,TouchableOpacity, ScrollView, Image, Switch,Picker,ActivityIndicator,Alert} from 'react-native';
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
import { convertDate,changeNumber,paramDate ,alertMessage} from '../../../utils/utils'
import CrmService from '../../../service/CrmService';
import CustomerService from '../../../service/CustomerService'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const placeholder_terms = {
    label : 'Payment Terms',
    value : -1,
    color : 'gray'
}
const placeholder_tax = {
    label : 'Tax is   (Excluded from amounts)',
    value : null,
    color : 'gray'
}


export default class CreateInvoice extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    preview_obj = {
        name : '',
        email : '',
        payment_terms : -1,
        inv_date : '',
        due_date : '',
        tax : -1,
        vat : 0,
    }
    total_balance = 0

    state = {
        isReady : false,
        isLoading : false,
        repeat_invoice : false,
        name : '',
        email : '',
        terms_arr : [],
        tax_arr : [],
        vat : '',
        activeIdx : 0,
        invoice_date : '',
        repeat_util : '',
        reference : '',
        notes : '',
        isInvDatePickerVisible : false,
        isDueDatePickerVisible : false,
        isNextInvoiceDate : false,
        inv_date : '',
        due_date : '',
        invoice_data_date : '',
        due_date_date : '',
        customer_arr : [],
        all_customer_arr : [],
        is_show_customer : false,
        select_customer_idx : -1,
        invoice_arr : [],
        total_balance : 0,
        customer_name : '',
        customer_email : '',
        customer_id : -1,
        search_text : '',
        selected_term : -1,
        invoice_num : '',
        next_invoice_date : '',
        preview_data : '',
        is_preview : false,
    }
    initValue () {
        this.setState({
            isReady : false,
            preview_data : '',
            isLoading : false,
            repeat_invoice : false,
            name : '',
            email : '',
            terms_arr : [],
            tax_arr : [],
            vat : '',
            activeIdx : 0,
            invoice_date : '',
            repeat_util : '',
            reference : '',
            notes : '',
            isInvDatePickerVisible : false,
            isDueDatePickerVisible : false,
            isNextInvoiceDate : false,
            inv_date : '',
            due_date : '',
            invoice_data_date : '',
            due_date_date : '',
            customer_arr : [],
            all_customer_arr : [],
            is_show_customer : false,
            select_customer_idx : -1,
            total_balance : 0,
            customer_name : '',
            customer_email : '',
            customer_id : -1,
            search_text : '',
            selected_term : -1,
            invoice_num : '',
            next_invoice_date : ''
        })
    }
    proceed () {
        if (!this.state.isReady) return
        if (this.state.invoice_arr.length > 0) {
            var arr = []
            for (var i = 0; i < this.state.invoice_arr.length; i++) {
                var obj = {
                    product_id : this.state.invoice_arr[i].id,
                    description : this.state.invoice_arr[i].description,
                    quantity: this.state.invoice_arr[i].quantity,
                    price:  Number(this.state.invoice_arr[i].price) + Number(this.state.invoice_arr[i].price * (this.state.invoice_arr[i].tax / 100))
                }
                arr.push(obj)
            }
        }
        
        var obj = {
            partner_id: this.state.customer_id,
            invoice_date: this.state.invoice_data_date,
            due_date: this.state.due_date_date,
            payment_term_id: false,
            name: this.state.customer_name,
            invoice_line_ids: arr,
            recurring: this.state.repeat_invoice,
            recurring_type: this.state.repeat_invoice ? (this.state.activeIdx == 1 ? 'weekly': 'monthly') : '',
            recurring_interval: 0,
            recurring_end: "after",
            recurring_end_interval: 0
        }
        this.preview_obj.name = this.state.customer_name
        this.preview_obj.payment_terms = this.state.selected_term
        this.preview_obj.inv_date = this.state.inv_date
        this.preview_obj.due_date = this.state.due_date
        this.preview_obj.email = this.state.email

        this.setState({isLoading : true})
        CustomerService.createInvoiceBill(global.token , obj).then(res => {
            var data = res.data.result
            console.log('create invoice = ' , data)
            if (data.success) {
                this.getInvoiceList(data.response)
            } else {
                console.log('error => ', data.message)
                this.setState({isLoading : false})
            }
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }

    getInvoiceList(id) {
        CustomerService.getAllCustomerInvoiceList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var arr = data.response.records
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length ; i ++) {
                        if (id == arr[i].id) {
                            console.log('arr = ' , arr[i])
                            //global.tab_name = 'Reports'
                            //this.initValue()
                            global.preview_data = arr[i]
                            this.setState({invoice_num : arr[i].number, preview_data : arr[i]})
                            break;
                        }
                    }
                }
            } else {
                console.log('error => ' , data.message)
            }
            this.setState({isLoading : false})
        })
    }
    checkReady () {
        if (this.state.customer_name != '' && this.state.invoice_data_date != ''&& this.state.due_date_date != '' && this.state.invoice_arr.length > 0 && this.state.customer_id != -1) {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    changeType (type) {
        var amount = 0
        for (var i = 0 ; i < this.state.tax_arr.length; i++) {
            if (type == this.state.tax_arr[i].value) {
                amount = this.state.tax_arr[i].amount
            }
        }
        this.setState({vat : amount})
    }
    changeRepeatTerms (value) {
        
    }
    changeTerms (value) {
        this.setState({selected_term : value} ,() => {
            if (this.state.selected_term == -1 || this.state.selected_term == 0) {
                var due_date = this.state.due_date
                var inv_date = this.state.inv_date
                if (inv_date != '') {
                    this.setState({due_date : convertDate(inv_date), due_date_date : paramDate(inv_date),inv_date : convertDate(inv_date), invoice_data_date : paramDate(inv_date)}, () =>this.checkReady())
                }
            } else {
                var due_date = this.state.due_date
                var inv_date = this.state.inv_date
                if (inv_date != '') {
                    if (this.state.selected_term == 1) {
                        due_date = new Date(inv_date).setDate(new Date(inv_date).getDate() + 15) 
                    } else if (this.state.selected_term == 2) {
                        due_date = new Date(inv_date).setDate(new Date(inv_date).getDate() + 30)
                    }
                    this.setState({due_date : convertDate(due_date), due_date_date : paramDate(due_date),inv_date : convertDate(inv_date), invoice_data_date : paramDate(inv_date)}, () =>this.checkReady())
                }
            }
        })
    }

    getTaxesArr () {
        this.setState({isLoading : true})
        CustomerService.getAllTaxes(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var arr = data.response.records
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
                    this.setState({tax_arr : result_arr})
                    global.tax_arr = result_arr
                }
            } else {

            }
            this.setState({isLoading :false})
        })
    }
    getTermsArr () {
        this.setState({isLoading : true})
        CustomerService.paymentTermsList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                var arr = data.response.records
                var result_arr = []
                if (arr.length > 0) {
                    for (var i = 0 ; i < arr.length ; i++) {
                        var obj = {
                            label : arr[i].name,
                            value : i,
                            color : 'black',
                        }
                        result_arr.push(obj)
                    }
                    console.log(result_arr)
                    this.setState({terms_arr : result_arr})
                }
            } else {

            }
            this.setState({isLoading :false})
        })
    }
    gotoFirstPage () {
        global.tab_name = ''
        this.props.navigation.navigate('AccountTabScreen', {refresh : true})
    }
    componentDidMount () {
        global.invoice_arr = []
        this.setState({invoice_arr : []})
        this.getTaxesArr()
        this.getTermsArr()
    }

    onChangeState () {
        var total_count = 0
        var tax_count = 0
        if (global.invoice_arr.length > 0) {
            var data = global.invoice_arr
            
            for (var i = 0; i < data.length ; i++) {
                total_count += Number(data[i].price / data[i].quantity) * Number(data[i].quantity)
                //tax_count +=(Number(data[i].price / data[i].quantity) * Number(data[i].quantity)) * (data[i].tax / 100)
            }
        }
        this.total_balance = Number(total_count) + Number(total_count * (this.state.vat / 100))
        this.setState({invoice_arr : global.invoice_arr,total_balance : Number(total_count) + Number(total_count * (this.state.vat / 100))}, () => this.checkReady())
        
    }

    hideInvDatePicker = () => {
        this.setState({ isInvDatePickerVisible: false });
    };
    handleInvDatePicked = date => {
        if (this.state.selected_term == -1 || this.state.selected_term == 0) {
            var due_date = date
            this.setState({due_date : convertDate(due_date), due_date_date : paramDate(date),inv_date : convertDate(date), invoice_data_date : paramDate(date)}, () =>this.checkReady())
        } else {
            var due_date = ''
            if (this.state.selected_term == 1) {
                due_date = new Date(date).setDate(new Date(date).getDate() + 15) 
            } else if (this.state.selected_term == 2) {
                due_date = new Date(date).setDate(new Date(date).getDate() + 30)
            }
            this.setState({due_date : convertDate(due_date), due_date_date : paramDate(date),inv_date : convertDate(date), invoice_data_date : paramDate(date)}, () =>this.checkReady())
        }
        this.hideInvDatePicker();
    };
    hideDueDatePicker = () => {
        this.setState({ isDueDatePickerVisible: false });
    };
    handleDueDatePicked = date => {
        if (this.state.selected_term == -1 || this.state.selected_term == 0) {
            var inv_date = date
            this.setState({due_date : convertDate(date), due_date_date : paramDate(date),inv_date : convertDate(inv_date), invoice_data_date : paramDate(inv_date)}, () =>this.checkReady())
        } else {
            var inv_date = ''
            if (this.state.selected_term == 1) {
                inv_date = new Date(date).setDate(new Date(date).getDate() - 15) 
            } else if (this.state.selected_term == 2) {
                inv_date = new Date(date).setDate(new Date(date).getDate() - 30)
            }
            this.setState({due_date : convertDate(date), due_date_date : paramDate(date),inv_date : convertDate(inv_date), invoice_data_date : paramDate(inv_date)}, () =>this.checkReady())
        }
        this.hideDueDatePicker()
    }

    showCustomerList () {
        this.setState({is_show_customer : true})
        this.setState({
            customer_arr : [],
            all_customer_arr : []
        })
        CrmService.getCustomerList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.sortCRMList(data.response.records)
            } else {
                alertMessage(data.message)
            }
        }).catch(error => {
            console.log('error => ' , error.message)
        })
    }

    sortCRMList (data) {
        if (data.length > 0) {
            var arr = []
            for (var i = 0 ; i < data.length ; i++) {
                if (data[i].customer) {
                    arr.push(data[i])
                }
            }
            this.setState({customer_arr : arr, all_customer_arr : arr})
        }
    }


    addCustomer () {
        global.is_customer = true
        this.props.navigation.navigate('CreateCRMScreen')
    }
    clickedOK () {
        var data = this.state.customer_arr[this.state.select_customer_idx]
        this.setState({customer_name : data.name, customer_email : data.email, is_show_customer : false, customer_id : data.id}, () => this.checkReady())
    }
    clickedCancel () {
        this.setState({is_show_customer : false})
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
    onChangeInvoice() {
        this.setState({repeat_invoice : !this.state.repeat_invoice})
    }

    searchList () {
        if (this.state.search_text == '') {
            this.setState({customer_arr : this.state.all_customer_arr})
        } else {
            if (this.state.all_customer_arr.length > 0) {
                var arr = []
                for (var i =0 ; i < this.state.all_customer_arr.length ; i++) {
                    if(this.state.all_customer_arr[i].name.toLowerCase().indexOf(this.state.search_text.toString().toLowerCase())!=-1) { 
                        arr.push(this.state.all_customer_arr[i])
                    }
                }
                this.setState({customer_arr : arr})
            }
        }
    }

    handleNextInvoice = date => {
        this.setState({next_invoice_date : convertDate(date)})
        this.hideNextInvoice()
    }

    hideNextInvoice () {
        this.setState({isNextInvoiceDate : false})
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                    {/* <HeaderComponent backTitle="Create Invoice" navigation ={this.props.navigation} goBack={() => {
                        this.props.navigation.navigate('AccountTabScreen')
                    }}></HeaderComponent> */}
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
                                            <Text style={styles.right_text}>REPEAT INVOICE</Text>
                                            <View style={{marginLeft : 5 * metrics}}></View>
                                            <Switch
                                                onValueChange = {() => this.onChangeInvoice()}
                                                value = {this.state.repeat_invoice}
                                                trackColor={{true: Colors.main_color, false: Colors.dark_gray}}
                                                thumbColor={Colors.white_color}
                                            />
                                        </View>
                                    </View>
                                    {
                                        this.state.repeat_invoice &&
                                        <View style={styles.plan_setting}>
                                            <View style={styles.check_box}>
                                                <TouchableOpacity style={{flex : 0.25,flexDirection : 'row', alignItems : 'center'}} onPress={() => this.setState({activeIdx : 1})}>
                                                    <RadioButton
                                                        value={"haaha"}
                                                        status={this.state.activeIdx == 1 ? 'checked' : 'unchecked'}
                                                        color={Colors.main_color}
                                                        onPress={() => this.setState({activeIdx : 1})}
                                                    />
                                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 14 * metrics, color : Colors.dark_gray}}>Weekly</Text>
                                                </TouchableOpacity>
                                                <View style={{marginLeft : 5 * metrics}}></View>
                                                <TouchableOpacity style={{flex : 0.25,flexDirection : 'row', alignItems : 'center'}} onPress={() => this.setState({activeIdx : 2})}>
                                                    <RadioButton
                                                        value={"haaha"}
                                                        status={this.state.activeIdx == 2 ? 'checked' : 'unchecked'}
                                                        color={Colors.main_color}
                                                        onPress={() => this.setState({activeIdx : 2})}
                                                    />
                                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 14 * metrics, color : Colors.dark_gray}}>Monthly</Text>
                                                </TouchableOpacity>
                                                <View style={{flex : 0.05}}></View>
                                                <View style={styles.plan_payment}>
                                                    <RNPickerSelect
                                                        value ={this.state.selected_term}
                                                        onValueChange={(value) => this.changeRepeatTerms(value)}
                                                        items={this.state.terms_arr}
                                                        placeholderTextColor={Colors.dark_gray}
                                                        style={styles.plan_payment_term}
                                                        placeholder={placeholder_terms}
                                                        textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.plan_item}>
                                                {/* <TextInput
                                                    value={this.state.invoice_date}
                                                    onChangeText={(text) => this.setState({invoice_date : text})}
                                                    style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean}}
                                                    placeholder={"Next Invoice"}
                                                    underlineColorAndroid='transparent'
                                                    textInputProps={{fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean}}
                                                /> */}
                                                <TouchableOpacity style={{flex : 0.4, borderBottomWidth : 1, borderBottomColor : Colors.gray_color, padding : 10 * metrics}} onPress={() => this.setState({isNextInvoiceDate : true})}>
                                                    <Text style={{fontSize : 13 * metrics, color : Colors.dark_gray}}>{this.state.next_invoice_date == '' ? 'Next Invoice' : this.state.next_invoice_date}</Text>
                                                    <DateTimePicker
                                                        mode="date"
                                                        isVisible={this.state.isNextInvoiceDate}
                                                        onConfirm={this.handleNextInvoice}
                                                        onCancel={this.hideNextInvoice}
                                                    />
                                                </TouchableOpacity>
                                                <View style={{flex : 0.1}}></View>
                                                <TextInput
                                                    value={this.state.repeat_util}
                                                    onChangeText={(text) => this.setState({repeat_util : text})}
                                                    style={{height : 40 * metrics, flex : 0.5,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, backgroundColor : 'transparent'}}
                                                    placeholder={"Repeat Invoice"}
                                                    keyboardType="numeric"
                                                    underlineColorAndroid='transparent'
                                                />
                                            </View>
                                            <View style={styles.plan_item}>
                                                <TextInput
                                                    value={this.state.reference}
                                                    onChangeText={(text) => this.setState({reference : text})}
                                                    style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, backgroundColor : 'transparent'}}
                                                    placeholder={"PO Reference"}
                                                    underlineColorAndroid='transparent'
                                                    textInputProps={{fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean}}
                                                />
                                                <View style={{flex : 0.1}}></View>
                                                <TextInput
                                                    value={this.state.notes}
                                                    onChangeText={(text) => this.setState({notes : text})}
                                                    style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, backgroundColor : 'transparent'}}
                                                    placeholder={"Notes"}
                                                    underlineColorAndroid='transparent'
                                                />
                                            </View>
                                        </View>
                                    }
                                    {
                                        this.state.invoice_num != '' && this.state.invoice_num != false &&
                                        <Text style={{marginLeft : 25 * metrics,marginTop : 15 * metrics, fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, fontWeight : 'bold'}}>{this.state.invoice_num}</Text>
                                    }
                                    
                                    <View style={styles.customer}>
                                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                                            <Text style={{flex : 0.9, fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics}}>Customer *</Text>
                                            <TouchableOpacity style={{flex : 0.1,alignItems : 'flex-end'}} onPress={() => this.addCustomer()}>
                                                <MaterialCommunityIcons name="plus-box" size={40 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                            <View style={{flex : 0.2,marginTop : 5 * metrics}}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Name</Text>
                                            </View>
                                            <View style={styles.name_body}>
                                                <TextInput
                                                    placeholder="Please enter customer name."
                                                    value={this.state.customer_name}
                                                    onChangeText={(text) => this.setState({customer_name : text})}
                                                    style={{width : '100%', height : 45 * metrics, backgroundColor : 'transparent', fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean}}
                                                />
                                            </View>
                                            <TouchableOpacity style={{flex : 0.15,alignItems : 'flex-end'}} onPress={() => this.showCustomerList()}>
                                                <FontAwesome5 name="eye" size={30 * metrics} color={Colors.main_color}></FontAwesome5>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                            <View style={{flex : 0.2, justifyContent : 'center',marginTop : 5 * metrics}}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Email</Text>
                                            </View>
                                            <View style={styles.name_body}>
                                                <TextInput
                                                    placeholder="Please enter customer email."
                                                    value={this.state.customer_email}
                                                    onChangeText={(text) => this.setState({customer_email : text})}
                                                    style={{width : '100%', height : 45 * metrics, backgroundColor : 'transparent', fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean}}
                                                />
                                            </View>
                                            <View style={{flex : 0.15}}></View>
                                        </View>
                                    </View>
                                    <View style={styles.payment_terms}>
                                        <RNPickerSelect
                                            value={this.state.selected_term}
                                            onValueChange={(value) => this.changeTerms(value)}
                                            items={this.state.terms_arr}
                                            placeholderTextColor={Colors.dark_gray}
                                            style={this.state.isReady ? global_style.text_input_active : global_style.text_input}
                                            placeholder={placeholder_terms}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
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
                                    {/* <View style={styles.payment_terms}>
                                        <RNPickerSelect
                                            onValueChange={(value) => this.changeType(value)}
                                            items={this.state.tax_arr}
                                            placeholderTextColor={Colors.dark_gray}
                                            style={this.state.isReady ? global_style.text_input_active : global_style.text_input}
                                            placeholder={placeholder_tax}
                                            textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                        />
                                    </View>
                                    <View style={styles.vat}>
                                        <Text style={{flex : 0.2 , fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>VAT </Text>
                                        <View style={{flex : 0.05}}></View>
                                        <Text style={{flex : 0.75 , fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>{this.state.vat == '' ? '' : "£ " + this.state.vat}</Text>
                                    </View> */}
                                    <View style={styles.total_balance}>
                                        <Text style={{flex : 0.4 , fontFamily : Fonts.adobe_clean, fontSize : 16 * metrics, color : Colors.dark_gray}}>Total Balance Due</Text>
                                        <Text style={{flex : 0.6 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray, textAlign : 'right' , fontWeight : 'bold'}}>£ {Number(this.state.total_balance).toFixed(2)}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.add_product} onPress={() => {
                                        global.is_add = false
                                        global.item = ''
                                        global.idx = -1
                                        global.tab_name = 'Sales'
                                        this.props.navigation.navigate('AddProduct')                                
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
                                    <View style={styles.payment_detail}>
                                        <Text style={styles.detail_title}>Payment details : </Text>
                                        <Text style={styles.detail_text}>Bank Name : {global.user_info.company_name}</Text>
                                        <Text style={styles.detail_text}>Account Name : {global.user_info.account_name}</Text>
                                        <Text style={styles.detail_text}>Sort Code : {global.user_info.sort_code}</Text>
                                        <Text style={styles.detail_text}>Account Number : {global.user_info.account_number}</Text>
                                    </View>
                                    <View style={{marginTop : 40 * metrics, width : '70%', alignSelf : 'center'}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.dark_gray}}>Invoice Number will be auto generated after confirming the draft invoice</Text>
                                    </View>
                                </ScrollView>
                            </View>
                            :
                            <View style={{flex : 1, marginTop : 20 * metrics}}>
                                <ScrollView>
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
                                            <Text style={styles.right_text}>REPEAT INVOICE</Text>
                                            <View style={{marginLeft : 5 * metrics}}></View>
                                            <Switch
                                                onValueChange = {() => this.onChangeInvoice()}
                                                value = {this.state.repeat_invoice}
                                                trackColor={{true: Colors.main_color, false: Colors.dark_gray}}
                                                thumbColor={Colors.white_color}
                                            />
                                        </View>
                                    
                                    </View>
                                    <View style={styles.customer}>
                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                            <View style={{flex : 0.5}}>
                                                <Text style={[styles.custom_text, {color : 'black'}]}>Customer</Text>
                                            </View>
                                            <View style={{flex : 0.5}}>
                                                <Text style={styles.custom_value}>{this.state.invoice_num}</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 15 * metrics}}>
                                            <View style={{flex : 0.5}}>
                                                <Text style={styles.custom_text}>Name</Text>
                                            </View>
                                            <View style={{flex : 0.5}}>
                                                <Text style={styles.custom_value}>{this.preview_obj.name}</Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection : 'row', alignItems : 'center', marginTop : 7 * metrics}}>
                                            <View style={{flex : 0.5}}>
                                                <Text style={styles.custom_text}>Email</Text>
                                            </View>
                                            <View style={{flex : 0.5}}>
                                                <Text style={styles.custom_value}>{this.preview_obj.email}</Text>
                                            </View>
                                        </View>
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
                                            <Text style={styles.custom_value}>{this.preview_obj.inv_date}</Text>
                                        </View>
                                        <View style={{flex : 0.1}}></View>
                                        <View style={styles.date_item}>
                                            <Text style={styles.custom_value}>{this.preview_obj.inv_date}</Text>
                                        </View>
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
                        this.state.is_show_customer && 
                        <View style={global_style.modal_bg}>
                            <View style={styles.modal_body}>
                                <View style={styles.customer_body}>
                                    <View style={{flex : 0.2}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 19 * metrics, color : Colors.dark_gray, fontWeight : '600'}}>Customer List</Text>
                                        <View style={{marginTop : 15 * metrics}}></View>
                                        <TextInput
                                            style={{height : 45 * metrics}}
                                            value={this.state.search_text}
                                            placeholder={"Search Customer"}
                                            onChangeText = {(value) => this.setState({search_text : value}, () => this.searchList())}
                                        />
                                    </View>
                                    <View style={{flex : 0.7}}>
                                        <ScrollView>
                                            {
                                                this.state.customer_arr.map((item , idx) => {
                                                    return (
                                                        <TouchableOpacity style={idx == this.state.select_customer_idx ? styles.active_customer_item : styles.customer_item} key={idx} onPress={() => this.setState({select_customer_idx : idx})}>
                                                            <Text style={ idx == this.state.select_customer_idx ? {fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.main_color} : {fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics}}>{item.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                        
                                    </View>
                                    <View style={{flex : 0.1, justifyContent : 'flex-end', flexDirection : 'row', alignItems : 'flex-end'}}>
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
        minHeight : 25 * metrics,
        alignItems : 'center',
        justifyContent : 'center',
        //padding : 10 * metrics
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
    vat : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth :1,
        minHeight : 55 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row',
        padding : 10 * metrics,
        alignItems : 'center',
    },
    total_balance : {
        width : '90%',
        borderColor : Colors.dark_gray,
        borderWidth : 2,
        minHeight : 55 * metrics,
        alignSelf : 'center',
        marginTop : 15 * metrics,
        flexDirection : 'row',
        padding : 10 * metrics,
        alignItems : 'center',
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
        justifyContent : 'center',
        minHeight : 20 * metrics,
        paddingLeft : 10 * metrics
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
        backgroundColor : Colors.main_blue_color,
        justifyContent : 'center',
        alignItems : 'center'
    },
    cancel_btn : {
        marginLeft : 20 * metrics,
        width : 100 * metrics,
        height : 40 * metrics,
        borderWidth : 1,
        borderRadius : 10 * metrics,
        backgroundColor : Colors.red_color,
        justifyContent : 'center',
        alignItems : 'center'
    },
    place_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.white_gray_color
    },
    customer_name : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : Colors.dark_gray
    },
    name_body : {
        flex : 0.7, padding : 5 * metrics, alignItems : 'flex-start'
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
    },
    date_view : {
        flex : 0.45,
        flexDirection : 'row',
        // justifyContent : 'center',
        alignItems : 'center',
    },
})