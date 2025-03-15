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
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [showSendButton]);
  
  // Handle focus animation
  useEffect(() => {
    Animated.timing(glowOpacity, {
      toValue: isFocused ? 0.7 : 0,
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
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 800,
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    onSendMessage(message);
    setMessage('');
    
    // Animate the button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: BUTTON_ANIMATION.SCALE_DOWN,
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
      <View style={styles.inputWrapper}>
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
            activeOpacity={0.7}
            disabled={inputDisabled}
          >
            <LinearGradient
              colors={['#2C6BED', '#1E56CC']}
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
            activeOpacity={0.7}
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
                colors={['rgba(44, 107, 237, 0.08)', 'rgba(44, 107, 237, 0.16)']}
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    position: 'relative',
    width: '100%',
  },
  inputGlow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 60,
    backgroundColor: 'transparent',
    borderRadius: CHAT_STYLES.INPUT_BORDER_RADIUS,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.2,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: CHAT_STYLES.INPUT_BORDER_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...getShadow('light'),
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: Platform.OS === 'ios' ? 0 : 0.5,
    borderColor: 'rgba(230, 240, 250, 0.8)',
    height: CHAT_STYLES.INPUT_HEIGHT,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        ...getGlassEffect(0.8),
      },
    }),
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: CHAT_STYLES.INPUT_PADDING_HORIZONTAL,
    fontSize: CHAT_STYLES.INPUT_FONT_SIZE,
    maxHeight: CHAT_STYLES.INPUT_MAX_HEIGHT,
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  buttonsContainer: {
    position: 'relative',
    width: CHAT_STYLES.ACTION_BUTTON_SIZE,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: CHAT_STYLES.ACTION_BUTTON_SIZE,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CHAT_STYLES.ACTION_BUTTON_BORDER_RADIUS,
    ...getShadow('medium'),
  },
  sendButton: {
    width: CHAT_STYLES.ACTION_BUTTON_SIZE,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE,
    borderRadius: CHAT_STYLES.ACTION_BUTTON_BORDER_RADIUS,
    overflow: 'hidden',
  },
  voiceButton: {
    width: CHAT_STYLES.ACTION_BUTTON_SIZE,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE,
    borderRadius: CHAT_STYLES.ACTION_BUTTON_BORDER_RADIUS,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 237, 0.1)',
  },
  voiceButtonRecording: {
    backgroundColor: '#F44336',
    borderColor: 'rgba(244, 67, 54, 0.2)',
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
    width: CHAT_STYLES.ACTION_BUTTON_SIZE - 8,
    height: CHAT_STYLES.ACTION_BUTTON_SIZE - 8,
    borderRadius: (CHAT_STYLES.ACTION_BUTTON_SIZE - 8) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});

export default ChatInput; 