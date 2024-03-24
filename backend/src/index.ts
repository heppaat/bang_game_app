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

const server = express();

server.use(cors());

server.use(express.json());

//name -> id
server.post("/api/signup", async (req, res) => {
  res.json();
});

//name -> id
server.post("/api/login", async (req, res) => {
  res.json();
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
