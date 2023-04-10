import { Show } from "solid-js";
import { useTheme } from "@suid/material";
import Backdrop from "@suid/material/Backdrop";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { deleteSetting } from "../api/deleteSetting";
import { updateSetting } from "../api/updateSetting";
import { isOpenedConfirm, setIsOpenedConfirm, isCancel } from "../signal";

export const Confirm = () => {
  const theme = useTheme();

  return (
    <Show when={isOpenedConfirm() === true} fallback={<></>}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
          marginTop: 0,
        }}
        open={isOpenedConfirm()}
        onClick={() => setIsOpenedConfirm(false)}
      ></Backdrop>
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: theme.palette.background.paper,
          border: "2px solid #000",
          boxShadow: "24px",
          p: 4,
          zIndex: theme.zIndex.drawer + 1,
        }}
        title="modal"
      >
        <Typography variant="subtitle1">
          {isCancel()
            ? "リリースを取り消します。"
            : "リリースするイメージ URI と日時をセットします。"}
        </Typography>
        <Typography variant="subtitle1">よろしいですか？</Typography>
        <Box sx={{ paddingTop: "20px" }}></Box>
        <Stack spacing={4} direction="row" sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={async (e) => {
              setIsOpenedConfirm(false);
              await (isCancel() ? deleteSetting() : updateSetting());
            }}
            title="はい"
          >
            はい
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => {
              setIsOpenedConfirm(false);
            }}
            title="いいえ"
          >
            いいえ
          </Button>
        </Stack>
      </Box>
    </Show>
  );
};
