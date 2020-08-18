import * as React from 'react'
import {Image} from 'react-native'
import FastImage from 'react-native-fast-image'

// interface Props {
//     uri: string
//     width?: number
//     height?: number
//     style?
// }

export default class ScaledImage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            source: {uri: this.props.uri},
            width: 0,
            height: 0,
        }
    }

    componentWillMount() {
        Image.getSize(this.props.uri, (width, height) => {
            if (this.props.width && !this.props.height) {
                // if(width>=250)
                //     this.setState({width: 250, height: height * (250 / width)})
                // else
                    this.setState({width: this.props.width, height: height * (this.props.width / width)})
            } else if (!this.props.width && this.props.height) {
                this.setState({width: width * (this.props.height / height), height: this.props.height})
            } else {
                this.setState({width: width, height: height})
            }
        }, (error) => {
            console.log("ScaledImage:componentWillMount:Image.getSize failed with error: ", error)
        })
    }

    render() {
        return <FastImage
        style={{maxWidth: 250, borderRadius: 10, marginTop: 10, alignSelf: 'flex-start', width: this.state.width, height: this.state.height}}
        source={{
            uri: this.state.source.uri,
            priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.contain}
    />
        // return <Image source={this.state.source} style={[this.props.style, {height: this.state.height, width: this.state.width}]}/>
    }
}