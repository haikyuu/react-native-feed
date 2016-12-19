# React-native Feed

An experimental feed app built with react-native.
![Screenshot](screenshot.png?raw=true "Feed Screenshot")
## Getting Started

These instructions will get you up and running.🏃

### Prerequisites

You'll need a running🏃 [postgresql](https://www.postgresql.org/download/) database
Check this awesome [guide](https://github.com/calebmer/postgraphql/blob/master/examples/forum/TUTORIAL.md#installation)

### Installing
Create the database
```
createdb feed
psql feed < database.sql
```
Install everything. (You should try [yarn](https://yarnpkg.com/))
```
npm install -g postgraphql
npm install
```
Ruuun : 🏃🏃🏃
```
postgraphql -c postgres://localhost:5432/feed --watch
react-native run-ios
#or
react-native run-android
```

Image upload won't work out of the box (the body parser of the node.js server has a default size limit of `100kb`), you'll need to change that:
- Find where postgraphql was installed :
```
npm bin -g
cd to the given location
#you'll find a symlink to postgraphql
cd to the original folder
```

- [Change `src/postgraphql/http/createPostGraphQLHttpRequestHandler.js` ](https://github.com/calebmer/postgraphql/pull/285/files) and include `limit: '50mb'` in the `bodyparser` options. [Check this](https://github.com/calebmer/postgraphql/pull/285/files)

## Built With

* [react-native](https://facebook.github.io/react-native/)
* [apollo-client](http://dev.apollodata.com/) - The **awesome** graphql client
* [graphql](http://graphql.org/)
* [postgresql](https://www.postgresql.org/)
* [postgraphql](https://github.com/calebmer/postgraphql) - The **amazing** Graphql API creator.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
