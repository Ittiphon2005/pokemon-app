"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PersonIcon from "@mui/icons-material/Person";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const infoItems = [
    {
      icon: <PersonIcon color="error" />,
      label: "ผู้พัฒนา",
      value: "อิทธิพล จันโนนแซง",
    },
    {
      icon: <BadgeIcon color="error" />,
      label: "รหัสนักศึกษา",
      value: "673450043-7",
    },
    {
      icon: <MenuBookIcon color="error" />,
      label: "รายวิชา",
      value: "Front-end Web Programming",
    },
    {
      icon: <AccountTreeIcon color="error" />,
      label: "สาขาวิชา",
      value: "วิทยาการคอมพิวเตอร์และสารสนเทศ",
    },
    {
      icon: <SchoolIcon color="error" />,
      label: "มหาวิทยาลัย",
      value: "มหาวิทยาลัยขอนแก่น",
    },
  ];

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card
        sx={{
          borderRadius: 6,
          boxShadow: "0px 10px 35px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #ef5350 0%, #ffca28 100%)",
            py: 5,
            textAlign: "center",
            position: "relative",
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              fontSize: 45,
              boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
              animation: "bounce 2s infinite ease-in-out",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-6px)" },
              },
            }}
          >
            ⚡
          </Avatar>

          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: "800",
              mt: 2.5,
              letterSpacing: "0.5px",
              textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            About This Project
          </Typography>
        </Box>

        <CardContent sx={{ px: { xs: 3, sm: 4 }, py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {infoItems.map((item, index) => (
              <Box key={index}>
                {/* เปลี่ยนจาก Grid มาใช้ Flexbox คลีนๆ */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(239, 83, 80, 0.08)",
                      p: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontWeight: "600",
                        display: "block",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        mb: 0.3,
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "700",
                        color: "#2c3e50",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
                {index < infoItems.length - 1 && (
                  <Divider sx={{ mt: 2.5, opacity: 0.5 }} />
                )}
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "700",
                color: "#2c3e50",
                mb: 2,
                letterSpacing: "0.5px",
              }}
            >
              CONNECT WITH ME
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2.5,
              }}
            >
              <Tooltip title={mounted ? "GitHub" : ""}>
                <IconButton
                  component="a"
                  href="https://github.com/Ittiphon2005/pokemon-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#24292e",
                    backgroundColor: "#f6f8fa",
                    p: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#24292e",
                      color: "#ffffff",
                      transform: "translateY(-4px)",
                      boxShadow: "0px 4px 12px rgba(36, 41, 46, 0.25)",
                    },
                  }}
                >
                  <GitHubIcon fontSize="medium" />
                </IconButton>
              </Tooltip>

              <Tooltip title={mounted ? "Facebook" : ""}>
                <IconButton
                  component="a"
                  href="https://www.facebook.com/ittiphon.jannonsaeng.5"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#1877f2",
                    backgroundColor: "#e7f3ff",
                    p: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#1877f2",
                      color: "#ffffff",
                      transform: "translateY(-4px)",
                      boxShadow: "0px 4px 12px rgba(24, 119, 242, 0.25)",
                    },
                  }}
                >
                  <FacebookIcon fontSize="medium" />
                </IconButton>
              </Tooltip>

              <Tooltip title={mounted ? "Gmail" : ""}>
                <IconButton
                  component="a"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ittiphon.j@kkumail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#ea4335",
                    backgroundColor: "#fce8e6",
                    p: 1.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#ea4335",
                      color: "#ffffff",
                      transform: "translateY(-4px)",
                      boxShadow: "0px 4px 12px rgba(234, 67, 53, 0.25)",
                    },
                  }}
                >
                  <EmailIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}