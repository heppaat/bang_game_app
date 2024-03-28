import { safeFetch } from "../lib/http";
import { z } from "zod";

export const signup = (name: string, password: string) =>
  safeFetch({
    method: "POST",
    path: "/api/signup",
    schema: z.object({ id: z.number() }),
    payload: { name, password },
  });

export const login = (name: string, password: string) =>
  safeFetch({
    method: "POST",
    path: "/api/login",
    schema: z.object({ token: z.string() }),
    payload: { name, password },
  });

export const createGame = () =>
  safeFetch({
    method: "POST",
    path: "/api/game",
    schema: z.object({ id: z.number() }),
    payload: {},
  });
