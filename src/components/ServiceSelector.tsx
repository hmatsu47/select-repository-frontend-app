import { createEffect, For, onMount, Show, Suspense } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { ServiceButton } from "./ServiceButton";
import { fetchRepositories } from "../api/fetchRepositories";
import { fetchServices } from "../api/fetchServices";
import { fetchSetting } from "../api/fetchSetting";
import { service, services, setService } from "../signal";

export const ServiceSelector = () => {
  onMount(async () => {
    await fetchServices();
  });

  createEffect(async () => {
    if (services() && !service()) {
      setService(services()![0].name);
      await fetchSetting();
      await fetchRepositories();
    }
  });

  return (
    <Box>
      <Suspense fallback={<div>Loading...</div>}>
        <Show when={services() && service()} fallback={<></>}>
          <Stack spacing={2} direction="row">
            <Typography variant="h6">リリース対象サービス :</Typography>
            <For each={services()} fallback={<></>}>
              {(serviceItem) => <ServiceButton serviceItem={serviceItem} />}
            </For>
          </Stack>
        </Show>
      </Suspense>
    </Box>
  );
};
