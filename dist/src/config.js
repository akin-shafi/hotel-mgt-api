"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_LOGIN = exports.FRONTEND_URL = exports.BASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { NODE_ENV, LOCAL_URL, REMOTE_URL, FRONTEND_URL_LOCAL, FRONTEND_LOGIN_URL, REMOTE_LOGIN_URL, FRONTEND_URL_REMOTE } = process.env;
const BASE_URL = NODE_ENV === 'development' ? LOCAL_URL : REMOTE_URL;
exports.BASE_URL = BASE_URL;
const FRONTEND_URL = NODE_ENV === 'development' ? FRONTEND_URL_LOCAL : FRONTEND_URL_REMOTE;
exports.FRONTEND_URL = FRONTEND_URL;
const FRONTEND_LOGIN = NODE_ENV === 'development' ? FRONTEND_LOGIN_URL : REMOTE_LOGIN_URL;
exports.FRONTEND_LOGIN = FRONTEND_LOGIN;
