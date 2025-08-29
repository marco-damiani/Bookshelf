export type Book = {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string; // ISO
};

const BASE = "https://fakerestapi.azurewebsites.net/api/v1/Books";

async function request<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const r = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`HTTP ${r.status} ${r.statusText}${text ? ` - ${text.slice(0, 180)}` : ""}`);
  }
  const ct = r.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return r.json() as Promise<T>;
  }
  return undefined as unknown as T;
}

export async function listBooks(): Promise<Book[]> {
  return request<Book[]>(BASE);
}

export async function getBook(id: number): Promise<Book> {
  return request<Book>(`${BASE}/${id}`);
}

// a API aceita qualquer id, mas no create não se usa
export async function createBook(payload: Omit<Book, "id">): Promise<Book> {
  return request<Book>(BASE, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateBook(id: number, payload: Book): Promise<Book> {
  return request<Book>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteBook(id: number): Promise<void> {
  await request<void>(`${BASE}/${id}`, { method: "DELETE" });
}
