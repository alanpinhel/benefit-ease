"use client";

import { api } from "@/lib/api";
import { cookies } from "@/lib/cookies";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { createContext, useContext, useReducer } from "react";

type Credentials = { email: string; password: string };
type Action = {
  type:
    | "start sign up"
    | "finished sign up"
    | "fail sign up"
    | "start sign in"
    | "finished sign in"
    | "fail sign in"
    | "sign out";
};
type Dispatch = (action: Action) => void;
type State = {
  isAuth: boolean;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isSignedUp: boolean;
};
type AuthProviderProps = { children: React.ReactNode };
type AuthContextValue = [state: State, dispatch: Dispatch];
type SignInResponse = { access_token: string };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function authReducer(state: State, action: Action): State {
  switch (action.type) {
    case "start sign up": {
      return { ...state, isSigningUp: true };
    }
    case "finished sign up": {
      return { ...state, isSigningUp: false, isSignedUp: true };
    }
    case "fail sign up": {
      return { ...state, isSigningUp: false };
    }
    case "start sign in": {
      return { ...state, isSigningIn: true };
    }
    case "finished sign in": {
      return { ...state, isAuth: true, isSigningIn: false };
    }
    case "fail sign in": {
      return { ...state, isSigningIn: false };
    }
    case "sign out": {
      return { ...state, isAuth: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

async function signUp(authDispatch: Dispatch, credentials: Credentials) {
  try {
    authDispatch({ type: "start sign up" });
    await api.post("/auth/v1/signup", credentials);
    authDispatch({ type: "finished sign up" });
  } catch (error) {
    authDispatch({ type: "fail sign up" });
    notifications.show({
      color: "orange",
      message: "Ocorreu um erro ao criar a conta.",
      title: "Erro no servidor 😢",
    });
  }
}

async function signIn(authDispatch: Dispatch, credentials: Credentials) {
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
    authDispatch({ type: "finished sign in" });
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

function signOut(authDispatch: Dispatch) {
  cookies.remove("access_token");
  authDispatch({ type: "sign out" });
}

function AuthProvider({ children }: AuthProviderProps) {
  const value = useReducer(authReducer, {
    isAuth: !!cookies.get("access_token"),
    isSigningIn: false,
    isSigningUp: false,
    isSignedUp: false,
  });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export { AuthProvider, signIn, signOut, signUp, useAuth };
