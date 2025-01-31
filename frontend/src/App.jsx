import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import Groups from "./pages/Groups";  // ✅ Ensure Correct Path
import Clients from "./pages/Clients";
import Settings from "./pages/Settings";  // ✅ Import Settings Page
import Categories from "./pages/Categories";  // ✅ Import Categories Page

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/services" element={<h2>Services Page</h2>} />
                    <Route path="/plans" element={<h2>Plans Page</h2>} />
                    <Route path="/tasks" element={<h2>Tasks Page</h2>} />
                    <Route path="/team" element={<h2>Team Page</h2>} />
                    <Route path="/attendance" element={<h2>Attendance Page</h2>} />
                    <Route path="/pending-approvals" element={<h2>Pending Approvals Page</h2>} />
                    <Route path="/reminders" element={<h2>Reminders Page</h2>} />
                    <Route path="/settings" element={<Settings />} />  {/* ✅ Replaced placeholder with actual page */}
                    <Route path="/categories" element={<Categories />} />  {/* ✅ Added Manage Categories Page */}
                    <Route path="/bulk-import" element={<h2>Bulk Data Import Page</h2>} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
