"use client";

import { api } from "@/lib/api";
import { cookies } from "@/lib/cookies";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { createContext, useContext, useReducer } from "react";

type User = { email: string; display_name: string };

type Action = {
  user?: User;
  type:
    | "start sign in"
    | "finished sign in"
    | "fail sign in"
    | "sign out"
    | "update user";
};

export type AuthDispatch = (action: Action) => void;

type State = {
  isAuth: boolean;
  isSigningIn: boolean;
  user?: User;
};

type AuthContextValue = [state: State, dispatch: AuthDispatch];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case "start sign in": {
      return { ...state, isSigningIn: true };
    }
    case "finished sign in": {
      return { ...state, isAuth: true, isSigningIn: false, user: action.user };
    }
    case "fail sign in": {
      return { ...state, isSigningIn: false };
    }
    case "sign out": {
      return { ...state, isAuth: false };
    }
    case "update user": {
      return { ...state, user: action.user };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export type SignInResponse = {
  access_token: string;
  user: {
    email: string;
    user_metadata: {
      display_name: string;
    };
  };
};

type Credentials = { email: string; password: string };

export async function signIn(
  authDispatch: AuthDispatch,
  credentials: Credentials
) {
  try {
    authDispatch({ type: "start sign in" });
    const { data } = await api.post<SignInResponse>(
      "/auth/v1/token?grant_type=password",
      credentials
    );
    notifications.show({
      color: "green",
      message: "Agora você já pode utilizar a plataforma.",
      title: "Boas-vindas de volta 🎉",
    });
    cookies.set("access_token", data.access_token);
    const user = {
      email: data.user.email,
      display_name: data.user.user_metadata.display_name,
    };
    cookies.set("user", user);
    api.defaults.headers.Authorization = `Bearer ${data.access_token}`;
    authDispatch({ type: "finished sign in", user });
  } catch (error) {
    authDispatch({ type: "fail sign in" });
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    switch (error.response?.status) {
      case 400:
        notifications.show({
          color: "red",
          message: "Credenciais inválidas.",
          title: "Erro de autenticação 😢",
        });
        break;
      default:
        notifications.show({
          color: "orange",
          message: "Ocorreu um erro ao criar a conta.",
          title: "Erro no servidor 😢",
        });
    }
  }
}

export function signOut(authDispatch: AuthDispatch) {
  cookies.remove("access_token");
  cookies.remove("user");
  authDispatch({ type: "sign out" });
}

type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useReducer(authReducer, {
    isAuth: !!cookies.get("access_token"),
    isSigningIn: false,
    user: cookies.get("user"),
  });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
