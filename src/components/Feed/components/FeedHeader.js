/* @flow */
/*
Display a header image, and event info
needs to parse the date into a readable format
NOTE:
Edge cases
  [x] april 28 - mars 3 might take more space.
TODO:
  [x] parse dates using moment.js
  [] i18n :
    [x] Load moment from @utils folder
    [] #i18n
*/
type FeedHeaderProps = {
  style?: any,
  image: any,
  title: string,
  location: string,
  startDate: number,
  endDate: number,
};
//test props
FeedHeader.defaultProps = {
  image: require('@assets/images/cosmos.jpg'),
  title: 'React Native App',
  location: 'Graphql City',
  startDate: 1479227834989,
  endDate: 1479227837989,
}
import React from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native'
import {
  generateRandomColor,
  moment,
  ionicon,
  Icon,
} from '@utils'
const { width, height } = Dimensions.get('window')

function parseDateDifference(startDate: number, endDate: number):string{
  /* takes 2 dates
    returns April 2 - 7 | April 27 - Mars 2 |
  */
  const separator = ' - '
  const parsedStartDate = moment(startDate).format("MMM D");
  if(moment(startDate).isSame(endDate, 'day')){
    return parsedStartDate
  }else if (moment(startDate).month === moment(startDate).month) {
    return parsedStartDate + separator + moment(endDate).format("D")
  } else{
    const parsedEndDate = moment(endDate).format("MMM D");
    return parsedStartDate + separator + parsedEndDate
  }
}
function FeedHeader(props:FeedHeaderProps){
  const parsedPeriod = parseDateDifference(props.startDate, props.endDate)
  return (
    <View style={[props.style, styles.container]}>
       <Image source={props.image} style={styles.headerImage}/>
       <View style={styles.informationsContainer}>
          <Text style={styles.title}> {props.title} </Text>

         <View style={styles.subInformationsContainer}>
           <View style={styles.leftInformationsContainer}>
             <Icon name={ionicon.outline('pin')} size={17} style={[styles.icon, styles.leftIcon]} color={'black'} />
             <Text style={styles.informationsText}>{props.location}</Text>
           </View>

           <View style={styles.rightInformationsContainer}>
             <Icon name={ionicon.outline('calendar')} size={17} style={styles.icon} color={'black'} />
             <Text style={styles.informationsText}>{parsedPeriod}</Text>
           </View>
         </View>
       </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, height: 210, backgroundColor: 'white', },
  headerImage: { width, height: 154, },
  informationsContainer: {
    flexDirection: 'column', justifyContent: 'center', flex: 1,
    borderColor: '#dce5eb', borderWidth: 1,
  },
  title: {
    textAlign: 'center', fontSize: 17, fontWeight: '600',
    color: '#525253', marginBottom: 2,
  },
  subInformationsContainer: { justifyContent: 'center', flexDirection: 'row' },
  leftInformationsContainer: { marginRight: 13.4, flexDirection: 'row' },
  rightInformationsContainer: { flexDirection: 'row' },
  icon: { width: 18, height: 18 },
  leftIcon: { marginRight: -4 },
  informationsText: {color: '#787878', fontSize: 13.7, fontWeight: '400'},
})
export default FeedHeader
