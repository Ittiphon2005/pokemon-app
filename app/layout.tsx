import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon App",
  description: "Pokemon Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: "#ef5350",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
              }}
            >
              Pokémon App
            </Typography>

            <Button color="inherit" href="/">
              Home
            </Button>

            <Button color="inherit" href="/about">
              About
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>{children}</Box>
      </body>
    </html>
  );
}