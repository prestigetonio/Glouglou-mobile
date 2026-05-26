import * as SecureStore from 'expo-secure-store';
import { Bottle, BottleFormData } from './types';

const BASE_URL = 'https://glouglou-private-cave-for-you.vercel.app';
const TOKEN_KEY = 'glouglou_jwt';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiSignIn(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/mobile/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Connexion échouée');
  return data as { token: string; user: { id: string; email: string; name: string; plan: string } };
}

export async function apiRegister(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Inscription échouée');
  return data;
}

// GET /api/bottles → retourne le tableau directement (pas { bottles: [...] })
export async function apiGetBottles(): Promise<Bottle[]> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/bottles`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data as Bottle[];
}

// GET /api/bottles/:id → retourne l'objet directement (pas { bottle })
export async function apiGetBottle(id: number): Promise<Bottle> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/bottles/${id}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Bouteille introuvable');
  return data as Bottle;
}

function formDataToPayload(form: BottleFormData) {
  return {
    name: form.name,
    domain: form.domain,
    type: form.type,
    vintage: form.vintage ? parseInt(form.vintage, 10) : null,
    year: parseInt(form.year, 10) || new Date().getFullYear(), // champ obligatoire
    region: form.region || null,
    country: form.country || null,
    quantity: parseInt(form.quantity, 10) || 1,
    price: form.price ? parseFloat(form.price) : null,
    rating: form.rating,
    notes: form.notes || null,
  };
}

// POST /api/bottles → retourne l'objet directement (pas { bottle })
export async function apiCreateBottle(form: BottleFormData) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/bottles`, {
    method: 'POST',
    headers,
    body: JSON.stringify(formDataToPayload(form)),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Erreur création') as Error & { code?: string };
    err.code = data.code;
    throw err;
  }
  return data as Bottle;
}

// PUT /api/bottles/:id (pas PATCH) → retourne l'objet directement
export async function apiUpdateBottle(id: number, form: BottleFormData) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/bottles/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(formDataToPayload(form)),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Erreur modification') as Error & { code?: string };
    err.code = data.code;
    throw err;
  }
  return data as Bottle;
}

export async function apiDeleteBottle(id: number): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/api/bottles/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur suppression');
  }
}
