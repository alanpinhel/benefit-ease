"use client";

import { api } from "@/lib/api";
import { cookies } from "@/lib/cookies";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { createContext, useContext, useReducer } from "react";

type Credentials = { email: string; password: string };
type User = { email: string; display_name: string };
type Action = {
  type:
    | "start sign in"
    | "finished sign in"
    | "fail sign in"
    | "sign out"
    | "start update user"
    | "finished update user"
    | "fail update user";
  user?: User;
};
type Dispatch = (action: Action) => void;
type State = {
  isAuth: boolean;
  isSigningIn: boolean;
  isUpdatingUser: boolean;
  user?: User;
};
type AuthProviderProps = { children: React.ReactNode };
type AuthContextValue = [state: State, dispatch: Dispatch];
export type SignInResponse = {
  access_token: string;
  user: {
    email: string;
    user_metadata: {
      display_name: string;
    };
  };
};

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
    case "start update user": {
      return { ...state, isUpdatingUser: true };
    }
    case "finished update user": {
      return { ...state, isUpdatingUser: false, user: action.user };
    }
    case "fail update user": {
      return { ...state, isUpdatingUser: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export async function signIn(authDispatch: Dispatch, credentials: Credentials) {
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

export function signOut(authDispatch: Dispatch) {
  cookies.remove("access_token");
  cookies.remove("user");
  authDispatch({ type: "sign out" });
}

export async function updateUser(
  authDispatch: Dispatch,
  { password, ...user }: Partial<Credentials> & User
) {
  try {
    authDispatch({ type: "start update user" });
    await api.put("/auth/v1/user", {
      email: user.email,
      password: password || undefined,
      data: {
        display_name: user.display_name,
      },
    });
    notifications.show({
      color: "green",
      message: "Usuário atualizado com sucesso.",
      title: "Sucesso 🎉",
    });
    cookies.set("user", user);
    authDispatch({ type: "finished update user", user });
  } catch (error) {
    authDispatch({ type: "fail update user" });
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    notifications.show({
      color: "orange",
      message: "Ocorreu um erro ao atualizar o usuário.",
      title: "Erro no servidor 😢",
    });
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value = useReducer(authReducer, {
    isAuth: !!cookies.get("access_token"),
    isSigningIn: false,
    isUpdatingUser: false,
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
