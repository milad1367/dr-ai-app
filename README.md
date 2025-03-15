# Dr AI Mobile App

A modern, visually stunning mobile application for AI-powered medical consultations. The app provides a premium user experience with smooth animations, elegant Persian typography, and a futuristic medical-grade design.

## Features

- 🔥 Ultra-premium UI design with futuristic medical theme
- 🧠 AI-powered medical consultations (MVP: chat interface)
- 🌐 RTL support for Persian language
- ✨ Smooth animations and transitions
- 💯 Cross-platform (iOS and Android) compatibility

## Screenshots

(Coming soon)

## Technologies Used

- **React Native / Expo**: For cross-platform mobile development
- **Expo Router**: For declarative navigation
- **Linear Gradient**: For premium gradient effects
- **Animated API**: For smooth animations and transitions
- **Expo Blur**: For modern, frosted-glass UI effects
- **Expo Haptics**: For tactile feedback

## Project Structure

```
dr-ai-app/
├── app/                  # Main screens and navigation
│   ├── _layout.tsx       # Root layout and navigation config
│   ├── index.tsx         # Home screen
│   ├── chat.tsx          # Chat/Consultation screen
│   └── profile.tsx       # User profile screen
├── components/           # Reusable UI components
│   └── ui/
│       ├── BackgroundAnimation.tsx
│       ├── BottomTabBar.tsx
│       └── GradientButton.tsx
├── services/             # API and data services
│   └── api.js            # Mock API service
├── utils/                # Utility functions
│   └── animation.ts      # Animation utilities
├── constants.js          # App-wide constants
└── assets/               # Static assets (images, fonts)
```

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dr-ai-app.git
cd dr-ai-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Follow the instructions in the terminal to open the app on your device or simulator.

## Design Principles

- **Premium Feel**: Every UI element is designed to feel premium and high-end
- **Medical Accuracy**: Design elements reflect medical professionalism
- **Smooth Interactions**: All animations and transitions are smooth and natural
- **RTL Support**: Full support for Persian language and right-to-left layout
- **Accessibility**: Designed with accessibility in mind

## Future Enhancements

- Full AI consultation system
- Medical record integration
- Appointment scheduling
- Medication reminders
- Doctor video consultations

## License

This project is licensed under the MIT License.

## Acknowledgments

- Medical icons provided by FontAwesome
- Design inspiration from modern healthcare apps
