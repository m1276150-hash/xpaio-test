// *** Configurable variables for the app ***
// This file contains all the user-editable configuration values that can be updated when customizing the chatbot app.

export const APP_CONFIG = {
  // UPDATE: Set to the welcome message for the chatbot
  WELCOME_MESSAGE:
    "어서오세요 ",

  // UPDATE: Set to the name of the chatbot app
  NAME: "Xpaio",

  // UPDATE: Set to the description of the chatbot app
  DESCRIPTION: "테스트 넷 에서 사용 가능한 토큰 발행 후 sdk연동까지 해볼까 ",
} as const;

// Colors Configuration - UPDATE THESE VALUES BASED ON USER DESIGN PREFERENCES
export const COLORS = {
  // UPDATE: Set to the background color (hex format)
  BACKGROUND: "#00ff00",

  // UPDATE: Set to the primary color for buttons, links, etc. (hex format)
  PRIMARY: "#4B73FF",
} as const;
