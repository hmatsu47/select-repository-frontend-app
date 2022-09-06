import { Show } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { updateSetting } from "../api/updateSetting";
import { formatDateTimeInput, formatDateTimeStore } from "../formatDateTime";
import {
  images,
  imageUri,
  isReleased,
  releaseAt,
  setReleaseAt,
} from "../signal";

export const ReleaseSetting = () => {
  return (
    <Show when={isReleased() !== undefined && images()} fallback={<></>}>
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
            <Typography variant="h6" sx={{ minWidth: "256px", color: "#f00" }}>
              次回リリースイメージ　URI
            </Typography>
            <Typography variant="subtitle1">
              {imageUri() ? imageUri() : "下のリストから選択してください"}
            </Typography>
          </Stack>
          <Stack spacing={2} direction="row">
            <Typography variant="h6" sx={{ minWidth: "256px", color: "#f00" }}>
              次回リリース日時
            </Typography>
            <input
              type="datetime-local"
              value={
                releaseAt() ? formatDateTimeInput(new Date(releaseAt()!)) : ""
              }
              onChange={(event) => {
                setReleaseAt(
                  event.currentTarget.value === ""
                    ? undefined
                    : new Date(
                        Date.parse(
                          formatDateTimeStore(event.currentTarget.value)
                        )
                      )
                );
              }}
              max="9999-12-31 23:59"
            />
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={async (e) => {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(4);
                tomorrow.setMinutes(5);
                tomorrow.setSeconds(0);
                tomorrow.setMilliseconds(0);
                setReleaseAt(tomorrow);
              }}
              sx={{ textTransform: "none" }}
            >
              翌朝 04:05
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={async (e) => {
                setReleaseAt(new Date());
              }}
              sx={{ textTransform: "none" }}
            >
              現在（即時リリースする）
            </Button>
          </Stack>
          <Stack spacing={2} direction="row">
            <Typography variant="h6" sx={{ minWidth: "256px", color: "#f00" }}>
              次回リリースセット
            </Typography>
            <Button
              disabled={!imageUri() || !releaseAt()}
              variant="contained"
              size="small"
              color="primary"
              onClick={async (e) => {
                if (
                  confirm(
                    "リリースするイメージ URI と日時をセットします。よろしいですか？"
                  )
                ) {
                  await updateSetting();
                }
              }}
              sx={{ textTransform: "none" }}
            >
              指定のイメージ URI と日時をセット
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Show>
  );
};
