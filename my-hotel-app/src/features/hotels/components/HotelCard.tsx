// src/features/hotels/components/HotelCard.tsx
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import type { Hotel } from "../domain/hotel";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const nav = useNavigate();

  // ✅ ΠΑΝΤΑ array – αν έρθει undefined/null, το κάνουμε []
  const amenities: string[] = Array.isArray(hotel.amenities) ? hotel.amenities : [];
  const shown = amenities.slice(0, 3);
  const extra = Math.max(0, amenities.length - shown.length);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        transition: "box-shadow 150ms",
        cursor: "pointer",
        "&:hover": { boxShadow: 4 },
      }}
      onClick={() => nav(`/hotels/${hotel.id}`)}
      role="link"
      aria-label={`Open ${hotel.name} details`}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {hotel.name}
        </Typography>

        {hotel.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 1.5,
            }}
          >
            {hotel.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ minHeight: 36 }}>
          {shown.map((a) => (
            <Chip key={a} label={a} size="small" />
          ))}
          {extra > 0 && <Chip label={`+${extra} more`} size="small" />}
        </Stack>
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        <Box sx={{ ml: "auto" }} />
        <Button
          component={RouterLink}
          to={`/hotels/${hotel.id}`}
          variant="contained"
          onClick={(e) => e.stopPropagation()}
          sx={{
            bgcolor: "common.black",
            color: "common.white",
            "&:hover": { bgcolor: "grey.900" },
            "&:active": { bgcolor: "grey.800" },
          }}
        >
          View Details
        </Button>

        <Button
          component={RouterLink}
          to={`/hotels/${hotel.id}/edit`}
          variant="contained"
          onClick={(e) => e.stopPropagation()}
          sx={{
            bgcolor: "#D1D0D0",
            color: "common.black",
            "&:hover": { bgcolor: "#bfbfbf" },
            "&:active": { bgcolor: "#a6a6a6" },
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
