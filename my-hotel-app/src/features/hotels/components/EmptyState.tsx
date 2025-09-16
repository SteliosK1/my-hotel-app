// src/features/hotels/components/EmptyState.tsx
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  text?: string;
};

export default function EmptyState({ text = "No hotels found." }: Props) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography>{text}</Typography>
    </Box>
  );
}
