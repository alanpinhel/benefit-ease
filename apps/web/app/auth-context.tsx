"use client";

import { api } from "@/lib/api";
import { cookies } from "@/lib/cookies";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { createContext, useContext, useReducer } from "react";

type Credentials = { email: string; password: string };
type Action = { type: "start sign in" | "finished sign in" | "fail sign in" };
type Dispatch = (action: Action) => void;
type State = { isAuth: boolean; isSigningIn: boolean };
type AuthProviderProps = { children: React.ReactNode };
type AuthContextValue = [state: State, dispatch: Dispatch];
type SignInResponse = { access_token: string };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function authReducer(state: State, action: Action) {
  switch (action.type) {
    case "start sign in": {
      return { ...state, isSigningIn: true };
    }
    case "finished sign in": {
      return { ...state, isAuth: true, isSigningIn: false };
    }
    case "fail sign in": {
      return { ...state, isSigningIn: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
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

function AuthProvider({ children }: AuthProviderProps) {
  const value = useReducer(authReducer, {
    isAuth: !!cookies.get("access_token"),
    isSigningIn: false,
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

export { AuthProvider, signIn, useAuth };
