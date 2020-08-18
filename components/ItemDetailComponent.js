/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,Text, View, TouchableOpacity , Image ,ActivityIndicator, Alert, ScrollView, BackHandler} from 'react-native'

import * as Colors from '../constants/Colors'
import * as Images from '../constants/Image'
import PropTypes from 'prop-types'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import global_style ,{ metrics } from '../constants/GlobalStyle'
import Textarea from 'react-native-textarea'
import { Avatar } from 'react-native-elements'
import Stars from 'react-native-stars'
import TransactionService from '../service/TransactionService';
import {Fonts} from '../constants/Fonts'
import ImagePicker from 'react-native-image-picker';
import { getHoursAndMins ,paramDate2, alertMessage, getHoursAndMinsFromStr,changeDatefromAccount} from '../utils/utils';
import { TextInput } from 'react-native-paper';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';

import RNFetchBlob from 'rn-fetch-blob'
import { WEB_API } from '../utils/keyInfo';
const { config } = RNFetchBlob;
const DocumentDir = RNFetchBlob.fs.dirs.SDCardApplicationDir;

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class ItemDetailComponent extends Component {
    constructor (props) { 
        super(props)
        this.state = {
            item : null,
            starCount : 0,
            receipt_files : [],
            showNote : false,
            description : '',
            add_note : '',
            isLoading : false,
            attachs_list : [],
            is_subScreen : false,
            categories : [],
            m_categories : [],
            selectCatID : -1 ,
            selectCatName : '',
            selectCatIcon : '',
            search_text : '',
            category_name : ''
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    handleBackButtonClick = () => {
        if (this.state.is_subScreen) {
            this.setState({is_subScreen : false})
            return true
        } else {
            return false
        }
        
    }
    componentDidMount () {
        global.file_path = ''
        global.file_name = ''
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({
            add_note : this.props.trans_data.note,
            description : this.props.trans_data.note,
            receipt_files : this.props.trans_data.attach,
            starCount : Number(this.props.trans_data.rating),
        })
        TransactionService.getAllTransactionCategories(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({categories : data.response.records, m_categories : data.response.records})
                var count = 0 
                if (data.response.records.length > 0) {
                    for (var i =0 ;i < data.response.records.length; i++) {
                        if (this.props.origin_data.rb_classification_account_id[0] == data.response.records[i].id) {
                            this.setState({category_name : data.response.records[i].name, selectCatIcon : data.response.records[i].image_variant})
                            count ++
                            break
                        }
                    }
                    if (count == 0 && this.props.origin_data.rb_classification_account_id != false) {
                        var text = this.props.origin_data.rb_classification_account_id[1].split(' ')
                        var result = ''
                        for (var i = 1  ; i < text.length ; i ++) {
                            result += text[i] + ' '
                        }
                        this.setState({category_name : result})
                    }
                }
            } else {
                this.setState({categories : []})
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }
    onHide = (item) => {
        var obj = {
            transaction_id : item.id
        }
        this.props.funcLoading(true)
        TransactionService.hideTransactions(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.props.closeModal()
            } else {
                alertMessage(data.message)
            }
            this.props.funcLoading(false)
        }).catch(error => {
            console.log(error.message)
            this.props.funcLoading(false)
        })
    }
    onShow = (item) => {
        var obj = {
            transaction_ids : [item.id]
        }
        this.props.funcLoading(true)
        TransactionService.showTransactions(obj, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.props.closeModal()
            } else {
                alertMessage(data.message)
            }
            this.props.funcLoading(false)
        }).catch(error => {
            this.props.funcLoading(false)
        })
    }
    contactUS = () => {
        this.props.navigation.navigate('Chat')
    }

    onStarRatingPress = (rating) => {
        this.setState({starCount : rating})
    }

    onAttachFile = () => {
        var options = {
            title: '',
            takePhotoButtonTitle: 'Camera',
            chooseFromLibraryButtonTitle: 'Photo Gallery',
            tintColor: '#57C0FD',
            noData: false,
            quality: 0.1,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // var res = this.state.receipt_files
                // var obj = {
                //     create_date : new Date(),
                //     datas : response.data
                // }
                // res.push(obj)
                // this.setState({receipt_files : res}, () => this.addAttach(response.data))
                this.addAttach(response.data)
            }
        });
    }

    checkReady = (data) => {
        // console.log('checkReady = ' , data)
    }

    addAttach = (data) => {
        var obj = {
            transaction_id : this.props.origin_data.id,
            attachment_name:"shopping",
            attach : [
                {
                    attach : data
                }
            ]
        }
        TransactionService.addAttach(obj , global.token).then(res => {
            var data = res.data.result
            // console.log('data = ' ,res.data.result)
            if (data.success) {
                this.getAllAttach()
            } else {
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ = ' , data.message)
                if (data.success == undefined) {
                    alertMessage(res.data.result[1])
                }
            }
        }).catch(error => {
            console.log('error = ' , error.message)
        })
    }

    getAllAttach () {
        this.setState({receipt_files : [], isLoading : true})
        TransactionService.getAttach(this.props.item.naxetra_id, global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({receipt_files : data.response, isLoading : false})
            } else {
                this.setState({receipt_files : [], isLoading :false})
            }
        }).catch(error => {
            console.log('error3 = ' , error.message)
            this.setState({isLoading : false})
        })
    }

    addNote = () => {
        var obj = {
            transaction_id : this.props.item.naxetra_id,
            add_note : this.state.description
        }
        TransactionService.addNote(obj , global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                console.log('good works!!!')
            } else {
                console.log('error = ' , data.message)
            }
            this.setState({showNote : false})
        }).catch(error => {
            console.log('error = ' , error)
        })
    }

    addRating = () => {
        var obj = {
            transaction_id : this.props.item.naxetra_id,
            rate : this.state.starCount.toString()
        }
        TransactionService.addRating(obj, global.token).then(res => {
            var data = res.data.result
            console.log('rating = ' , data)
        }).catch(error => {
            console.log('error = ' , error)
        })
    }

    async createPDF() {
        if (global.file_path != '') {
            this.props.navigation.navigate('PdfScreen')
        } else {
            this.setState({isLoading : true})
            global.trans_id = this.props.item.naxetra_id
            var name = 'kkk'
            let options = {
                fileCache: true,
                // addAndroidDownloads: {
                //     useDownloadManager: true,
                //     notification: true,
                //     title: `${name} file report`, 
                //     path: DocumentDir + `/${name}Report` + '.pdf',
                //     description: 'Downloading file.',
                // },
            };

            var url = WEB_API + 'generate_statement/' + this.props.item.naxetra_id + '/'
            console.log('url = ', url)
            config(options)
                .fetch(
                    "POST",
                    url,
                    {
                        'Content-type': 'application/pdf',
                        'user-token' : token,
                    }
                )
                .then(response => {
                    this.setState({isLoading : false})
                    this.setState({base64 : response.path()})
                    global.file_path = response.path()
                    global.file_name = 'Naxetra - ' + this.props.origin_data.transaction_number
                    global.trans_id = this.props.item.naxetra_id
                    this.props.navigation.navigate('PdfScreen')
                })
                .catch(err => {
                this.setState({isLoading : false})
                return reject(err);
            });
        }
        
    }

    customerSupplier () {
        alertMessage('Feature Coming Soon!')
    }

    onChangeSearchText (text) {
        this.setState({search_text : text},() => {
            if (text == '') {
                //console.log('lenght = ' , this.state.m_categories.length)
                this.setState({categories : this.state.m_categories}, () => console.log('length = ', this.state.categories))
            } else {
                var arr = []
                for (var i = 0 ; i < this.state.m_categories.length ; i ++) {
                    if (this.state.m_categories[i].name.toLowerCase().indexOf(text.toLowerCase())!=-1) {
                        arr.push(this.state.m_categories[i])
                    }
                }
                this.setState({categories : arr})
            }
        })
    }

    gotoCategories () {
        this.setState({is_subScreen : true})
    }


    onSelectCategory (item) {
        this.setState({
            selectCatID : item.id,
            selectCatName : item.name,
            category_name : item.name,
            selectCatIcon : item.image_variant
        })
    }
    gotoBack () {
        this.setState({
            is_subScreen : false
        })
        TransactionService.updateCategoryInTransaction(global.token,this.state.selectCatID,this.props.item.naxetra_id).then(res => {
            var data = res.data.result
            console.log('datae = ', data)
        }).catch(error => {
            console.log(error.message)
        })
    }

    gotoViewAll() {
        global.trans_id = this.props.item.naxetra_id
        this.props.navigation.navigate('ViewAllScreen')
    }


    reduceFirstArr = (idx) => {
        var res = this.state.first_recept_files
        if (res.length > 0) {
            var temp = []
            for (var i = 0 ; i < res.length ; i++) {
                if (i != idx) {
                    temp.push(res[i])
                }
            }
            this.setState({first_recept_files : temp})
        }
    }
    reduceArr = (idx) => {
        var res = this.state.receipt_files
        if (res.length > 0) {
            var temp = []
            for (var i = 0 ; i < res.length ; i++) {
                if (i != idx) {
                    temp.push(res[i])
                }
            }
            this.setState({receipt_files : temp})
        }
    }

    updateTransactions () {

    }

    removeAttachFile () {
        
    }

    closeBtn (idx) {
        var id = this.state.receipt_files[idx].id
        //this.setState({isLoading : true})
        TransactionService.removeAttach(global.token, id).then(res => {
            var data = res.data.result
            if (data.success) {
                this.getAllAttach()
            }
            console.log('rating = ' , data)
        }).catch(error => {
            console.log('error = ' , error)
        })
    }

    gotoViewPic (item) {
        global.picture = item
        this.props.navigation.navigate('ViewPicScreen')
    }
    render() {
        return (
            <View style={styles.container}>
                {
                    !this.state.is_subScreen &&
                    <View style={{flex : 1}}>
                        <View style={styles.mainBody}>
                            <View style={styles.body}>
                                <View style={styles.img_body}>
                                    {
                                        !this.props.item.rb_transaction_icon ? 
                                        <Avatar
                                            rounded
                                            overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                            size="xlarge"
                                            source={Images.default_icon}
                                            resizeMode={'stretch'}
                                            containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                            style={styles.item_img}
                                        />
                                        :
                                        <Avatar
                                            rounded
                                            overlayContainerStyle={{ backgroundColor: '#dfdfdf' }}
                                            size="xlarge"
                                            source={{uri : 'data:image/png;base64,' + this.props.item.rb_transaction_icon}}
                                            resizeMode={'stretch'}
                                            containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                            style={styles.item_img}
                                        />
                                    }
                                </View>
                                <ScrollView>
                                    <View style={styles.item_textBody}>
                                        {
                                            this.props.origin_data.transaction_type == 'out' ? 
                                            <Text style={styles.title}>{this.props.origin_data.transaction_info_details}</Text>
                                            :
                                            <Text style={styles.title}>{!this.props.origin_data.transaction_info_details ? 'Transaction' : this.props.origin_data.transaction_info_details}</Text>
                                        }
                                        <View style={{marginTop : 5 * metrics}}></View>
                                        
                                        {
                                            !this.props.origin_data.create_date ? 
                                            <Text style={styles.time}>{paramDate2(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London'}))} {getHoursAndMins(new Date().toISOString())}</Text>
                                            :
                                            <Text style={styles.time}>{changeDatefromAccount(this.props.origin_data.create_date.split(' ')[0])} {getHoursAndMinsFromStr(this.props.origin_data.create_date.split(' ')[1])}</Text>
                                        }
                                        <View style={{marginTop : 8 * metrics}}></View>
                                        
                                        <TouchableOpacity style={styles.rest_button} onPress={() => this.gotoCategories()}>
                                            {
                                                (this.state.selectCatIcon == '' || !this.state.selectCatIcon) ? 
                                                <MaterialCommunityIcons name="link-plus" size={22 * metrics} style={{alignSelf : 'center',textAlign : 'center',color : Colors.main_blue_color}}></MaterialCommunityIcons>
                                                :
                                                <Avatar
                                                    rounded
                                                    overlayContainerStyle={{ backgroundColor: '#dfdfdf',opacity : 1 }}
                                                    size="xlarge"
                                                    source={{uri : 'data:image/png;base64,' + this.state.selectCatIcon}}
                                                    resizeMode={'stretch'}
                                                    containerStyle={{ borderColor: 1, borderColor: 'gray' }}
                                                    style={styles.icon_img}
                                                />
                                            }
                                            <Text style={{marginLeft : 5 * metrics,textAlign : 'center',color : Colors.main_blue_color , fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics}}>{this.state.category_name == '' ? 'Default' : this.state.category_name}</Text>
                                        </TouchableOpacity>
                                        <View style={{marginTop : 20 * metrics}}></View>
                                        {
                                            this.props.origin_data.transaction_type != 'out' ?
                                            <Text style={{fontWeight : '500' , fontSize : 23 * metrics,fontFamily : Fonts.adobe_clean, textAlign : 'center', color : 'green'}}>+ £ {Math.abs(this.props.origin_data.rb_amount).toFixed(2)}</Text>                            
                                            :
                                            <Text style={{fontWeight : '500' , fontSize : 23 * metrics,fontFamily : Fonts.adobe_clean, textAlign : 'center', color : 'red'}}>- £ {Math.abs(this.props.origin_data.rb_amount).toFixed(2)}</Text>                            
                                        }
                                    </View>
                                    {
                                        !this.state.showNote &&
                                        <View>
                                            <View style={styles.trans_body}>
                                                <View style={styles.mg_body}>
                                                    <TouchableOpacity style={styles.btn} onPress={() => this.setState({showNote : true})}>
                                                        <View style={global_style.roundIcon}>
                                                            <Ionicons name="ios-git-network" size={23 * metrics} style={global_style.icon_style}></Ionicons>
                                                        </View>
                                                        <Text style={styles.item_action}>Add Note</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.btn} onPress={() => this.createPDF()}>
                                                        <View style={global_style.roundIcon}>
                                                            <MaterialCommunityIcons name="script-text-outline" size={23 * metrics} style={global_style.icon_style}></MaterialCommunityIcons>
                                                        </View>
                                                        <Text style={styles.item_action}>Generate Statement</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.btn} onPress={() => this.customerSupplier()}>
                                                        <View style={global_style.roundIcon}>
                                                            <Image source={Images.supplier_img} style={styles.supplier}></Image>
                                                        </View>
                                                        <Text style={styles.item_action}>Customer or Supplier</Text>
                                                    </TouchableOpacity>
                                                    {
                                                        this.props.origin_data.nx_hide_transaction == false ? 
                                                        <TouchableOpacity style={styles.btn} onPress={() => {
                                                            this.onHide(this.props.item)
                                                        }}>
                                                            <View style={global_style.roundIcon}>
                                                                <FeatherIcon name="eye-off" size={23 * metrics} style={global_style.icon_style}></FeatherIcon>
                                                            </View>
                                                            <Text style={styles.item_action}>Hide this Transaction</Text>
                                                        </TouchableOpacity>    
                                                        :
                                                        <TouchableOpacity style={styles.btn} onPress={() => {
                                                            this.onShow(this.props.item)
                                                        }}>
                                                            <View style={global_style.roundIcon}>
                                                                <FeatherIcon name="eye" size={23 * metrics} style={global_style.icon_style}></FeatherIcon>
                                                            </View>
                                                            <Text style={styles.item_action}>Show this Transaction</Text>
                                                        </TouchableOpacity> 
                                                    }
                                                </View>
                                            </View>
                                            
                                            <View style={styles.border_line}></View>
                                            
                                            <View style={styles.reciept_view}>
                                                <Text style={{fontSize : 15 * metrics, fontFamily : Fonts.adobe_clean,marginTop : 15 * metrics}}>Receipts</Text>
                                                <ScrollView  horizontal={true} style={{height : 100}}>
                                                    <View style={{marginTop : 15 * metrics, flexDirection : 'row',position : 'relative'}}>
                                                        <TouchableOpacity style={styles.new_receipt} onPress={() => this.onAttachFile()}>
                                                            <MaterialCommunityIcons name="camera" size={25 * metrics} style={{color : Colors.main_blue_color, alignSelf : 'center'}}></MaterialCommunityIcons>
                                                        </TouchableOpacity>
                                                        {
                                                            this.state.receipt_files.map((item, idx) => {
                                                                return (
                                                                    <View>
                                                                        <TouchableOpacity key={idx} style={{marginRight : 8 * metrics}} onPress={() => this.gotoViewPic(item)}>
                                                                            <Image source={{uri : 'data:image/png;base64,' +  item.datas}} style={styles.img_item}></Image>
                                                                        </TouchableOpacity>
                                                                        <TouchableOpacity onPress={() => this.closeBtn(idx)} style={styles.close_icon}>
                                                                            <MaterialCommunityIcons name="close-circle-outline" size={30 * metrics} color={Colors.main_blue_color}></MaterialCommunityIcons>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                )
                                                            })
                                                        }                        
                                                    </View>
                                                </ScrollView>
                                            </View>
                                            <View style={styles.border_line}></View>
                                            
                                            <View style={styles.transaction_detail}>
                                                <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,marginTop : 15 * metrics, textAlign : 'center',marginBottom : 10 * metrics}}>Transaction Details</Text>
                                                <View style={{flexDirection : 'row', marginTop : 10 * metrics}}>
                                                    <View style={{flex : 0.5}}>
                                                        <Text style={styles.detail_title}>Transaction Number</Text>
                                                    </View>
                                                    <View style={{flex : 0.5}}>
                                                        <Text style={styles.detail_number}>{this.props.origin_data.transaction_number}</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection : 'row', marginTop : 10 * metrics}}>
                                                    <View style={{flex : 0.5}}>
                                                        <Text style={styles.detail_title}>Reference</Text>
                                                    </View>
                                                    <View style={{flex : 0.5}}>
                                                        <Text style={styles.detail_number}>{!this.props.origin_data.reference ? '' : this.props.origin_data.reference}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={{marginTop : 15 * metrics}}></View>
                                            <View style={styles.border_line}></View>
                                            
                                            <View style={styles.transaction_detail}>

                                                <View style={{flexDirection : 'row', marginTop : 10 * metrics}}>
                                                    <View style={{flex : 0.7}}>
                                                        <Text style={styles.detail_title}>Naxetra Bank</Text>
                                                    </View>
                                                    <View style={{flex : 0.3}}>
                                                        <Text style={styles.detail_value}>{this.props.item.account_number}</Text>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection : 'row', marginTop : 10 * metrics}}>
                                                    <View style={{flex : 0.7}}>
                                                        <Text style={styles.detail_title}>Spent</Text>
                                                    </View>
                                                    <View style={{flex : 0.3}}>
                                                        <Text style={styles.detail_value}>£ {Number(this.props.item.spend).toFixed(2)}</Text>
                                                    </View>
                                                </View>

                                                <View style={{flexDirection : 'row', marginTop : 10 * metrics}}>
                                                    <View style={{flex : 0.7}}>
                                                        <Text style={styles.detail_title}>All Time</Text>
                                                    </View>
                                                    <View style={{flex : 0.3}}>
                                                        <Text style={styles.detail_value}>£ {Number(this.props.item.all_time).toFixed(2)}</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={{flexDirection : 'row', alignItems : 'flex-end'}}>
                                                    <View style={{flex : 0.7}}></View>
                                                    <TouchableOpacity style={{height : 45 * metrics,flex : 0.3,justifyContent: 'center', marginTop : 10 * metrics}} onPress={() => this.gotoViewAll()}>
                                                        <Text style={{color : 'red' , fontFamily : Fonts.adobe_clean, fontSize : 21 * metrics,textAlign : 'center'}}>View All</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            
                                            <View style={styles.border_line}></View>
                                            <View style={{marginTop : 14 * metrics}}></View>
                                            
                                            <View style={{flexDirection : 'row', width : '90%', alignSelf : 'center'}}>
                                                <View style={{flex : 0.15, justifyContent : 'center'}}>
                                                    <Image source={Images.location_icon} style={{width : 28 * metrics, height : 30 * metrics}} resizeMode="contain"></Image>
                                                </View>
                                                <View style={{flex : 0.85, justifyContent : 'center'}}>
                                                    <Text style={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}>United Kingdom, {this.props.origin_data.intermediary_psp_address_postcode}</Text>
                                                </View>
                                            </View>

                                            <View style={{marginTop : 15 * metrics}}></View>
                                            <View style={styles.border_line}></View>
                                
                                            <View style={styles.rating_view}>   
                                                <View style={{flex : 0.6, justifyContent : 'center'}}>
                                                    <Text style={{fontSize : 17 * metrics ,fontFamily : Fonts.adobe_clean}}>Rate Experience</Text>
                                                </View>
                                                <View style={{flex : 0.4}}>
                                                    <Stars
                                                        default={this.state.starCount}
                                                        count={5}
                                                        update={(val)=>{this.setState({starCount: val} , () => {
                                                            this.addRating()
                                                        })}}
                                                        half={false}
                                                        starSize={50}
                                                        fullStar={<MaterialCommunityIcons name={'star'} style={[styles.myStarStyle]}/>}
                                                        emptyStar={<MaterialCommunityIcons name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
                                                        halfStar={<MaterialCommunityIcons name={'star-half'} style={[styles.myStarStyle]}/>}
                                                    />
                                                    <View style={{marginBottom : 10 * metrics}}></View>
                                                </View>
                                            </View>

                                            <View style={styles.border_line}></View>
                                            <View style={{marginTop : 14 * metrics}}></View>
                                            
                                            <View style={{flexDirection : 'row', width : '90%', alignSelf : 'center'}}>
                                                <View style={{flex : 0.5}}>
                                                    <Text style={{fontSize : 15 * metrics,fontFamily : Fonts.adobe_clean, color : Colors.gray_color, textAlign : 'left'}}>Something not right?</Text>
                                                </View>
                                                <TouchableOpacity style={{flex : 0.3}} onPress={()=> this.contactUS()}>
                                                    <Text style={{fontSize : 15 * metrics ,fontFamily : Fonts.adobe_clean, color : Colors.main_color,textAlign : 'right'}}>Contact Us</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{flex : 0.2}} onPress={() => this.props.navigation.navigate('HelpScreen')}>
                                                    <Text style={{fontSize : 15 * metrics ,fontFamily : Fonts.adobe_clean,textAlign : 'right'}}>Help</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{height : 20 * metrics}}></View>
                                        </View>
                                    }
                                    {
                                        this.state.showNote && 
                                        <View style={{width : '90%' , alignSelf : 'center'}}>
                                            <View style={{marginTop : 25 * metrics}}></View>
                                            
                                            <Text style={{fontSize : 20 * metrics, fontFamily : Fonts.adobe_clean}}>Add Note</Text>
                                            
                                            <View style={{marginTop : 10 * metrics}}></View>
                                            
                                            <Textarea
                                                containerStyle={styles.textareaContainer}
                                                style={global_style.textarea}
                                                defaultValue={this.state.description}
                                                placeholder={''}
                                                value= {this.state.description}
                                                placeholderTextColor={'#c7c7c7'}
                                                underlineColorAndroid={'transparent'}
                                                onChangeText={(text) => this.setState({description : text})}
                                            />
                                            <View style={{marginTop : 50 * metrics}}></View>
                                            
                                            <View style={{flexDirection : 'row'}}>
                                                <TouchableOpacity style={global_style.save_button} onPress={()=> this.addNote()}>
                                                    <Text style={styles.text}>Save</Text>
                                                </TouchableOpacity>
                                                <View style={{marginLeft : 20 * metrics}}></View>
                                                <TouchableOpacity style={global_style.cancel_button} onPress={() => this.setState({showNote : false})}>
                                                    <Text style={styles.text}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                            
                                        </View>
                                    }
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.topBody}>
                            <TouchableOpacity style={{width : '100%', height : '100%'}} onPress={() => this.props.closeModal()}></TouchableOpacity>
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
                                        this.state.categories.map((item, idx) => {
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
            </View>
        );
    }
}

ItemDetailComponent.propType = {
    item : PropTypes.object,
    closeModal : PropTypes.func,
    funcLoading : PropTypes.func
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignSelf : 'center',
        width: '100%',
        height : '100%',
    },
    topBody : {
        flex: 1,
        backgroundColor : 'black',
        opacity : 0.7
    },
    mainBody : {
        width : '100%', 
        height : '85%',
        position : 'absolute',
        bottom : 0,
        zIndex : 999,
        backgroundColor : 'transparent',
    },
    body : {
        width : '100%',
        height : '100%',
        borderTopLeftRadius : 50,
        borderTopRightRadius : 50,
        borderWidth : 1,
        borderColor : Colors.white_gray_color,
        backgroundColor : 'white',
    },
    img_body : {
        alignSelf : 'center',
        marginTop : -40 * metrics,
        backgroundColor : 'white',
        padding : 8 * metrics,
        borderRadius : 50,
        justifyContent : 'center'
    },
    item_img : {
        width : 80 * metrics, 
        height : 80 * metrics,
        elevation : 10,
    },
    item_textBody : {
        width : '80%',
        flexDirection : 'column',
        alignSelf : 'center'
    },
    title : {
        fontSize : 20 * metrics,
        fontWeight : '500',
        color : 'black',
        textAlign : 'center',
    },
    time : {
        textAlign : 'center',
        fontSize : 15 * metrics,
        color : Colors.gray_color
    },
    rest_button : {
        alignSelf : 'center',
        marginTop : 10 * metrics,
        minWidth : 130 * metrics,
        height : 35 * metrics,
        borderRadius : 25,
        backgroundColor : 'white',
        borderWidth : 1,
        alignItems : 'center',
        justifyContent : 'center',
        flexDirection : 'row',
        paddingLeft : 7 * metrics,
        paddingRight : 7 * metrics,
        borderColor : Colors.main_blue_color
    },
    trans_body : {
        width : '100%',
        height : 100 * metrics,
        backgroundColor : '#fff3ea',
        marginTop : 10
    },
    mg_body : {
        width : '80%',
        height : '100%',
        alignSelf : 'center',
        flexDirection : 'row',
    },
    btn : {
        flex : 0.25,
        height : 80 * metrics,
        flexDirection : 'column',
        alignSelf : 'center',
        justifyContent : 'center'
    },
    rating_view : {
        marginTop : 10 * metrics,
        flexDirection : 'row',
        alignSelf : 'center',
        width : '90%'
    },
    myStarStyle: {
        color: Colors.main_color,
        backgroundColor: 'transparent',
        textShadowColor: 'black',
        borderColor : 'black',
        fontSize : 30 * metrics
    },
    myEmptyStarStyle: {
        color: Colors.gray_color,
    },
    item_action : {
        textAlign : 'center',fontFamily : Fonts.adobe_clean,
        fontSize : 14 * metrics
    },
    supplier : {
        width : 30 * metrics,
        height : 30 * metrics,
        resizeMode : 'stretch'
    },
    reciept_view : {
        width : '90%',
        alignSelf : 'center',
    },
    new_receipt : {
        width : 65 * metrics,
        height : 65 * metrics,
        borderWidth : 1,
        borderRadius : 8 * metrics,
        borderColor : Colors.white_gray_color,
        justifyContent : 'center',
        marginRight : 8 * metrics
    },
    border_line : {
        width : '100%' , height : 1.5 * metrics, backgroundColor : Colors.white_gray_color
    },
    transaction_detail : {
        width : '90%',
        flexDirection : 'column',
        alignSelf : 'center'
    },
    detail_title : {
        fontSize : 18 * metrics,
        color : Colors.gray_color
    },
    detail_value : {
        fontSize : 18 * metrics,
        color : Colors.gray_color,
        textAlign : 'right'
    },
    detail_number : {
        fontSize : 16 * metrics,
        color : Colors.gray_color,
        textAlign : 'right'
    },
    img_item : {
        width : 65 * metrics,
        height : 65 * metrics,
        borderWidth : 1,
        borderRadius : 8 * metrics,
        borderColor : Colors.white_gray_color,
        justifyContent : 'center',
        marginLeft : 8 * metrics
    },
    close_icon : {
        position : 'absolute',
        top : -10,
        right : 0,
        zIndex : 9999,
        backgroundColor : 'white',
        borderRadius : 50
    },
    text : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 19 * metrics,
        textAlign : 'center',
        color : 'white'
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
    },
    remove_btn : {
        width : 120 * metrics, 
        height : 40 * metrics, 
        borderWidth : 1, 
        borderRadius : 20 * metrics, 
        borderColor : Colors.main_blue_color,
        justifyContent : 'center',
        alignItems : 'center', 
        alignSelf : 'flex-end'
    },
    remove_text : {
        fontSize : 16 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.main_blue_color
    }
});