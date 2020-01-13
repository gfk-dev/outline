// @flow
import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import { InvalidRequestError } from './errors';

const QUEZX_API_URL = process.env.QUEZX_API_URL;

export async function post(endpoint: string, body: Object) {
  let data;

  const token = body.token;
  try {
    const response = await fetch(`${QUEZX_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    data = await response.json();
  } catch (err) {
    throw new InvalidRequestError(err.message);
  }
  if (!data.ok) throw new InvalidRequestError(data.error);

  return data;
}

export async function request(endpoint: string, body: Object) {
  let data;
  try {
    const response = await fetch(
      `${QUEZX_API_URL}/${endpoint}?${querystring.stringify(body)}`
    );
    data = await response.json();
  } catch (err) {
    throw new InvalidRequestError(err.message);
  }
  if (!data.ok) throw new InvalidRequestError(data.error);

  return data;
}

export async function getToken(code: string) {
  let data;
  const obj = {
    client_id: process.env.QUEZX_CLIENT_KEY,
    client_secret: process.env.QUEZX_CLIENT_SECRET,
    code,
  };

  const form = Object.keys(obj)
    .map(p => `${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    .join('&');

  try {
    const response = await fetch(`${QUEZX_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
    });

    data = await response.json();
  } catch (err) {
    throw new InvalidRequestError(err.message);
  }

  return data;
}

export async function getUser(token: string) {
  let data;
  try {
    const response = await fetch(`${QUEZX_API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    data = await response.json();
  } catch (err) {
    throw new InvalidRequestError(err.message);
  }

  return data;
}
