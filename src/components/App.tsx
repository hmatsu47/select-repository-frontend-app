import { Component } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import { TitleBar } from "./TitleBar";

export const App: Component = () => {
  return (
    <>
      <TitleBar />
      <Box
        sx={{
          padding: "10px 0 0 0",
          width: "100%",
          minWidth: "960px",
          display: "flex",
          justifyContent: "center",
        }}
        aria-live="polite"
      >
        <Stack spacing={2} direction="column"></Stack>
      </Box>
    </>
  );
};
