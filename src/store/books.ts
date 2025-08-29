import { defineStore } from "pinia";
import { listBooks, getBook, createBook, updateBook, deleteBook, type Book } from "../api/books";

type Status = "idle" | "loading" | "saving" | "deleting" | "error" | "success";

export const useBooksStore = defineStore("books", {
  state: () => ({
    items: [] as Book[],
    status: "idle" as Status,
    message: "" as string,
  }),
  getters: {
    byId: (s) => (id: number) => s.items.find((b) => b.id === id),
  },
  actions: {
    async fetchAll() {
      this.status = "loading";
      this.message = "";
      try {
        this.items = await listBooks();
        this.status = "idle";
      } catch (e: any) {
        this.status = "error";
        this.message = e?.message ?? "Erro ao carregar livros";
      }
    },
    async fetchOne(id: number) {
      this.status = "loading";
      this.message = "";
      try {
        const b = await getBook(id);
        const ix = this.items.findIndex((x) => x.id === id);
        if (ix >= 0) this.items[ix] = b;
        else this.items.push(b);
        this.status = "idle";
        return b;
      } catch (e: any) {
        this.status = "error";
        this.message = e?.message ?? "Erro ao carregar livro";
        throw e;
      }
    },
    async create(payload: Omit<Book, "id">) {
      this.status = "saving";
      this.message = "";
      try {
        const created = await createBook(payload);
        this.items.unshift(created);
        this.status = "success";
        this.message = "Livro criado com sucesso";
        return created;
      } catch (e: any) {
        this.status = "error";
        this.message = e?.message ?? "Erro ao criar livro";
        throw e;
      } finally {
        setTimeout(() => {
          if (this.status === "success") this.status = "idle";
          this.message = "";
        }, 1200);
      }
    },
    async update(id: number, payload: Book) {
      this.status = "saving";
      this.message = "";
      const ix = this.items.findIndex((x) => x.id === id);
      const backup = ix >= 0 ? { ...this.items[ix] } : undefined;
      try {
        // otimista
        if (ix >= 0) this.items[ix] = { ...payload };
        const saved = await updateBook(id, payload);
        if (ix >= 0) this.items[ix] = saved;
        this.status = "success";
        this.message = "Livro atualizado";
        return saved;
      } catch (e: any) {
        if (ix >= 0 && backup) this.items[ix] = backup;
        this.status = "error";
        this.message = e?.message ?? "Erro ao atualizar";
        throw e;
      } finally {
        setTimeout(() => {
          if (this.status === "success") this.status = "idle";
          this.message = "";
        }, 1200);
      }
    },
    async remove(id: number) {
      this.status = "deleting";
      this.message = "";
      const ix = this.items.findIndex((x) => x.id === id);
      const backup = ix >= 0 ? { ...this.items[ix] } : undefined;
      if (ix >= 0) this.items.splice(ix, 1);
      try {
        await deleteBook(id);
        this.status = "success";
        this.message = "Livro excluído";
      } catch (e: any) {
        if (ix >= 0 && backup) this.items.splice(ix, 0, backup);
        this.status = "error";
        this.message = e?.message ?? "Erro ao excluir";
        throw e;
      } finally {
        setTimeout(() => {
          if (this.status === "success") this.status = "idle";
          this.message = "";
        }, 1200);
      }
    },
  },
});
