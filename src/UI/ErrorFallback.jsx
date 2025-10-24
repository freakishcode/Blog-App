import { Box, Paper, Typography, Button } from "@mui/material";

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Typography variant='h5' color='error' gutterBottom>
          Oops! Something went wrong.
        </Typography>

        <Typography variant='body2' color='text.secondary' gutterBottom>
          Don’t worry — you can try again.
        </Typography>

        {/* Debug info only in dev */}
        {process.env.NODE_ENV === "development" && (
          <Box
            sx={{
              mt: 2,
              mb: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.200",
              overflow: "auto",
              maxHeight: 150,
              textAlign: "left",
            }}
          >
            <Typography
              variant='caption'
              color='error'
              sx={{ fontFamily: "monospace" }}
            >
              {error.message}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>

          <Button
            variant='outlined'
            color='secondary'
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
