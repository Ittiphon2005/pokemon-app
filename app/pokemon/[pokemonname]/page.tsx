"use client";

import { use, useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Skeleton,
  Button,
} from "@mui/material";

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  cries: {
    latest: string;
  };
}

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemonname: string }>;
}) {
  const { pokemonname } = use(params);

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [evolution, setEvolution] = useState<string[]>([]);

  useEffect(() => {
    async function loadPokemon() {
      try {
        const pokemonRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonname}`
        );
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonname}`
        );
        const speciesData = await speciesRes.json();

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();

        const evoList: string[] = [];
        let current = evolutionData.chain;

        while (current) {
          evoList.push(current.species.name);
          current = current.evolves_to[0];
        }

        setEvolution(evoList);
      } catch (error) {
        console.error(error);
      }
    }

    loadPokemon();
  }, [pokemonname]);

  if (!pokemon) {
    return (
      <Box sx={{ maxWidth: 700, mx: "auto", mt: 5, p: 2 }}>
        <Skeleton variant="text" width={220} height={60} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ my: 3, borderRadius: 3 }}
        />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 750,
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: 8,
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            align="center"
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              color: "#d32f2f",
              mb: 3,
            }}
          >
            {pokemon.name}
          </Typography>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src={
                pokemon.sprites.other["official-artwork"].front_default
              }
              alt={pokemon.name}
              width={300}
              style={{
                maxWidth: "100%",
              }}
            />
          </Box>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Type
          </Typography>

          <Box sx={{ mb: 4 }}>
            {pokemon.types.map((type) => (
              <Chip
                key={type.type.name}
                label={type.type.name}
                color="primary"
                sx={{
                  mr: 1,
                  mb: 1,
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              />
            ))}
          </Box>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Stats
          </Typography>

          {pokemon.stats.map((stat) => (
            <Box key={stat.stat.name} sx={{ mb: 2 }}>
              <Typography
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              >
                {stat.stat.name} : {stat.base_stat}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={Math.min(stat.base_stat, 100)}
                color="warning"
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mt: 0.5,
                }}
              />
            </Box>
          ))}

          <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
            Evolution
          </Typography>

          <Box sx={{ mb: 4 }}>
            {evolution.map((evo) => (
              <Chip
                key={evo}
                label={evo}
                color="success"
                sx={{
                  mr: 1,
                  mb: 1,
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              />
            ))}
          </Box>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Pokémon Cry
          </Typography>

          <audio controls style={{ width: "100%" }}>
            <source src={pokemon.cries.latest} />
          </audio>

          <Box
            sx={{
              textAlign: "center",
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              color="error"
              href="/"
              sx={{
                borderRadius: 5,
                px: 4,
              }}
            >
              ⬅ Back to Pokédex
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}