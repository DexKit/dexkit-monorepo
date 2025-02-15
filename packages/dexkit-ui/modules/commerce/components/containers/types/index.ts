export interface CommerceContainerState {
  params: { [key: string]: string };
  containerId: string;
  setContainer: (
    containerId: string,
    params?: { [key: string]: string },
    options?: { activeMenu?: boolean }
  ) => void;
  set: (key: string, value: string) => void;
  get: (key: string) => string;
  goBack: () => void;
}

export type ShareType =
  | "telegram"
  | "whatsapp"
  | "pinterest"
  | "email"
  | "link"
  | "facebook"
  | "x";
