import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';



import CustomText from 'components/CustomText';
import { Colors, Fonts, Headings } from 'variables';
import { callActions } from 'reduxStore/actions';
import { emitRejectCall, emitAcceptCall, emitSendICECandidate } from 'socket/eventEmitters';


type IncomingCallNotificationProps = {};

const IncomingCallNotification = ({ }: IncomingCallNotificationProps) => {
  const { socketState } = useSelector(state => state.app);
  const { user: { _id: userId, username, avatar } } = useSelector(state => state.auth);
  const { 
    RTCConnection,
    incomingCall: { chatType, chatId, callerId, callerName, callerProfile, offer },
    activeCall: { remoteStream  }
  } = useSelector(state => state.call);
  const dispatch = useDispatch();

  if (!callerId) return <></>;

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <CustomText 
          color={Colors.white} 
          fontSize={Headings.headingMedium} 
          fontWeight={Fonts.semiBold}
          style={{ marginBottom: 6 }}
        >
          {callerName} is calling...
        </CustomText>
        <CustomText color={Colors.white} fontSize={Headings.headingExtraSmall}>
          Hey Chat Video Call
        </CustomText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onRejectCall}>
          <View style={styles.rejectButton}>
            <MaterialIcon color={Colors.purpleDark} name="close" size={28} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onAcceptCall}>
          <View style={styles.acceptButton}>
          <MaterialIcon color={Colors.white} name="check" size={26} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.purpleDark,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 25
  },
  actions: {
    flexDirection: 'row'
  },
  details: {

  },
  rejectButton: {
    backgroundColor: Colors.white,
    borderRadius: 40,
    width: 35,
    height: 35,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1
  },
  acceptButton: {
    backgroundColor: Colors.yellowDark,
    borderRadius: 40,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1
  },
  videoContainer: {
    flex: 1
  }
});

export default IncomingCallNotification;
