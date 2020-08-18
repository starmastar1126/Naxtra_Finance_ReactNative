import React from 'react';
import {Text, View, Picker, TouchableOpacity, StyleSheet, ScrollView,TextInput,DatePickerAndroid,ActivityIndicator} from 'react-native';
import CRMHeaderComponent from '../../components/CRMHeaderComponent';
import global_style, {metrics} from '../../constants/GlobalStyle'
import * as Colors from '../../constants/Colors'
import { Fonts } from '../../constants/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { changeDatefromServer, getHoursAndMins, convertDate ,changeDate2, alertMessage} from '../../utils/utils';
import DateTimePicker from "react-native-modal-datetime-picker"
import Textarea from 'react-native-textarea'
import CrmService from '../../service/CrmService'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ActiveScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
		const { state } = navigation;
		return {
			header: null,
		}
    };

    state = {
        type : 0,
        user_id : -1,
        now_day : '',
        marked : null,
        date_ym : '',
        date_time : '',
        date : new Date() ,
        isDatePickerVisible : false,
        isTimePickerVisible : false,
        description : 'Notes',
        isReady : false,
        user_list : [],
        active_name : '',
        isLoading : false
    }

    onDay () {
        return 'adsfasdf'
    }

    goBack () {
        this.props.navigation.goBack()
    }
    componentDidMount () {
        var year = new Date().getFullYear()
        var month = new Date().getMonth() + 1
        var day = new Date().getDate()
        var hours = new Date().getHours()
        var mins = new Date().getMinutes()

        if (month < 10)
            month = '0' + month
        if (day < 10)
            day = '0' + day
        if (hours < 10)
            hours = '0' + hours
        if (mins < 10)
            mins = '0' + mins
        this.setState({
            date_ym : changeDatefromServer(year + '-' + month + '-' + day),
            date_time : hours + " : " + mins
        })

        CrmService.getCustomerList(global.token).then(res => {
            var data = res.data.result
            if (data.success) {
                this.setState({user_list : data.response.records})
                if (data.response.records.length > 0) {
                    this.setState({user_id : data.response.records[0].id})
                }
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
        })
    }

    onConfirm() {
        if (!this.state.isReady)
            return

        var obj = {
            date_deadline : this.state.date,
            recommended_activity_type_id : false,
            activity_type_id : this.state.type,
            summary : this.state.active_name,
            note : this.state.description
        }
        this.setState({isLoading : true})
        CrmService.setScaduleActivity(global.token, obj, this.state.user_id).then(res => {
            var data = res.data.result
            if (data.success) {
                this.props.navigation.goBack()
            } else {
                alertMessage(data.message)
            }
            this.setState({isLoading : false})
        }).catch(error => {
            this.setState({isLoading : false})
            console.log(error.message)
        })
    }

    showTimePicker () {
        this.setState({isTimePickerVisible : true})
    }

    showDatePicker () {
        this.setState({isDatePickerVisible : true})
    }

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };
    handleDatePicked = date => {
        this.setState({date : changeDate2(date)})
        this.setState({date_ym : convertDate (date)})
        this.hideDatePicker();
    };
    
    handleTimePicked = time => {
        this.setState({date_time : getHoursAndMins(time)})
        this.hideTimePicker()
    }
    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false }, () => this.checkReady());
    };
    checkReady () {
        if (this.state.active_name != '' && this.state.type != 0 && this.state.user_id != -1 && this.state.description != '') {
            this.setState({isReady : true})
        } else {
            this.setState({isReady : false})
        }
    }
    async showDateTimePicker () {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: this.state.date,
              mode : 'spinner'
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              var mon = month + 1
              var days = day
      
              if (mon < 10) 
                mon = '0' + mon
              if (day < 10 )
                days = '0' + day
      
              var time = year + '-' + mon + '-' + days
              this.setState({date_ym : changeDatefromServer(time)}, () => {
                  console.log(time)
              })
            }
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }
    render() {
        var onDay = 'asdfasdf'
        return (
            <View style={{flex : 1}}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={{flex : 1}}
                    scrollEnabled={false}
                >
                    <View style={{flex : 1 }}>
                        <CRMHeaderComponent navigation={this.props.navigation} goBack={() => this.goBack()} ref={(ref) => this.header_ref = ref} type={2}></CRMHeaderComponent>
                        <View style={styles.body}>
                            <ScrollView>
                                <View style={styles.active_body}>
                                    <View style={{marginTop : 20 * metrics}}></View>
                                    <View style={styles.active_name}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics}}>Activity Name</Text>
                                        <TextInput
                                            style={styles.text_input}
                                            value={this.state.active_name}
                                            onChangeText={(text) => this.setState({active_name : text}, ()=> this.checkReady())}
                                        ></TextInput>
                                    </View>
                                    <View style={styles.ative_item}>
                                        <View style={{flex : 0.5, justifyContent : 'center'}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics}}>Activity Type</Text>
                                        </View>
                                        <View style={{flex : 0.5, justifyContent : 'center'}}>
                                            <Picker
                                                selectedValue={this.state.type}
                                                style={{marginTop : -5 * metrics}}
                                                onValueChange={(itemValue, itemIndex) => this.setState({type : itemValue}, () => {
                                                    this.checkReady()
                                                })}
                                            >
                                                <Picker.Item label="" value="0"></Picker.Item>
                                                <Picker.Item label="Email" value="1" />
                                                <Picker.Item label="Call" value="2" />
                                                <Picker.Item label="Meeting" value="3" />
                                                <Picker.Item label="Todo" value="4" />
                                            </Picker>
                                            <View style={{width :'95%', alignSelf : 'center', borderBottomWidth : 1, borderBottomColor : Colors.dark_gray}}></View>
                                        </View>
                                    </View>
                                    <View style={styles.ative_item}>
                                        <View style={{flex : 0.5, justifyContent : 'center'}}>
                                            <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics}}>Assign To</Text>
                                        </View>
                                        <View style={{flex : 0.5, justifyContent : 'center'}}>
                                            <Picker
                                                selectedValue={this.state.user_id}
                                                style={{marginTop : -5 * metrics}}
                                                onValueChange={(itemValue, itemIndex) => this.setState({user_id : itemValue}, () => {
                                                    this.checkReady()
                                                })}
                                            >
                                                <Picker.Item label="Select Assign" value="-1" />
                                                {
                                                    this.state.user_list.map((item, idx) => {
                                                        return (
                                                            <Picker.Item label={item.name} value={item.id} />
                                                        )
                                                    })
                                                }
                                            </Picker>
                                            <View style={{width :'95%', alignSelf : 'center', borderBottomWidth : 1, borderBottomColor : Colors.dark_gray}}></View>
                                        </View>
                                    </View>
                                    <View style={{marginTop : 40 * metrics, flexDirection : 'row'}}>
                                        <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 20 * metrics, marginRight : 10 * metrics, flex : 0.2}}>Date : </Text>
                                        <View style={{flex : 0.4 ,flexDirection : 'row', alignItems : 'center' , justifyContent : 'flex-start'}}>
                                            <MaterialCommunityIcons name="calendar-range-outline" size={30 * metrics}></MaterialCommunityIcons>
                                            <TouchableOpacity style={{marginLeft : 10 * metrics}} onPress={() => this.showDatePicker()}>
                                                <Text>{this.state.date_ym != '' ? this.state.date_ym : convertDate(new Date())}</Text>
                                            </TouchableOpacity>
                                            <DateTimePicker
                                                mode="date"
                                                isVisible={this.state.isDatePickerVisible}
                                                onConfirm={this.handleDatePicked}
                                                onCancel={this.hideDatePicker}
                                            />
                                        </View>
                                        <View style={{flex : 0.4,flexDirection : 'row', alignItems : 'center' , justifyContent : 'flex-start'}}>
                                            <MaterialCommunityIcons name="clock-outline" size={30 * metrics}></MaterialCommunityIcons>
                                            <TouchableOpacity style={{marginLeft : 10 * metrics}} onPress={() => this.showTimePicker()}>
                                                <Text style={{fontFamily : Fonts.adobe_clean,}}>{this.state.date_time != '' ? this.state.date_time : '00:00:00'}</Text>
                                            </TouchableOpacity>
                                            <DateTimePicker
                                                mode = "time"
                                                is24Hour={true}
                                                isVisible={this.state.isTimePickerVisible}
                                                onConfirm={this.handleTimePicked}
                                                onCancel={this.hideTimePicker}
                                            />
                                        </View>
                                    </View>
                                    <View style={{marginTop : 40 * metrics}}>
                                        <Textarea
                                            containerStyle={styles.textareaContainer}
                                            style={[global_style.textarea, {borderColor : Colors.dark_gray, borderRadius : 5 * metrics}]}
                                            defaultValue={this.state.description}
                                            placeholder={''}
                                            value= {this.state.description}
                                            placeholderTextColor={'#c7c7c7'}
                                            underlineColorAndroid={'transparent'}
                                            onChangeText={(text) => this.setState({description : text}, () => this.checkReady())}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={global_style.bottom_button_body}>
                            <TouchableOpacity  style={this.state.isReady ? global_style.bottom_active_btn : global_style.bottom_btn} onPress={()=> this.onConfirm()}>
                                <View style={global_style.btn_body}>
                                <Text style={global_style.left_text}>Confirm</Text>
                                    <MaterialCommunityIcons style={global_style.right_icon} name="arrow-right" size={25 * metrics}></MaterialCommunityIcons>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.state.isLoading && 
                        <View style={global_style.loading_body}>
                            <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                        </View>
                    }
                </KeyboardAwareScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body : {
        width : '100%',
        flex: 0.85,
    },
    active_body : {
        width : '90%',
        alignSelf : 'center',
    },
    active_name : {
        flexDirection : 'column',
        
    },
    text_input : {
        borderBottomWidth : 1,
        borderBottomColor : Colors.dark_gray,
        fontFamily : Fonts.adobe_clean,
        fontSize : 17 * metrics,
        padding : 0,
        marginTop : 15 * metrics,
        paddingBottom : 10 * metrics
    },
    ative_item : {
        flexDirection : 'row',
        marginTop : 20 * metrics,
        alignItems : 'center',
    },
    fullType : {
        fontSize : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        marginLeft : 5 * metrics,   
    },
    emptyType : {
        fontSize : 20 * metrics,
        fontFamily : Fonts.adobe_clean,
        color : Colors.gray_color,
        marginLeft : 5 * metrics,
    },
})