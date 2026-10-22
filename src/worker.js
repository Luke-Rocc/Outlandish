// Låser hele siden bag brugernavn og password.
// Brugere og nøgle ligger som Cloudflare-secrets:
//   USERS          "navn:password,navn2:password2"
//   SESSION_SECRET lang tilfældig tekst, der signerer login-cookien
const COOKIE = "__Host-outlandish";
const REMEMBER_SECONDS = 60 * 60 * 24 * 30;
const SESSION_SECONDS = 60 * 60 * 12;

export default {
  async fetch(request, env) {
    if (!env.USERS || !env.SESSION_SECRET) {
      return new Response("Login er ikke sat op: USERS og SESSION_SECRET mangler.", { status: 500 });
    }
    const url = new URL(request.url);

    if (url.pathname === "/login") {
      if (request.method === "POST") return login(request, env);
      if (await currentUser(request, env)) return redirect("/");
      return env.ASSETS.fetch(new Request(new URL("/login", url), request));
    }
    if (url.pathname === "/logout") {
      return redirect("/login", `${COOKIE}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`);
    }
    if (!(await currentUser(request, env))) return redirect("/login");
    return env.ASSETS.fetch(request);
  },
};

async function login(request, env) {
  const form = await request.formData();
  const name = String(form.get("user") || "").trim().toLowerCase();
  const password = String(form.get("pass") || "");
  const remember = form.get("remember") === "on";

  const users = parseUsers(env.USERS);
  const expected = users.get(name);
  // Sammenlign altid, også for ukendte brugere, så svartiden ikke afslører brugernavne.
  const ok = await sameText(password, expected ?? "\u0000", env.SESSION_SECRET) && expected !== undefined;
  if (!ok) return redirect("/login?fejl=1");

  const seconds = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  const value = await sign(`${name}|${Math.floor(Date.now() / 1000) + seconds}`, env.SESSION_SECRET);
  const maxAge = remember ? `; Max-Age=${seconds}` : "";
  return redirect("/", `${COOKIE}=${value}; Path=/; Secure; HttpOnly; SameSite=Lax${maxAge}`);
}

async function currentUser(request, env) {
  const cookie = (request.headers.get("Cookie") || "")
    .split(/;\s*/)
    .find((c) => c.startsWith(COOKIE + "="));
  if (!cookie) return null;
  const value = cookie.slice(COOKIE.length + 1);
  const dot = value.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = decodeURIComponent(value.slice(0, dot));
  if ((await sign(payload, env.SESSION_SECRET)) !== value) return null;
  const [name, exp] = payload.split("|");
  if (Number(exp) < Date.now() / 1000) return null;
  if (!parseUsers(env.USERS).has(name)) return null;
  return name;
}

function parseUsers(text) {
  const users = new Map();
  for (const entry of text.split(",")) {
    const i = entry.indexOf(":");
    if (i > 0) users.set(entry.slice(0, i).trim().toLowerCase(), entry.slice(i + 1).trim());
  }
  return users;
}

async function hmac(text, secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload, secret) {
  return `${encodeURIComponent(payload)}.${await hmac(payload, secret)}`;
}

async function sameText(a, b, secret) {
  return (await hmac(a, secret)) === (await hmac(b, secret));
}

function redirect(location, cookie) {
  const headers = { Location: location, "Cache-Control": "no-store" };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(null, { status: 303, headers });
}
