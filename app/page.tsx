"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  TextField, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  InputAdornment, 
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Pagination,
  Skeleton,
  Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import Link from "next/link";

interface PokemonData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

// แผนผังแปลภาษาจากอังกฤษเป็นไทยสำหรับการแสดงผล
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

const POKEMON_TYPES = Object.keys(TYPE_TRANSLATIONS);

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

export default function HomePage() {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 24; 

  useEffect(() => {
    async function fetchAllPokemon() {
      setLoading(true);
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1351");
        const data = await res.json();
        
        const detailedFetches = data.results.map(async (p: any) => {
          const detailRes = await fetch(p.url);
          const detailData = await detailRes.json();
          return {
            id: detailData.id,
            name: detailData.name,
            image: detailData.sprites.other["official-artwork"].front_default,
            types: detailData.types.map((t: any) => t.type.name)
          };
        });

        const results = await Promise.all(detailedFetches);
        setPokemonList(results);
      } catch (err) {
        console.error("Error fetching pokemon list:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedType]);

  const filteredPokemon = pokemonList.filter((pokemon) => {
    const query = searchQuery.trim().toLowerCase();
    
    const matchesName = pokemon.name.toLowerCase().includes(query);
    const matchesId = pokemon.id.toString().includes(query) || 
                      `#${String(pokemon.id).padStart(3, "0")}`.includes(query);

    const matchesSearch = query === "" || matchesName || matchesId;
    const matchesType = selectedType === "all" || pokemon.types.includes(selectedType);
    
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage); 
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPokemon = filteredPokemon.slice(startIndex, endIndex); 

  const formatPokemonId = (id: number) => {
    return `#${String(id).padStart(3, "0")}`;
  };

  return (
    <Box sx={{ backgroundColor: "#fbf8eb", minHeight: "100vh", pt: 6, pb: 8, px: 2 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        
        {/* ชื่อหัวข้อหลัก */}
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            fontWeight: "800", 
            mb: 5, 
            color: "#e33d3d",
            letterSpacing: "-0.5px"
          }}
        >
          Pokédex ออนไลน์
        </Typography>

        {/* 🎨 ตกแต่งใหม่: แคปซูลควบคุมแบบมินิมอลโมเดิร์น (หมดปัญหาตัวหนังสือซ้อนทับกัน) */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: 750,
            mx: "auto",
            mb: 6,
            p: "8px 12px",
            display: "flex",
            alignItems: "center",
            borderRadius: "50px", // เปลี่ยนเป็นทรงแคปซูลโค้งมนพรีเมียม
            backgroundColor: "#ffffff",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* ส่วนกล่องค้นหาแบบไร้ขอบสี่เหลี่ยมดั้งเดิม */}
          <TextField
            fullWidth
            placeholder="ค้นหาชื่อ หรือเลขไอดีโปเกเด็กซ์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="standard" // เปลี่ยนเป็น standard เพื่อซ่อนกรอบป้องกันการซ้อนขี่กัน
            slotProps={{
              input: {
                disableUnderline: true, // ปิดเส้นใต้
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#e33d3d", ml: 1.5, mr: 0.5 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery("")} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            sx={{ px: 1 }}
          />

          {/* เส้นแบ่งกั้นระหว่างช่องค้นหากับตัวเลือกประเภท */}
          <Box sx={{ height: 28, width: "1px", backgroundColor: "rgba(0,0,0,0.1)", mx: 1.5 }} />

          {/* ส่วนเลือกประเภทที่ออกแบบใหม่ ให้คลีนและไม่มีปัญหา text overlap */}
          <FormControl variant="standard" sx={{ minWidth: 180, pr: 1 }}>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disableUnderline // ลบเส้นใต้ออกเพื่อให้กลมกลืนในแคปซูล
              displayEmpty
              IconComponent={FilterListIcon} // เปลี่ยนไอคอนลูกศรเป็นไอคอนฟิลเตอร์เก๋ๆ
              sx={{
                textTransform: "capitalize",
                fontWeight: "600",
                color: selectedType === "all" ? "text.secondary" : "#e33d3d",
                fontSize: "0.95rem",
                "& .MuiSelect-select": {
                  pl: 1,
                  pr: "24px !important",
                  py: 1,
                  display: "flex",
                  alignItems: "center"
                }
              }}
            >
              <MenuItem value="all">
                <span style={{ fontWeight: 500 }}>ประเภททั้งหมด</span>
              </MenuItem>
              {POKEMON_TYPES.map((type) => (
                <MenuItem key={type} value={type} sx={{ fontWeight: "600" }}>
                  ธาตุ{TYPE_TRANSLATIONS[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* โซนแสดงผลการ์ดโปเกมอน */}
        {loading ? (
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid key={index} sx={{ display: "flex", justifyContent: "center", p: 1.5 }}>
                <Box sx={{ width: 220, p: 2, bgcolor: "#fff", borderRadius: 5 }}>
                  <Skeleton variant="text" width="40%" sx={{ ml: "auto" }} />
                  <Skeleton variant="rectangular" height={115} sx={{ my: 2, borderRadius: 2 }} />
                  <Skeleton variant="text" width="80%" sx={{ mx: "auto" }} />
                  <Skeleton variant="text" width="60%" sx={{ mx: "auto", mt: 1 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={3} sx={{ justifyContent: "center", alignItems: "stretch" }}>
              {paginatedPokemon.length > 0 ? (
                paginatedPokemon.map((pokemon) => (
                  <Grid key={pokemon.name} sx={{ display: "flex", justifyContent: "center", p: 1.5 }}>
                    <Link href={`/pokemon/${pokemon.name}`} style={{ display: "flex", textDecoration: "none", width: "100%", maxWidth: 220 }}>
                      
                      <Card 
                        sx={{ 
                          width: 220,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between", 
                          borderRadius: 5, 
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.02)", 
                          border: "1px solid rgba(0,0,0,0.01)",
                          transition: "all 0.25s ease-in-out", 
                          "&:hover": { 
                            transform: "translateY(-6px)", 
                            boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.06)" 
                          } 
                        }}
                      >
                        <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", textAlign: "center", pt: 2, pb: "20px !important" }}>
                          
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: "700", 
                              color: "#b0bec5", 
                              display: "block",
                              textAlign: "right",
                              pr: 1,
                              fontSize: "0.85rem"
                            }}
                          >
                            {formatPokemonId(pokemon.id)}
                          </Typography>

                          <Box sx={{ height: 115, display: "flex", alignItems: "center", justifyContent: "center", my: 1 }}>
                            <Box 
                              component="img" 
                              src={pokemon.image || "https://via.placeholder.com/110"} 
                              alt={pokemon.name} 
                              sx={{ 
                                maxHeight: "100%", 
                                maxWidth: "100%",
                                objectFit: "contain",
                                filter: "drop-shadow(0px 6px 8px rgba(0,0,0,0.05))"
                              }} 
                            />
                          </Box>
                          
                          <Box sx={{ height: "3.2rem", display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                            <Typography 
                              sx={{ 
                                textTransform: "capitalize", 
                                fontWeight: "bold", 
                                fontSize: "1.1rem",
                                color: "#2c3e50",
                                lineHeight: "1.3rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                              }}
                            >
                              {pokemon.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0.5, mt: "auto" }}>
                            {pokemon.types.map((t) => {
                              const badgeColor = TYPE_COLORS[t.toLowerCase()] || "#757575";
                              const thaiType = TYPE_TRANSLATIONS[t.toLowerCase()] || t;
                              return (
                                <Chip 
                                  key={t} 
                                  label={thaiType} 
                                  size="small" 
                                  sx={{ 
                                    fontSize: "0.75rem", 
                                    fontWeight: "bold",
                                    borderRadius: "6px",
                                    backgroundColor: badgeColor,
                                    color: "#ffffff", 
                                    px: 0.8
                                  }} 
                                />
                              );
                            })}
                          </Box>

                        </CardContent>
                      </Card>

                    </Link>
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: "100%", py: 8 }}>
                  <Typography align="center" sx={{ color: "text.secondary", fontSize: "1.2rem" }}>
                    ❌ ไม่พบข้อมูลโปเกมอนที่คุณกำลังค้นหา
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* แถบเลือกหน้าถัดไป */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 7 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(event, value) => setPage(value)} 
                  color="error" 
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: "bold"
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}