"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAuthState = loadAuthState;
exports.saveAuthState = saveAuthState;
exports.clearAuthState = clearAuthState;
const STORAGE_KEY = "rushHourAuth";
function loadAuthState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return { user: null, token: null };
    try {
        return JSON.parse(raw);
    }
    catch {
        return { user: null, token: null };
    }
}
function saveAuthState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function clearAuthState() {
    localStorage.removeItem(STORAGE_KEY);
}
