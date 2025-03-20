import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  Platform,
  Dimensions,
  I18nManager,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { CHAT_TEXT } from '../../constants/chatConstants';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow, BUTTON_ANIMATION } from './ChatStyles';
import { BlurView } from 'expo-blur';

// Updated medical teal/blue colors
const MEDICAL_COLORS = {
  primary: '#00A8B5', // Teal primary color
  secondary: '#0078A8', // Deeper blue secondary color
  light: '#E5F8FA', // Very light teal for backgrounds
  highlight: '#00C6D4', // Bright teal for highlights
  text: '#2A4054', // Dark blue-gray for text
  background: '#FFFFFF', // Clean white background
};

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartVoiceInput: () => void;
  isRecording: boolean;
  inputDisabled: boolean;
  isRTL?: boolean;
  placeholder?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStartVoiceInput,
  isRecording = false,
  inputDisabled = false,
  isRTL = true,
  placeholder = "پیام خود را اینجا بنویسید...",
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(CHAT_STYLES.INPUT_HEIGHT);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sendButtonScale = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const recordingPulse = useRef(new Animated.Value(1)).current;
  
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

  // Handle content size change for auto-growing input
  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(
      Math.max(height, CHAT_STYLES.INPUT_HEIGHT),
      CHAT_STYLES.INPUT_MAX_HEIGHT
    );
    setInputHeight(newHeight);
  };
  
  // Handle send button press
  const handleSend = () => {
    if (message.trim() === '') return;
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    onSendMessage(message);
    setMessage('');
    setInputHeight(CHAT_STYLES.INPUT_HEIGHT);
    
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
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused
      ]}>
        {/* Text input */}
        <View style={[
          styles.inputWrapper,
          { height: inputHeight + 4 }
        ]}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input, 
              { height: inputHeight },
              isRTL && styles.rtlInput
            ]}
            placeholder={placeholder}
            placeholderTextColor={COLORS.lightText}
            value={message}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            editable={!inputDisabled}
            multiline
            maxLength={500}
            textAlignVertical="center"
            onContentSizeChange={handleContentSizeChange}
            textAlign={isRTL ? "right" : "left"}
          />
        </View>
        
        {/* Send/Voice button */}
        <View style={styles.buttonsContainer}>
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
                colors={[MEDICAL_COLORS.primary, MEDICAL_COLORS.secondary]}
                style={styles.buttonGradient}
              >
                <FontAwesome5 
                  name={isRTL ? "paper-plane" : "paper-plane"} 
                  size={18} 
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
                      },
                    ]}
                  />
                  <View style={styles.recordingInner} />
                </View>
              ) : (
                <FontAwesome5 
                  name="microphone" 
                  size={20} 
                  color={MEDICAL_COLORS.primary} 
                  solid 
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    paddingTop: 8,
    backgroundColor: MEDICAL_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(210, 230, 250, 0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MEDICAL_COLORS.light,
    borderRadius: CHAT_STYLES.INPUT_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(210, 230, 250, 0.8)',
    ...getShadow('light'),
  },
  inputContainerFocused: {
    borderColor: MEDICAL_COLORS.primary,
    borderWidth: 1.5,
    ...getShadow('medium'),
  },
  inputWrapper: {
    flex: 1,
    minHeight: CHAT_STYLES.INPUT_HEIGHT,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: CHAT_STYLES.INPUT_PADDING_HORIZONTAL,
    fontSize: CHAT_STYLES.INPUT_FONT_SIZE,
    color: MEDICAL_COLORS.text,
    paddingVertical: 6,
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  buttonsContainer: {
    padding: 6,
    position: 'relative',
    width: 50,
    height: 50,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    ...getShadow('light'),
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 168, 181, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 181, 0.2)',
  },
  voiceButtonRecording: {
    backgroundColor: 'rgba(234, 76, 76, 0.1)',
    borderColor: 'rgba(234, 76, 76, 0.3)',
  },
  recordingContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  recordingPulse: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(234, 76, 76, 0.2)',
  },
  recordingInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EA4C4C',
  },
});

export default ChatInput; 