import { Expo } from 'expo-server-sdk';
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config('../')


/* export const send = async (expoPushToken,title,message1,name) => {
    console.log(expoPushToken)
    console.log("on the way")
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: `${message1}${name}`  ,
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message1),
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        cconsole.log(err);
    })
  } */

export const send = (pushToken,title,message,name) => {

    



    console.log("send")
    try{
    let expo = new Expo();
    console.log("send")

    // Create the messages that you want to send to clients
    let messages = [];
  
     
     
    
      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken,
        sound: 'default',
        title: title,
        body: `${message}${name}`  ,
        data: { someData: 'goes here' },
      })
    


    let chunks = expo.chunkPushNotifications(messages);
let tickets = [];
(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
})();
}
catch (error){
console.log(error);
}
}