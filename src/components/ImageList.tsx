import { For, Show } from "solid-js";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Paper from "@suid/material/Paper";
import Table from "@suid/material/Table";
import TableBody from "@suid/material/TableBody";
import TableCell from "@suid/material/TableCell";
import TableContainer from "@suid/material/TableContainer";
import TableHead from "@suid/material/TableHead";
import TableRow from "@suid/material/TableRow";
import Typography from "@suid/material/Typography";
import { images, imageUri, repository, setImageUri } from "../signal";
import { formatDateTimeDisplay } from "../formatDateTime";

export const ImageList = () => {
  return (
    <Show when={repository() && images() !== undefined} fallback={<></>}>
      <Box
        sx={{
          width: "100%",
          minWidth: "1024px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <Show
          when={images() !== null}
          fallback={
            <Typography variant="h6">
              リポジトリにイメージがありません
            </Typography>
          }
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>選択</TableCell>
                  <TableCell>
                    イメージURI（リポジトリURI:タグ または
                    リポジトリURI@ダイジェスト）
                  </TableCell>
                  <TableCell>プッシュ日時</TableCell>
                  <TableCell>サイズ（MB）</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={images()} fallback={<></>}>
                  {(imageItem) => (
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <Button
                          variant={
                            imageUri() && imageUri() === imageItem.uri
                              ? "contained"
                              : "outlined"
                          }
                          size="small"
                          color={
                            imageUri() && imageUri() === imageItem.uri
                              ? "primary"
                              : "inherit"
                          }
                          onClick={async (e) => {
                            setImageUri(imageItem.uri);
                          }}
                          sx={{ textTransform: "none" }}
                        >
                          選択
                        </Button>
                      </TableCell>
                      <TableCell>{imageItem.uri}</TableCell>
                      <TableCell>
                        {formatDateTimeDisplay(new Date(imageItem.pushed_at))}
                      </TableCell>
                      <TableCell align="right">
                        {(
                          Math.round(
                            (imageItem.size / (1000 * 1000)) * Math.pow(10, 2)
                          ) / Math.pow(10, 2)
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </Table>
          </TableContainer>
        </Show>
      </Box>
    </Show>
  );
};
