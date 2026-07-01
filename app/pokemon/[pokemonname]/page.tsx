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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);
      try {
        // 1. ดึงข้อมูลตัวโปเกมอนปัจจุบัน (แปลงชื่อเป็นตัวพิมพ์เล็กเสมอเพื่อป้องกัน API เอ๋อ)
        const pokemonRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonname.toLowerCase()}`
        );
        
        if (!pokemonRes.ok) throw new Error("Pokemon not found");
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        // 2. ป้องกันบั๊ก: เช็กก่อนว่ามีโครงสร้างข้อมูล species.url อยู่จริงไหมก่อนจะ fetch
        if (pokemonData?.species?.url) {
          const speciesRes = await fetch(pokemonData.species.url);
          
          if (speciesRes.ok) {
            const speciesData = await speciesRes.json();

            // 3. เช็กก่อนว่ามีลิงก์สายวิวัฒนาการส่งมาไหม
            if (speciesData?.evolution_chain?.url) {
              const evolutionRes = await fetch(speciesData.evolution_chain.url);
              
              if (evolutionRes.ok) {
                const evolutionData = await evolutionRes.json();

                // 4. วนลูปเก็บชื่อร่างวิวัฒนาการอย่างปลอดภัย
                const evoList: string[] = [];
                let current = evolutionData.chain;

                while (current) {
                  evoList.push(current.species.name);
                  if (current.evolves_to && current.evolves_to.length > 0) {
                    current = current.evolves_to[0];
                  } else {
                    current = null;
                  }
                }
                setEvolution(evoList);
              }
            }
          }
        } else {
          // ถ้าไม่มีข้อมูลสายพันธุ์ ให้โชว์แค่ชื่อตัวเอง
          setEvolution([pokemonData.name]);
        }

      } catch (error) {
        console.error("Error loading Pokémon data:", error);
        // กรณีดึงข้อมูลล้มเหลว ให้โชว์ชื่อโปเกมอนจาก URL ไปก่อน หน้าเว็บจะได้ไม่ขาวโพลน
        setEvolution([pokemonname]);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [pokemonname]);

  // หน้าจอตอนกำลังโหลดข้อมูล (Skeleton Loading)
  if (loading || !pokemon) {
    return (
      <Box sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 5 }}>
        <Skeleton variant="text" width={220} height={60} sx={{ mx: "auto" }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ borderRadius: 3, my: 2 }}
        />
        <Skeleton variant="text" height={30} width="40%" />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={30} width="40%" sx={{ mt: 2 }} />
        <Skeleton variant="text" height={20} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 5,
        px: 2,
        pb: 5,
      }}
    >
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: 6,
        }}
      >
        <CardContent>
          {/* ชื่อโปเกมอน */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              textTransform: "capitalize",
              color: "#d32f2f",
              mb: 3,
            }}
          >
            {pokemon.name}
          </Typography>

          {/* รูปภาพโปเกมอน */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={
                pokemon.sprites.other["official-artwork"].front_default
              }
              alt={pokemon.name}
              sx={{
                width: {
                  xs: 180,
                  sm: 240,
                  md: 300,
                },
                height: "auto",
              }}
            />
          </Box>

          {/* ประเภทธาตุ */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
            ประเภท (Type)
          </Typography>

          <Box sx={{ mb: 3 }}>
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

          {/* ค่าพลังพื้นฐาน */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
            ค่าพลังพื้นฐาน (Stats)
          </Typography>

          {pokemon.stats.map((stat) => (
            <Box key={stat.stat.name} sx={{ mb: 2 }}>
              <Typography sx={{ textTransform: "capitalize" }}>
                {stat.stat.name}: {stat.base_stat}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={Math.min((stat.base_stat / 150) * 100, 100)}
                color="warning"
                sx={{
                  height: 10,
                  borderRadius: 5,
                  mt: 0.5,
                }}
              />
            </Box>
          ))}

          {/* สายวิวัฒนาการ */}
          <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }} gutterBottom>
            สายวิวัฒนาการ (Evolution)
          </Typography>

          <Box sx={{ mb: 3 }}>
            {evolution.map((evo) => (
              <Chip
                key={evo}
                label={evo}
                color={evo === pokemon.name ? "error" : "success"}
                variant={evo === pokemon.name ? "contained" : "outlined"}
                sx={{
                  mr: 1,
                  mb: 1,
                  textTransform: "capitalize",
                  fontWeight: "bold",
                }}
              />
            ))}
          </Box>

          {/* เสียงร้อง */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
            เสียงร้อง (Pokémon Cry)
          </Typography>

          <audio
            key={pokemon.id}
            controls
            style={{
              width: "100%",
              marginTop: 10,
            }}
          >
            <source src={pokemon.cries.latest} type="audio/ogg" />
            เบราว์เซอร์ของคุณไม่รองรับการเล่นไฟล์เสียง
          </audio>

          {/* ปุ่มกลับหน้าหลัก */}
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
              sx={{ fontWeight: "bold", borderRadius: 2 }}
            >
              กลับสู่หน้าหลัก (Back to Pokédex)
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}