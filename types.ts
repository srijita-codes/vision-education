
export enum AppView {
  LANDING = 'landing',
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  SUMMARY = 'summary',
  CHAT = 'chat',
  DIAGRAM = 'diagram'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  view: AppView;
  user: User | null;
  accessibilityMode: boolean;
  voiceVolume: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
