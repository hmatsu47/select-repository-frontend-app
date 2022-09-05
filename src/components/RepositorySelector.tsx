import { For, Show } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { RepositoryButton } from "./RepositoryButton";
import { repositories } from "../signal";

export const RepositorySelector = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: "1024px",
        display: "flex",
      }}
      aria-live="polite"
    >
      <Show when={repositories()} fallback={<></>}>
        <Stack spacing={2} direction="row">
          <Typography variant="h6" sx={{ minWidth: "256px" }}>
            リリース対象リポジトリ
          </Typography>
          <For each={repositories()} fallback={<></>}>
            {(repositoryItem) => (
              <RepositoryButton repositoryItem={repositoryItem} />
            )}
          </For>
        </Stack>
      </Show>
    </Box>
  );
};
