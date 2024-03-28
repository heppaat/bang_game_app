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
import jwt from "jsonwebtoken";

const server = express();
const serverPassword = "asdfljlawflkmkcmw";

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

const HeaderSchema = z.object({
  auth: z.string(),
});

const safeVerify = <Schema extends z.ZodTypeAny>(
  token: string,
  schema: Schema
): z.infer<typeof schema> | null => {
  try {
    const tokenPayload = jwt.verify(token, serverPassword);
    return schema.parse(tokenPayload);
  } catch (error) {
    return null;
  }
};

server.use(async (req, res, next) => {
  const result = HeaderSchema.safeParse(req.headers);
  if (!result.success) return next();

  const { auth } = result.data;
  if (!auth) return next();

  const tokenPayload = safeVerify(auth, z.object({ name: z.string() }));
  if (!tokenPayload) return next();

  const users = await load(
    "users",
    UserSchema.omit({ password: true }).array()
  );
  if (!users) return res.sendStatus(500);

  const user = users.find((user) => user.name === tokenPayload.name);
  if (!user) return next();

  res.locals.user = user;
  next();
});

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

server.post("/api/login", async (req, res) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(500);

  const { name, password } = result.data;

  const users = await load("users", UserSchema.array());
  if (!users) return res.sendStatus(500);

  const user = users.find((user) => user.name === name);
  if (!user) return res.sendStatus(401);

  const isCorrect = await compare(password, user.password);
  if (!isCorrect) return res.sendStatus(500);

  //token ami 1h utan lejar
  const token = jwt.sign({ name: user.name }, serverPassword, {
    expiresIn: "1h",
  });

  res.json({ token });
});

type Game = z.infer<typeof GameSchema>;
type User = z.infer<typeof UserSchema>;

server.post("/api/game", async (req, res) => {
  const user = res.locals.user as User;
  if (!user) return res.sendStatus(401);

  const id = Math.random();

  const newGame: Game = {
    id,
    admin: user.name,
    requests: [],
    joinedUsers: [],
    players: [],
    communityCards: [],
    usedCards: [],
    logs: [],
    unusedCards: [],
  };

  const games = await load("games", GameSchema.array());
  if (!games) return res.sendStatus(500);

  games.push(newGame);

  const saveResult = await save("games", games, GameSchema.array());
  if (!saveResult.success) return res.sendStatus(500);

  res.json({ id });
});

const JoinRequestSchema = z.object({
  id: z.number(),
});

server.post("/api/join", async (req, res) => {
  const user = res.locals.user as Omit<User, "password">;
  if (!user) return res.sendStatus(401);

  const result = JoinRequestSchema.safeParse(req.body);
  if (!result.success) return res.sendStatus(400);
  const { id } = req.body;

  const games = await load("games", GameSchema.array());
  if (!games) return res.sendStatus(500);

  const gameToUpdate = games.find((game) => game.id === id);
  if (!gameToUpdate) return res.sendStatus(404);

  if (gameToUpdate.admin === user.name) {
    gameToUpdate.joinedUsers.push(user);
  } else {
    gameToUpdate.requests.push(user);
  }

  const saveResult = await save(
    "games",
    games.map((game) => (game.id === id ? gameToUpdate : game)),
    GameSchema.array()
  );

  if (!saveResult.success) return res.sendStatus(500);

  res.json({ id });
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
