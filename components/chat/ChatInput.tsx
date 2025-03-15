import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { CHAT_TEXT } from '../../constants/chatConstants';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow, BUTTON_ANIMATION, getGlassEffect } from './ChatStyles';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartVoiceInput: () => void;
  isRecording: boolean;
  inputDisabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStartVoiceInput,
  isRecording = false,
  inputDisabled = false,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sendButtonScale = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const recordingPulse = useRef(new Animated.Value(1)).current;
  const inputHeight = useRef(new Animated.Value(CHAT_STYLES.INPUT_HEIGHT)).current;
  
  // Determine which button to show (microphone or send)
  const showSendButton = message.trim().length > 0;
  
  // Animation for button switch
  useEffect(() => {
    Animated.spring(sendButtonScale, {
      toValue: showSendButton ? 1 : 0,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [showSendButton]);
  
  // Handle focus animation
  useEffect(() => {
    Animated.timing(glowOpacity, {
      toValue: isFocused ? 0.85 : 0,
      duration: CHAT_STYLES.ANIMATION_DURATION_NORMAL,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  
  // Pulsating animation for recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.4,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(recordingPulse, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);
  
  // Handle text input changes with auto-growing height
  const handleTextChange = (text: string) => {
    setMessage(text);
  };
  
  // Handle send button press
  const handleSend = () => {
    if (message.trim() === '') return;
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    onSendMessage(message);
    setMessage('');
    
    // Animate the button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: BUTTON_ANIMATION.SCALE_DOWN * 0.92,
        duration: BUTTON_ANIMATION.DURATION_PRESS,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: BUTTON_ANIMATION.DURATION_RELEASE,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Handle voice input button press
  const handleVoiceInput = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Close keyboard if open
    Keyboard.dismiss();
    
    // Call voice input handler
    onStartVoiceInput();
  };
  
  return (
    <View style={styles.container}>
      {/* Animated glow effect for input */}
      <Animated.View
        style={[
          styles.inputGlow,
          {
            opacity: glowOpacity,
            shadowColor: COLORS.primary,
            height: inputHeight,
          },
        ]}
      />
      
      {/* Text input */}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused
      ]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={CHAT_TEXT.TEXT_INPUT_PLACEHOLDER}
          placeholderTextColor={COLORS.lightText}
          value={message}
          onChangeText={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!inputDisabled}
          multiline
          maxLength={500}
          textAlignVertical="center"
        />
      </View>
      
      {/* Send/Voice button */}
      <Animated.View style={styles.buttonsContainer}>
        {/* Send button (animated) */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [
                { scale: sendButtonScale },
                { scale: scaleAnim },
              ],
              opacity: sendButtonScale,
            },
          ]}
          pointerEvents={showSendButton ? 'auto' : 'none'}
        >
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.6}
            disabled={inputDisabled}
          >
            <LinearGradient
              colors={['#3C78F0', '#1D54C4']}
              style={styles.buttonGradient}
            >
              <FontAwesome5 
                name="paper-plane" 
                size={CHAT_STYLES.ACTION_BUTTON_ICON_SIZE - 2} 
                color={COLORS.white} 
                solid 
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Voice button (animated) */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [
                { scale: Animated.subtract(1, sendButtonScale) },
                { scale: scaleAnim },
              ],
              opacity: Animated.subtract(1, sendButtonScale),
            },
          ]}
          pointerEvents={!showSendButton ? 'auto' : 'none'}
        >
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonRecording,
            ]}
            onPress={handleVoiceInput}
            onLongPress={handleVoiceInput}
            activeOpacity={0.6}
            disabled={inputDisabled}
          >
            {isRecording ? (
              <View style={styles.recordingContainer}>
                <Animated.View 
                  style={[
                    styles.recordingPulse,
                    {
                      transform: [{ scale: recordingPulse }],
                      opacity: Animated.subtract(2, recordingPulse),
                    }
                  ]} 
                />
                <FontAwesome5
                  name="stop"
                  size={CHAT_STYLES.ACTION_BUTTON_ICON_SIZE - 2}
                  color={COLORS.white}
                  solid
                />
              </View>
            ) : (
              <LinearGradient
                colors={['rgba(44, 107, 237, 0.12)', 'rgba(44, 107, 237, 0.24)']}
                style={styles.buttonGradient}
              >
                <FontAwesome5
                  name="microphone"
                  size={CHAT_STYLES.ACTION_BUTTON_ICON_SIZE}
                  color={COLORS.primary}
                  solid
                />
              </LinearGradient>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    position: 'relative',
    width: '100%',
  },
  inputGlow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 62,
    backgroundColor: 'transparent',
    borderRadius: CHAT_STYLES.INPUT_BORDER_RADIUS,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    shadowOpacity: 0.3,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: CHAT_STYLES.INPUT_BORDER_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...getShadow('medium'),
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(200, 220, 250, 0.6)',
    height: CHAT_STYLES.INPUT_HEIGHT + 4,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        ...getGlassEffect(0.85),
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: 'rgba(44, 107, 237, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  input: {
    paddingVertical: 12,
    paddingHorizontal: CHAT_STYLES.INPUT_PADDING_HORIZONTAL + 2,
    fontSize: CHAT_STYLES.INPUT_FONT_SIZE,
    maxHeight: CHAT_STYLES.INPUT_MAX_HEIGHT,
    color: '#1A2138',
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '500',
  },
  buttonsContainer: {
    position: 'relative',
    width: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CHAT_STYLES.ACTION_BUTTON_BORDER_RADIUS,
    ...getShadow('strong'),
  },
  sendButton: {
    width: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    borderRadius: CHAT_STYLES.ACTION_BUTTON_BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: 'rgba(20, 70, 180, 0.5)',
  },
  voiceButton: {
    width: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE + 2,
    borderRadius: CHAT_STYLES.ACTION_BUTTON_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.2,
    borderColor: 'rgba(44, 107, 237, 0.2)',
  },
  voiceButtonRecording: {
    backgroundColor: '#F44336',
    borderColor: 'rgba(244, 67, 54, 0.4)',
    ...getShadow('strong'),
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  recordingPulse: {
    position: 'absolute',
    width: CHAT_STYLES.ACTION_BUTTON_SIZE,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE,
    borderRadius: CHAT_STYLES.ACTION_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(255, 80, 80, 0.5)',
  },
});

export default ChatInput; 