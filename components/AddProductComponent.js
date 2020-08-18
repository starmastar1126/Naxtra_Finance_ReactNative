/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image ,TextInput,AsyncStorage} from 'react-native'
import * as Images from '../constants/Image'
import * as Colors from '../constants/Colors'
import PropTypes from 'prop-types'
import global_style, {metrics} from '../constants/GlobalStyle'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {Fonts} from '../constants/Fonts'
import RNPickerSelect from 'react-native-picker-select';
import TextComponent from './TextComponent'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { changeNumber } from '../utils/utils';

const placeholder_terms = {
  label : 'Select Items',
  value : null,
  color : 'gray'
}
const placeholder_tax = {
  label : 'Tax is   (Excluded from amounts)',
  value : null,
  color : 'gray'
}


export default class AddProductComponent extends Component {

  state = {
    terms_arr : [],
    description : '',
    amount : '0',
    quantity : '0',
    price : 0,
    isReady : false,
    product_name : '',
    product_id : -1,
    selected_item : null,
    tax_arr : [],
    tax_amount : 0
  }
  checkReady () {
    if (this.state.product_name != '' && this.state.amount != '' && this.state.quantity != '') {
      this.setState({isReady : true})
    } else {
      this.setState({isReady : false})
    }
  }

  setEditInformation (data) {
    this.setState({
      quantity : data.quantity,
      amount : data.price
    })
  }

  componentDidMount () {
    this.setState({tax_arr : global.tax_arr})
    console.log('info = ' , global.product_info)
    if (global.product_info != '' && global.product_info != undefined) {
      this.setEditInformation(global.product_info)
    }
    var data = this.props.product_arr
    if (data.length > 0) {
      var arr = []
      var def = {
          label : '(No Terms Security)',
          value : -1,
          id : -1,
          color : 'black'
      }
      arr.push(def)
      for(var i = 0 ; i < data.length ; i++) {
          var obj = {
              label : data[i].name + '      (£ ' + changeNumber(data[i].lst_price) + ')',
              value : i,
              id : data[i].id,
              color : 'black'
          }
          arr.push(obj)
      }

      for (var i = 0; i < arr.length ; i++) {
        if (arr[i].id == global.product_info.id) {
          this.setState({selected_item : arr[i].value})
        }
      }
      this.setState({terms_arr : arr}, () => {
        
      })
    }
    
  }
  changeTax (value) {
    var arr = global.tax_arr
    if (arr.length > 0) {
      for (var i = 0 ; i < arr.length; i++) {
        if (value == arr[i].value) {
          this.setState({tax_amount : arr[i].amount})
          break;
        }
      }
    }
  }
  changeType (value) {
    console.log('item = ', this.props.product_arr[value])
    if (this.state.quantity == 0) {
      this.setState({
        product_id : this.props.product_arr[value].id , 
        quantity : 1 , 
        price : this.props.product_arr[value].lst_price, 
        amount : (this.props.product_arr[value].lst_price).toString(), 
        product_name : this.props.product_arr[value].name,
        selected_item : value
      }, () => this.checkReady())
    } else {
      this.setState({
        product_id : this.props.product_arr[value].id , 
        quantity : this.state.quantity ,
        price : this.props.product_arr[value].lst_price, 
        amount : (this.props.product_arr[value].lst_price   * this.state.quantity).toString(), 
        product_name : this.props.product_arr[value].name,
        selected_item : value
      }, () => this.checkReady())
    }
  }

  gotoList () {
    this.props.gotoList()
  }

  saveList () {
    if (!this.state.isReady) return
    var obj = {
      description : this.state.description,
      quantity : this.state.quantity,
      price : this.state.amount,
      name : this.state.product_name,
      id : this.state.product_id,
      tax : this.state.tax_amount
    }

    this.props.gotoSaveList(obj)
  }

  render() {
    return (
      <View style={styles.body}>
        <View style={styles.item_selector}>
          <Text style={{flex : 0.2 , fontFamily : Fonts.adobe_clean, fontSize : 18 * metrics}}>Item</Text>
          <View style={styles.picker_body}>
            <RNPickerSelect
                onValueChange={(value) => this.changeType(value)}
                items={this.state.terms_arr}
                placeholderTextColor={Colors.dark_gray}
                style={styles.plan_payment_term}
                placeholder={placeholder_terms}
                value={this.state.selected_item}
                textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean}}
            />
          </View>
        </View>     
        {/* <View style={styles.tax_selector}>
          <View style={{flex : 0.5}}></View>
          <View style={styles.tax_picker_body}>
            <RNPickerSelect
              onValueChange={(value) => this.changeTax(value)}
              items={this.state.tax_arr}
              placeholderTextColor={Colors.dark_gray}
              style={styles.tax_item}
              placeholder={placeholder_tax}
              textInputProps={{fontSize : 17 * metrics, fontFamily : Fonts.adobe_clean, color : Colors.main_color}}
            />
          </View> 
        </View> */}
        <View style={styles.description}>
          <TextComponent
            textPlaceHolder = "Description (Optional)"
            textValue={this.state.description}
            textType="text"
            ready ={ this.state.isReady}
            onChangeText = {(value) => this.setState({description : value},() => {this.checkReady()})}
          > </TextComponent>
        </View>
        <View style={styles.amount_value}>
          <View style={{flex : 0.45}}>
            <TextComponent
              textPlaceHolder = "Quantity"
              textValue={this.state.quantity}
              textType="number"
              ready ={ this.state.isReady}
              onChangeText = {(value) => this.setState({quantity : value, amount : value == '' ? (this.state.price * 1).toString() : (this.state.price * value).toString()},() => {this.checkReady()})}
            > </TextComponent>
          </View>
          <View style={{flex : 0.1}}></View>
          <View style={{flex : 0.45}}>
            <TextComponent
              textPlaceHolder = "Amount (£)"
              textValue={this.state.amount}
              textType="number"
              ready ={ this.state.isReady}
              onChangeText = {(value) => {
                this.setState({amount : value})
              }}
            > </TextComponent>
          </View>
        </View>
        <View style={styles.button_body}>
          <View style={{flex : 0.45, alignItems : 'flex-start', justifyContent : 'center'}}>
            <TouchableOpacity style={styles.save_btn} onPress={() => this.saveList()}>
              <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : 'white'}}>Save</Text>
            </TouchableOpacity>
            <View style={{marginTop : 10 * metrics}}></View>
            <TouchableOpacity style={styles.cancel_btn} onPress={() => this.gotoList()}>
              <Text style={{fontFamily : Fonts.adobe_clean, fontSize : 17 * metrics, color : 'white'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex : 0.1}}>
            
          </View>
          <View style={{flex : 0.45, alignItems : 'flex-end'}}>
            {/* <TouchableOpacity>
              <MaterialCommunityIcons name="plus-box" size={45 * metrics} color={Colors.main_color}></MaterialCommunityIcons>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{height : 40 * metrics}}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body : {
    width : '100%',
    minHeight : 350 * metrics,
    alignSelf : 'center',
    backgroundColor : 'white',
  },
  item_selector : {
    width : '90%',
    height : 110 * metrics,
    marginTop : 20 * metrics,
    flexDirection : 'row',
    alignSelf : 'center',
    alignItems : 'center'
  },
  tax_selector : {
    width : '90%',
    flexDirection : 'row',
    alignSelf : 'center',
    alignItems : 'center'
  },
  picker_body : {
    flex : 0.8,
    height : 45 * metrics,
    borderWidth : 1,
    borderColor : Colors.dark_gray,
    justifyContent : 'center',
    minHeight : 30 * metrics
  },
  tax_picker_body : {
    flex : 0.5,
    height : 45 * metrics,
    borderBottomWidth : 1,
    borderColor : Colors.dark_gray,
    justifyContent : 'center',
    minHeight : 30 * metrics
  },
  tax_item : {
    alignSelf : 'flex-end'
  },
  description : {
    width : '85%',
    alignSelf : 'center',
    marginTop : 15 * metrics
  },
  amount_value : {
    width : '85%',
    alignSelf : 'center',
    marginTop : 15 * metrics,
    flexDirection : 'row'
  },
  button_body : {
    width : '85%',
    alignSelf : 'center',
    marginTop : 35 * metrics,
    flexDirection : 'row',
  },
  save_btn : {
    justifyContent : 'center', alignItems : 'center', width : 100 * metrics, height : 45 * metrics, backgroundColor : 'green',
    borderWidth : 1, borderColor : Colors.dark_gray,borderRadius : 10 * metrics
  },
  cancel_btn : {
    justifyContent : 'center', alignItems : 'center', width : 100 * metrics, height : 45 * metrics, backgroundColor : Colors.red_color,
    borderWidth : 1, borderColor : Colors.dark_gray,borderRadius : 10 * metrics
  }
});

AddProductComponent.propType = {
  gotoList : PropTypes.func,
  gotoSaveList : PropTypes.func
}