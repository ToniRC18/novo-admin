type RequiredKey = "NOVO_AUTH_URL" | "SERVICE_TOKEN" | "ADMIN_SECRET";

function getEnvValue(key: RequiredKey) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  novoAuthUrl: getEnvValue("NOVO_AUTH_URL"),
  serviceToken: getEnvValue("SERVICE_TOKEN"),
  adminSecret: getEnvValue("ADMIN_SECRET"),
};
