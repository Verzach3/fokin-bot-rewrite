import { AnyMessageContent, AppStateChunk, AuthenticationCreds, BaileysEventEmitter, BaileysEventMap, BinaryNode, CatalogCollection, ChatModification, ConnectionState, Contact, GroupMetadata, MediaConnInfo, MessageReceiptType, MessageRelayOptions, MiscMessageGenerationOptions, OrderDetails, ParticipantAction, Product, ProductCreate, ProductUpdate, proto, SignalKeyStoreWithTransaction, WABusinessProfile, WAMediaUpload, WAMediaUploadFunction, WAPatchCreate, WAPatchName, WAPresence } from "@adiwajshing/baileys";

export default interface Socket {
  getOrderDetails: (
    orderId: string,
    tokenBase64: string
  ) => Promise<OrderDetails>;
  getCatalog: (
    jid?: string | undefined,
    limit?: number | undefined
  ) => Promise<{ products: Product[] }>;
  getCollections: (
    jid?: string | undefined,
    limit?: number | undefined
  ) => Promise<{ collections: CatalogCollection[] }>;
  productCreate: (create: ProductCreate) => Promise<Product>;
  productDelete: (productIds: string[]) => Promise<{ deleted: number }>;
  productUpdate: (productId: string, update: ProductUpdate) => Promise<Product>;
  processMessage: (
    msg: proto.IWebMessageInfo
  ) => Promise<Partial<BaileysEventMap<any>>>;
  sendMessageAck: (
    { tag, attrs }: BinaryNode,
    extraAttrs: { [key: string]: string }
  ) => Promise<void>;
  sendRetryRequest: (node: BinaryNode) => Promise<void>;
  appPatch: (patchCreate: WAPatchCreate) => Promise<void>;
  sendPresenceUpdate: (
    type: WAPresence,
    toJid?: string | undefined
  ) => Promise<void>;
  presenceSubscribe: (toJid: string) => Promise<void>;
  profilePictureUrl: (
    jid: string,
    type?: "image" | "preview" | undefined,
    timeoutMs?: number | undefined
  ) => Promise<string>;
  onWhatsApp: (
    ...jids: string[]
  ) => Promise<{ exists: boolean; jid: string }[]>;
  fetchBlocklist: () => Promise<string[]>;
  fetchStatus: (jid: string) => Promise<{ status: string; setAt: Date }>;
  updateProfilePicture: (jid: string, content: WAMediaUpload) => Promise<void>;
  updateBlockStatus: (
    jid: string,
    action: "block" | "unblock"
  ) => Promise<void>;
  getBusinessProfile: (jid: string) => Promise<void | WABusinessProfile>;
  resyncAppState: (collections: WAPatchName[]) => Promise<AppStateChunk>;
  chatModify: (mod: ChatModification, jid: string) => Promise<void>;
  resyncMainAppState: () => Promise<void>;
  assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
  relayMessage: (
    jid: string,
    message: proto.IMessage,
    {
      messageId: msgId,
      participant,
      additionalAttributes,
      cachedGroupMetadata,
    }: MessageRelayOptions
  ) => Promise<string>;
  sendReceipt: (
    jid: string,
    participant: string,
    messageIds: string[],
    type: MessageReceiptType
  ) => Promise<void>;
  sendReadReceipt: (
    jid: string,
    participant: string,
    messageIds: string[]
  ) => Promise<void>;
  readMessages: (keys: proto.IMessageKey[]) => Promise<void>;
  refreshMediaConn: (forceGet?: boolean | undefined) => Promise<MediaConnInfo>;
  waUploadToServer: WAMediaUploadFunction;
  fetchPrivacySettings: (
    force?: boolean | undefined
  ) => Promise<{ [_: string]: string }>;
  sendMessage: (
    jid: string,
    content: AnyMessageContent,
    options?: MiscMessageGenerationOptions | undefined
  ) => Promise<proto.WebMessageInfo>;
  groupMetadata: (jid: string) => Promise<GroupMetadata>;
  groupCreate: (
    subject: string,
    participants: string[]
  ) => Promise<GroupMetadata>;
  groupLeave: (id: string) => Promise<void>;
  groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
  groupParticipantsUpdate: (
    jid: string,
    participants: string[],
    action: ParticipantAction
  ) => Promise<string[]>;
  groupUpdateDescription: (
    jid: string,
    description?: string | undefined
  ) => Promise<void>;
  groupInviteCode: (jid: string) => Promise<string>;
  groupRevokeInvite: (jid: string) => Promise<string>;
  groupAcceptInvite: (code: string) => Promise<string>;
  groupAcceptInviteV4: (
    jid: string,
    inviteMessage: proto.IGroupInviteMessage
  ) => Promise<string>;
  groupToggleEphemeral: (
    jid: string,
    ephemeralExpiration: number
  ) => Promise<void>;
  groupSettingUpdate: (
    jid: string,
    setting: "announcement" | "locked" | "not_announcement" | "unlocked"
  ) => Promise<void>;
  groupFetchAllParticipating: () => Promise<{ [_: string]: GroupMetadata }>;
  type: "md";
  ws: any;
  ev: BaileysEventEmitter;
  authState: {
    creds: AuthenticationCreds;
    keys: SignalKeyStoreWithTransaction;
  };
  user: Contact;
  emitEventsFromMap: (
    map: Partial<BaileysEventMap<AuthenticationCreds>>
  ) => void;
  assertingPreKeys: (
    range: number,
    execute: (keys: { [_: number]: any }) => Promise<void>
  ) => Promise<void>;
  generateMessageTag: () => string;
  query: (
    node: BinaryNode,
    timeoutMs?: number | undefined
  ) => Promise<BinaryNode>;
  waitForMessage: (
    msgId: string,
    timeoutMs?: number | undefined
  ) => Promise<any>;
  waitForSocketOpen: () => Promise<void>;
  sendRawMessage: (data: Buffer | Uint8Array) => Promise<void>;
  sendNode: (node: BinaryNode) => Promise<void>;
  logout: () => Promise<void>;
  end: (error: Error) => void;
  onUnexpectedError: (error: Error, msg: string) => void;
  uploadPreKeys: (count?: number | undefined) => Promise<void>;
  waitForConnectionUpdate: (
    check: (u: Partial<ConnectionState>) => boolean,
    timeoutMs?: number | undefined
  ) => Promise<void>;
}
