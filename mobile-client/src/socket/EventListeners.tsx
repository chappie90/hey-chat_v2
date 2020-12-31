import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { navigate } from 'navigation/NavigationRef';

import { 
  appHandlers,
  contactsHandlers,
  chatsHandlers,
  profileHandlers,
  videoCallHandlers
} from './eventHandlers';

const SocketEventListeners = () => {
  const { userId, username, socketState, currentScreen } = useSelector(state => state.auth);
  const { chatHistory } = useSelector(state => state.chats);
  const { localStream, RTCConnection } = useSelector(state => state.video);
  const currentScreenRef = useRef('');
  const RTCPeerConnectionRef = useRef<any>(null);
  const localStreamRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    currentScreenRef.current = currentScreen;
    localStreamRef.current = localStream;
    RTCPeerConnectionRef.current = RTCConnection;
  }, [currentScreen, localStream, RTCConnection]);

  useEffect(() => {
    // Add event listeners
    if (socketState) {
      // User has successfully connected
      socketState.on('get_contacts', (data: string) => {
        contactsHandlers.onGetContacts(data, dispatch);
      });

      // User has successfully connected
      socketState.on('get_online_contacts', (data: string) => {
        contactsHandlers.onGetOnlineContacts(data, dispatch);
      });

      // Add new chat to sender's chats list
      // replace temporary contact id with new chat id in chatHistory global state
      // send confirmation of message delivered to sender
      // and add new pending contact to sender's contacts list
      socketState.on('first_message_sent', (data: string) => {
        chatsHandlers.onFirstMessageSent(data, dispatch);
      });

      // Add new chat to recipient's chats list
      socketState.on('first_message_received', (data: string) => {
        chatsHandlers.onFirstMessageReceived(data, dispatch);
      });

      // Update sender chat and send confirmation of message delivered to sender
      socketState.on('message_sent', (data: string) => {
        chatsHandlers.onMessageSent(data, dispatch);
      });

      // Update recipient's chats list and add new message to chat history
      socketState.on('message_received', (data: string) => {
        chatsHandlers.onMessageReceived(data, username, chatHistory, dispatch, socketState, currentScreenRef.current);
      });

      // Mark all sender's chat history messages as read
      socketState.on('messages_marked_as_read_sender', (data: string) => {
        chatsHandlers.onMessagesMarkedAsReadSender(data, dispatch);
      });

      // Update recipient's chat messages with liked message
      socketState.on('message_liked', (data: string) => {
        chatsHandlers.onMessageLiked(data, dispatch);
      }); 

      // Delete message for recipient
      socketState.on('message_deleted', (data: string) => {
        chatsHandlers.onMessageDeleted(data, dispatch);
      }); 

      // Update recipient's chat with new contact profile image
      socketState.on('profile_image_updated', (data: string) => {
        profileHandlers.onProfileImageUpdated(data, dispatch);
      });

      // Notify user when contact goes online
      socketState.on('user_online', (data: string) => {
        contactsHandlers.onContactIsOnline(data, userId, dispatch);
      }); 

      // Notify user when contact goes offline
      socketState.on('user_offline', (userId: string) => {
        contactsHandlers.onContactIsOffline(userId, dispatch);
      }); 

      // Contact has started typing
      socketState.on('contact_is_typing', (contactId: string) => {
        contactsHandlers.onContactIsTyping(contactId, dispatch);
      }); 

      // Contact has stopped typing
      socketState.on('contact_stopped_typing', (contactId: string) => {
        contactsHandlers.onContactStoppedTyping(contactId, dispatch);
      }); 

      // User has successfully established socket connection
      socketState.on('user_connected', () => {
        appHandlers.onUserConnected(dispatch);
      });

      // User has sent message after deleting chat
      // Restore chat
      socketState.on('chat_restored', (data: string) => {
        chatsHandlers.onChatRestored(data, dispatch);
      });

      // Recipient has received video call offer
      socketState.on('video_call_offer_received', (data: string) => {
        videoCallHandlers.onVideoCallOfferReceived(data, userId, socketState, dispatch);
      });

      // User has received contact's ice candidate
      socketState.on('ice_candidate_received', (data: string) => {
        videoCallHandlers.onICECandidateReceived(data,  RTCPeerConnectionRef.current, dispatch);
      });

      // Recipient has accepted video call
      socketState.on('video_call_accepted', (data: string) => {
        videoCallHandlers.onVideoCallAccepted(data, userId, socketState, RTCPeerConnectionRef.current, dispatch);
      });

      // Recipient has rejected video call
      socketState.on('video_call_rejected', () => {
        videoCallHandlers.onVideoCallRejected(navigate, dispatch);
      });

      // Caller has cancelled video call
      socketState.on('video_call_cancelled', () => {
        videoCallHandlers.onVideoCallCancelled(dispatch);
      });

      // Either user ends video call
      // Stop local stream
      socketState.on('video_call_ended', (data: string) => {
        videoCallHandlers.onVideoCallEnded(data, localStreamRef.current , RTCPeerConnectionRef.current, navigate, dispatch);
      });

    }
  }, [socketState]);

  return <></>;
};

export default SocketEventListeners;
