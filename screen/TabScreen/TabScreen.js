import React, {Component} from 'react'
import {Platform, View,Text, TouchableOpacity , StyleSheet,BackHandler,StatusBar, ActivityIndicator,SafeAreaView ,Alert, AsyncStorage} from 'react-native'
import global_style ,{ metrics} from '../../constants/GlobalStyle'
import Tabs from 'react-native-tabs';
import * as Colors from '../../constants/Colors'
import { BorderlessButton } from 'react-native-gesture-handler'
import SideMenuComponent from '../../components/SideMenuComponent'
import ItemDetailComponent from '../../components/ItemDetailComponent'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Drawer from 'react-native-drawer'
import AnalyticsScreen from './AnalyticsScreen'
import CardScreen from './CardScreen'
import MoreScreen from './MoreScreen'
import PaymentScreen from './PaymentScreen'
import AccountScreen from './AccountScreen'
import UserService from '../../service/UserService';
import {Fonts} from '../../constants/Fonts'
import { alertMessage } from '../../utils/utils';
import TransactionService from '../../service/TransactionService';


export default class TabScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            header: null,
        }
    };
    openDrawer = () => {
        this.setState({isShowSide : true})
        this._drawer.open()
    }

    closeDrawer = () => {
        this.setState({isShowSide : false})
        this._drawer.close()
    }

    changeToken () {
        var obj = {
            login : global.user_info.email,
            password : global.user_info.password
        }
        UserService.loginUser(obj).then(res => {
            var data = res.data.result
            if (data.success) {
                console.log('TOKEN SUCCESS')
                global.token = data.token
                global.time = new Date().getTime()
            } else {
                global.time = new Date().getTime()
            }
        }).catch(error => {
            console.log('error = ' , error)
        })
    }

    changeTab = (value) => {
        this._drawer.close()
        this.setState({page:value.props.name}, () => {
            switch(value.props.name) {
                case 'Account' :
                    global.tabIdx = 1
                    break;
                case 'Analytics' :
                    global.tabIdx = 2
                    break;
                case 'Payments' :
                    global.tabIdx = 3
                    break;
                case 'Cards' :
                    global.tabIdx = 4
                    break;
                case 'More' :
                    global.tabIdx = 5
                    break;    
            }
        })


    }

    showDetail = (item) => {
        var obj = {
            note : !item.rb_transaction_add_notes ? '' : item.rb_transaction_add_notes,
            rating : '',
            attach : ''
        }
        this.setState({isLoading : true})
        TransactionService.getTransactionDetail(global.token, item.id).then(res => {
            var detail = res.data.result
            if (!detail.success) {
                return
            }
            this.setState({transaction_item : detail.response[0]})
            TransactionService.getTransactionDetailById(global.token, item.id).then(res => {
                var data = res.data.result
                if (data.success) {
                    item = data.response[0]
                    console.log('detail = ', item)
                    TransactionService.getRating(item.naxetra_id, global.token).then(res => {
                        var data = res.data.result
                        obj.rating = data
                        TransactionService.getAttach(item.naxetra_id, global.token).then(res => {
                            var data = res.data.result
                            
                            if (data.success) {
                                obj.attach = data.response
                            } else {
                                obj.attach = []
                            }
                            this.setState({
                                isShowDetail : true,
                                item : item,
                                isLoading : false,
                                transaction_data : obj
                            })   
                        }).catch(error => {
                            this.setState({isLoading : false})
                        })
                    }).catch(error => {
                        console.log('error2 = ' , error.message)
                        this.setState({isLoading : false})
                    })
                }
            }).catch(error => {
                alertMessage(error.message)
                this.setState({isLoading : false})
            })
        })
        
    }
    constructor(props) {
        super(props);
        this.state = {
            page:'Account',
            isShowDetail : false,
            isShowSide :false,
            item : null,
            isLoading : false,
            transaction_data : '',
            transaction_item : ''
        };
        
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.account_ref = null;
        
         //re-login
        // global.timeout = setInterval(() => {
        //     this.getLocalStorage()
        // }, 30000);
        //important
    }

    async getLocalStorage () {
        var flag = await AsyncStorage.getItem('logout')
        if (flag == "0") { //login
            this.changeToken()
        } else { //logout
        }
    }

    componentWillReceiveProps() {
        this.componentDidMount()
    }

    Logout = (flag) => {
        this.setState({isLoading : flag})
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    //
    async setLocalStorage() {
        await AsyncStorage.setItem('steps' , 'LoginScreen')
        await AsyncStorage.setItem("is_signup", '')
    }
    componentDidMount() {     
        this.setLocalStorage()
        global.pay_type = 1
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        //this.testData()
        this.initTabScreen()   
    }
    setLoading = (flag) => {
        this.setState({isLoading : flag})
    }

    initTabScreen () {
        if (typeof(global.tabIdx) == "undefined" || global.tabIdx == '') {
            this.setState({page : 'Account'})
            return;
        }
        switch(global.tabIdx) {
            case 1 : 
                this.setState({page : 'Account'})
                if (global.init_account == 'true' && this.account_ref != null) 
                    this.account_ref.onChangeState()
                break;
            case 2 : 
                this.setState({page : 'Analytics'})
                break;
            case 3 : 
                this.setState({page : 'Payments'})
                break;
            case 4 : 
                this.setState({page : 'Cards'})
                break;
            case 5 : 
                this.setState({page : 'More'})
                break;
        }
    }

    handleBackButtonClick() {
        if (this.state.isShowDetail) {
            this.setState({isShowDetail : false}, () => {
                this.account_ref.onChangeState() //new add
            })
            return true
        } else {
            return false    
        }
    }
    render() {
        return (
            <SafeAreaView style={{flex : 1}}>
                <StatusBar
                    // translucent
                    barStyle = "dark-content" 
                    hidden = {false}
                    backgroundColor="white"
                    />
                <View style={styles.container}>
                    <View style={{width : '100%', height : '100%'}}>
                        <Drawer
                            ref={(ref) => this._drawer = ref}
                            type="overlay"
                            content={<SideMenuComponent isLoadingfunc={this.Logout} goInit={() => console.log('1')} navigation={this.props.navigation} closeDrawer = {() => this.closeDrawer() }/>}
                            tapToClose={true}
                            openDrawerOffset={0.2} // 20% gap on the right side of drawer
                            panCloseMask={0.2}
                            closedDrawerOffset={-2}
                            onDragStart={() => this.setState({isShowSide : false})}
                            onClose={() => this.setState({isShowSide : false})}
                            styles={drawerStyles}
                            tweenHandler={(ratio) => ({
                                main: { opacity:(2-ratio)/2 },
                            })}
                        >
                            {
                                this.state.page == 'Account' &&
                                <AccountScreen ref={(ref) => this.account_ref = ref} gotoTabScreen = {() => this.componentDidMount()}  showDetailItem={this.showDetail} navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></AccountScreen>
                            }
                            {
                                this.state.page == 'Analytics' &&
                                <AnalyticsScreen showDetailItem={this.showDetail} navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></AnalyticsScreen>
                            }
                            {
                                this.state.page == 'Payments' &&
                                <PaymentScreen navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></PaymentScreen>
                            }
                            {
                                this.state.page == 'Cards' &&
                                <CardScreen navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></CardScreen>
                            }
                            {
                                this.state.page == 'More' &&
                                <MoreScreen navigation={this.props.navigation} showDrawer = {() => this.openDrawer()}></MoreScreen>
                            }   
                        </Drawer>
                        {
                            !this.state.isShowDetail && !this.state.isShowSide && 
                            <Tabs selected={this.state.page} style={styles.tab_body} selectedStyle={{color:'red'}} onSelect={value=> this.changeTab(value)}>
                                <View name="Account" style={styles.tab_item}>
                                    <BorderlessButton style={styles.tabBarIcon}>
                                        <EvilIcons name="user" size={30 * metrics} style={this.state.page == 'Account' && {color : Colors.main_color}}></EvilIcons>
                                        {
                                            this.state.page == 'Account' &&
                                            <Text style={{color : Colors.main_color,fontFamily : Fonts.adobe_clean}}>Account</Text>
                                        }
                                    </BorderlessButton>
                                </View>
                                <View name="Analytics" style={styles.tab_item}>
                                    <BorderlessButton style={styles.tabBarIcon}>
                                        <MaterialIcon name="chart-bar" size={25 * metrics} style={this.state.page == 'Analytics' && {color : Colors.main_color}}></MaterialIcon>
                                        {
                                            this.state.page == 'Analytics' &&
                                            <Text style={{color : Colors.main_color,fontFamily : Fonts.adobe_clean}}>Analytics</Text>
                                        }
                                    </BorderlessButton>
                                </View>
                                <View name="Payments" style={styles.tab_item}>
                                    <BorderlessButton style={styles.tabBarIcon}>
                                        <MaterialIcon name="wallet-giftcard" size={25 * metrics} style={this.state.page == 'Payments' && {color : Colors.main_color}}></MaterialIcon>
                                        {
                                            this.state.page == 'Payments' &&
                                            <Text style={{color : Colors.main_color,fontFamily : Fonts.adobe_clean}}>Payments</Text>
                                        }
                                    </BorderlessButton>
                                </View>
                                <View name="Cards" style={styles.tab_item}>
                                        <BorderlessButton style={styles.tabBarIcon}>
                                            <MaterialIcon name="account-card-details-outline" size={25 * metrics} style={this.state.page == 'Cards' && {color : Colors.main_color}}></MaterialIcon>
                                            {
                                                this.state.page == 'Cards' &&
                                                <Text style={{color : Colors.main_color,fontFamily : Fonts.adobe_clean}}>Cards</Text>
                                            }
                                        </BorderlessButton>
                                    </View>
                                <View name="More" style={styles.tab_item}>
                                        <BorderlessButton style={styles.tabBarIcon}>
                                            <MaterialIcon name="dots-horizontal-circle-outline" size={25 * metrics} style={this.state.page == 'More' && {color : Colors.main_color}}></MaterialIcon>
                                            {
                                                this.state.page == 'More' &&
                                                <Text style={{color : Colors.main_color,fontFamily : Fonts.adobe_clean,}}>More</Text>
                                            }
                                        </BorderlessButton>
                                    </View>
                            </Tabs> 
                        }
                    </View>
                </View>
                {
                    this.state.isShowDetail &&
                    <View style={global_style.opacityBg}>
                        <ItemDetailComponent navigation ={this.props.navigation} origin_data ={this.state.transaction_item} trans_data ={this.state.transaction_data} funcLoading = {this.setLoading} item={this.state.item} closeModal={() => {
                            this.setState({isShowDetail : false})
                            this.componentDidMount()
                            this.account_ref.onChangeState() //new add
                        }}></ItemDetailComponent>
                    </View>
                }
                {
                    this.state.isLoading && 
                    <View style={global_style.loading_body}>
                        <ActivityIndicator size={100} color={Colors.main_color} style={global_style.activityIndicator}></ActivityIndicator>
                    </View>
                }
            </SafeAreaView>
        );
    }
}
const drawerStyles = {
    drawer: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 50},
    main: {paddingLeft: 3,},
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    tab_body : {
        backgroundColor : 'white',
        height : 55 * metrics,
        elevation : Platform.OS == 'android'  ? 5 : 0.5,
    },
    welcome: {
      fontSize: 20 * metrics,
      fontFamily : Fonts.adobe_clean,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
    tab_item : {
        width : '100%',
        height : '100%',
        justifyContent : 'center'
    },
    tabBarIcon : {
        width : '100%',
        height : '90%',
        flexDirection : 'column',
        justifyContent : 'center',
        alignSelf : 'center',
        alignItems : 'center'
    },
    normal : {
        width : '100%',
        height : '100%',
        justifyContent : 'center'
    }
});
   