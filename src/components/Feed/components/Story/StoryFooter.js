/* @flow */
/*
  StoryFooter
  Like, Comment and share actions
*/
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Animated,
} from 'react-native'
import {
  generateRandomColor,
  Icon,
  ionicon,
} from '@utils'
import {
  colors
} from '@styles'
const IconAnimated = Animated.createAnimatedComponent(Icon)
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';


class AnimatedIcon extends React.Component{
  constructor(props){
    super(props)
    this.state = {
       fadeAnim: new Animated.Value(0), // init opacity 0
     };
  }
  componentDidMount(){
    Animated.timing(          // Uses easing functions
       this.state.fadeAnim,    // The value to drive
       {toValue: 1}            // Configuration
     ).start();
  }
  render(){
    return (
      <IconAnimated

         {...this.props} />
    )
  }
}
type StoryFooterProps = {
  style?: any,
  likes: number,
  comments: number,
  liked_by_user: boolean
}

const defaultProps: StoryFooterProps = {
  likes: 0,
  comments: 0,
  liked_by_user: false,
}
class StoryFooter extends React.Component {
  constructor(props:StoryFooterProps) {
    super(props)
    this.state = {
      likedByCurrentUser:
        this.props.userLikePostsByPostid.nodes.some(user=>user.userByUserid.id === this.props.userByUserid.id)
        &&
        this.props.userLikePostsByPostid.totalCount !== 0,
    }
    this.like = this.like.bind(this)
    this.unlike = this.unlike.bind(this)
    this.onLikePress = this.onLikePress.bind(this)
  }

  onLikePress(){
    if (this.state.likedByCurrentUser) {
      this.unlike()
    }else{
      this.like()
    }
  }
  like(){
    this.setState({
      likedByCurrentUser: !this.state.likedByCurrentUser,
    })
    this.props.likePost({userId: 1})
      .then(({ data }) => {
        console.log('got data', data);
        this.props.refetch().then(data=>{

        })
      }).catch((error) => {
        this.setState({
          likedByCurrentUser: !this.state.likedByCurrentUser,
        })
        console.log('there was an error sending the query', error);
      });
  }
  unlike(){
    this.setState({
      likedByCurrentUser: !this.state.likedByCurrentUser,
    })
    this.props.unlikePost({userId: 1})
      .then(({ data }) => {
        console.log('got data', data);
        this.props.refetch().then(data=>{

        })
      }).catch((error) => {
        this.setState({
          likedByCurrentUser: !this.state.likedByCurrentUser,
        })
        console.log('there was an error sending the query', error);
      });
  }
  share(){
    Share.share({
      message: this.props.body,
      title: 'Post by ' + this.props.userByUserid.name,
      url: "https://google.com",
    }, {
      dialogTitle: "Share post",
      tintColor: 'papayawhip',
    }).then(this.showResult)
  }
  showResult(result){
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log("result.activityType: ", result.activityType);
      } else {
        console.log("shared");
      }
    } else if (result.action === Share.dismissedAction) {
      console.log("dismissed");
    }
  }
  render(){
    //TODO: use yahoo intl
    let likes = this.props.userLikePostsByPostid.totalCount
    // let likes = rand
    let likesText
    if (likes === 0) {
      likesText = 'Like'
    }else if(likes === 1){
      likesText = '1 Like'
    }else{
      likesText = likes + ' Likes'
    }
    let commentsText
    if (this.props.comments === 0) {
      commentsText = 'Comment'
    }else if(this.props.comments === 1){
      commentsText = '1 Comment'
    }else{
      commentsText = this.props.comments + ' Comments'
    }

    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={this.onLikePress.bind(this)}>
            {
              this.state.likedByCurrentUser?
              <Icon
                 name={ionicon('heart')} size={24} color={'#e74c3c'}
                 style={{

                 }}
                />
              :
              <Icon
                name={ionicon.outline('heart')} size={24} color={colors.text.grey}

               />
            }
          </TouchableOpacity>
          <Text style={styles.actionText}>{likesText}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name={ionicon('chatboxes')} size={24} color={colors.text.grey} />
          </TouchableOpacity>
          <Text style={styles.actionText}>{commentsText}</Text>
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={this.share.bind(this)}>
            <Icon name={ionicon('share')} size={24} color={colors.text.grey} />
          </TouchableOpacity>
          <Text style={styles.actionText}>Share</Text>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    container:  {
      flex: 1, justifyContent: 'space-around', flexDirection: 'row',
      padding: 13,
      borderTopColor: colors.border.lightgrey, borderTopWidth: 2,
    },
    actionContainer: { flexDirection: 'row', alignItems: 'center'},
    actionButton: { marginRight: 8, },
    actionText: { color: colors.text.grey, fontSize: 14, }
})
StoryFooter.defaultProps = defaultProps

const likeQuery = gql`
  mutation likePost ($userlikepost: CreateUserLikePostInput!){
    createUserLikePost(input: $userlikepost){
      userLikePost {
        userid
      }
    }
  }
`
const unlikeQuery = gql`
  mutation unlikePost ($userlikepost: DeleteUserLikePostByUseridAndPostidInput!){
    deleteUserLikePostByUseridAndPostid(input: $userlikepost){
      userLikePost {
        userid
      }
    }
  }
`
export default graphql(likeQuery, {
  props: ({ ownProps, mutate })=> ({
    likePost: ({body, userId = 1}) => mutate({ variables: {
    	"userlikepost": {
       	"userLikePost": {
          "userid": 1,
        	"postid": ownProps.id
        }
      }
    }})
  })
})(
  graphql(unlikeQuery, {
    props: ({ ownProps, mutate })=> {
      return ({
        unlikePost: ({body, userId = 1}) => mutate({ variables: {
        	"userlikepost": {
              "userid": 1,
            	"postid": ownProps.id
          }
        }})
      })
    }
  })(StoryFooter)
)
// export default StoryFooter
