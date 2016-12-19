/* @flow weak */

import React, { Component } from 'react';
import {
  Feed
} from '@components'
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:5000/graphql' }),
});
class Root extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <ApolloProvider client={client}>
        <Feed/>
      </ApolloProvider>
    )
  }
}
export default Root
