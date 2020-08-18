/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, View,Text, TouchableOpacity , StyleSheet, Image, Switch, ScrollView,ActivityIndicator, ImageBackground} from 'react-native';
import TabHeaderScreen from '../../components/TabHeaderScreen'
import * as Images from '../../constants/Image'
import * as Colors from '../../constants/Colors'
import global_style ,{ metrics } from '../../constants/GlobalStyle';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'
import {Fonts} from '../../constants/Fonts'
import CardService from '../../service/CardService';
import { alertMessage } from '../../utils/utils';
import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Card Pic',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class CardScreen extends Component {
    componentWillReceiveProps () {
        this.componentDidMount()
    }
    componentDidMount () {
        this.setState({isLoading : true, isAdd : false, isSelected : false})
        CardService.getAllCardList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                console.log('data = ' , data.response)
                this.setState({card_arr : data.response})
            } else {
                this.setState({card_arr : [], isAdd : true})
            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
            this.setState({card_arr : [], isAdd : true})
        })

        
        //this.setState({isLoading : false})
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };

    state = {
        card_arr : [],
        select_item : '',
        isSelected : false,
        isAdd : false,
        freeze : false,
        view_pin : false,
        isLoading : false,
        show_carddeatil : false,
        pin_number : ''
    }

    onRequestDebitCard = () => {
        //this.props.navigation.navigate("RequestDebitCardScreen")
    }

    onChangedFreeze = () => {
        this.setState({freeze : !this.state.freeze}, () => {
            this.setState({isLoading : true})
            if (this.state.freeze) {
                CardService.blockCard(global.token, this.state.select_item.id).then(res => {
                    var data = res.data.result
                    if (data.success) {
                        this.state.select_item.state = 'block'
                        this.setState({select_item : this.state.select_item})
                        this.setState()
                    }
                    this.setState({isLoading : false})
                })
            } else {
                CardService.unblockCard(global.token, this.state.select_item.id).then(res => {
                    var data = res.data.result
                    if (data.success) {
                        this.state.select_item.state = 'active'
                        this.setState({select_item : this.state.select_item})
                    }
                    this.setState({isLoading : false})
                })
            }
        })
        
        // CardService.suspendCard(global.token , obj, this.state.select_item.id).then(res => {
        //     var data = res.data.result
        //     if (data.success) {
        //         console.log('data = ', data)
        //     } else {
        //         alertMessage(data.message)
        //         this.setState({freeze : false})
        //     }
        //     this.setState({isLoading : false})
        // }).catch(error => {
        //     this.setState({isLoading : false})
        // })
    }

    onChangedViewPin = () => {
        this.setState({view_pin : !this.state.view_pin})
        if (this.state.select_item.rb_card_type != 'virtual') {
            this.setState({isLoading : true})
            CardService.getShowCardPin(global.token,this.state.select_item.id).then(res=> {
                var data = res.data.result
                if (data.success) {
                    this.setState({pin_number : data.response.pin})
                } else {
                    if (data.message != 'Unauthorized')
                        alertMessage(data.message)
                    this.setState({view_pin : false})
                }
                this.setState({isLoading : false})
            }).catch(err => {
                console.log(err)
                this.setState({isLoading : false})
            })
        }
    }

    goCreateCard = (type) => {
        if (type == 'virtual') {
            alertMessage('Feature Coming Soon!')
            return
        }
        global.card_type = type
        this.props.navigation.navigate('RequestDebitCardScreen')
    }

    onSelectItem = (item) => {
        // CardService.getTransactionInformation(global.token, item.id).then(res => {
        //     var data = res.data.result
        // })
        if (item.state == 'block') {
            this.setState({freeze : true})
        } else {
            this.setState({freeze : false})
        }
        this.setState({isSelected : true,select_item : item, view_pin : false})
    }

    gotoAdd () {
        this.setState({isAdd : true})
    }

    setActive () {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                var res = response.data
                this.activeCard (res)
            }
        });
    }

    activeCard (data) {
        this.setState({isLoading : true})
        CardService.activeCard(global.token, this.state.select_item.id, data).then(res => {
            var data = res.data.result
            console.log('data = ' , data)
            if (data.success) {
                alertMessage(data.message)
                // this.setState({isAdd : false, isSelected : false}, () => {
                //     // this.componentDidMount()
                // })
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(err => {
            this.setState({isLoading : false})
            console.log(err.message)
        })
    }
    onShowCardDetail () {
        this.setState({show_carddeatil : true})
    }

    render() {
        return (
            <View>
                <View style={{width : '100%' , height : '100%'}}>
                    <TabHeaderScreen headerTitle="Cards" navigation = {this.props.navigation} showDrawer={() => this.props.showDrawer()} onPlusBtn ={() => this.gotoAdd()}></TabHeaderScreen>
                    <View style={{flex : 1, alignItems : 'center', backgroundColor : Colors.white_color}}>
                        <View style={{width : '100%' , height : '100%'}}>
                            {/* <View style={styles.space}></View> */}
                            {
                                this.state.isAdd && !this.state.show_carddeatil &&
                                <View style={{marginTop : 60 * metrics}}>
                                    <View style={styles.card_view}>
                                        <View style={{flex : 1, flexDirection : 'column', justifyContent: 'center', alignItems : 'center'}}>
                                            <Text style={{color : 'white' , fontSize : 18 * metrics}}>Get New Card</Text>
                                            <View style={{marginTop : 30 * metrics}}></View>
                                            <View style={{flexDirection : 'row'}}>
                                                <View style={styles.typeBody}>
                                                    <TouchableOpacity style={styles.types} onPress={() => this.goCreateCard('virtual')}>
                                                        <AntDesign name="earth" size={28 * metrics} color="white"></AntDesign>
                                                    </TouchableOpacity>
                                                    <Text style={{marginTop : 5 * metrics, color : 'white'}}>Virtual</Text>
                                                </View>
                                                <View style={{width : 30}}></View>
                                                <View style={styles.typeBody}>
                                                    <TouchableOpacity style={styles.types} onPress={() => this.goCreateCard('physical')}>
                                                        <MaterialCommunityIcons name="account-card-details-outline" size={30 * metrics} color="white"></MaterialCommunityIcons>
                                                    </TouchableOpacity>
                                                    <Text style={{marginTop : 5 * metrics, color : 'white'}}>Physical</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{height : 80 * metrics}}></View>
                                    <TouchableOpacity style={{flexDirection : 'column', alignItems : 'center'}} onPress={() => this.setState({isAdd : false})}>
                                        <Text style={{fontSize : 17 * metrics, color : '#000'}}>Already have a card?</Text>
                                        <Text style={{fontSize : 17 * metrics, color : Colors.main_blue_color}}>Go Back</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                !this.state.isAdd && !this.state.isSelected && 
                                <View style={{flex : 1, flexDirection : 'column'}}>
                                    <View style={{flex : 1, marginTop :20 * metrics}}>
                                        <ScrollView style={{flex : 1}}>
                                            {
                                                this.state.card_arr.map((item, idx) => {
                                                    return (
                                                        <TouchableOpacity style={{width : '90%', alignSelf : 'center'}} onPress={() => this.onSelectItem(item)} key={idx}>
                                                            {
                                                                item.rb_card_type == 'virtual' ?
                                                                <ImageBackground source={Images.virtual_card} style={styles.cards} resizeMode={"stretch"} borderRadius={5*metrics}>
                                                                    <View style={{marginTop : 120 * metrics}}></View>
                                                                    <View>
                                                                        <Text style={styles.card_number}>{item.rb_card_number == false ? '' : item.rb_card_number}</Text>
                                                                        <View style={{flexDirection : 'row', flex : 1, marginTop : 5 * metrics, marginBottom : 10 * metrics}}>
                                                                            <View style={{flex : 0.3, justifyContent : 'center'}}>
                                                                                <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,color : 'white',marginLeft : 20 * metrics}}>{item.rb_card_cvv == false ? '' : item.rb_card_cvv}</Text>
                                                                            </View>
                                                                            <View style={{flex : 0.6, flexDirection :'row'}}>
                                                                                <View style={{flexDirection : 'column'}}>
                                                                                    <Text style={styles.cvv_title}>VAUD</Text>
                                                                                    <Text style={styles.cvv_title}>THRU</Text>
                                                                                </View>
                                                                                <Text style={styles.card_cvv}>{item.rb_card_expiry_date}</Text>
                                                                            </View>
                                                                            <View style={{flex : 0.1}}></View>
                                                                        </View>
                                                                        <Text style={styles.card_name}>{item.name}</Text>
                                                                        <View style={{flexDirection : 'row'}}>
                                                                            <Text style={styles.card_id}>{global.user_info.sort_code}</Text>
                                                                            <Text style={styles.card_id}>{global.user_info.account_number}</Text>
                                                                        </View>
                                                                    </View>
                                                                </ImageBackground>
                                                                :
                                                                <ImageBackground source={Images.physical_card} style={styles.cards} resizeMode={"stretch"} borderRadius={10*metrics}>
                                                                    <View style={{marginTop : 120 * metrics}}></View>
                                                                    <View>
                                                                        <Text style={styles.card_number}>{item.rb_card_number == false ? '' :  item.rb_card_number}</Text>
                                                                        <View style={{flexDirection : 'row', flex : 1, marginTop : 5 * metrics, marginBottom : 10 * metrics}}>
                                                                            <View style={{flex : 0.3, justifyContent : 'center'}}>
                                                                                <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,color : 'white',marginLeft : 20 * metrics}}>{item.rb_card_cvv == false ? '' : item.rb_card_cvv}</Text>
                                                                            </View>
                                                                            <View style={{flex : 0.6, flexDirection :'row'}}>
                                                                                <View style={{flexDirection : 'column'}}>
                                                                                    <Text style={styles.cvv_title}>VAUD</Text>
                                                                                    <Text style={styles.cvv_title}>THRU</Text>
                                                                                </View>
                                                                                <Text style={styles.card_cvv}>{item.rb_card_expiry_date}</Text>
                                                                            </View>
                                                                            <View style={{flex : 0.1}}></View>
                                                                        </View>
                                                                        <Text style={styles.card_name}>{item.name}</Text>
                                                                        <View style={{flexDirection : 'row'}}>
                                                                            <Text style={styles.card_id}>{global.user_info.sort_code}</Text>
                                                                            <Text style={styles.card_id}>{global.user_info.account_number}</Text>
                                                                        </View>
                                                                    </View>
                                                                </ImageBackground>
                                                            }
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                    {/* <View style={{flex : 0.1, justifyContent : 'center'}}>
                                        <TouchableOpacity style={{alignSelf : 'center'}} onPress={() => this.setState({isAdd : true})}>
                                            <MaterialCommunityIcons name="plus-circle-outline" size={40 * metrics}></MaterialCommunityIcons>
                                        </TouchableOpacity>
                                    </View> */}
                                    <View style={{flex : 0.1}}></View>
                                </View>
                            }
                            {
                                this.state.isSelected && !this.state.isAdd && !this.state.show_carddeatil &&
                                <View style={styles.slide}>
                                    <ScrollView style={{width : '100%' , flex : 1}}>
                                        <View style={{flex :1 , alignItems : 'center'}}>
                                            <View style={{marginTop : 30 * metrics}}></View>
                                            <View style={{width : '90%', alignSelf : 'center'}}>
                                                {
                                                    this.state.select_item.rb_card_type == 'virtual' ?
                                                    <ImageBackground source={Images.virtual_card} style={styles.cards} resizeMode={"stretch"} borderRadius={5*metrics}>
                                                        <View style={{marginTop : 120 * metrics}}></View>
                                                        <View>
                                                            <Text style={styles.card_number}>{this.state.select_item.rb_card_number == false ? '' : this.state.select_item.rb_card_number}</Text>
                                                            <View style={{flexDirection : 'row', flex : 1, marginTop : 5 * metrics, marginBottom : 10 * metrics}}>
                                                                <View style={{flex : 0.3,justifyContent : 'center'}}>
                                                                    <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,color : 'white',marginLeft : 20 * metrics}}>{item.rb_card_cvv == false ? '' : item.rb_card_cvv}</Text>
                                                                </View>
                                                                <View style={{flex : 0.6, flexDirection :'row'}}>
                                                                    <View style={{flexDirection : 'column'}}>
                                                                        <Text style={styles.cvv_title}>VAUD</Text>
                                                                        <Text style={styles.cvv_title}>THRU</Text>
                                                                    </View>
                                                                    <Text style={styles.card_cvv}>{this.state.select_item.rb_card_expiry_date}</Text>
                                                                </View>
                                                                <View style={{flex : 0.1}}></View>
                                                            </View>
                                                            <Text style={styles.card_name}>{this.state.select_item.name}</Text>
                                                            <View style={{flexDirection : 'row'}}>
                                                                <Text style={styles.card_id}>{global.user_info.sort_code}</Text>
                                                                <Text style={styles.card_id}>{global.user_info.account_number}</Text>
                                                            </View>
                                                        </View>
                                                    </ImageBackground>
                                                    :
                                                    <ImageBackground source={Images.physical_card} style={styles.cards} resizeMode={"stretch"} borderRadius={10*metrics}>
                                                        <View style={{marginTop : 120 * metrics}}></View>
                                                        <View>
                                                            <Text style={styles.card_number}>{this.state.select_item.rb_card_number == false ? '' : this.state.select_item.rb_card_number}</Text>
                                                            <View style={{flexDirection : 'row', flex : 1, marginTop : 5 * metrics, marginBottom : 10 * metrics}}>
                                                                <View style={{flex : 0.3, justifyContent : 'center'}}>
                                                                    <Text style={{fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean,color : 'white',marginLeft : 20 * metrics}}>{item.rb_card_cvv == false ? '' : item.rb_card_cvv}</Text>
                                                                </View>
                                                                <View style={{flex : 0.6, flexDirection :'row'}}>
                                                                    <View style={{flexDirection : 'column'}}>
                                                                        <Text style={styles.cvv_title}>VAUD</Text>
                                                                        <Text style={styles.cvv_title}>THRU</Text>
                                                                    </View>
                                                                    <Text style={styles.card_cvv}>{this.state.select_item.rb_card_expiry_date}</Text>
                                                                </View>
                                                                <View style={{flex : 0.1}}></View>
                                                            </View>
                                                            <Text style={styles.card_name}>{this.state.select_item.name}</Text>
                                                            <View style={{flexDirection : 'row'}}>
                                                                <Text style={styles.card_id}>{global.user_info.sort_code}</Text>
                                                                <Text style={styles.card_id}>{global.user_info.account_number}</Text>
                                                            </View>
                                                        </View>
                                                    </ImageBackground>
                                                }
                                            </View>
                                            <View style={styles.space}></View>
                                            <View style={styles.card_body}>
                                                {
                                                    this.state.select_item.rb_card_type != 'virtual' &&
                                                    <View style={styles.item}>
                                                        <View style={{flex : 0.6, justifyContent : 'center'}}>
                                                            <View style={{flexDirection : 'column'}}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Card Status</Text>
                                                            </View>   
                                                        </View>
                                                        {
                                                            (this.state.select_item.rb_card_type == 'virtual' || this.state.select_item.state == 'active') ?
                                                            <View style={{flex : 0.4, backgroundColor : 'green', borderRadius : 20 * metrics, height : 40 * metrics, justifyContent : 'center',alignSelf : 'flex-end'}}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color: 'white', textAlign : 'center'}}>ACTIVE</Text>
                                                            </View>
                                                            :
                                                            <View style={{flex : 0.4,alignItems : 'flex-end'}}>
                                                                <TouchableOpacity style={{justifyContent : 'center', alignItems :'center'}} onPress={() => this.setActive()}>
                                                                    <Image source={Images.camera_img} style={{width : 55 * metrics, height : 55 * metrics}}></Image>
                                                                    <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 14 * metrics, textAlign :'center'}}>ACTIVATE</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        }
                                                    </View>
                                                }
                                                
                                                <View style={{marginTop : 10 * metrics}}></View>
                                                <View style={styles.item}>
                                                    <View style={{flex : 0.8, justifyContent : 'center'}}>
                                                        <View style={{flexDirection : 'column'}}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Freeze Card</Text>
                                                            {/* <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.white_gray_color}}>Your card is inactive</Text> */}
                                                        </View>
                                                    </View>
                                                    <View style={{flex : 0.2, alignItems : 'flex-end', justifyContent : 'center'}}>
                                                        <Switch
                                                            onValueChange = {() => this.onChangedFreeze()}
                                                            value = {this.state.freeze}
                                                            trackColor={{true: Colors.main_color, false: Colors.dark_gray}}
                                                            thumbColor={Colors.white_color}
                                                        />
                                                    </View>
                                                </View>
                                                {
                                                    this.state.select_item.rb_card_type != 'virtual' && 
                                                    <View style={styles.item}>
                                                        <View style={{flex : 0.8, justifyContent : 'center'}}>
                                                            <View style={{flexDirection : 'column'}}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>View Pin</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{flex : 0.2, alignItems : 'flex-end', justifyContent : 'center'}}>
                                                            <Switch
                                                                onValueChange = {() => this.onChangedViewPin()}
                                                                value = {this.state.view_pin}
                                                                trackColor={{true: Colors.main_color, false: Colors.dark_gray}}
                                                                thumbColor={Colors.white_color}
                                                            />
                                                        </View>
                                                    </View>
                                                }
                                                {
                                                    this.state.view_pin && 
                                                    <View style={styles.item}>
                                                        <Text style={{flex : 0.4,fontFamily : Fonts.adobe_clean,fontSize : 15 * metrics, color : Colors.gray_color}}>PIN Number : </Text>
                                                        <Text style={{flex : 0.6,fontSize : 18 * metrics, fontFamily : Fonts.adobe_clean, textAlign : 'left'}}>{this.state.pin_number}</Text>
                                                    </View>
                                                }
                                                {/* {
                                                    this.state.select_item.rb_card_type != 'virtual' && 
                                                    <View style={styles.item}>
                                                        <View style={{flex : 0.8, justifyContent : 'center'}}>
                                                            <View style={{flexDirection : 'column'}}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Unlock PIN or CVV</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{flex : 0.2, alignItems : 'flex-end', justifyContent : 'center'}}>
                                                            <MaterialIcons name="keyboard-arrow-right" size={25 * metrics} color={Colors.white_gray_color}></MaterialIcons>
                                                        </View>
                                                    </View>
                                                } */}
                                                <View style={styles.item}>
                                                    <View style={{flex : 0.8, justifyContent : 'center'}}>
                                                        <View style={{flexDirection : 'column'}}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Security</Text>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.white_gray_color}}>Enable additional protection</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flex : 0.2, alignItems : 'flex-end', justifyContent : 'center'}}>
                                                        <MaterialIcons name="keyboard-arrow-right" size={25 * metrics} color={Colors.white_gray_color}></MaterialIcons>
                                                    </View>
                                                </View>
                                                <View style={styles.item}>
                                                    <View style={{flex : 0.8, justifyContent : 'center'}}>
                                                        <View style={{flexDirection : 'column'}}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Limit</Text>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 16 * metrics, color : Colors.white_gray_color}}>£ {this.state.select_item.transaction_limit}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flex : 0.2, alignItems : 'flex-end', justifyContent : 'center'}}>
                                                        <MaterialIcons name="keyboard-arrow-right" size={25 * metrics} color={Colors.white_gray_color}></MaterialIcons>
                                                    </View>
                                                </View>
                                                <TouchableOpacity style={styles.item} onPress={() => this.onShowCardDetail()}>
                                                    <View style={{flex : 0.8, justifyContent : 'center'}}>
                                                        <View style={{flexDirection : 'column'}}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Card Details</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flex : 0.2, alignItems : 'flex-end', justifyContent : 'center'}}>
                                                        <MaterialIcons name="keyboard-arrow-right" size={25 * metrics} color={Colors.white_gray_color}></MaterialIcons>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{marginTop :40 * metrics}}></View>
                                                <View style={[styles.item, { alignItems : 'center'}]}>
                                                    <TouchableOpacity onPress={() => this.setState({isSelected : false})} style={styles.touch_btn}>
                                                        <MaterialIcons name="arrow-back" size={30 * metrics}></MaterialIcons>
                                                        <Text style={{textAlign : 'center', color : 'black', marginLeft : 10 * metrics}}>BACK</Text>
                                                    </TouchableOpacity>
                                                
                                                </View>
                                                <View style={{marginTop :10 * metrics}}></View>
                                            </View>
                                        </View>
                                        <View style={{height : 55 * metrics}}></View>
                                    </ScrollView>
                                </View>
                            }
                            {
                                this.state.isSelected && !this.state.isAdd && this.state.show_carddeatil &&
                                <View style={styles.slide}>
                                    <ScrollView style={{width : '100%' , flex : 1}}>
                                        <View style={{flex :1 , alignItems : 'center'}}>
                                            <View style={{marginTop : 30 * metrics}}></View>
                                            <View style={{width : '90%', alignSelf : 'center'}}>
                                                {
                                                    this.state.select_item.rb_card_type == 'virtual' ?
                                                    <ImageBackground source={Images.virtual_card} style={styles.cards} resizeMode={"stretch"} borderRadius={5*metrics}>
                                                        <View style={{marginTop : 120 * metrics}}></View>
                                                        <View>
                                                            <Text style={styles.card_number}>{this.state.select_item.rb_card_number == false ? '' : '' + this.state.select_item.rb_card_number}</Text>
                                                            <View style={{flexDirection : 'row', flex : 1, marginTop : 5 * metrics, marginBottom : 10 * metrics}}>
                                                                <View style={{flex : 0.3}}></View>
                                                                <View style={{flex : 0.6, flexDirection :'row'}}>
                                                                    <View style={{flexDirection : 'column'}}>
                                                                        <Text style={styles.cvv_title}>VAUD</Text>
                                                                        <Text style={styles.cvv_title}>THRU</Text>
                                                                    </View>
                                                                    <Text style={styles.card_cvv}>{this.state.select_item.rb_card_expiry_date}</Text>
                                                                </View>
                                                                <View style={{flex : 0.1}}></View>
                                                            </View>
                                                            <Text style={styles.card_name}>{this.state.select_item.name}</Text>
                                                            <View style={{flexDirection : 'row'}}>
                                                                <Text style={styles.card_id}>{global.user_info.sort_code}</Text>
                                                                <Text style={styles.card_id}>{global.user_info.account_number}</Text>
                                                            </View>
                                                        </View>
                                                    </ImageBackground>
                                                    :
                                                    <ImageBackground source={Images.physical_card} style={styles.cards} resizeMode={"stretch"} borderRadius={10*metrics}>
                                                        <View style={{marginTop : 120 * metrics}}></View>
                                                        <View>
                                                            <Text style={styles.card_number}>{this.state.select_item.rb_card_number == false ? '' : this.state.select_item.rb_card_number}</Text>
                                                            <View style={{flexDirection : 'row', flex : 1, marginTop : 5 * metrics, marginBottom : 10 * metrics}}>
                                                                <View style={{flex : 0.3}}></View>
                                                                <View style={{flex : 0.6, flexDirection :'row'}}>
                                                                    <View style={{flexDirection : 'column'}}>
                                                                        <Text style={styles.cvv_title}>VAUD</Text>
                                                                        <Text style={styles.cvv_title}>THRU</Text>
                                                                    </View>
                                                                    <Text style={styles.card_cvv}>{this.state.select_item.rb_card_expiry_date}</Text>
                                                                </View>
                                                                <View style={{flex : 0.1}}></View>
                                                            </View>
                                                            <Text style={styles.card_name}>{this.state.select_item.name}</Text>
                                                            <View style={{flexDirection : 'row'}}>
                                                                <Text style={styles.card_id}>{global.user_info.sort_code}</Text>
                                                                <Text style={styles.card_id}>{global.user_info.account_number}</Text>
                                                            </View>
                                                        </View>
                                                    </ImageBackground>
                                                }
                                            </View>
                                            <View style={styles.space}></View>
                                            <View style={styles.card_body}>
                                                {
                                                    // this.state.select_item.rb_card_type != 'virtual' &&
                                                    <View style={styles.item}>
                                                        <View style={{flex : 0.6, justifyContent : 'center'}}>
                                                            <View style={{flexDirection : 'column'}}>
                                                                <Text style={{fontFamily : Fonts.adobe_clean,fontSize : 18 * metrics, color : '#000'}}>Card Details</Text>
                                                            </View>   
                                                        </View>
                                                        
                                                        <View style={(this.state.select_item.rb_card_type == 'virtual' || this.state.select_item.state == 'active') ? styles.active_rect : styles.not_active_react}>
                                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, color: 'white', textAlign : 'center'}}>{(this.state.select_item.rb_card_type == 'virtual' || this.state.select_item.state == 'active') ? 'Active' : 'Not-Active'}</Text>
                                                        </View>
                                                        
                                                    </View>
                                                }
                                                <View style={{marginTop : 30 * metrics}}>
                                                    <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics}}>{this.state.select_item.name}</Text>
                                                    <View style={{marginTop : 10 * metrics}}>
                                                        <Text style={styles.address_txt}>{this.state.select_item.rb_address_number} {this.state.select_item.rb_address_street}</Text>
                                                        <Text style={styles.address_txt}>{this.state.select_item.rb_address_city}</Text>
                                                        <Text style={styles.address_txt}>{this.state.select_item.rb_address_postal_code}</Text>
                                                        <Text style={styles.address_txt}>{this.state.select_item.rb_address_iso_country}</Text>
                                                        <Text style={styles.email_txt}>Email : {global.user_info.email}</Text>
                                                        <Text style={styles.phone}>Phone : {global.user_info.phone}</Text>
                                                    </View>
                                                </View>
                                                <View style={{marginTop :40 * metrics}}></View>
                                                <View style={[styles.item, { alignItems : 'center'}]}>
                                                    <TouchableOpacity onPress={() => this.setState({show_carddeatil : false})} style={styles.touch_btn}>
                                                        <MaterialIcons name="arrow-back" size={30 * metrics}></MaterialIcons>
                                                        <Text style={{textAlign : 'center', color : 'black', marginLeft : 10 * metrics}}>BACK</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{marginTop :10 * metrics}}></View>
                                            </View>
                                        </View>
                                        <View style={{height : 55 * metrics}}></View>
                                    </ScrollView>
                                </View>
                            }
                        </View>
                    </View>
                </View>
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

CardScreen.propType = {
    showDrawer : PropTypes.func
}
const styles = StyleSheet.create({
    wrapper: {},
    slide: {
      width : '100%',
      height : '100%',
      alignItems : 'center',
      flexDirection : 'column',
      //marginTop : 30 * metrics,
    },
    card : {
        width : '95%',
        height : 260 * metrics,
        alignSelf : 'center',
        backgroundColor :'red'
        // resizeMode : "stretch",
    },
    text: {
      color: '#fff',
      fontSize: 30 * metrics,
      fontFamily : Fonts.adobe_clean,
      fontWeight: 'bold'
    },
    space : {
        height : 30 * metrics, width : '100%'
    },
    card_body : {
        width : '75%',
        flexDirection : "column", 
        height : '100%',
    },
    card_view : {
        width : '70%',
        height : 190 * metrics,
        alignSelf : 'center',
        backgroundColor : Colors.card_color,
        borderRadius : 15,
        justifyContent : 'center',
        flexDirection : 'row'
    },
    typeBody : {
        width : 80 * metrics,
        alignItems : 'center',
        justifyContent : 'center'
    },
    types : {
        width : 60 * metrics,
        height : 60 * metrics,
        borderRadius : 50,
        borderWidth : 1,
        borderColor : 'white',
        alignItems : 'center',
        justifyContent : 'center',
        flexDirection : 'column'
    },
    item : {
        width : '100%',
        flexDirection : 'row',
        height : 50 * metrics,
        marginBottom : 10 * metrics,
        justifyContent : 'center'
    },
    card_item : {
        width : '90%',
        borderColor : Colors.white_gray_color,
        elevation : Platform.OS == 'android' ? 0.5 : 0.3,
        borderWidth : 1,
        borderRadius : 10 * metrics,
        minHeight : 80 * metrics,
        alignSelf : 'center',
        marginBottom : 20 * metrics,
        flexDirection : 'row'
    },
    cards : {
        width : '100%',
        borderColor : Colors.white_gray_color,
        borderRadius : 10 * metrics,
        minHeight : 260 * metrics,
        alignSelf : 'center',
        marginBottom : 25 * metrics,
        flexDirection : 'column'
    },
    card_number : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : 'white',
        marginLeft : 20 * metrics
    },
    expiry : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : 'white',
        marginLeft : 20 * metrics,
        marginTop : 5 * metrics
    },
    expiry_title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 12 * metrics,
        color : 'white',
        marginLeft : 20 * metrics,
        marginTop : 20 * metrics
    },
    cvv : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        color : 'white',
        marginLeft : 20 * metrics,
        marginTop : 20 * metrics
    },
    card_name : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 20 * metrics,
        color : 'white',
        marginLeft : 20 * metrics,
        marginTop : 5 * metrics
    },
    card_id_title : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 12 * metrics,
        color : 'white',
        marginLeft : 20 * metrics,
        marginTop : 20 * metrics
    },
    card_id : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : 'white',
        marginLeft : 20 * metrics,
        marginTop : 5 * metrics
    },
    card_cvv : { 
        fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics, marginLeft : 10 * metrics, color : 'white'
    },
    cvv_title : {
        fontFamily : Fonts.adobe_clean, fontSize : 12 * metrics, color : 'white'
    },
    touch_btn : {
        flexDirection : 'row',alignItems :'center',alignSelf : 'center',height : '100%',width : 150 * metrics,justifyContent : 'center',
        borderWidth : 1, borderRadius : 10 * metrics, borderColor : Colors.gray_color
    },
    address_txt : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.dark_gray,
        marginTop : 3 * metrics
    },
    email_txt : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.dark_gray,
        marginTop : 15 * metrics
    },
    phone : {
        fontFamily : Fonts.adobe_clean,
        fontSize : 18 * metrics,
        color : Colors.dark_gray,
        marginTop : 10 * metrics
    },
    active_rect : {
        flex : 0.4, backgroundColor : 'green', borderRadius : 20 * metrics, height : 40 * metrics, justifyContent : 'center'
    },
    not_active_react : {
        flex : 0.4, backgroundColor : Colors.gray_color, borderRadius : 20 * metrics, height : 40 * metrics, justifyContent : 'center'
    }
  })