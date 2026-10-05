import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  unreadMessages: {},

  messageSubscription: null,
  presenceSubscription: null,
  readSubscription: null,

  onlineUsers: [],

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/users");

      const currentUser = useAuthStore.getState().authUser;

      const otherUsers = res.data.filter((user) => user.id !== currentUser?.id);

      set({
        users: otherUsers,
      });

      await get().getOnlineUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      set((state) => ({
        messages: res.data,
        unreadMessages: {
          ...state.unreadMessages,
          [userId]: 0,
        },
      }));

      axiosInstance.put(`/messages/${userId}/read`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getUnreadMessages: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread");

      set({
        unreadMessages: res.data,
      });
    } catch (error) {
      console.error("Failed to fetch unread messages:", error);
    }
  },

  getOnlineUsers: async () => {
    try {
      const res = await axiosInstance.get("/users/online");

      const currentUser = useAuthStore.getState().authUser;

      const onlineUserIds = get()
        .users.filter(
          (user) =>
            user.id !== currentUser?.id && res.data.includes(user.email),
        )
        .map((user) => user.id);

      set({
        onlineUsers: onlineUserIds,
      });
    } catch (error) {
      console.error("Failed to fetch online users:", error);
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    try {
      let res;

      if (messageData.image) {
        const formData = new FormData();

        formData.append("file", messageData.image);
        formData.append("receiverId", selectedUser.id);

        if (messageData.text) {
          formData.append("text", messageData.text);
        }

        res = await axiosInstance.post("/messages/image", formData);
      } else {
        res = await axiosInstance.post("/messages", {
          receiverId: selectedUser.id,
          text: messageData.text,
        });
      }

      set((state) => ({
        messages: [...state.messages, res.data],

        users: state.users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                lastMessageAt: res.data.createdAt,
              }
            : user,
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { authUser, socket } = useAuthStore.getState();

    if (!authUser || !socket || !socket.connected) {
      console.log("Cannot subscribe: WebSocket not connected");
      return;
    }

    const oldSubscription = get().messageSubscription;

    if (oldSubscription) {
      try {
        oldSubscription.unsubscribe();
      } catch (error) {
        console.log("Old subscription already closed");
      }

      set({
        messageSubscription: null,
      });
    }

    const subscription = socket.subscribe(
      `/topic/messages/${authUser.id}`,
      (frame) => {
        console.log("New WebSocket message:", frame.body);

        const newMessage = JSON.parse(frame.body);

        const senderId = newMessage.senderId;

        const currentSelectedUser = get().selectedUser;

        set((state) => ({
          users: state.users.map((user) =>
            user.id === senderId
              ? {
                  ...user,
                  lastMessageAt: newMessage.createdAt,
                }
              : user,
          ),
        }));

        if (currentSelectedUser?.id === senderId) {
          set((state) => ({
            messages: [...state.messages, newMessage],
          }));

          axiosInstance.put(`/messages/${senderId}/read`);

          return;
        }
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [senderId]: (state.unreadMessages[senderId] || 0) + 1,
          },
        }));

        console.log("Unread messages:", get().unreadMessages);
      },
    );

    set({
      messageSubscription: subscription,
    });

    console.log("Subscribed to:", `/topic/messages/${authUser.id}`);
  },

  subscribeToReadReceipts: () => {
    const { authUser, socket } = useAuthStore.getState();

    if (!authUser || !socket || !socket.connected) {
      console.log("Cannot subscribe to read receipts: WebSocket not connected");
      return;
    }

    const oldSubscription = get().readSubscription;

    if (oldSubscription) {
      try {
        oldSubscription.unsubscribe();
      } catch (error) {
        console.log("Old read subscription already closed");
      }

      set({
        readSubscription: null,
      });
    }

    const subscription = socket.subscribe(
      `/topic/messages/read/${authUser.id}`,
      (frame) => {
        console.log("Read receipt:", frame.body);

        const readUpdate = JSON.parse(frame.body);
        const readerId = readUpdate.userId;

        set((state) => ({
          messages: state.messages.map((message) => {
            if (
              message.senderId === authUser.id &&
              message.receiverId === readerId
            ) {
              return {
                ...message,
                read: true,
              };
            }

            return message;
          }),
        }));
      },
    );

    set({
      readSubscription: subscription,
    });

    console.log("Subscribed to:", `/topic/messages/read/${authUser.id}`);
  },

  subscribeToPresence: () => {
    const { authUser, socket } = useAuthStore.getState();

    if (!authUser || !socket || !socket.connected) {
      console.log("Cannot subscribe to presence: WebSocket not connected");
      return;
    }

    const oldSubscription = get().presenceSubscription;

    if (oldSubscription) {
      try {
        oldSubscription.unsubscribe();
      } catch (error) {
        console.log("Old presence subscription already closed");
      }

      set({
        presenceSubscription: null,
      });
    }

    const subscription = socket.subscribe("/topic/presence", (frame) => {
      console.log("Presence update:", frame.body);

      const presenceUpdate = JSON.parse(frame.body);

      const user = get().users.find(
        (user) => user.email === presenceUpdate.email,
      );

      if (!user) {
        return;
      }

      set((state) => {
        const userId = user.id;

        const isCurrentlyOnline = state.onlineUsers.includes(userId);

        if (presenceUpdate.online && !isCurrentlyOnline) {
          return {
            onlineUsers: [...state.onlineUsers, userId],
          };
        }

        if (!presenceUpdate.online && isCurrentlyOnline) {
          return {
            onlineUsers: state.onlineUsers.filter((id) => id !== userId),
          };
        }

        return state;
      });
    });

    set({
      presenceSubscription: subscription,
    });

    console.log("Subscribed to: /topic/presence");
  },

  unsubscribeFromMessages: () => {
    const subscription = get().messageSubscription;

    if (subscription) {
      subscription.unsubscribe();

      set({
        messageSubscription: null,
      });

      console.log("Unsubscribed from messages");
    }
  },

  unsubscribeFromPresence: () => {
    const subscription = get().presenceSubscription;

    if (subscription) {
      subscription.unsubscribe();

      set({
        presenceSubscription: null,
      });

      console.log("Unsubscribed from presence");
    }
  },

  unsubscribeFromReadReceipts: () => {
    const subscription = get().readSubscription;

    if (subscription) {
      subscription.unsubscribe();

      set({
        readSubscription: null,
      });

      console.log("Unsubscribed from read receipts");
    }
  },

  setSelectedUser: (selectedUser) => {
    set((state) => {
      const unreadMessages = {
        ...state.unreadMessages,
      };

      if (selectedUser) {
        delete unreadMessages[selectedUser.id];
      }

      return {
        selectedUser,
        unreadMessages,
      };
    });
  },
}));
