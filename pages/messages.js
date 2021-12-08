import Box from "@mui/material/Box";

export default function Messages() {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: "100%", md: "65%" },
        ml: { md: `25%` },
      }}
    >
      <h1>Hello!!!!! I am Messages Tab!!!!</h1>
    </Box>
  );
}
