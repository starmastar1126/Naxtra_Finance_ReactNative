import React from 'react';
import {Text, View, Button,StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Switch, BackHandler,ActivityIndicator} from 'react-native';
import * as Images from '../../../constants/Image'
import { SafeAreaView } from 'react-navigation'
import global_style, {metrics} from '../../../constants/GlobalStyle'
import * as Colors from '../../../constants/Colors'
import { Fonts } from '../../../constants/Fonts';
import HeaderComponent from '../../../components/HeaderComponent';
import { RadioButton } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { CheckBox } from 'react-native-elements'
import ProductService from '../../../service/ProductService'

const placeholder_terms = {
    label : 'Payment Terms',
    value : null,
    color : 'gray'
}

export default class CreateProduct extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };
    constructor(props) {
        super(props)
        this.state = {
            repeat_invoice : false,
            terms_arr : [
                {
                    label : '(No Terms Security)',
                    value : 0,
                    color : 'black'
                },
                {
                    label : 'Due pm receive',
                    value : 1,
                    color : 'black'
                },
                {
                    label : 'Net 15 Days',
                    value : 2,
                    color : 'black'
                },
                {
                    label : 'Net 30 Days',
                    value : 3,
                    color : 'black'
                },
                {
                    label : 'Net 60 Days',
                    value : 4,
                    color : 'black'
                },
            ],
            activeIdx : 0,
            is_add : false,
            product_name : '',
            product_sale_price : 0,
            product_sale_tax : '',
            product_cost : 0,
            product_purchase_tax : '',
            is_sold : true,
            is_purchased : true,
            is_expense : false,
            isReady : false,
            isLoading : false
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    
    onChangeInvoice() {
        this.setState({repeat_invoice : !this.state.repeat_invoice})
    }
    changeType (type) {

    }
    showList () {
        this.setState({is_add : false})
    }
    addProduct (value) {
        if (value == 'add') {
            this.setState({is_add : true})
        } else {
            this.setState({is_add : true})
        }
    }
    handleBackButtonClick () {
        if (this.state.is_add) {
            this.setState({is_add : false})
            return true
        } else {
            return false
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    //

    componentDidMount() {       
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    onChangeExpenses () {
        this.setState({is_expense : !this.state.is_expense})
    }

    onChangeSold () {
        this.setState({is_sold : !this.state.is_sold})
    }

    onChangePurchased () {
        this.setState({is_purchased : !this.state.is_purchased})
    }

    checkReady () {
        if (this.state.product_name != '' && this.state.product_sale_tax != '' && this.state.product_sale_price != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }

    onProceed () {
        if (!this.state.isReady)
            return
        
        var obj = {
            name: this.state.product_name,
            type: "service",
            categ_id: "1",
            lst_price: this.state.product_sale_price,
            standard_price: this.state.product_cost
        }

        this.setState({isLoading : true})
        ProductService.addProduct(global.token, obj).then(res => {
            var result = res.data.result
            if (result.success) {
                this.props.navigation.navigate('AddProduct', {refresh : true})
            } else {
                alertMessage(result.message)
            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
            console.log('erro = ' , err.message)
        })
    }

    render() {
        return (
            <View style={{flex : 1}}>
                <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
                    <HeaderComponent backTitle="Create Products" navigation ={this.props.navigation} goBack={() => {
                        this.props.navigation.navigate('AddProduct', {refresh : true})
                    }}></HeaderComponent>
                    <View style={{flex : 1}}>
                        <View style={{flex : 0.85}}>
                            <ScrollView style={{flex : 1}}>
                                <View style={styles.top_setting}>
                                    <TouchableOpacity style={styles.setting_item}>
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
                                                    onValueChange={(value) => this.changeType(value)}
                                                    items={this.state.terms_arr}
                                                    placeholderTextColor={Colors.dark_gray}
                                                    style={styles.plan_payment_term}
                                                    placeholder={placeholder_terms}
                                                    textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.plan_item}>
                                            <TextInput
                                                value={this.state.invoice_date}
                                                onChangeText={(text) => this.setState({invoice_date : text})}
                                                style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, borderBottomColor : Colors.dark_gray, borderBottomWidth : 1}}
                                                placeholder={"Next Invoice"}
                                                underlineColorAndroid='transparent'
                                                textInputProps={{fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean}}
                                            />
                                            <View style={{flex : 0.1}}></View>
                                            <TextInput
                                                value={this.state.repeat_util}
                                                onChangeText={(text) => this.setState({repeat_util : text})}
                                                style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, borderBottomColor : Colors.dark_gray, borderBottomWidth : 1}}
                                                placeholder={"Repeat Invoice"}
                                                underlineColorAndroid='transparent'
                                            />
                                        </View>
                                        <View style={styles.plan_item}>
                                            <TextInput
                                                value={this.state.reference}
                                                onChangeText={(text) => this.setState({reference : text})}
                                                style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, borderBottomColor : Colors.dark_gray, borderBottomWidth : 1}}
                                                placeholder={"PO Reference"}
                                                underlineColorAndroid='transparent'
                                                textInputProps={{fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean}}
                                            />
                                            <View style={{flex : 0.1}}></View>
                                            <TextInput
                                                value={this.state.notes}
                                                onChangeText={(text) => this.setState({notes : text})}
                                                style={{height : 40 * metrics, flex : 0.45,fontSize : 13 * metrics, fontFamily : Fonts.adobe_clean, borderBottomColor : Colors.dark_gray, borderBottomWidth : 1}}
                                                placeholder={"Notes"}
                                                underlineColorAndroid='transparent'
                                            />
                                        </View>
                                    </View>
                                }
                                {/* <View style={styles.create_product_body}>
                                    <TouchableOpacity onPress={() => this.createProduct()}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.gray_color, fontWeight : '600'}}>Create Product</Text>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={styles.invoice_item_title}>
                                    <Text style={styles.item_title}>Create Products</Text>
                                    {/* <TouchableOpacity style={{flex: 0.1, justifyContent : 'flex-end'}} onPress={() => this.addProduct('add')}>
                                        <MaterialCommunityIcons name="plus-box" size={40 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                    </TouchableOpacity> */}
                                </View>
                                {
                                    <View style={styles.product_body}>
                                        <View style={styles.product_item}>
                                            <View style={styles.product_title}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics,color : Colors.dark_gray}}>Product Name</Text>
                                            </View>
                                            <TextInput
                                                value={this.state.product_name}
                                                style={styles.product_value}
                                                onChangeText={(value) => this.setState({product_name : value},() => this.checkReady())}
                                            />
                                        </View>
                                        <View style={styles.product_item}>
                                            <View style={styles.product_title}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics,color : Colors.dark_gray}}>Sales Price</Text>
                                            </View>
                                            <TextInput
                                                value={this.state.product_sale_price}
                                                style={styles.product_value}
                                                keyboardType={"numeric"}
                                                onChangeText={(value) => this.setState({product_sale_price : value},() => this.checkReady())}
                                            />
                                        </View>
                                        <View style={styles.product_item}>
                                            <View style={styles.product_title}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics,color : Colors.dark_gray}}>Sales Taxes</Text>
                                            </View>
                                            <TextInput
                                                value={this.state.product_sale_tax}
                                                style={styles.product_value}
                                                onChangeText={(value) => this.setState({product_sale_tax : value},() => this.checkReady())}
                                            />
                                        </View>
                                        <View style={styles.product_item}>
                                            <View style={styles.product_title}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics,color : Colors.dark_gray}}>Cost</Text>
                                            </View>
                                            <TextInput
                                                value={this.state.product_cost}
                                                style={styles.product_value}
                                                keyboardType={"numeric"}
                                                onChangeText={(value) => this.setState({product_cost : value},() => this.checkReady())}
                                            />
                                        </View>
                                        <View style={styles.product_item}>
                                            <View style={styles.product_title}>
                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics,color : Colors.dark_gray}}>Purchase Taxes</Text>
                                            </View>
                                            <TextInput
                                                value={this.state.product_purchase_tax}
                                                style={styles.product_value}
                                                onChangeText={(value) => this.setState({product_purchase_tax : value},() => this.checkReady())}
                                            />
                                        </View>
                                        
                                        <View style={styles.check_box_body}>
                                            <CheckBox
                                                title='Can be sold'
                                                checked={this.state.is_sold}
                                                containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                                textStyle={!this.state.is_sold ? styles.check_title : styles.checked_title}
                                                checkedColor={Colors.main_color}
                                                onPress={()=> this.onChangeSold()}
                                            />
                                            <CheckBox
                                                title='Can be Purchased'
                                                checked={this.state.is_purchased}
                                                containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                                textStyle={!this.state.is_purchased ? styles.check_title : styles.checked_title}
                                                checkedColor={Colors.main_color}
                                                onPress={()=> this.onChangePurchased()}
                                            />
                                            <CheckBox
                                                title='Can be Expenses'
                                                checked={this.state.is_expense}
                                                containerStyle={{borderWidth : 0, marginLeft : 0, backgroundColor : 'transparent'}}
                                                textStyle={!this.state.is_expense ? styles.check_title : styles.checked_title}
                                                checkedColor={Colors.main_color}
                                                onPress={()=> this.onChangeExpenses()}
                                            />
                                        </View>
                                        <View style={styles.other_body}>
                                            <Image source={Images.img} style={{width : 50 * metrics, height : 50 * metrics}} resizeMode="contain"></Image>
                                            <View style={{marginLeft : 15 * metrics}}></View>
                                            <Image source={Images.product} style={{width : 45 * metrics, height : 40 * metrics}} resizeMode="contain"></Image>
                                        </View>
                                    </View>
                                }
                            </ScrollView>
                        </View>
                        <View style={global_style.bottom_button_body}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onProceed()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Proceed</Text>
                                    <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                </View>
                            </TouchableOpacity>
                        </View>
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
    create_product_body : {
        width : '90%',
        alignItems : 'flex-end',
        alignSelf : 'center',
        marginTop : 15 * metrics
    },
    invoice_item_title : {
        flexDirection : 'row',
        width : '90%',
        alignSelf : 'center',
        marginTop : 20 * metrics,
        alignItems : 'center',
    },
    item_title :{
        fontSize : 18 * metrics,
        fontFamily : Fonts.adobe_clean,
        flex: 0.9
    },
    product_body : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        minHeight : 120 * metrics,
        marginTop : 15 * metrics,
        borderColor : Colors.dark_gray,
        padding : 20 * metrics,
        backgroundColor : "#fbf6f6"
    },
    product_item : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'center',
        height : 50 * metrics
    },
    product_title : {
        flex : 0.5, justifyContent : 'flex-end',height : 50 * metrics
    },
    product_value : {
        flex : 0.5, fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean,borderBottomWidth : 1,borderColor : Colors.white_gray_color, justifyContent :'center'
    },
    check_box_body : {
        width : '88%',
        alignSelf : 'center',
        marginTop : 30 * metrics
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
    other_body : {
        width : '90%',
        alignSelf : 'center',
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center'
    }
})