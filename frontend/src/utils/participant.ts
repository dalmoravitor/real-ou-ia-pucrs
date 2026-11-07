const STORAGE_KEY = "real-ou-ia-participant-ids";

export const normalizePlayerName = (name: string) => name.trim().toLocaleLowerCase("pt-BR");

export const createAnonymousParticipantId = () => {
  const randomPart =
    crypto.randomUUID?.().replaceAll("-", "").slice(0, 20) ??
    `${Date.now()}${Math.random().toString(36).slice(2)}`.slice(0, 20);
  return `first-${randomPart}`;
};

export const readParticipantIds = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const rememberParticipantId = (name: string, participantId: string) => {
  const ids = readParticipantIds();
  ids[normalizePlayerName(name)] = participantId;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage indisponível: segue sem persistir
  }
};
