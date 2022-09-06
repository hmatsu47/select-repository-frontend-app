import { Show } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { formatDateTimeDisplay } from "../formatDateTime";
import { isReleased, lastImageUri, lastReleasedAt } from "../signal";

export const LastReleased = () => {
  return (
    <Show when={isReleased()} fallback={<></>}>
      <Box
        sx={{
          width: "100%",
          minWidth: "1024px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <Stack spacing={2} direction="column">
          <Stack spacing={2} direction="row">
            <Typography variant="h6" sx={{ minWidth: "256px" }}>
              前回リリースイメージURI
            </Typography>
            <Typography variant="h6">{lastImageUri()!}</Typography>
          </Stack>
          <Stack spacing={2} direction="row">
            <Typography variant="h6" sx={{ minWidth: "256px" }}>
              前回リリース日時
            </Typography>
            <Typography variant="h6">
              {formatDateTimeDisplay(new Date(lastReleasedAt()!))}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Show>
  );
};
