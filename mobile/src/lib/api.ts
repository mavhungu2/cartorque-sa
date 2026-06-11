import Constants from "expo-constants";
import type { Listing, ListingFacets } from "./contracts/listing";
import type { NewFinanceApplicationInput } from "./contracts/finance";

const BASE: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  "https://cartorque-sa--cartorque-sa.us-east4.hosted.app/api/v1";

export type ApiError = { code: string; message: string; field?: string };

export class ApiRequestError extends Error {
  constructor(
    public readonly error: ApiError,
    public readonly status: number,
  ) {
    super(error.message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const error: ApiError = body?.error ?? {
      code: "http_error",
      message: `Request failed (${res.status})`,
    };
    throw new ApiRequestError(error, res.status);
  }
  return body as T;
}

export type ListingsResponse = {
  listings: Listing[];
  facets: ListingFacets;
  total: number;
  nextCursor: string | null;
};

export type VideosResponse = {
  channel: { name: string; handle: string; url: string; tagline: string; about: string };
  videos: { id: string; title: string; category: string; description: string }[];
  categories: { slug: string; title: string; blurb: string }[];
};

export const api = {
  listings: () => request<ListingsResponse>("/listings"),
  listing: (id: string) => request<{ listing: Listing }>(`/listings/${encodeURIComponent(id)}`),
  videos: () => request<VideosResponse>("/videos"),
  submitFinance: (input: NewFinanceApplicationInput) =>
    request<{ id: string }>("/finance", { method: "POST", body: JSON.stringify(input) }),
};
