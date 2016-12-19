/* @flow */
import {ScrollView, Text, View, StyleSheet, ActivityIndicator} from 'react-native'
import React from 'react'

import {FeedHeader, StoryInput, Story} from '@components/Feed'
class Feed extends React.Component {
    constructor(props) {
        super(props)
    }
    onRefreshClicked() {
        this.props.data.refetch();
    }
    renderData() {
        if (this.props.data.loading) {
            return <ActivityIndicator/>
        } else if(this.props.data.allPosts.nodes.length === 0){
          return <Text style={styles.emptyFeedMessage}>Nothing to show ... Try to post something</Text>
        } else{
            return this.props.data.allPosts.nodes.map((post, index) => {
                return <Story
                   {...post} refetch={this.props.data.refetch} index={index}
                  style={styles.story} key={post.__id} type={'post'}
                  onRefreshClicked={this.onRefreshClicked.bind(this)}/>
            })
        }
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <FeedHeader/>
                <StoryInput onRefreshClicked={this.onRefreshClicked.bind(this)}/>
                <View style={{
                    padding: 9,
                    flex: 1
                }}>
                    {this.renderData()}
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#f4f3f3'
    },
    story: {
        marginBottom: 8
    },
    emptyFeedMessage:{
      color: '#90a0a9',
      alignSelf: 'center',
      marginTop: 10
    }
})
export default Feed
