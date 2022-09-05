import { createSignal } from "solid-js";
import { AlertColor } from "@suid/material/Alert";

import { ImageItem, RepositoryItem, ServiceItem } from "./type";

export const [service, setService] = createSignal<string | undefined>();
export const [repository, setRepository] = createSignal<string | undefined>();
export const [services, setServices] = createSignal<
  ServiceItem[] | undefined
>();
export const [repositories, setRepositories] = createSignal<
  RepositoryItem[] | undefined
>();
export const [images, setImages] = createSignal<ImageItem[] | undefined>();
export const [imageUri, setImageUri] = createSignal<string | undefined>();
export const [releaseAt, setReleaseAt] = createSignal<Date | undefined>();
export const [lastImageUri, setLastImageUri] = createSignal<
  string | undefined
>();
export const [lastReleasedAt, setLastReleasedAt] = createSignal<
  Date | undefined
>();
export const [isReleased, setIsReleased] = createSignal<boolean | undefined>();
export const [message, setMessage] = createSignal<string | undefined>();
export const [messageSeverity, setMessageSeverity] = createSignal<
  AlertColor | undefined
>();
