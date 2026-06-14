import { toast } from "sonner";

/** Show a loading toast, return dismiss fn */
export function toastLoading(msg: string) {
  return toast.loading(msg);
}

export const t = {
  success: (msg: string, desc?: string) =>
    toast.success(msg, { description: desc }),

  error: (msg: string, desc?: string) =>
    toast.error(msg, { description: desc }),

  info: (msg: string, desc?: string) =>
    toast(msg, { description: desc }),

  promise: <T,>(
    fn: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => toast.promise(fn, msgs),
};

/** Typed API helper — fetch + throw on error + auto-toast */
export async function apiCall<T = unknown>(
  url: string,
  opts: RequestInit,
  messages: { loading?: string; success: string; errorPrefix?: string }
): Promise<T> {
  const id = messages.loading ? toast.loading(messages.loading) : null;

  const res  = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) } });
  const data = await res.json().catch(() => ({}));

  if (id) toast.dismiss(id);

  if (!res.ok) {
    const msg = data?.error ?? `${messages.errorPrefix ?? "Error"} (${res.status})`;
    toast.error(msg);
    throw new Error(msg);
  }

  toast.success(messages.success);
  return data as T;
}
