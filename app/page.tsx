"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Grid,
  CardActionArea,
  Button,
  Skeleton,
  Box,
} from "@mui/material";

interface PokemonResponse {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<
    { name: string; url: string }[]
  >([]);

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 20;

  useEffect(() => {
    setLoading(true);

    fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    )
      .then((response) => response.json())
      .then((data: PokemonResponse) => {
        setPokemonList((prev) => [...prev, ...data.results]);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [offset]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: "bold",
          color: "#d32f2f",
          mb: 5,
          textShadow: "2px 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        Pokédex
      </Typography>

      <Grid container spacing={3}>
        {pokemonList.map((pokemon) => {
          const pokemonId = pokemon.url.split("/")[6];

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.name}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 10,
                    backgroundColor: "#fffde7",
                  },
                }}
              >
                <CardActionArea href={`/pokemon/${pokemon.name}`}>
                  <CardContent
                    sx={{
                      textAlign: "center",
                      py: 3,
                    }}
                  >
                    <Avatar
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                      alt={pokemon.name}
                      sx={{
                        width: 100,
                        height: 100,
                        margin: "auto",
                        mb: 2,
                        bgcolor: "#eeeeee",
                        border: "3px solid #ef5350",
                      }}
                    />

                    <Typography
                      variant="h6"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                        color: "#424242",
                      }}
                    >
                      {pokemon.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}

        {loading &&
          [...Array(8)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Skeleton
                    variant="circular"
                    width={100}
                    height={100}
                    sx={{ margin: "auto" }}
                  />

                  <Skeleton
                    variant="text"
                    sx={{ mt: 2 }}
                  />

                  <Skeleton variant="text" />
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {pokemonList.length < 1351 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
          }}
        >
          <Button
            variant="contained"
            color="warning"
            size="large"
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: 5,
              fontWeight: "bold",
            }}
            onClick={() => setOffset((prev) => prev + limit)}
          >
            Load More Pokémon
          </Button>
        </Box>
      )}
    </Container>
  );
}