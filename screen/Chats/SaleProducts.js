import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';


export default class SaleProducts extends React.Component {
    static navigationOptions = {
        title: 'Edit Vendor'
    };

    sendToBot = async (id, data)=>{
        console.log(id)
        await fetch('https://naxetra.zeva.ai/naxetra/send/?id='+id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },body: 
                //samples provided for different scenarios

                JSON.stringify(
                {
                    "purpose": "products_sale",
                    "result": {
                        "sale":{
                            "id":12,
                            "supplier":"ACME LTD",
                            "products": [{
                                "id": "p1",
                                "name": "printer",
                                "price": "304",
                                "quantity": 1
                            },
                            {
                                "id": "p2",
                                "name": "scanner",
                                "price": "203",
                                "quantity": 2
                            }]
                            }
                        }
                    }
                ),
        }).then((Response)=>Response.json()).then((responseJson)=>{
                console.log('Success', responseJson);
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
                <Text style={{justifyContent: "center", alignSelf:"center"}}>This is Screen for adding products for sales invoice</Text>
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