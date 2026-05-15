export type FwdGifPayload = {
  id: string;
  title: string;
  mediaUrl: string;
  previewUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  duration: number;
  format: string;
  altText: string;
  tags: string[];
};

export type FwdSelectedEvent = {
  type: 'FWD_GIF_SELECTED';
  provider: 'fwd';
  gif: FwdGifPayload;
  usage?: { source?: string; context?: string; userUid?: string; mode?: string };
};

export type FwdClosedEvent = { type: 'FWD_PICKER_CLOSED' };
export type FwdErrorEvent = { type: 'FWD_PICKER_ERROR'; message: string };
export type FwdPickerEvent = FwdSelectedEvent | FwdClosedEvent | FwdErrorEvent;
