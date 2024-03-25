import express from "express";
import cors from "cors";
import { boolean, string, z } from "zod";
import { save, load } from "./util/db";
import {
  UserSchema,
  RoleSchema,
  CharacterSchema,
  CardSchema,
  PlayerSchema,
  LogSchema,
  GameSchema,
} from "./model";
import { error } from "console";
import { send } from "process";
import { hash } from "./util/hash";
import { compare } from "bcrypt";

const server = express();

server.use(cors());

server.use(express.json());

const SignupRequestSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(3),
});

const LoginSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(3),
});

//name -> id
server.post("/api/signup", async (req, res) => {
  const result = SignupRequestSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(500);

  const { name, password } = result.data;

  const users = await load("users", UserSchema.array());
  if (!users) return res.sendStatus(500);

  const userExists = users.some((user) => user.name === name);
  if (userExists) return res.sendStatus(409);

  const id = Math.random();
  const hashedPassword = await hash(password);
  users.push({ id, name, password: hashedPassword });

  const isCreated = await save("users", users, UserSchema.array());
  if (!isCreated) return res.sendStatus(500);

  return res.json({ id });
});

//name -> id
server.post("/api/login", async (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(500);

  const { name, password } = result.data;

  const users = await load("users", UserSchema.array());
  if (!users) return res.sendStatus(500);

  const user = users.find((user) => user.name === name);
  if (!user) return res.sendStatus(401);

  const isCorrect = await compare(password, user.password);
  if (!isCorrect) res.sendStatus(500);

  return res.json({ success: true });
});

//groupSize, id -> 200/400/500
server.post("/api/game", async (req, res) => {
  res.json();
});

//id (user), id(game) -> 200/400/500
server.post("/api/join", async (req, res) => {
  //added to requests
  res.json();
});

//id (game) -> game(part of game)
server.get("/api/state/:id", async (req, res) => {
  res.json();
});

//id (user) id (game) -> 200/400/500
server.post("/api/authorize", async (req, res) => {
  //from requests to player
  res.json();
});

//id (game) -> 200/400/500
server.post("/api/start", async (req, res) => {
  //last join -> role, character, isActive calculations, shuffled (unused) cards
  /* const roles = [
  "Sheriff",
  "Renegade",
  "Bandit",
  "Bandit",
  "Deputy",
  "Bandit",
  "Deputy",
]; */

  res.json();
});

// +1 / -1 -> 200/400/500
server.post("/api/game/:gameid/:playerid/life", async (req, res) => {
  // + Log
  res.json();
});

//from array, index, to array -> 200/400/500
server.post("/api/game/:gameid/:playerid/move", async (req, res) => {
  // + Log
  res.json();
});

server.post("/api/game/:gameid/reveal", async (req, res) => {
  res.json();
});

server.delete("/api/game/:gameid/finish", async (req, res) => {
  res.json();
});

server.listen(3001);
