import React from 'react'
import { createAppContainer ,createDrawerNavigator} from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import LoginScreen from '../screen/LoginScreen'
//import FingerScreen from '../screen/FingerScreen'
import SplashScreen from '../screen/SplashScreen'
import SignUpScreen from '../screen/SignUpScreen'
import VerifyScreen from '../screen/VerifyScreen'
import WelcomeScreen from '../screen/WelcomeScreen'
import BusinessDetailScreen from '../screen/BusinessDetailScreen'
import PersonalDetailScreen from '../screen/PersonalDetailScreen'
import CompanyScreen from '../screen/CompanyScreen'
import CompanyOfficerScreen from '../screen/CompanyOfficerScreen'
import UploadProofScreen from '../screen/UploadProofScreen'
import PreviewScreen from '../screen/PreviewScreen'
import ForgotPasswordScreen from '../screen/ForgotPasswordScreen'
import TabScreen from '../screen/TabScreen/TabScreen'
import ComingSoonScreen from '../screen/ComingSoonScreen'
import PaymentLinkScreen from '../screen/DetailScreen/PaymentLinkScreen'
import HelpScreen from '../screen/SettingScreen/HelpScreen'
import SettingScreen from '../screen/SettingScreen/SettingScreen'
import PasswordScreen from '../screen/SettingScreen/PasswordScreen'
import ChangePinScreen from '../screen/SettingScreen/ChangePinScreen'
import TermsAndConditionScreen from '../screen/SettingScreen/TermsAndConditionScreen'
import FaqScreen from '../screen/SettingScreen/FaqScreen'
import PrivacyScreen from '../screen/SettingScreen/PrivacyScreen'
import AccountHelpScreen from '../screen/SettingScreen/AccountHelpScreen'
import HelpAccountScreen from '../screen/SettingScreen/HelpAccountScreen'
import HelpAnylaticsScreen from '../screen/SettingScreen/HelpAnalyticsScreen'
import IssueScreen from '../screen/SettingScreen/IssueScreen'
import ChattingScreen from '../screen/Message/ChattingScreen'
import MessageScreen from '../screen/Message/MessageScreen'
import BiometricScreen from '../screen/BiometricScreen'
import NaxetraAccount from '../screen/DetailScreen/NaxetraAccount'
import BankAccount from '../screen/DetailScreen/BankAccount'
import ConfirmScreen from '../screen/DetailScreen/ConfirmScreen'
import TransferScreen from '../screen/DetailScreen/TransferScreen'
import LinkSuccessScreen from '../screen/DetailScreen/LinkSuccessScreen'
import AddBeneficiaryScreen from '../screen/DetailScreen/AddBeneficiaryScreen'
import ManageBeneficiary from '../screen/DetailScreen/ManageBeneficiary'
import AddMoneyScreen from '../screen/DetailScreen/AddMoneyScreen'
import SelectMoneyScreen from '../screen/DetailScreen/SelectMoneyScreen'
import VerfiyNumberScreen from '../screen/DetailScreen/VerfiyNumberScreen'
import ActivityScreen from '../screen/ActivityScreen'
import RequestDebitCardScreen from '../screen/DetailScreen/RequestDebitCardScreen'
import TicketScreen from '../screen/SettingScreen/TicketScreen'
import PersonalSettingScreen from '../screen/SettingScreen/PersonalSettingScreen'
import AccountSettingScreen from '../screen/SettingScreen/AccountSettingScreen'
import PriceSettingScreen from '../screen/SettingScreen/PriceSettingScreen'
import CardDetailScreen from '../screen/DetailScreen/CardDetailScreen'
import PinCodeScreen from '../screen/DetailScreen/PinCodeScreen'
import ConfirmAddressScreen from '../screen/DetailScreen/ConfirmAddressScreen'
import ViewAllScreen from '../screen/DetailScreen/ViewAllScreen'
import PdfScreen from '../screen/DetailScreen/PdfScreen'
import ConfrimPaymentScreen from '../screen/DetailScreen/ConfirmPaymentScreen'
import Chat from '../screen/Chats/Chat'
import MyWebView from '../screen/Chats/MyWebView'
import ViewPicScreen from '../screen/DetailScreen/ViewPicScreen'
import CompanyDetail from '../screen/SettingScreen/CompanyDetail'

import CRMListScreen from '../screen/CRM/CRMListScreen'
import CreateCRMScreen from '../screen/CRM/CreateCRMScreen'
import ActiveScreen from '../screen/CRM/ActiveScreen'
import CRMCallScreen from '../screen/CRM/CRMCallScreen'
import DetailCRMScreen from '../screen/CRM/DetailCRMScreen'

//Account Screen
import AccountTabScreen from '../screen/Accounts/AccountTabScreen'
import AddProduct from '../screen/Accounts/Component/AddProduct'
import CreateProduct from '../screen/Accounts/Component/CreateProduct'

//Chat Screen
import VendorEdit from '../screen/Chats/VendorEdit'
import PurchaseProducts from '../screen/Chats/PurchaseProducts'
import SaleProducts from '../screen/Chats/SaleProducts'

import AddMoney from '../screen/DetailScreen/AddMoney'

// import BillPayment from '../screen/Accounts/Component/BillPayment'

const AppNavigator = createStackNavigator({
    LoginScreen: { screen: LoginScreen },
    SplashScreen : { screen : SplashScreen },
    SignUpScreen : { screen : SignUpScreen },
    VerifyScreen : { screen : VerifyScreen },
    WelcomeScreen : { screen : WelcomeScreen },
    PersonalDetail : { screen : PersonalDetailScreen },
    BusinessDetail : { screen : BusinessDetailScreen } , 
    CompanyScreen : { screen : CompanyScreen},
    CompanyOfficer : { screen : CompanyOfficerScreen },
    UploadProof : { screen : UploadProofScreen } ,
    PreviewScreen : { screen : PreviewScreen },
    ForgotPasswordScreen : { screen : ForgotPasswordScreen },
    TabScreen : { screen : TabScreen },
    ComingSoonScreen : { screen : ComingSoonScreen },
    PaymentLinkScreen : { screen : PaymentLinkScreen },
    HelpScreen : { screen : HelpScreen },
    SettingScreen : { screen : SettingScreen },
    PasswordScreen : { screen : PasswordScreen },
    ChangePinScreen : { screen : ChangePinScreen },
    TermScreen : { screen : TermsAndConditionScreen },
    FaqScreen : { screen : FaqScreen },
    PrivacyScreen : { screen : PrivacyScreen },
    AccountHelpScreen : { screen : AccountHelpScreen },
    HelpAccountScreen : { screen : HelpAccountScreen },
    TicketScreen : { screen : TicketScreen},
    HelpAnalyticsScreen : { screen : HelpAnylaticsScreen },
    IssueScreen : { screen : IssueScreen },
    MessageScreen : { screen : MessageScreen },
    ChattingScreen : { screen : ChattingScreen },
    BiometricScreen : { screen : BiometricScreen },
    NaxetraAccount : { screen : NaxetraAccount },
    BankAccount : { screen : BankAccount},
    ConfirmScreen : { screen : ConfirmScreen },
    TransferScreen : { screen : TransferScreen },
    LinkSuccessScreen : { screen : LinkSuccessScreen },
    AddBeneficiaryScreen : { screen :AddBeneficiaryScreen },
    ManageBeneficiary : { screen : ManageBeneficiary },
    AddMoneyScreen : { screen : AddMoneyScreen }, 
    SelectMoneyScreen : { screen : SelectMoneyScreen },
    VerfiyNumberScreen : { screen : VerfiyNumberScreen },
    ActivityScreen : { screen : ActivityScreen },
    RequestDebitCardScreen : { screen : RequestDebitCardScreen },
    AccountSettingScreen : { screen : AccountSettingScreen },
    PersonalSettingScreen : {screen : PersonalSettingScreen },
    PriceSettingScreen : { screen : PriceSettingScreen },
    CardDetailScreen : { screen : CardDetailScreen },
    PinCodeScreen : { screen : PinCodeScreen },
    ConfirmAddressScreen : { screen : ConfirmAddressScreen },
    ViewAllScreen : { screen : ViewAllScreen },
    PdfScreen : { screen : PdfScreen },
    ConfrimPaymentScreen : { screen : ConfrimPaymentScreen },
    Chat : { screen : Chat} ,
    MyWebView : { screen : MyWebView },
    ViewPicScreen : { screen : ViewPicScreen },
    CRMListScreen : { screen : CRMListScreen },
    CreateCRMScreen : { screen : CreateCRMScreen},
    ActiveScreen : { screen : ActiveScreen },
    CRMCallScreen : {screen : CRMCallScreen},
    DetailCRMScreen  : { screen : DetailCRMScreen },
    //Account Screen
    AccountTabScreen : { screen : AccountTabScreen },
    AddProduct : { screen : AddProduct },
    VendorEdit : { screen : VendorEdit },
    PurchaseProducts : { screen : PurchaseProducts },
    SaleProducts : { screen : SaleProducts },
    CreateProduct : { screen : CreateProduct },
    AddMoney : { screen : AddMoney },
    // BillPayment : { screen : BillPayment }

    CompanyDetail : { screen : CompanyDetail }, 
    
}, {
    initialRouteName: 'SplashScreen',
    navigationOptions : {
        headerLeft: null
    }
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;