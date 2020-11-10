interface FBPerson {
  id: string;
}

interface FBMessage {
  mid: string;
  text: string;
}

interface FBMessageEvent {
  sender: FBPerson;
  recipient: FBPerson;
  timestamp: number;
  message: FBMessage;
}

interface FBEvent {
  id: string;
  time: number;
  messaging: Array<FBMessageEvent>;
}

export interface FBPage {
  object: string;
  entry: Array<FBEvent>;
}
