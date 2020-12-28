import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux'

import { appActions, chatsActions } from 'reduxStore/actions';
import Chat from 'components/chats/chat/Chat';
import ChatHeader from 'components/chats/chat/ChatHeader';
import { Colors } from 'variables';
import CameraWidget from 'components/camera/CameraWidget';
import PhotosLibraryWidget from 'components/camera/PhotosLibraryWidget';

type CurrentChatScreenProps = StackScreenProps<ContactsStackParams, 'CurrentChat'>;

const CurrentChatScreen = ({ route, navigation }: CurrentChatScreenProps) => {
  const { chatType, chatId, contactId, contactName, contactProfile } = route.params;
  const { chats } = useSelector(state => state.chats);
  const dispatch = useDispatch();
  const [isVisibleCamera, setIsVisibleCamera] = useState(false);
  const [isVisibleLibrary, setIsVisibleLibrary] = useState(false);
  const [messageImageData, setMessageImageData] = useState<TCameraPhoto | null>(null);

  const showCamera = (): void => setIsVisibleCamera(true);

  const hideCamera = (): void => setIsVisibleCamera(false);

  const showLibrary = (): void => setIsVisibleLibrary(true);

  const hideLibrary = (): void => setIsVisibleLibrary(false);

  const clearMessageImageData = (): void => setMessageImageData(false);

  const onSelectPhoto = (photoData: TCameraPhoto): void => setMessageImageData(photoData);

  useEffect(() => {
    dispatch(appActions.getCurrentScreen(route.name));
    const activeChat: TChat = chats.filter((chat: TChat) => chat.chatId === chatId)[0];
    dispatch(chatsActions.setActiveChat(activeChat));

    return () => {
      dispatch(appActions.getCurrentScreen(''));
      dispatch(chatsActions.setActiveChat(null));
    };
  }, []);

  return (
    <View style={styles.container}>
      <ChatHeader 
        chatType={chatType}
        contactId={contactId}
        contactName={contactName} 
        contactProfile={contactProfile} 
      />
      <Chat 
        chatType={chatType} 
        chatId={chatId} 
        contactId={contactId}
        contactName={contactName} 
        contactProfile={contactProfile} 
        showCamera={showCamera}
        hideCamera={hideCamera}
        showLibrary={showLibrary}  
        hideLibrary={hideLibrary}
        messageImageData={messageImageData}
        clearMessageImageData={clearMessageImageData}
      />
      <CameraWidget 
        isVisible={isVisibleCamera}
        selectPhotoBtnText='Send'
        onSelectPhoto={onSelectPhoto} 
        onHideCamera={hideCamera}
      />
      <PhotosLibraryWidget 
        isVisible={isVisibleLibrary} 
        selectPhotoBtnText='Send'
        onSelectPhoto={onSelectPhoto}
        onHideLibrary={hideLibrary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

export default CurrentChatScreen;