import { Container, Stack} from "@chakra-ui/react";
import { Routes, Route, Link as RouterLink, Navigate } from "react-router-dom";
import HotelsListPage from "./features/hotels/feature/list/list-hotels/HotelsListPage";
import HotelViewPage from "./features/hotels/feature/view/HotelViewPage";
import HotelCreatePage from "./features/hotels/feature/create/xx-create/HotelCreatePage";
import HotelUpdatePage from "./features/hotels/feature/update/HotelUpdatePage";

export default function App() {
  return (
    <Container py={8}>
      <Stack mb={6} direction="row" gap={4}>
      <RouterLink
        to="/hotels"
        style={{ textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        Hotels
      </RouterLink>

      <RouterLink
        to="/hotels/create"
        style={{ textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        Create
      </RouterLink>
      </Stack>
      <Routes>
        <Route path="/" element={<Navigate to="/hotels" replace />} />
        <Route path="/hotels" element={<HotelsListPage />} />
        <Route path="/hotels/create" element={<HotelCreatePage />} />
        <Route path="/hotels/:id" element={<HotelViewPage />} />
        <Route path="/hotels/:id/edit" element={<HotelUpdatePage />} />
      </Routes>
    </Container>
  );
}
