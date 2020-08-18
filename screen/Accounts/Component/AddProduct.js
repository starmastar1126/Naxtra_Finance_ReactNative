import React from 'react';
import {Text, View, Button,StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Switch, BackHandler,ActivityIndicator} from 'react-native';
import * as Images from '../../../constants/Image'
import { SafeAreaView } from 'react-navigation'
import global_style, {metrics} from '../../../constants/GlobalStyle'
import * as Colors from '../../../constants/Colors'
import AddProductComponent from '../../../components/AddProductComponent'
import { Fonts } from '../../../constants/Fonts';
import HeaderComponent from '../../../components/HeaderComponent';
import { RadioButton } from 'react-native-paper'
import RNPickerSelect from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ProductService from '../../../service/ProductService';
import { changeNumber } from '../../../utils/utils';

const placeholder_terms = {
    label : 'Payment Terms',
    value : null,
    color : 'gray'
}

export default class AddProduct extends React.Component {
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
            terms_arr : [],
            product_arr : [],
            activeIdx : 0,
            is_add : false,
            invoice_arr : [],
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

    showSaveList (data) {
        var arr = global.invoice_arr
        if (global.idx != -1 && arr.length > 0) {
            for (var i = 0 ; i < arr.length ; i++) {
                if (i == global.idx) {
                    arr[i] = data
                }
            }
        } else {
            arr.push(data)
        }
        global.invoice_arr = arr
        this.setState({
            invoice_arr : arr,
            is_add : false,
            isReady : arr.length > 0 ? true : false
        })
    }

    addProduct (value, item, idx) {
        if (value == 'add') {
            this.setState({is_add : true})
            global.product_info = item
            global.idx = idx
        } else {
            this.setState({
                is_add : true
            })
            global.product_info = item
            global.idx = idx
        }
    }
    setData(data , idx) {
        global.product_info = data
        global.idx = idx
        this.setState({is_add : true})
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
            this.setState({
                invoice_arr : result_arr
            }, () => {
                global.invoice_arr = result_arr
            })
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
    componentWillReceiveProps() {
        this.componentDidMount()
    }
    //
    getProducts () {
        this.setState({invoice_arr : global.invoice_arr, isLoading : true})
        ProductService.getAllProducts(global.token).then(res => {
            var result = res.data.result
            if (result.success) {
                var data = result.response.records
                this.setState({product_arr : data}, () => {
                    if (global.is_add) {
                        this.setData(global.item, global.idx)
                    }
                })
            } else {
                console.log('error = ' , result)
                this.setState({terms_arr : []})
            }
            this.setState({isLoading : false})
        }).catch(error => {
            console.log('error = ' , error.message)
            this.setState({isLoading : false})
        })
    }

    onProceed () {
        if (!this.state.isReady)
            return
        this.props.navigation.navigate('AccountTabScreen', {refresh : true})
    }

    componentDidMount() {  
        this.getProducts()
        if (global.invoice_arr.length > 0) {
            this.setState({isReady : true})
        }
        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    

    createProduct () {  
        this.props.navigation.navigate('CreateProduct')
    }

    render() {
        return (
            <View style={{flex : 1}}>
                <SafeAreaView style={{flex : 1, backgroundColor : Colors.white_color}}>
                    <HeaderComponent backTitle="Add Products" navigation ={this.props.navigation} goBack={() => {
                        this.props.navigation.navigate('AccountTabScreen')
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
                                <View style={styles.create_product_body}>
                                    <TouchableOpacity onPress={() => this.createProduct()}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : Colors.gray_color, fontWeight : '600'}}>Create Product</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.invoice_item_title}>
                                    <Text style={styles.item_title}>Invoice Items</Text>
                                    <TouchableOpacity style={{flex: 0.1, justifyContent : 'flex-end'}} onPress={() => this.addProduct('add', '', -1)}>
                                        <MaterialCommunityIcons name="plus-box" size={40 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                </View>
                                {
                                    this.state.invoice_arr.map((item, idx) => {
                                        return (
                                            <View style={styles.product_item} key={idx}>
                                                <View style={{flexDirection : 'row', alignItems : 'center',marginTop : 10 * metrics}}>
                                                    <Text style={{flex : 0.6 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color : Colors.dark_gray}} numberOfLines={1}>{item.name}</Text>
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
                    this.state.is_add && 
                    <View style={global_style.modal_bg}>
                        <View style={styles.modal_body}>
                            <AddProductComponent navigation={this.props.navigation} product_arr={this.state.product_arr} gotoList={() => this.showList()} gotoSaveList={(data) => this.showSaveList(data)}></AddProductComponent>
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
    product_item : {
        width : '90%',
        alignSelf : 'center',
        borderWidth : 1,
        minHeight : 120 * metrics,
        marginTop : 15 * metrics,
        borderColor : Colors.dark_gray,
        padding : 20 * metrics,
        backgroundColor : "#fbf6f6"
    },
    product_item_text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : Colors.dark_gray
    },
    background : {
        backgroundColor :'black', 
        opacity : 0.5 , 
        width : '100%' , 
        height: '110%',
        zIndex : 999,
        elevation : Platform.OS == 'android' ? 3.5 : 0.8,
        justifyContent : 'center'
    },
    modal_body : {
        width : '90%',
        alignSelf : 'center',
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems :'center',
        marginTop : 120 * metrics
    }
})