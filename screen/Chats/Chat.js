import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { RefreshControl, Alert, Text, TextInput, View, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import io from 'socket.io-client';
import FastImage from 'react-native-fast-image';
import YouTube from 'react-native-youtube';
import Video from 'react-native-video';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import RNFetchBlob from 'rn-fetch-blob';
import DocumentPicker from 'react-native-document-picker';
import Markdown from 'react-native-markdown-renderer'
import Markdownit from 'markdown-it'
import { openDatabase } from 'react-native-sqlite-storage';

import Icon from 'react-native-vector-icons/Ionicons';


const options = [
    'Help',
    'Restart',
    'Cancel',
    //   'Email Chat',
    'Transfer to Human',
    'Close Menu'      //keep this at the end of the array
]

var index = 0;

export default class Chat extends Component {

    isrefreshing = false;
    isAttachmentReq = false;
    isDateTimePickerVisible = false;


    constructor(props) {
        super(props);
        this.db = openDatabase({ name: 'zevarn.db' });
        this.bot_id = "89afb559-ccd8-4096-ab13-f1f4d5c84aa6";
        this.client_id = "b-a4f34062-6753-11ea-87f8-064268bd56e4";
        this.botIcon = 'https://naxetra.zeva.ai/media/static/no-img.png';
        this.bot_name = "Charlie";
        this.loginId = "1284929382898230823231245"//this.props.navigation.state.params.loginId;
        this.profileName = global.user_info.first_name + '  ' + global.user_info.last_name || 'Guest' // add
        this.host = 'https://naxetra.zeva.ai';
        this.filehost = this.host;
        this.sdkConfig = {
            "socketURL": this.host + "/socket.io/socket.io.js",
            "socketBasePath": this.host,
            "socketPath": "/socket.io/socket.io.js"
        };
        this.state = { text: '', isConnected: false, myArr: [], viewArr: [], isDateTimePickerVisible: false, isAttachmentReq: false, isloading: false };
        this.quickReplyData = { isVisible: false, data: [] };
        this.isConnected = false;
        this.userTextInput = React.createRef();
        this.height = Dimensions.get("window").height;
        this.dbCount = 0;
    }


    showDateTimePicker = () => {
        this.setState({
            text: this.state.text,
            isConnected: this.state.isConnected,
            // myArr: this.state.myArr,
            viewArr: this.state.viewArr,
            isDateTimePickerVisible: !this.state.isDateTimePickerVisible,
            isAttachmentReq: false,
            isloading: false
        })
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    handlePickedDate = (date) => {
        this.state.text = this.formatDate(date);
        this.showDateTimePicker();
    }

    showActionSheet = () => {
        this.ActionSheet.show()
    }

    showAttachmentSheet = () => {
        this.AttachmentSheet.show();
    }

    // static navigationOptions = ({ navigation }) => {
    //     return { title: navigation.state.params.bot_name }

    // }
    
    _onPressOut(message) {
        if (message != '') {
            this.quickReplyData.isVisible = false;
            this.quickReplyData.data = [];
            let temp = index++
            if (message.file_token && message.file_type.startsWith("image")) {
                Image.getSize(message.file_url, (width, height) => {
                    this.insertConversationToDB({
                        type: 'image',
                        position: 'right',
                        bot_id: this.bot_id,
                        message: message.file_url,
                        url: null,
                        file_name: null,
                        img_height: height * (250 / width)
                    }, null, null)
                        .then((obj) => {
                            this.setState({isloading: false});
                            this.processViewArray({ 'message': message, 'position': 'right', 'type': 'image', 'height': height * (250 / width) }, true)
                        }).catch((err) => {
                            this.setState({isloading: false});
                            console.log('image right insert to db error:', err);
                        })
                })
            } else if (message.file_token) {
                this.setState({isloading: false});
                this.processViewArray({ 'message': message, 'position': 'right', 'type': 'attachment' }, true)
            }
            else {
                this.insertConversationToDB({
                    type: 'string',
                    position: 'right',
                    bot_id: this.bot_id,
                    message: message,
                    url: null,
                    file_name: null,
                    img_height: null
                }, null, null)
                    .then((obj) => {
                        this.processViewArray({ 'message': message, 'position': 'right', 'type': 'string' }, true);
                    }).catch((err) => {
                        console.log('EEEEE', err);
                    })
            }
        }
    }

    emitMessage(message) {
        var self = this;
        var updateProfile = false;
        if (!self.firstUserMessage) {
            self.firstUserMessage = true;
            updateProfile = true;
        }
        var visibleMessage = null;
        var isForm = false;
        self.socket.emit('send', new Date().getTime(), {
            message: message,
            client_id: self.config.client_id,
            senderId: self.config.senderId,
            botType: self.config.botType,
            botId: self.config.bot_id,
            isDeveloper: self.config.isDeveloper,
            debug: self.config.debug,
            language: self.config.language,
            location: self.config.location,
            updateProfile: updateProfile,
            visibleMessage: visibleMessage,
            isForm: isForm
        });
    }

    componentWillUnmount() {
        if (this.socket)
            this.socket.close();
    }

    initialize(dbData) {
        if (dbData == null) {
            this.state.viewArr.unshift(
                <View style={{ width: '100%', alignItems: 'center', padding: 30 }}>
                    <Text style={{ color: 'grey' }}>------  New Messages  ------</Text>
                </View>)


            this.config.title = "React Native Test Bot";
            this.config.client_id = this.client_id;
            this.config.bot_id = this.bot_id;
            this.config.botIcon = this.botIcon;
            this.config.botIcon = "../images/bot-icon.png";
            this.config.orgId = "d7947ee8-c3e1-4548-8400-d5215e69b7d0";
            this.config.senderId = this.profileName;
            this.config.isAnonymous = true;
            this.config.isLocationRequired = false;
            this.config.isDeveloper = true;
            this.config.debug = true;
            this.config.authRequired = false;
            this.config.botType = 'service';
            this.config.enableAgentTransfer = true;
            this.config.profileMeta = {
                firstName: this.profileName//"Guest"
            };

            this.socket = io(this.sdkConfig.socketBasePath, { 'forceNew': true, 'forceBase64': true });
            this.socket.on('connect', () => {
                console.log('Connected to socket')
                this.submitMessage();
            })
            this.socket.on('chat', (msTime, people, msg) => {
                this.state.myArr.unshift({ 'message': msg, 'position': 'right', 'type': 'string' })
                this.isConnected = true;
                this.setState({
                    text: '',
                    isConnected: true,
                    // myArr: this.state.myArr,
                    viewArr: this.state.viewArr,
                    isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                    isAttachmentReq: false,
                    isloading: false
                })
            })

            this.socket.on('message', (msTime, people, msg) => {
                var sample = msTime;
                this.processMessage(sample);
            })
            this.setStateForConnection();
        } else {
            this.setStateForConnection();
        }
    }

    setStateForConnection() {
        this.isConnected = true;
        this.setState({
            text: '',
            isConnected: true,
            // myArr: this.state.myArr,
            viewArr: this.state.viewArr,
            isDateTimePickerVisible: this.isDateTimePickerVisible,
        })

    }

    insertConversationToDB(data, elements, buttons) {
        var context = this;
        var elements_num = (elements) ? elements.length : 0;
        var buttons_num = (buttons) ? buttons.length : 0;
        return new Promise((resolve, reject) => {
            this.db.transaction(function (txn) {
                txn.executeSql('insert into conversation(conv_type, position, bot_id, message, url, file_name, img_height, buttons_num, elements_num) values (\'' + data.type + '\', \'' + data.position + '\', \'' + data.bot_id + '\', \'' + data.message.replace(/'/g, '"') + '\', \'' + data.url + '\', \'' + data.file_name + '\', \'' + data.img_height + '\',' + buttons_num + ',' + elements_num + ')', [], (tx, res) => {
                    if (res && res.insertId) {
                        var valuesString = ''
                        if (elements != null && elements.length != 0) {
                            for (var i = 0; i < elements.length; i++) {
                                if (elements[i].default_action) {
                                    valuesString += '(\'' + res.insertId + '\',\'' + elements[i].image_url + '\',' + elements[i].buttons.length + ', \'' + elements[i].title + '\', \'' + elements[i].subtitle + '\', \'' + elements[i].default_action.type + '\', \'' + elements[i].default_action.url + '\'';
                                } else {
                                    valuesString += '(\'' + res.insertId + '\',\'' + elements[i].image_url + '\',' + elements[i].buttons.length + ', \'' + elements[i].title + '\', \'' + elements[i].subtitle + '\', \'\', \'\'';
                                }
                                valuesString += ((i == elements.length - 1) ? '); ' : '), ');
                            }
                            txn.executeSql('insert into elements(conv_id, image_url, element_buttons_num, element_title, element_subtitle, element_type, element_url) values ' + valuesString, [], (tx, result) => {
                                var element_id = result.insertId - elements.length + 1;
                                for (var j = 0; j < elements.length; j++) {
                                    var eleButtons = elements[j].buttons;
                                    context.insertButtonsToDB(eleButtons, txn, res.insertId, element_id, j).then(count => {
                                        if (count == elements.length - 1) {
                                            resolve(tx);
                                        }
                                    });
                                    element_id++;
                                }
                            });
                        } else if (buttons != null && buttons.length != 0) {
                            context.insertButtonsToDB(buttons, txn, res.insertId, null, 0).then(tx => {
                                if (data.type == 'table') {
                                    resolve(tx);
                                } else {
                                    resolve(tx);
                                }
                            }).catch(err => {
                                reject(err);
                            });
                        } else {
                            resolve(res);
                        }
                    }
                }, (tx, err) => {
                    console.log('transaction insert error:', tx, err)
                    reject(tx);
                });
            });
        })

    }

    insertButtonsToDB(buttons, txn, conv_id, fk_id, count) {
        return new Promise((resolve, reject) => {
            var valuesString = '';
            for (var i = 0; i < buttons.length; i++) {
                valuesString += '(' + conv_id + ', \'' + buttons[i].title.replace(/'/g, "''") + '\', \'' + buttons[i].payload.replace(/'/g, "''") + '\', \'' + buttons[i].type + '\'';
                if (fk_id) {
                    valuesString += ', \'generic_button\', \'' + fk_id + '\'';
                }
                valuesString += ((i == buttons.length - 1) ? '); ' : '), ');
            }
            var sqlString = `insert into buttons(conv_id, title, payload, type) values ` + valuesString;
            if (fk_id) {
                sqlString = `insert into buttons(conv_id, title, payload, type, msg_type, fk_id) values ` + valuesString;
            }
            txn.executeSql(sqlString, [], (tx, res) => {
                    resolve(count);
            }, (trans, err) => {
                reject(trans);
            });
        }).catch(err => {
            console.log('Error in inserting to db', err);
        })
    }

    componentDidMount() {
        var reqDetails = this;
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!')
        //code for SQLite //
        this.db.transaction(function (txn) {
            txn.executeSql('create table if not exists bot (bot_id varchar(50), bot_name varchar(200), server varchar(15), client_id varchar(50), PRIMARY key (bot_id));', []);
            txn.executeSql('create table if not exists conversation (conv_id integer primary key autoincrement, conv_type varchar(20), position varchar(10), bot_id varchar(50), message varchar(255), url varchar(255), file_name varchar(255), img_height int, buttons_num int, elements_num int);', []);
            txn.executeSql('create table if not exists buttons (button_id integer primary key autoincrement, conv_id varchar(50), title varchar(255), payload varchar(255), type varchar(20), msg_type varchar(30), fk_id varchar(50));', []);
            txn.executeSql('create table if not exists elements (element_id integer primary key autoincrement, conv_id varchar(50), image_url varchar(255), element_buttons_num int, element_title varchar(255), element_subtitle varchar(255), element_type varchar(255), element_url varchar(255));',
                [], (tx, result) => {
                    txn.executeSql('select * from bot where bot_id = \'' + reqDetails.bot_id + '\'', [], (selecttx, res) => {
                        if (res.rows.length == 0) {
                            txn.executeSql('insert into bot(bot_id, bot_name, server, client_id) values(\'' + reqDetails.bot_id + '\',\'' + reqDetails.bot_name + '\',\'' + reqDetails.host + '\',\'' + reqDetails.client_id + '\')', []);
                            reqDetails.initialize(null);
                        } else {
                            txn.executeSql('select buttons.*, elements.*, conversation.* from conversation left join buttons on conversation.conv_id = buttons.conv_id left join elements on buttons.fk_id = elements.element_id where conversation.conv_id in (select conv_id from conversation where bot_id = \'' + reqDetails.bot_id + '\' order by conv_id desc limit 10) order by conversation.conv_id desc, elements.element_id, buttons.button_id;', [], (selecttx, res) => {
                                if (res.rows.length == 0) {
                                    reqDetails.initialize(null);
                                } else {
                                    reqDetails.dbCount = res.rows.item(res.rows.length - 1).conv_id;
                                    reqDetails.processConversationsFromDB(res, true);
                                }
                            }, (txx, err) => {
                                console.log('err', txx, err)
                            });
                        }
                    })
                }
            );
        });
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@@@@')
    }



    getPreviousConversations() {
        var reqDetails = this;
        this.db.transaction(function (txn) {
            txn.executeSql('select buttons.*, elements.*, conversation.* from conversation left join buttons on conversation.conv_id = buttons.conv_id left join elements on buttons.fk_id = elements.element_id where conversation.conv_id in (select conv_id from conversation where bot_id = \'' + reqDetails.bot_id + '\' and conv_id < ' + reqDetails.dbCount + ' order by conv_id desc limit 10) order by conversation.conv_id desc, elements.element_id, buttons.button_id;', [], (selecttx, res) => {
                if (res.rows.length == 0) {
                    // reqDetails.initialize(null);
                    Alert.alert('Thats it! ', 'You have seen all!');
                } else {
                    reqDetails.dbCount = res.rows.item(res.rows.length - 1).conv_id;
                    reqDetails.processConversationsFromDB(res, false);
                }
            }, (txx, err) => {
                console.log('err', txx, err)
            });
        });
    }


    processConversationsFromDB(res, isNew) {
        var oldConv = this.state.viewArr;
        if (!isNew) {
            this.state.viewArr = [];
        }
        for (var i = res.rows.length - 1; i >= 0; i--) {
            var currentRow = res.rows.item(i);
            if (currentRow.conv_type == 'button') {
                var buttons = [];
                for (var j = 0; j < currentRow.buttons_num; j++) {
                    var buttonRow = res.rows.item(i - j);
                    console.log('button = ', buttonRow)
                    buttons.unshift({
                        'type': buttonRow.type,
                        'title': buttonRow.title,
                        'payload': buttonRow.payload
                    })
                    if (j == currentRow.buttons_num - 1) {
                        this.processViewArray({
                            'message': {
                                payload: {
                                    'text': currentRow.message,
                                    'buttons': buttons
                                }
                            }, 'position': 'left', 'type': 'button'
                        }, false);
                        i -= j;
                    }
                }
            } else if (currentRow.conv_type == 'image') {
                this.processViewArray({ 'message': currentRow.message, 'position': currentRow.position, 'type': 'image', 'height': currentRow.img_height }, false)
            } else if (currentRow.conv_type == 'generic') {
                var elements = [];
                for (var j = 0; j < currentRow.elements_num; j++) {
                    var elementRow = res.rows.item(i - j);
                    var buttons = [];
                    for (var k = 0; k < elementRow.element_buttons_num; k++) {
                        var buttonRow = res.rows.item(i - k);
                        buttons.unshift({
                            'type': buttonRow.type,
                            'title': buttonRow.title,
                            'payload': buttonRow.payload
                        })
                        if (k == elementRow.element_buttons_num - 1) {
                            i -= k;
                        }
                    }
                    var element = {
                        'title': elementRow.element_title,
                        'image_url': elementRow.image_url,
                        'subtitle': elementRow.element_subtitle,
                        'default_action': {
                            'type': elementRow.element_type,
                            'url': elementRow.element_url
                        },
                        'buttons': buttons
                    }
                    elements.unshift(element);
                    if (j == elementRow.elements_num - 1) {
                        this.processViewArray({
                            'message': {
                                payload: {
                                    'elements': elements
                                }
                            }, 'position': 'left', 'type': 'generic'
                        }, false);
                        i -= j;
                    }
                }
            } else if( currentRow.conv_type == 'table') {
                
            }
            else {
                this.processViewArray({ 'message': currentRow.message, 'position': currentRow.position, 'type': currentRow.conv_type }, false);
            }
        }


        if (isNew) {
            this.initialize(null);

        } else {
            var combinedArr = [...oldConv, ...this.state.viewArr];
            this.isConnected = true;
            this.isPreviousConvRetreived = true;
            this.setState({
                text: '',
                isConnected: true,
                viewArr: combinedArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            });
            this.initialize(res.rows);
        }
    }

    processMessage(message) {
        // try{

        var msg = message.message;
        var entityType = '';
        if (message && message.nerMeta) {
            entityType = message.nerMeta.entityType
            if (entityType == 'BT.ATTACHMENT' || entityType == 'BT.ATTACHMENT_OR_STRING') this.isAttachmentReq = true;

        }

        if (message.quick_replies != null) {
            this.insertConversationToDB({
                type: 'string',
                position: 'left',
                bot_id: this.bot_id,
                message: message.message,
                url: null,
                file_name: null,
                img_height: null
            }, null, null).then((obj) => {
                this.processViewArray({ 'message': message.message, 'position': 'left', 'type': 'string' }, false);
                this.processViewArray({ 'message': message, 'position': 'left', 'type': 'quick_replies_buttons' }, false)
                this.callToSetState(entityType);
            }).catch((err) => {
                console.log('EEEEE', err);
            })
            this.state.myArr.unshift({ 'message': message, 'position': 'left', 'type': 'quick_replies_buttons' })
            this.processViewArray({ 'message': message, 'position': 'left', 'type': 'quick_replies_buttons' }, false)
        } else if (message && message.attachment && message.attachment.type === 'template' && message.attachment.payload.template_type === 'button') {
            message = {
                botName: this.config.name,
                botIcon: 'botIcon',
                payload: message.attachment.payload,
                entityType: entityType
            };
            this.insertConversationToDB({
                type: 'button',
                position: 'left',
                bot_id: this.bot_id,
                message: message.payload.text,
                url: null,
                file_name: null,
                img_height: null
            }, null, message.payload.buttons).then((obj) => {
                this.processViewArray({ 'message': message, 'position': 'left', 'type': 'button' }, false);
                this.callToSetState(entityType);
            }).catch((err) => {
                console.log('button insert to db error', err);
            })
        } else if (message && message.attachment && message.attachment.type === 'template' && message.attachment.payload.template_type === 'generic') {
            message = {
                botName: this.config.name,
                botIcon: 'botIcon',
                payload: message.attachment.payload,
                entityType: entityType
            };
            this.insertConversationToDB({
                type: 'generic',
                position: 'left',
                bot_id: this.bot_id,
                message: '',
                url: null,
                file_name: null,
                img_height: null
            }, message.payload.elements, null).then((obj) => {
                this.processViewArray({ 'message': message, 'position': 'left', 'type': 'generic' }, false);
                this.callToSetState(entityType);
            }).catch((err) => {
                console.log('generic insert to db error', err);
            })
        } else if (message && message.attachment && message.attachment.type === 'template' && message.attachment.payload.template_type === 'table') {
            message = {
                botName: this.config.name,
                botIcon: 'botIcon',
                payload: message.attachment.payload,
                entityType: entityType,
                tableKeys: Object.keys(message.attachment.payload.table_data)
            };
            this.insertConversationToDB({
                type: 'table',
                position: 'left',
                bot_id: this.bot_id,
                message: message.payload.text,
                url: null,
                file_name: null,
                img_height: null,
            }, null, message.payload.buttons).then((obj) => {
                this.processViewArray({ 'message': message, 'position': 'left', 'type': 'table' }, false);
                this.callToSetState(entityType);
            }).catch((err) => {
                console.log('table template insert to db error', err);
            })
        } else if (message && message.nerMeta && message.nerMeta.entityType && message.nerMeta.entityType == 'BT.DATE') {
            this.insertConversationToDB({
                type: 'date',
                position: 'left',
                bot_id: this.bot_id,
                message: message.message,
                url: null,
                file_name: null,
                img_height: null
            }, null, null)
                .then((obj) => {
                    this.processViewArray({ 'message': message.message, 'position': 'left', 'type': 'date' }, false);
                    this.callToSetState(entityType);
                }).catch((err) => {
                    console.log('date insert to db error:', err);
                })
        } else {

            if (!(/<[a-z][\s\S]*>/i.test(msg))) {
                var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.‌​-]+(:[0-9]+)?|(?:www‌​.|[-;:&=\+\$,\w]+@)[‌​A-Za-z0-9.-]+)((?:\/‌​[\+~%\/.\w-_]*)?\??(‌​?:[-\+=&;%@.\w_]*)#?‌​(?:[\w]*))?)[^\s]+/g;
                var imgUrl = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i;
                var videoUrl = /(http)?s?:?(\/\/[^"']*\.(?:mp4|flv|mov|wmv|avi|ogg|webm))/i;
                var youtubeUrl = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/i;
                var isImage = false;
                var isVideo = false;
                var isYouTube = false;
                var isLink = false;
                var url1 = '';
                var message = msg;
                msg = msg.replace(urlRegex, function (url) {
                    url1 = url;
                    if (imgUrl.test(url)) {
                        isImage = true;
                    } else if (videoUrl.test(url)) {
                        isVideo = true;
                    } else if (youtubeUrl.test(url)) {
                        isYouTube = true;
                    }
                    isLink = true;
                });
                if (isImage) {
                    Image.getSize(url1, (width, height) => {
                        this.insertConversationToDB({
                            type: 'image',
                            position: 'left',
                            bot_id: this.bot_id,
                            message: url1,
                            url: null,
                            file_name: null,
                            img_height: height * (250 / width)
                        }, null, null)
                            .then((obj) => {
                                this.processViewArray({ 'message': url1, 'position': 'left', 'type': 'image', 'height': height * (250 / width) }, false)
                                this.callToSetState(entityType);
                            }).catch((err) => {
                                console.log('image insert to db error:', err);
                            })
                    })

                } else if (isVideo) {
                    this.insertConversationToDB({
                        type: 'video',
                        position: 'left',
                        bot_id: this.bot_id,
                        message: url1,
                        url: null,
                        file_name: null,
                        img_height: null
                    }, null, null)
                        .then((obj) => {
                            this.processViewArray({ 'message': url1, 'position': 'left', 'type': 'video' }, false);
                            this.callToSetState(entityType);
                        }).catch((err) => {
                            console.log('video insert to db error:', err);
                        })
                } else if (isYouTube) {
                    this.insertConversationToDB({
                        type: 'youtube',
                        position: 'left',
                        bot_id: this.bot_id,
                        message: url1,
                        url: null,
                        file_name: null,
                        img_height: null
                    }, null, null)
                        .then((obj) => {
                            this.processViewArray({ 'message': url1, 'position': 'left', 'type': 'youtube' }, false);
                            this.callToSetState(entityType);
                        }).catch((err) => {
                            console.log('youtube insert to db error:', err);
                        })
                }
                else if (isLink) {
                    fetch(url1).then(response => {
                        try {
                            if (response.headers.get('content-type').startsWith('image')) {
                                Image.getSize(response.url, (width, height) => {
                                    this.insertConversationToDB({
                                        type: 'image',
                                        position: 'left',
                                        bot_id: this.bot_id,
                                        message: response.url,
                                        url: null,
                                        file_name: null,
                                        img_height: height * (250 / width)
                                    }, null, null)
                                        .then((obj) => {
                                            this.processViewArray({ 'message': url1, 'position': 'left', 'type': 'image', 'height': height * (250 / width) }, false)
                                            this.callToSetState(entityType);
                                        }).catch((err) => {
                                            console.log('EEEEE', err);
                                        })
                                })
                            }
                            else {
                                this.insertConversationToDB({
                                    type: 'link',
                                    position: 'left',
                                    bot_id: this.bot_id,
                                    message: url1,
                                    url: null,
                                    file_name: null,
                                    img_height: null
                                }, null, null)
                                    .then((obj) => {
                                        this.processViewArray({ 'message': url1, 'position': 'left', 'type': 'link' }, false);
                                        this.callToSetState(entityType);
                                    }).catch((err) => {
                                        console.log('link insert to db error:', err);
                                    })
                            }
                        } catch (err) {
                            this.insertConversationToDB({
                                type: 'link',
                                position: 'left',
                                bot_id: this.bot_id,
                                message: url1,
                                url: null,
                                file_name: null,
                                img_height: null
                            }, null, null)
                                .then((obj) => {
                                    this.processViewArray({ 'message': message, 'position': 'left', 'type': 'link' }, false);
                                    this.callToSetState(entityType);
                                }).catch((err) => {
                                    console.log('link insert to db error:', err);
                                })
                        }

                    }).catch(err => {
                        this.insertConversationToDB({
                            type: 'link',
                            position: 'left',
                            bot_id: this.bot_id,
                            message: url1,
                            url: null,
                            file_name: null,
                            img_height: null
                        }, null, null)
                            .then((obj) => {
                                this.processViewArray({ 'message': url1, 'position': 'left', 'type': 'link' }, false);
                                this.callToSetState(entityType);
                            }).catch((err) => {
                                console.log('link insert to db error:', err);
                            })
                    })
                } else {
                    this.insertConversationToDB({
                        type: 'string',
                        position: 'left',
                        bot_id: this.bot_id,
                        message: msg,
                        url: null,
                        file_name: null,
                        img_height: null
                    }, null, null)
                        .then((obj) => {
                            this.processViewArray({ 'message': msg, 'position': 'left', 'type': 'string' }, false);
                            this.callToSetState(entityType);
                        }).catch((err) => {
                            console.log('EEEEE', err);
                        })
                }
            }
            else {
                this.insertConversationToDB({
                    type: 'string',
                    position: 'left',
                    bot_id: this.bot_id,
                    message: msg,
                    url: null,
                    file_name: null,
                    img_height: null
                }, null, null)
                    .then((obj) => {
                        this.processViewArray({ 'message': msg, 'position': 'left', 'type': 'string' }, false);
                        this.callToSetState(entityType);
                    }).catch((err) => {
                        console.log('EEEEE', err);
                    })
            }
        }
    }

    callToSetState(entityType) {
        this.setState({
            text: '',
            isConnected: this.state.isConnected,
            viewArr: this.state.viewArr,
            isDateTimePickerVisible: this.state.isDateTimePickerVisible,
            isAttachmentReq: (entityType == 'BT.ATTACHMENT' || entityType == 'BT.ATTACHMENT_OR_STRING') ? true : false,
            
        })
    }

    componentDidCatch(error, info) {
        if (__DEV__) {
            return;
        }
        if (this.errorShown) {
            return;
        }

        this.errorShown = true;
        console.log('catch error', error);
        console.log('catch error info', info)
    }

    updateState(message) {
        this.setState({
            text: '',
            isConnected: this.state.isConnected,
            viewArr: this.state.viewArr,
            isDateTimePickerVisible: this.state.isDateTimePickerVisible,
            isAttachmentReq: false,
            
        }, () => {
            if (message != '') {
                this.emitMessage(message);
                this.userTextInput.current.clear();
            }
        })
    }

    updateStateForImage = async (uri, filename, filetype) => {
        let baseurl =  "https://naxetra.zeva.ai/file/" + this.config.senderId + "/upload";
        var url1 = (Platform.OS === "ios") ? uri.split('file://')[1] : uri;
        RNFetchBlob.fetch('POST', baseurl, {
            'Content-Type': false,//'multipart/form-data',
        }, [
            // element with property `filename` will be transformed into `file` in form data
            { name: 'file', filename: filename || 'rncamimage.'+filetype.split('/')[1], type: filetype, data: RNFetchBlob.wrap(url1) },
            // elements without property `filename` will be sent as plain text
            { name: 'upload_file', data: 'true' },
        ])
            // listen to upload progress event
            .uploadProgress((written, total) => {
                // console.log('uploaded', (written / total) * 100)
            }).then((resp) => {
                // ...
                console.log('resp = ' , resp)
                data = resp.data;
                if (resp.respInfo.status == 200) {
                    var data1 = JSON.parse(data)
                    var message = {
                        file_token: data1.file_token,
                        file_url: "https://naxetra.zeva.ai" + "/file/" + encodeURI(data1.file_token),
                        file_name: filename,
                        file_type: filetype
                    };
                    this._onPressOut(message);
                } else {
                    this.setState({isloading: false});
                    Alert.alert('Please try again');
                }
            }).catch((err) => {
                // ...
                this.setState({isloading: false});
                console.log('file upload error', err);
                console.log(err.message)
                Alert.alert('There is an error in upload. Please try again');
            })
    }

    openFiles() {
        // Pick a single file
        try {
            const res = DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            }).then(res => {
                this.setState({isloading: true});
                this.updateStateForImage(res.uri, res.name, res.type);
            }).catch(err => {
                this.setState({isloading: false});
                console.log('error in picking a file>>', err);
            });
        } catch (err) {
            this.setState({isloading: false});
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }


    openLibrary() {
        var options = {
            title: '',
            takePhotoButtonTitle: 'Camera',
            chooseFromLibraryButtonTitle: 'Photo Gallery',
            tintColor: '#57C0FD',
            noData: true,
            quality: 0.1,
            // allowsEditing: true,
            // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        isImage = false;
        url = '';
        var self = this;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {
                isImage = true;
                this.setState({isloading: true});
                this.updateStateForImage(response.uri, response.fileName, response.type);
            }
        });
    }

    goToWebView(data) {
        console.log('data = ' , data)
        const { navigate } = this.props.navigation;
        if (data && data.default_action && data.default_action.url) {
            navigate("MyWebView", { imageurl: data.default_action.url })
        } else if (data && typeof (data) == "string" && !data.startsWith('{')) {
            navigate("MyWebView", { imageurl: data })
        } else if (data && typeof (data) == "string" && data.startsWith('{')){
            data = JSON.parse(data);
            if(data.purpose == "vendor"){
                navigate("VendorEdit", {data: data.url, conversationID: data.id});
            } else if(data.purpose == "products_purchase") {
                navigate("PurchaseProducts", {data: data.url, conversationID: data.id});
            } else if(data.purpose == "products_sale") {
                navigate("SaleProducts", {data: data.url, conversationID: data.id});
            } else if(data.purpose == "pay_now") {
                navigate("PayNow", {data: data.url, conversationID: data.id});
            }
            
        }
    }

    processViewArray(a, isUserMessage) {

        //for normal string entered by user
        if (a.position == 'right' && a.type == 'string') {
            this.state.viewArr.unshift(
                <View style={styles.user_message}>
                    <Text>{a.message}</Text>
                </View>)
        }

        //for upload image
        else if (a.position == 'right' && a.type == 'image') {
            this.state.viewArr.unshift(
                <TouchableOpacity onPress={() => this.goToWebView(a.message.file_url || a.message)}>
                    <FastImage
                        style={{ alignSelf: "flex-end", marginTop: 8, width: 250, height: a.height, borderRadius: 15, borderBottomRightRadius: 0 }}
                        source={{
                            uri: a.message.file_url || a.message,
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </TouchableOpacity>
            )
            this.setState({
                text: '',
                isConnected: this.state.isConnected,
                viewArr: this.state.viewArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            })
        }

        //for upload attachment
        else if (a.position == 'right' && a.type == 'attachment') {
            this.state.viewArr.unshift(
                <View
                    style={styles.user_attachment_container}>
                    <Icon
                        style={styles.user_attachment_icon}
                        onPress={() => this.goToWebView(a.message.file_url)}
                        name="ios-document"
                        size={30}
                    />
                    <TouchableOpacity onPress={() => this.goToWebView(a.message.file_url)}
                        style={styles.user_attachment}>
                        <Text style={styles.user_attachment_filename}>{a.message.file_name}</Text>
                        <Text style={styles.user_attachment_status}>File Uploaded</Text>
                    </TouchableOpacity>
                </View>
            )
            this.setState({
                text: '',
                isConnected: this.state.isConnected,
                // myArr: this.state.myArr,
                viewArr: this.state.viewArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            })
        }

        //for date picker
        else if (a.position == 'left' && a.type == 'date') {
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View
                        // key={this.state.viewArr.length} 
                        style={styles.input_message_date_container}>
                        <Text style={styles.input_date_info_text}>{a.message}</Text>
                        <Text style={styles.input_date_view_divider}></Text>
                        <Icon
                            style={styles.input_calendar_icon}
                            onPress={() => this.showDateTimePicker()}
                            name="md-calendar"
                            size={30}
                        />
                    </View>
                </View>
            )
        }

        //for quick replies
        else if (a.position == 'left' && a.type == 'quick_replies') {
            var quick_replies = '';
            quick_replies = a.message.quick_replies;
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View style={styles.input_message_quickreplies_container}>
                        <View style={styles.quickreplies_info_text}>
                            <Text>{a.message.message}</Text>
                        </View>
                    </View>
                </View>
            )
        }

        //for quick replies buttons view
        else if (a.position == "left" && a.type == 'quick_replies_buttons') {
            var quick_replies = '';
            quick_replies = a.message.quick_replies;
            this.quickReplyData.data = quick_replies;
            this.quickReplyData.isVisible = true;
        }

        //for buttons
        else if (a.position == 'left' && a.type == 'button') {
            var buttons = '';
            buttons = a.message.payload.buttons;
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View style={styles.input_message_buttons_container}>
                        <View style={styles.buttons_container}>
                            <Text>{a.message.payload.text.replace(/<br>/g, '\n').replace(/&nbsp/g, ' ').replace(/&emsp;|&ensp;/g, '\t').replace(/<b>|<\/b>/g, '').replace(/<u>|<\/u>/g, '')}</Text>
                            {buttons.map(i => {
                                return <TouchableOpacity
                                    style={styles.input_button}
                                    onPress={() => (i.type == 'postback') ? this._onPressOut(i.payload) : this.goToWebView(i.url)}
                                >
                                    <Text style={styles.input_button_text}> {i.title} </Text>
                                </TouchableOpacity>
                            })}
                        </View>
                    </View>
                </View>
            )
        }

        //for table
        else if (a.position == 'left' && a.type == 'table') {
            var buttons = '';
            buttons = a.message.payload.buttons;
            var tableKeys = '';
            tableKeys = a.message.tableKeys;
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View style={styles.input_message_buttons_container}>
                        <View style={styles.table_buttons_container}>
                            <Text>{a.message.payload.text.replace(/<br>/g, '\n').replace(/&nbsp/g, ' ').replace(/&emsp;|&ensp;/g, '\t').replace(/<b>|<\/b>/g, '').replace(/<u>|<\/u>/g, '')}</Text>
                            {tableKeys.map((i, index) => {
                                return <View style={{flexDirection: "row"}}>
                                        <Text style={(index==0)?styles.table_first_left:(index==tableKeys.length?styles.table_last_left:styles.table_left)}>{i}</Text>
                                        <Text style={(index==0)?styles.table_first_right:(index==tableKeys.length?styles.table_last_right:styles.table_right)}>{a.message.payload.table_data[i]}</Text>
                                </View>
                            })}
                            {buttons.map(i => {
                                return <TouchableOpacity
                                    style={styles.input_button}
                                    onPress={() => (i.type == 'postback') ? this._onPressOut(i.payload) : this.goToWebView(i.url)}
                                >
                                    <Text style={styles.input_button_text}> {i.title} </Text>
                                </TouchableOpacity>
                            })}
                        </View>
                    </View>
                </View>
            )
        }

        //for corousel
        else if (a.position == 'left' && a.type == 'generic') {
            var elements = '';
            elements = a.message.payload.elements;
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {elements.map(i => {
                            return (<View style={styles.corousel_item_container}>
                                <TouchableOpacity onPress={() => this.goToWebView(i)}>
                                    <FastImage
                                        style={styles.corousel_item_image}
                                        source={{
                                            uri: i.image_url || 'https://fistosports.com/assets/images/no-img.png',
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </TouchableOpacity>
                                <View style={styles.corousel_item_info}>
                                    <Text style={styles.corousel_item_info_title}>{i.title.replace(/<br>/g, '\n').replace(/&nbsp/g, ' ').replace(/&emsp;|&ensp;/g, '\t').replace(/<b>|<\/b>/g, '').replace(/<u>|<\/u>/g, '')}</Text>
                                    <Text style={styles.corousel_item_info_desc}>{i.subtitle.replace(/<br>/g, '\n').replace(/&nbsp/g, ' ').replace(/&emsp;|&ensp;/g, '\t').replace(/<b>|<\/b>/g, '').replace(/<u>|<\/u>/g, '')}</Text>
                                    {i.buttons.map(j => {
                                        return (<TouchableOpacity style={styles.corousel_item_info_button}
                                            onPress={() => (i.type == 'postback') ? this._onPressOut(j.payload) : this.goToWebView(j.url)}>
                                            <Text style={styles.corousel_item_info_button_text}>{j.title}</Text>
                                        </TouchableOpacity>)
                                    })}
                                </View>
                            </View>)
                        })}
                    </ScrollView>
                </View>
            )
        }

        else if (a.position == 'left' && a.type == 'image') {
            displayMessage = a.message.substring(0, 50);
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <TouchableOpacity onPress={() => this.goToWebView(a.message)}>
                        <FastImage
                            style={{ maxWidth: 250, width: 250, height: a.height }}
                            source={{
                                uri: a.message,
                                priority: FastImage.priority.high,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </TouchableOpacity>
                </View>
            )
            this.setState({
                text: '',
                isConnected: this.state.isConnected,
                viewArr: this.state.viewArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            })
        }

        else if (a.position == 'left' && a.type == 'link') {
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View style={styles.input_message_link_container}>
                        <TouchableOpacity onPress={() => this.goToWebView(a.message)}>
                            <Text style={styles.link_display_text}>{a.message}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
            this.setState({
                text: '',
                isConnected: this.state.isConnected,
                viewArr: this.state.viewArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            })
        }

        else if (a.position == 'left' && a.type == 'youtube') {
            displayMessage = a.message.substring(0, 100);
            var youtubeID = a.message.split('watch?v=')[1];
            youtubeID = youtubeID.split('&list=')[0];
            if (a.message.length > 100) displayMessage + '...';
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View style={styles.input_message_youtube_video_container}>
                        <YouTube
                            videoId={youtubeID} // The YouTube video ID
                            // videoIds={youtubeIDs}
                            play={false}// control playback of video with true/false
                            inline // control whether the video should play in fullscreen or inline
                            // loop // control whether the video should loop when ended
                            onReady={e => this.setState({ isReady: true })}
                            origin="https://www.youtube.com"
                            onChangeState={e => this.setState({ status: e.state })}
                            onChangeQuality={e => this.setState({ quality: e.quality })}
                            onError={e => this.setState({ error: e.error })}
                            style={styles.link_youtube_video}
                        />
                        <TouchableOpacity onPress={() => this.goToWebView(a.message)}>
                            <View style={styles.link_view_container}>
                                <FastImage
                                    style={styles.link_icon}
                                    source={{
                                        uri: "https://p7.hiclipart.com/preview/766/1015/803/hyperlink-computer-icons-symbol-blog-link.jpg",
                                        priority: FastImage.priority.high
                                    }} />
                                <Text style={styles.link_text}>{displayMessage}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
            this.setState({
                text: '',
                isConnected: this.state.isConnected,
                viewArr: this.state.viewArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            })
        }

        else if (a.position == 'left' && a.type == 'video') {
            displayMessage = a.message.substring(0, 100);
            var youtubeID = a.message.split('watch?v=')[1];
            youtubeID = youtubeID.split('&list=')[0];
            if (a.message.length > 100) displayMessage + '...';
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon} source={{
                        uri: this.botIcon,
                        priority: FastImage.priority.high,
                    }} />
                    <View style={styles.input_message_video_container}>
                        <Video source={a.message}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.player = ref
                            }}                                      // Store reference
                            onBuffer={this.onBuffer}                // Callback when remote video is buffering
                            onError={this.videoError}               // Callback when video cannot be loaded
                            style={styles.link_video}
                        />
                        <TouchableOpacity onPress={() => this.goToWebView(a.message)}>
                            <View style={styles.link_view_container}>
                                <FastImage
                                    style={styles.link_icon}
                                    source={{
                                        uri: "https://p7.hiclipart.com/preview/766/1015/803/hyperlink-computer-icons-symbol-blog-link.jpg",
                                        priority: FastImage.priority.high
                                    }} />
                                <Text style={styles.link_text}>{displayMessage}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
            this.setState({
                text: '',
                isConnected: this.state.isConnected,
                // myArr: this.state.myArr,
                viewArr: this.state.viewArr,
                isDateTimePickerVisible: this.state.isDateTimePickerVisible,
                isAttachmentReq: false,
                
            })
        }

        else {
            const md = Markdownit({
                typographer: true,
                linkify: true,
               });
               
               md.linkify.tlds('.py', false);  // disables .py as top level domain
               md.linkify.tlds('onion', true)            // Add unofficial `.onion` domain
               md.linkify.add('git:', 'http:')           // Add `git:` protocol as "alias"
               md.linkify.add('ftp:', null)              // Disable `ftp:` ptotocol
               md.linkify.set({ fuzzyIP: true }); 
            this.state.viewArr.unshift(
                <View style={styles.input_container}>
                    <FastImage style={styles.bot_icon}
                        source={{
                            uri: this.botIcon,
                            priority: FastImage.priority.high,
                        }} />
                    <View
                        // key={this.state.viewArr.length} 
                        style={styles.input_message_container}>
                            <Markdown markdownit={md} >
                        {a.message.replace(/<br>/g, '\n').replace(/&nbsp/g, ' ').replace(/&emsp;|&ensp;/g, '\t').replace(/<b>|<\/b>/g, '').replace(/<u>|<\/u>/g, '')}
                        </Markdown>
                    </View>
                </View>
            )
        }
        if (isUserMessage) this.updateState(a.message);
    }

    render() {
        console.disableYellowBox = true;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView style={{ flex: 1 }} keyboardShould behavior="padding" keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -200}>
                    <ScrollView ref="scrollView" invertStickyHeaders="true" stickyHeaderIndices={[-1]} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
                        refreshControl={
                            <RefreshControl refreshing={this.isrefreshing} onRefresh={this.getPreviousConversations.bind(this)} />}
                        onContentSizeChange={(width, height) => {
                            if (this.isPreviousConvRetreived) {
                                this.isPreviousConvRetreived = false;
                            } else {
                                this.scrolltoEnd(height);
                            }
                        }}>

                        {(!this.isConnected) ? (<View style={{ height: 20, width: '100%', backgroundColor: 'gray', alignItems: 'center', alignContent: 'center' }}><Text style={{ color: 'white' }}>Connecting......</Text></View>) : (<Text style={{ height: 0 }}></Text>)}

                        {/* for conversation */}
                        <View style={styles.chat_container}>
                            {this.state.viewArr}
                        </View>

                        <View style={this.state.isloading?{flex: 1, justifyContent: 'center'}:{display: "none"}}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>

                        {/* for quickrelpies */}
                        <View>{(this.quickReplyData.isVisible) ? (
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {this.quickReplyData.data.map(i => {
                                    return <TouchableOpacity
                                        style={styles.quick_reply_item}
                                        onPress={() => this._onPressOut(i.payload)}>
                                        <Text style={styles.quick_reply_item_text}> {i.payload} </Text>
                                    </TouchableOpacity>
                                })}
                            </ScrollView>
                        ) : null}</View>

                    </ScrollView>


                    {/* for footer */}
                    <View style={styles.footer_bar_container}>
                        <Icon
                            style={styles.footer_icon_1}
                            onPress={this.showActionSheet}
                            name="ios-menu"
                            size={30}
                        />
                        <TextInput
                            style={[styles.footer_input, { width: Dimensions.get('window').width - 195 + ((this.state.isAttachmentReq) ? 0 : 83) }]}
                            placeholder="Type here..."
                            ref={this.userTextInput}
                            enablesReturnKeyAutomatically={true}
                            value={this.state.text}
                            // bufferDelay = {10}
                            onChangeText={(text) => {
                                this.setState((text == '') ? { text: '' } : { text: text })
                                value = this.state.text
                            }
                            }
                        />
                        <Icon
                            style={styles.footer_icon_2}
                            onPress={() => this._onPressOut(this.state.text)}
                            name="md-send"
                            size={30}
                        />
                        <Icon
                            style={styles.footer_icon_2}
                            onPress={this.openFiles.bind(this)}
                            name="md-attach"
                            size={28}
                        />
                        <Icon
                            style={styles.footer_icon_2}
                            onPress={this.openLibrary.bind(this)}
                            name="md-camera"
                            size={26}
                        />
                        {/* for date picker */}
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handlePickedDate}
                            onCancel={this.showDateTimePicker}
                            mode="date"
                        />

                        {/* for Bot Menu */}
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            options={options}
                            styles={this.styles}
                            cancelButtonIndex={options.length - 1}
                            destructiveButtonIndex={options.length - 1}
                            onPress={(index) => { this._onPressOut((index == options.length - 1) ? '' : options[index]) }}
                        />

                    </View>

                    {/* </ScrollView> */}
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    scrolltoEnd(height) {
        this.refs.scrollView.scrollTo({ y: height });
    }

    config = {};

    guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    submitMessage() {
        var self = this;
        self.socket.emit('joinserver', self.config.senderId, 'desktop', {
            isDeveloper: self.config.isDeveloper,
            senderId: self.config.senderId,
            botType: self.config.botType,
            botId: self.config.bot_id,
            profileMeta: self.config.profileMeta,
            language: self.config.language,
            debug: self.config.debug,
            location: self.config.location,
            reconnect: self.disconnected
        });
        self.disconnected = false;
    }

}

const styles = StyleSheet.create({
    table_first_left: {
        borderWidth: 1,
        width: "50%",
        height: 30,
        padding: 5,
        marginTop: 10,
        justifyContent: "center",
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderTopLeftRadius: 10 
    },
    table_last_left: {
        borderWidth: 1,
        width: "50%",
        height: 30,
        padding: 5,
        marginBottom: 10,
        borderRightWidth: 0,
        justifyContent: "center",
        borderBottomLeftRadius: 10 
    },
    table_left: {
        borderWidth: 1,
        width: "50%",
        height: 30,
        padding: 5,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        justifyContent: "center",
    },
    table_first_right: {
        borderWidth: 1,
        width: "50%",
        height: 30,
        padding: 5,
        marginTop: 10,
        justifyContent: "center",
        borderBottomWidth: 0,
        borderTopRightRadius: 10
    },
    table_last_right: {
        borderWidth: 1,
        width: "50%",
        height: 30,
        padding: 5,
        marginBottom: 10,
        justifyContent: "center",
        borderBottomRightRadius: 10
    },
    table_right: {
        borderWidth: 1,
        width: "50%",
        height: 30,
        padding: 5,
        borderBottomWidth: 0,
        justifyContent: "center",
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bot_icon: {
        width: 30,
        height: 30,
        marginTop: 13,
        marginRight: 10
    },
    user_message: {
        alignSelf: "flex-end",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        padding: 10,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderColor: 'blue'
    },
    user_image_upload_container: {
        alignSelf: "flex-end",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        // padding:10, 
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderColor: 'blue'
    },
    user_uploaded_image: {
        flex: 1,
        width: 250,
        height: 250,
        borderColor: "#dcdcdc",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    user_attachment_container: {
        alignSelf: "flex-end",
        flexDirection: "row",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        padding: 10,
        color: 'white',
        overflow: 'hidden',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomRightRadius: 0,
        borderColor: 'blue'
    },
    user_attachment_icon: {
        color: '#525050',
        marginVertical: 3,
        marginHorizontal: 8,
        justifyContent: "center",
        alignSelf: "center"
    },
    user_attachment: {
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center"
    },
    user_attachment_filename: {
        maxWidth: 250,
        margin: 10,
        fontSize: 16,
        fontWeight: "400",
        overflow: "hidden"
    },
    user_attachment_status: {
        maxWidth: 250,
        marginHorizontal: 10,
        color: '#525050',
        fontWeight: "200"
    },
    input_container: {
        flexDirection: "row"
    },
    input_message_date_container: {
        alignSelf: "flex-start",
        flexDirection: "row",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        // paddingHorizontal:10, 
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#57C0FD'
    },
    input_date_info_text: {
        justifyContent: "center",
        alignContent: "center",
        padding: 10
    },
    input_date_view_divider: {
        justifyContent: "center",
        alignContent: "center",
        width: 1,
        backgroundColor: '#57C0FD'
    },
    input_calendar_icon: {
        color: '#57C0FD',
        marginVertical: 3,
        marginHorizontal: 8,
        justifyContent: "center",
        alignContent: "center"
    },
    input_message_quickreplies_container: {
        flexDirection: "column"
    },
    quickreplies_info_text: {
        alignSelf: "flex-start",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        padding: 10,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#57C0FD'
    },
    input_message_buttons_container: {
        flexDirection: "column"
    },
    input_button: {
        alignItems: "center",
        marginTop: 5,
        backgroundColor: '#57C0FD',
        minHeight: 30,
        borderRadius: 10
    },
    input_button_text: {
        color: 'white',
        padding: 10,
        fontWeight: "700"
    },
    buttons_container: {
        alignSelf: "flex-start",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        padding: 10,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#57C0FD'
    },
    table_buttons_container: {
        alignSelf: "flex-start",
        minHeight: 40,
        maxWidth: 300,
        marginTop: 8,
        padding: 10,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#57C0FD'
    },
    corousel_item_container: {
        minHeight: 300,
        width: 250,
        marginRight: 10,
        marginTop: 10,
        borderWidth: 0.5,
        borderColor: '#dddddd',
        borderRadius: 15
    },
    corousel_item_image: {
        maxWidth: 250,
        height: 200,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    corousel_item_info: {
        padding: 15,
        paddingBottom: 10
    },
    corousel_item_info_title: {
        fontWeight: '700',
        fontSize: 18
    },
    corousel_item_info_desc: {
        fontWeight: '300',
        fontSize: 14,
        marginBottom: 10
    },
    corousel_item_info_button: {
        // borderWidth: 0.5, 
        height: 40,
        marginBottom: 5,
        justifyContent: "center",
        borderRadius: 10,
        backgroundColor: '#57C0FD',
        alignItems: "center"
    },
    corousel_item_info_button_text: {
        color: "white",
        fontWeight: "700"
    },
    input_message_video_container: {
        alignSelf: "flex-start",
        flexDirection: "column",
        minHeight: 40,
        maxWidth: 300,
        marginTop: 8,
        // padding:10, 
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#ddd'
    },
    link_view_container: {
        borderBottomRightRadius: 9,
        backgroundColor: "#f0f0f0",
        flexDirection: "row"
    },
    link_icon: {
        marginTop: 20,
        marginLeft: 10,
        height: 20,
        width: 20
    },
    link_text: {
        color: 'grey',
        maxWidth: 250,
        textDecorationColor: 'gray',
        padding: 10
    },
    link_video: {
        alignSelf: 'stretch',
        minWidth: 250,
        height: 200
    },
    link_youtube_video: {
        alignSelf: 'auto',
        minWidth: 250,
        height: 200,
        borderRadius: 10
    },
    input_message_youtube_video_container: {
        alignSelf: "flex-start",
        flexDirection: "column",
        minHeight: 40,
        maxWidth: 300,
        marginTop: 8,
        // padding:10, 
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#ddd'
    },
    input_message_link_container: {
        alignSelf: "flex-start",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        padding: 10,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#57C0FD'
    },
    link_display_text: {
        color: 'blue',
        maxWidth: 250,
        textDecorationLine: 'underline',
        textDecorationColor: 'blue'
    },
    input_message_image_container: {
        alignSelf: "flex-start",
        minHeight: 40,
        maxWidth: 250,
        marginTop: 8,
        // padding:10, 
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#ddd'
    },
    link_image_container: {
        flexDirection: "column"
    },
    link_image: {
        flex: 1,
        // width: 250, 
        // height: 250, 
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        maxWidth: 250,
        alignSelf: 'flex-start',
        borderColor: "#dcdcdc",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    container: {
        flex: 1,
        flexDirection: 'column-reverse',
        // justifyContent: "flex-end"
    },
    chat_container: {
        flex: 1,
        flexDirection: 'column-reverse',
        paddingLeft: 20,
        paddingTop: 50,
        paddingRight: 20,
        paddingBottom: 30,
        overflow: "scroll",
        // justifyContent: "flex-end"
    },
    quick_reply_item: {
        alignItems: "center",
        marginTop: 5,
        marginLeft: 10,
        backgroundColor: '#57C0FD',
        minHeight: 30,
        minWidth: 100,
        borderRadius: 60
    },
    quick_reply_item_text: {
        color: 'white',
        padding: 10,
        alignContent: "center"
    },
    footer_bar_container: {
        paddingHorizontal: 10,
        marginLeft: 20,
        marginRight: 50,
        marginBottom: 10,
        marginTop: 7,
        borderRadius: 30,
        height: 40,
        // backgroundColor: '#F0EFEF',
        alignItems: "center",
        // justifyContent: "center",
        flexDirection: "row",
    },
    footer_container: {
        height: 35,
        marginBottom: Dimensions.get("screen").height * (4 / 100)
    },
    footer_icon_1: {
        color: '#525050',
        marginRight: 10,
        justifyContent: "center",
        alignContent: "center"
    },
    footer_icon_2: {
        color: '#525050',
        marginRight: 15,
        justifyContent: "center",
        alignContent: "center"
    },
    footer_input: {
        height: 40,
        marginRight: 10,
        borderRadius: 25,
        backgroundColor: '#F0EFEF',
        padding: 10
    },
    input_message_container: {
        alignSelf: "flex-start",
        minHeight: 40,
        maxWidth: '80%',
        marginTop: 8,
        padding: 10,
        color: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderColor: '#57C0FD'
    }
});