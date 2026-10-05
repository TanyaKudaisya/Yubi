import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Client } from "@stomp/stompjs";

export const useAuthStore = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  socket: null,
  isSocketConnected: false,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({ authUser: null });
        return;
      }

      const res = await axiosInstance.get("/users/me");

      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      localStorage.removeItem("token");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const payload = {
        name: data.fullName ?? data.name,
        email: data.email,
        password: data.password,
      };

      const res = await axiosInstance.post("/users", payload);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });

      get().connectSocket();

      toast.success("Account created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Signup failed"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/users/login", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });

      get().connectSocket();

      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Login failed"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: () => {
    get().disconnectSocket();

    localStorage.removeItem("token");

    set({ authUser: null });

    toast.success("Logged out successfully");
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      let res;

      if (data.profilePic instanceof File) {
        const formData = new FormData();
        formData.append("file", data.profilePic);

        res = await axiosInstance.post(
          "/users/profile-picture",
          formData
        );
      } else {
        res = await axiosInstance.put("/users/profile", data);
      }

      set({ authUser: res.data });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Profile update failed"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();

    if (!authUser) {
      console.log("Cannot connect WebSocket: no authenticated user");
      return;
    }

    // Prevent duplicate WebSocket clients
    if (socket && socket.active) {
      console.log("WebSocket already active");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Cannot connect WebSocket: no JWT token");
      return;
    }

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected to WebSocket");

        set({
          isSocketConnected: true,
        });
      },

      onWebSocketClose: () => {
        console.log("WebSocket disconnected");

        set({
          isSocketConnected: false,
        });

        // Old STOMP subscription is no longer valid
        import("./useChatStore").then(({ useChatStore }) => {
          useChatStore.setState({
            messageSubscription: null,
          });
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);

        set({
          isSocketConnected: false,
        });
      },

      onWebSocketError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    // Store the client BEFORE activating it
    set({
      socket: client,
    });

    client.activate();
  },

  disconnectSocket: () => {
    const client = get().socket;

    if (client) {
      client.deactivate();

      set({
        socket: null,
        isSocketConnected: false,
      });
    }
  },
}));