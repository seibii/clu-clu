import { Stream } from 'xstream';

export type CrispChatRequest = CrispChatRequestSetUser | CrispChatRequestResetUser | CrispChatRequestOpenChat;

export interface CrispChatRequestSetUser {
  type: 'set_user';
  user: UserProfile;
}

export interface CrispChatRequestResetUser {
  type: 'reset_user';
}

export interface CrispChatRequestOpenChat {
  type: 'open_chat';
}

interface UserProfile {
  uid: string
  email: string
  name: string
  phoneNumber: string
  profileImageUrl: string
}

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_RUNTIME_CONFIG: { session_merge: boolean };
    CRISP_WEBSITE_ID: string;
    CRISP_TOKEN_ID: string | undefined;
  }
}

interface CrispProps {
  websiteId: string;
  sessionMerge: boolean;
}

export const makeCrispChatDriver = (
  props: CrispProps
): ((stream: Stream<CrispChatRequest>) => void) => {
  initialize(props);

  return (stream) => {
    stream.addListener({
      next: (request: CrispChatRequest) => {
        switch (request.type) {
          case 'set_user':
            setUser(request.user);
            break;
          case 'reset_user':
            resetUser();
            break;
          case 'open_chat':
            openChat();
            break;
        }
      }
    });
  };
};

const initialize = (props: CrispProps) => {
  /* eslint-disable */
  window.$crisp = [];
  window.CRISP_RUNTIME_CONFIG = { session_merge: props.sessionMerge };
  window.CRISP_WEBSITE_ID = props.websiteId;
  (function () {
    var d = document;
    var s = d.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = true;
    d.getElementsByTagName('head')[0].appendChild(s);
  })();
  /* eslint-enable */
};

const setUser = (user: UserProfile) => {
  /* eslint-disable */
  window.CRISP_TOKEN_ID = user.uid;
  const crisp = window.$crisp;
  crisp.push(['do', 'session:reset']);
  crisp.push(['set', 'user:email', [user.email]]);
  crisp.push(['set', 'user:phone', [user.phoneNumber]]);
  crisp.push(['set', 'user:nickname', [user.name]]);
  crisp.push(['set', 'user:avatar', [user.profileImageUrl]]);
  /* eslint-enable */
};

const resetUser = () => {
  window.CRISP_TOKEN_ID = undefined;
  window.$crisp.push(['do', 'session:reset']);
};

const openChat = () => {
  window.$crisp.push(['do', 'chat:open']);
};
