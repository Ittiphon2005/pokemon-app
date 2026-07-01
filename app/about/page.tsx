import {
  Container,
  Card,
  CardContent,
  Typography,
  Link,
  Divider,
  Avatar,
  Box,
} from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: 8,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg,#ef5350,#ffca28)",
            py: 4,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: "auto",
              bgcolor: "white",
              fontSize: 50,
            }}
          >
            ⚡
          </Avatar>

          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: "bold",
              mt: 2,
            }}
          >
            About This Project
          </Typography>
        </Box>

        <CardContent>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            color="error"
            gutterBottom
          >
            Developer
          </Typography>

          <Typography sx={{ mb: 3 }}>
            อิทธิพล จันโนนแซง
          </Typography>

          <Typography
            variant="h6"
            color="error"
            gutterBottom
          >
            Course
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Front-end Web Programming
          </Typography>

          <Typography
            variant="h6"
            color="error"
            gutterBottom
          >
            Program
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Computer Science and Information Technology (CS)
          </Typography>

          <Typography
            variant="h6"
            color="error"
            gutterBottom
          >
            University
          </Typography>

          <Typography sx={{ mb: 3 }}>
            มหาวิทยาลัยขอนแก่น
          </Typography>

          <Typography
            variant="h6"
            color="error"
            gutterBottom
          >
            GitHub Source Code
          </Typography>

          <Link
            href="https://github.com/Ittiphon2005/pokemon-app"
            target="_blank"
            underline="hover"
          >
            github.com/Ittiphon2005/pokemon-app
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}