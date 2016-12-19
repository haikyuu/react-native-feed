/* @flow */

import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  LayoutAnimation,
  Easing,
} from 'react-native'
const { width } = Dimensions.get('window')
import StoryHeader from '@components/Feed/components/Story/StoryHeader'
import StoryFooter from '@components/Feed/components/Story/StoryFooter'
import {
  generateRandomColor,
  Icon,
  ionicon,
} from '@utils'

import {
  colors
} from '@styles'
class Story extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       fadeAnim: new Animated.Value(0), // init opacity 0
     };
  }
  componentDidMount() {
    console.log("this.props: ", this.props);
    Animated.sequence([
      Animated.delay(this.props.index * 200),
      Animated.timing(          // Uses easing functions
        this.state.fadeAnim,    // The value to drive
        {
          toValue: 1,
          easing: Easing.elastic(.5)
        }           // Configuration
      )
    ]).start();
   }

  renderBody(props){
    let imageSource
    if (props.image) {
      imageSource = {
        uri: 'data:image/jpeg;base64,' + props.image,
        // isStatic: true
      };
    }
      return (
        <View>
          <Text style={styles.textBody}>{props.body}</Text>
          {
            imageSource?
            <Image style={styles.postImage} source={imageSource} />
            // null
            :null
          }
        </View>
      )
  }
  render(){
    return (
      <Animated.View style={[this.props.style, styles.container, {
        opacity: this.state.fadeAnim,
        transform: [{
           translateY: this.state.fadeAnim.interpolate({
             inputRange: [0, 1],
             outputRange: [-10, 0]  // 0 : 150, 0.5 : 75, 1 : 0
           }),
        }],
      }]}>
        <StoryHeader {...this.props}/>
          {this.renderBody(this.props)}
        <StoryFooter  {...this.props} style={styles.footer} />
      </Animated.View>
    )
  }
}
const styles = StyleSheet.create({
    container:  {
      flex: 1,
      borderColor: colors.border.greyblue, borderWidth: 2,
      backgroundColor: 'white',
    },
    textBody: { fontSize: 15, color: colors.text.black, paddingHorizontal: 14,},
    footer: { marginHorizontal: 16, marginTop: 13, },
    postImage: { height: 220, width: width - 22, marginTop:8 },
})
export default Story
export {
  StoryFooter,
  StoryHeader,
}
