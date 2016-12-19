/* @flow weak */
import React, { Component } from 'react';
import Feed from '@components/Feed/Feed'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`
{
  allPosts (orderBy: CREATEDAT_DESC){
    nodes{
      __id
      id
      body
      image
      createdat
      userByUserid{
        id
        name
      }
      userLikePostsByPostid{
        totalCount
        nodes{
          userByUserid{
            id
            name
          }
        }
      }
    }
  }
}
`
const FeedContainer = graphql(query, {
  options: { pollInterval: 20000 },
})(Feed)


export default FeedContainer
