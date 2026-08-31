import { Route, Routes } from "react-router-dom"
import { AuthProvider, SiteProvider } from "./context"
import { Admin } from "./pages/Admin"
import { Home } from "./pages/Home"
import { ThemeProvider } from "./theme"

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </SiteProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
