import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableWithoutFeedback,
  Animated,
  Easing
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import config from 'react-native-config';
import { useSelector } from 'react-redux';

import { Colors } from 'variables';
import { Images } from 'assets';

type ProfileImageProps = { 
  uploadProgress: number;
  uploadFinished: boolean;
  onToggleImageActions: () => void;
};

const ProfileImage = ({ uploadProgress, uploadFinished, onToggleImageActions }: ProfileImageProps) => {
  const { user: { avatar } } = useSelector(state => state.auth);
  const opacityAnim = useRef(new Animated.Value(0));
  const pulsateAnim = useRef(new Animated.Value(0));
  const indicatorRef = useRef<AnimatedProgressWheel>(null);
  const [image, setImage] = useState('');
  const S3_BUCKET_PATH = `${config.RN_S3_DATA_URL}/public/uploads/profile/medium`;
  const pulsateLoopRef = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          pulsateAnim.current, {
            toValue: 0.25,
            duration: 500,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          pulsateAnim.current, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true
          }
        )
      ])
    )
  ).current;

  const onImageLoad = (): void => {
    Animated.timing(
      opacityAnim.current, {
        duration: 600,
        toValue: 1,
        useNativeDriver: true
      },
    ).start();
  };

  useEffect(() => {
    if (uploadFinished) {
      indicatorRef.current.animateTo(100, 2000, Easing.quad);

      setTimeout(function() {
        indicatorRef.current.animateTo(0);
        pulsateLoopRef.stop();
        pulsateLoopRef.reset();
        pulsateAnim.current.setValue(0);
      }, 4000);
    }
      
    if (uploadProgress > 0) {
      indicatorRef.current.animateTo(uploadProgress, 6000, Easing.quad);
      pulsateLoopRef.start();
    } 

    return () => {
      pulsateLoopRef.stop();
      pulsateLoopRef.reset();
    };
  }, [uploadProgress, uploadFinished]);

  useEffect(() => {
    if (uploadFinished) {
      setTimeout(() => {
        setImage(avatar);
      }, 4000);
    } else {
      setImage(avatar);
    }
  }, [avatar]);
 
  return (
    <TouchableWithoutFeedback onPress={() => onToggleImageActions ()}>
      <View style={styles.container}>
        <View style={styles.progressCircle}>
          <AnimatedProgressWheel 
            ref={indicatorRef}
            size={215} 
            width={7.5} 
            color={Colors.purpleLight}
            fullColor={Colors.purpleDark}
            backgroundColor={Colors.white}
          />
        </View>
        <Animated.View
          style={[
            styles.progressPulse,
            { opacity: pulsateAnim.current }
          ]}
        />
        <View style={styles.imageContainer}>
          {avatar ?
            <Animated.Image 
              key={image}
              source={{ uri: `${S3_BUCKET_PATH}/${image}` }}
              style={[
                styles.image,
                { opacity: opacityAnim.current }
              ]} 
              onLoad={() => onImageLoad()}
            /> : 
            <Animated.Image
              source={ Images.avatarBig } 
              style={[
                styles.image,
                { opacity: opacityAnim.current }
              ]}  
              onLoad={() => onImageLoad()}  
            />
          }
        </View>   
        <View style={styles.cameraIconContainer}>
          <MaterialIcon name="camera-alt" size={36} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
    marginBottom: 30,
  },
  progressCircle: {
    position: 'absolute',
    top: -7.5,
    margin: 'auto',
    transform: [
      { rotate: '60deg' }
    ]
  },
  progressPulse: {
    position: 'absolute',
    top: 0,
    margin: 'auto',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.white,
    zIndex: 2
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: Colors.white
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraIconContainer: {
    backgroundColor: Colors.greyLight,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.white,
    position: 'absolute',
    top: '72%',
    transform: [
      { translateX: 70 }
    ]
  },
});

export default ProfileImage;