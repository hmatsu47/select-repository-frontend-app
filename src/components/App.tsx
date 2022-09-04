import { Component } from "solid-js";
import Box from "@suid/material/Box";
import Stack from "@suid/material/Stack";
import { ServiceSelector } from "./ServiceSelector";
import { TitleBar } from "./TitleBar";

export const App: Component = () => {
  return (
    <>
      <TitleBar />
      <Box
        sx={{
          padding: "10px 0 0 10px",
          width: "100%",
          minWidth: "960px",
          display: "flex",
        }}
        aria-live="polite"
      >
        <Stack spacing={2} direction="column">
          <ServiceSelector />
        </Stack>
      </Box>
    </>
  );
};
