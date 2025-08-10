import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
} from "@mui/material";
import BuilderPage from "./features/builder/BuilderPage";
import MyFormsPage from "./features/forms/MyFormsPage";
import PreviewPage from "./features/forms/PreviewPage";
import { Navigate } from "react-router-dom";

export default function App() {
  const navItems = [
    { label: "Builder", path: "/create" },
    { label: "My Forms", path: "/myforms" },
  ];

  return (
    <BrowserRouter>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            Form Builder
          </Typography>

          
          <Box>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "white",
                  mx: 1,
                  borderRadius: 2,
                  "&.active": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<BuilderPage />} />
          <Route path="/myforms" element={<MyFormsPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
