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
import { CHAT_TEXT, CHAT_UI } from '../../constants/chatConstants';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

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
      toValue: isFocused ? 0.5 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  
  // Pulsating animation for recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.2,
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
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
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
          onChangeText={setMessage}
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
              colors={['#1E88E5', '#2962FF']}
              style={styles.buttonGradient}
            >
              <FontAwesome5 name="paper-plane" size={18} color={COLORS.white} solid />
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
                  size={18}
                  color={COLORS.white}
                  solid
                />
              </View>
            ) : (
              <LinearGradient
                colors={['rgba(44, 107, 237, 0.1)', 'rgba(44, 107, 237, 0.2)']}
                style={styles.buttonGradient}
              >
                <FontAwesome5
                  name="microphone"
                  size={18}
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
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderRadius: 16,
    marginHorizontal: 8,
    marginBottom: 4,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 4,
  },
  inputGlow: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 62,
    bottom: 14,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    elevation: 2,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginRight: 8,
  },
  input: {
    minHeight: CHAT_UI.INPUT_HEIGHT - 20,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    fontSize: 16,
    color: COLORS.text,
    textAlign: Platform.OS === 'ios' ? 'right' : 'right',
    writingDirection: 'rtl',
  },
  buttonsContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  voiceButtonRecording: {
    backgroundColor: COLORS.primary,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: COLORS.primary,
  },
  recordingPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: COLORS.primary,
  },
});

export default ChatInput; 