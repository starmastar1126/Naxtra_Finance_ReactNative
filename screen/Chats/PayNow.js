import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';


export default class PayNow extends React.Component {
    static navigationOptions = {
        title: 'Pay Now'
    };

    sendToBot = async (id, data)=>{
        console.log(id)
        await fetch('https://naxetra.zeva.ai/naxetra/send/?id='+id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },body: 
                JSON.stringify(
                {
                    "purpose": "pay_now",
                    "result": {
                        "paynow":{
                            "id":12,
                            "supplier":"ACME LTD",
                            "price": "123",
                            "date": "12-12-2020"
                            }
                        }
                    }
                ),
        }).then((Response)=>Response.json()).then((responseJson)=>{
                console.log('Success', responseJson)
                this.props.navigation.goBack(null);
        }).catch(err => {
            console.log('Error while sending data',err)
        })
    }

    render() {
        const {navigation} = this.props;
        var data = navigation.getParam('data',{});
        var id = navigation.getParam('conversationID', "");
        return (
            <View style={{flex:1, justifyContent: "center"}}>
                <Text style={{justifyContent: "center", alignSelf:"center"}}>This is Screen for pay now option </Text>
                <TouchableOpacity onPress={()=> this.sendToBot(id, data)} 
                    style={{
                        alignItems: "center", 
                        justifyContent: "center",
                        backgroundColor: "#DDDDDD", 
                        
                        height: 40, margin: 50} }>
                            <Text>Click Here to send details to bot</Text>
                </TouchableOpacity>
            </View>
        );
    }
}