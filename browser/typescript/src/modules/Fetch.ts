export default class Fetch {
  public static async post(path: string, jsonBody: string) {
    const response = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      body: jsonBody,
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await response.json();
    return { response, json };
  }
}
