/* @flow */
/*
  StoryHeader

*/
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActionSheetIOS,
  Platform
} from 'react-native'
import {
  generateRandomColor,
  Icon,
  ionicon,
  moment
} from '@utils'

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';


import { colors } from '@styles'

const defaultProps: StoryHeaderProps = {
  publisher: {
    type: 'attendee',
    publisher_id: 'id', // NOTE when organizer => no id
    publisher_name: 'Christina Hendricks',
  },
  created: "2016-11-15T12:53:21.146Z",
  avatar: require('@assets/images/photoProfile2.png'),
}
class StoryHeader extends React.Component {
  constructor(props:StoryHeaderProps) {
    super(props)
    this.handleMorePress = this.handleMorePress.bind(this)
  }
  render(){
    const created = moment(this.props.createdat).fromNow(true)
    return (
      <View style={[this.props.style, styles.container]}>
        <Image style={styles.avatar} source={this.props.avatar} />
        <View style={styles.informations}>
          <Text style={styles.publisher}>{this.props.userByUserid.name}</Text>
          <Text style={styles.publishedDate}>{created + ' ago'}</Text>
        </View>
        {/*TODO: check if post is mine*/}
        <TouchableOpacity style={styles.moreButton} onPress={this.handleMorePress}>
          <Icon name={ionicon('more')} size={25} color={colors.text.grey}/>
        </TouchableOpacity>
      </View>
    )
  }
  handleMorePress = () => {
    const BUTTONS = [
      'Delete',
      'Cancel'
    ];
    const DESTRUCTIVE_INDEX = 0;
    const CANCEL_INDEX = 1;
    if(Platform.OS === 'ios'){
      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
      },
      (buttonIndex) => {
        if (buttonIndex === DESTRUCTIVE_INDEX) {
          //TODO check if it's the user's post first
          //TODO check also in the database
          this.props.deletePost()
          this.props.refetch()
        }
      });
    }else{
      //TODO
    }
  };
}
const styles = StyleSheet.create({
  container:  {
    flex: 1,  justifyContent: 'center', flexDirection: 'row',
    margin: 12,
    backgroundColor: 'white',
  },
  avatar: {
     width: 36, height: 36,
     marginRight: 12,
  },
  informations: { flex: 1, },
  publisher: { fontSize: 16, color: colors.text.black,  },
  publishedDate: { fontSize: 11.7, color: colors.text.grey, },
  moreButton: { alignSelf: 'center'}
})
StoryHeader.defaultProps = defaultProps
const deletePostQuery = gql`
  mutation deletePost ($post: DeletePostByIdInput!){
    deletePostById(input: $post){
     deletedPostId
    }
  }
`
export default graphql(deletePostQuery, {
  props: ({ ownProps, mutate })=> {
    return ({
      deletePost: () => mutate({ variables: {
        "post": {
            "id": ownProps.id
        }
      }})
    })
  }
})(StoryHeader)
// export default StoryHeader
