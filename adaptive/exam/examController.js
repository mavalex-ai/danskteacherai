// Backend2/adaptive/exam/examController.js

import { UserState } from "../state/UserState.js";
import {
  loadUserState,
  saveUserState
} from "../persistence/stateRepository.js";

/**
 * Start exam — ENSURES USER STATE EXISTS
 */
export async function startExam({ userId, exam }) {
  if (!userId || !exam) {
    throw new Error("userId and exam are required");
  }

  let userState = await loadUserState(userId);

  // ✅ CRITICAL FIX: create state if missing
  if (!userState) {
    userState = new UserState(userId);
  }

  userState.exam.target = exam;
  userState.exam.attempts = 0;
  userState.exam.readiness = { total: 0 };
  userState.exam.lastExamTask = null;

  await saveUserState(userState);

  return {
    status: "started",
    exam
  };
}

/**
 * Stop exam — SAFE EVEN IF STATE MISSING
 */
export async function stopExam({ userId }) {
  if (!userId) {
    throw new Error("userId is required");
  }

  const userState = await loadUserState(userId);
  if (!userState) {
    return { status: "stopped" };
  }

  userState.exam.target = null;
  userState.exam.attempts = 0;
  userState.exam.readiness = {};
  userState.exam.lastExamTask = null;

  await saveUserState(userState);

  return { status: "stopped" };
}

/**
 * Get exam status
 */
export async function getExamStatus({ userId }) {
  if (!userId) {
    throw new Error("userId is required");
  }

  const userState = await loadUserState(userId);

  if (!userState) {
    return {
      exam: null,
      attempts: 0,
      readiness: {}
    };
  }

  return {
    exam: userState.exam.target,
    attempts: userState.exam.attempts,
    readiness: userState.exam.readiness
  };
}
