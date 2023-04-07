import { Show } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { formatDateTimeInput, formatDateTimeStore } from "../formatDateTime";
import {
  images,
  imageUri,
  isReleased,
  isReleaseSelected,
  releaseAt,
  setReleaseAt,
  setIsOpenedConfirm,
  setIsCancel,
} from "../signal";

export const ReleaseSetting = () => {
  const handleOpenSet = () => {
    setIsCancel(false);
    setIsOpenedConfirm(true);
  };
  const handleOpenCancel = () => {
    setIsCancel(true);
    setIsOpenedConfirm(true);
  };
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
          <Stack
            spacing={2}
            direction="row"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="h6" sx={{ minWidth: "256px", color: "#f00" }}>
              次回リリースイメージ URI
            </Typography>
            <Typography variant="subtitle1">
              {imageUri() ? imageUri() : "下のリストから選択してください"}
            </Typography>
          </Stack>
          <Stack spacing={2} direction="row">
            <Typography variant="h6" sx={{ minWidth: "256px", color: "#f00" }}>
              <label id="releaseAt">次回リリース日時</label>
            </Typography>
            <input
              type="datetime-local"
              aria-labelledby="releaseAt"
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
              onClick={() => {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(4);
                tomorrow.setMinutes(5);
                tomorrow.setSeconds(0);
                tomorrow.setMilliseconds(0);
                setReleaseAt(tomorrow);
              }}
              sx={{ textTransform: "none" }}
              title="翌朝リリースする"
            >
              翌朝 04:05
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => {
                setReleaseAt(new Date());
              }}
              sx={{ textTransform: "none" }}
              title="即時リリースする"
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
              onClick={handleOpenSet}
              sx={{ textTransform: "none" }}
              title="次回リリースをセット"
            >
              指定のイメージ URI と日時をセット
            </Button>
            <Button
              disabled={!isReleaseSelected()}
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleOpenCancel}
              sx={{ textTransform: "none" }}
              title="次回リリースを取り消し"
            >
              リリースを取り消し
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Show>
  );
};
