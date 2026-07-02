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
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
      home?: {
        front_default: string | null;
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
  cries?: {
    latest?: string;
  };
}

const TYPE_TRANSLATIONS: { [key: string]: string } = {
  normal: "ทั่วไป",
  fire: "ไฟ",
  water: "น้ำ",
  grass: "พืช",
  electric: "ไฟฟ้า",
  ice: "น้ำแข็ง",
  fighting: "ต่อสู้",
  poison: "พิษ",
  ground: "ดิน",
  flying: "บิน",
  psychic: "พลังจิต",
  bug: "แมลง",
  rock: "หิน",
  ghost: "ผี",
  dragon: "มังกร",
  dark: "มืด",
  steel: "เหล็ก",
  fairy: "แฟรี่",
};

const TYPE_COLORS: { [key: string]: string } = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemonname: string }>;
}) {
  const { pokemonname } = use(params);
  const router = useRouter();

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [evolution, setEvolution] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false); 

  const statNameTH: { [key: string]: string } = {
    hp: "พลังชีวิต (HP)",
    attack: "พลังโจมตี (Attack)",
    defense: "พลังป้องกัน (Defense)",
    "special-attack": "โจมตีพิเศษ (Sp. Atk)",
    "special-defense": "ป้องกันพิเศษ (Sp. Def)",
    speed: "ความเร็ว (Speed)"
  };

  const getStatColor = (statName: string) => {
    switch (statName.toLowerCase()) {
      case "hp": return "success"; 
      case "attack": return "error"; 
      case "defense": return "primary"; 
      case "speed": return "secondary"; 
      default: return "warning"; 
    }
  };

  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);
      setError(false);
      try {
        const cleanName = pokemonname.trim().toLowerCase();
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanName}`);
        
        if (!pokemonRes.ok) throw new Error("ไม่พบข้อมูลโปเกมอน");
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        if (pokemonData?.species?.url) {
          const speciesRes = await fetch(pokemonData.species.url);
          if (speciesRes.ok) {
            const speciesData = await speciesRes.json();
            if (speciesData?.evolution_chain?.url) {
              const evolutionRes = await fetch(speciesData.evolution_chain.url);
              if (evolutionRes.ok) {
                const evolutionData = await evolutionRes.json();
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
          setEvolution([pokemonData.name]);
        }
      } catch (err) {
        console.error("Error loading Pokémon data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadPokemon();
  }, [pokemonname]);

  const handleNavigate = (targetId: number) => {
    if (targetId < 1) return;
    router.push(`/pokemon/${targetId}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: 850, mx: "auto", mt: 5, backgroundColor: "#fbf8eb", borderRadius: 4 }}>
        <Skeleton variant="text" width={220} height={60} sx={{ mx: "auto", mb: 3 }} />
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 4 }} />
          </Box>
          <Box sx={{ flex: 1.5 }}>
            <Skeleton variant="text" height={30} width="40%" />
            <Skeleton variant="text" height={20} sx={{ my: 1 }} />
            <Skeleton variant="text" height={30} width="50%" sx={{ mt: 3 }} />
            {[1, 2, 3, 4].map((n) => <Skeleton key={n} variant="text" height={20} sx={{ mt: 1 }} />)}
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !pokemon) {
    return (
      <Box sx={{ backgroundColor: "#fbf8eb", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#e33d3d", textAlign: "center" }}>
          ❌ ไม่พบข้อมูลของโปเกมอนตัวนี้
        </Typography>
        <Typography sx={{ color: "text.secondary", textAlign: "center", maxWidth: 400 }}>
          ไม่สามารถดึงข้อมูลของ "{pokemonname}" ได้ อาจเป็นร่างพิเศษที่ไม่มีฐานข้อมูลแยกเฉพาะ หรือระบุชื่อไม่ถูกต้อง
        </Typography>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="error" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 3, fontWeight: "bold", mt: 1 }}>
            กลับสู่หน้าหลัก
          </Button>
        </Link>
      </Box>
    );
  }

  // ลำดับการหาภาพที่ปลอดภัย (Fallback Image Logic) ป้องกันรูปแตก 100%
  const pokemonImage =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default ||
    "https://via.placeholder.com/350?text=No+Image";

  return (
    <Box sx={{ backgroundColor: "#fbf8eb", minHeight: "100vh", display: "flex", alignItems: "center", py: 5, px: 2 }}>
      <Card sx={{ maxWidth: 950, width: "100%", mx: "auto", borderRadius: 6, boxShadow: "0px 10px 35px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          
          {/* ส่วนหัวคุมการนำทางระดับ ID */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<NavigateBeforeIcon />}
              disabled={pokemon.id <= 1}
              onClick={() => handleNavigate(pokemon.id - 1)}
              sx={{ fontWeight: "bold", borderRadius: 2.5, width: { xs: "100%", sm: "auto" } }}
            >
              ก่อนหน้า
            </Button>

            <Typography variant="h4" align="center" sx={{ fontWeight: "900", textTransform: "capitalize", color: "#e33d3d", order: { xs: -1, sm: 0 } }}>
              {pokemon.name} <Box component="span" sx={{ color: "#b0bec5", ml: 0.5 }}>#{String(pokemon.id).padStart(3, "0")}</Box>
            </Typography>

            <Button
              variant="outlined"
              color="error"
              endIcon={<NavigateNextIcon />}
              onClick={() => handleNavigate(pokemon.id + 1)}
              sx={{ fontWeight: "bold", borderRadius: 2.5, width: { xs: "100%", sm: "auto" } }}
            >
              ถัดไป
            </Button>
          </Box>

          {/* ปรับมาใช้ Flexbox จัดเลย์เอาต์ ป้องกัน Layout พังและแก้ Error เคลียร์เส้นแดง */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 5, alignItems: "center" }}>
            
            {/* กล่องแสดงรูปฝั่งซ้าย */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", width: "100%" }}>
              <Box
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: 5,
                  p: 3,
                  width: "100%",
                  maxWidth: 340,
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.02)",
                  border: "1px solid rgba(0,0,0,0.03)"
                }}
              >
                <Box
                  component="img"
                  src={pokemonImage}
                  alt={pokemon.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.08))"
                  }}
                />
              </Box>
            </Box>

            {/* กล่องแสดงข้อมูลฝั่งขวา */}
            <Box sx={{ flex: 1.4, width: "100%", display: "flex", flexDirection: "column", gap: 3.5 }}>
              
              {/* ธาตุ */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "800", color: "#2c3e50", mb: 1, letterSpacing: "0.5px" }}>
                  ประเภท (Type)
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {pokemon.types.map((type) => {
                    const typeKey = type.type.name.toLowerCase();
                    const badgeColor = TYPE_COLORS[typeKey] || "#757575";
                    const thaiType = TYPE_TRANSLATIONS[typeKey] || type.type.name;
                    return (
                      <Chip
                        key={type.type.name}
                        label={thaiType}
                        sx={{
                          fontWeight: "bold",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          backgroundColor: badgeColor,
                          color: "#ffffff",
                          px: 1,
                          boxShadow: "0px 2px 6px rgba(0,0,0,0.08)"
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              {/* สเตตัสพื้นฐาน */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "800", color: "#2c3e50", mb: 1.5, letterSpacing: "0.5px" }}>
                  ค่าพลังพื้นฐาน (Stats)
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {pokemon.stats.map((stat) => {
                    const currentStatName = stat.stat.name.toLowerCase();
                    const displayName = statNameTH[currentStatName] || stat.stat.name.toUpperCase();
                    return (
                      <Box key={stat.stat.name}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                          <Typography sx={{ fontWeight: "600", fontSize: "0.85rem", color: "#555" }}>
                            {displayName}
                          </Typography>
                          <Typography sx={{ fontWeight: "700", fontSize: "0.85rem", color: "#2c3e50" }}>
                            {stat.base_stat}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((stat.base_stat / 160) * 100, 100)}
                          color={getStatColor(stat.stat.name)} 
                          sx={{
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: "rgba(0,0,0,0.04)"
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* สายวิวัฒนาการ */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "800", color: "#2c3e50", mb: 1, letterSpacing: "0.5px" }}>
                  สายวิวัฒนาการ (Evolution Chain)
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {evolution.map((evo) => (
                    <Link key={evo} href={`/pokemon/${evo}`} style={{ textDecoration: "none" }}>
                      <Chip
                        label={evo === pokemon.name ? `${evo} (ปัจจุบัน)` : evo}
                        color={evo === pokemon.name ? "error" : "default"}
                        variant={evo === pokemon.name ? "filled" : "outlined"}
                        clickable={evo !== pokemon.name}
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          border: evo !== pokemon.name ? "1px solid #ccc" : undefined,
                          "&:hover": evo !== pokemon.name ? { backgroundColor: "#f5f5f5" } : {}
                        }}
                      />
                    </Link>
                  ))}
                </Box>
              </Box>

              {/* เสียงร้อง */}
              {pokemon.cries?.latest && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <VolumeUpIcon sx={{ color: "#e33d3d", fontSize: "1.2rem" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: "800", color: "#2c3e50", letterSpacing: "0.5px" }}>
                      เสียงร้อง (Pokémon Cry)
                    </Typography>
                  </Box>
                  <audio
                    key={pokemon.id}
                    controls
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: "8px",
                      backgroundColor: "#f1f3f4"
                    }}
                  >
                    <source src={pokemon.cries.latest} type="audio/ogg" />
                    เบราว์เซอร์ของคุณไม่รองรับการเล่นไฟล์เสียงนี้
                  </audio>
                </Box>
              )}

            </Box>
          </Box>

          {/* ปุ่มย้อนกลับฐานล่าง */}
          <Box sx={{ textAlign: "center", mt: 5, pt: 2, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  fontWeight: "bold", 
                  borderRadius: 3, 
                  px: 4, 
                  py: 1,
                  boxShadow: "0px 4px 15px rgba(227, 61, 61, 0.2)",
                  "&:hover": { backgroundColor: "#c62828" }
                }}
              >
                กลับสู่หน้าสมุดภาพหลัก
              </Button>
            </Link>
          </Box>
          
        </CardContent>
      </Card>
    </Box>
  );
}