import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, InputBase, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const pages = [
    { name: "Clients", path: "/clients" },
    { name: "Groups", path: "/groups" },
    { name: "Services", path: "/services" },
    { name: "Plans", path: "/plans" },
    { name: "Tasks", path: "/tasks" },
    { name: "Team", path: "/team" },
    { name: "Attendance", path: "/attendance" },
    { name: "Pending Approvals", path: "/pending-approvals" },
    { name: "Reminders", path: "/reminders" },
    { name: "Settings", path: "/settings" },
    { name: "Bulk Data Import", path: "/bulk-import" },
];

// Custom styling for search bar
const SearchContainer = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: "5px 10px",
    display: "flex",
    alignItems: "center",
    width: "100%",
}));

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}>
                <Toolbar />
                <List>
                    {pages.map((page, index) => (
                        <ListItem disablePadding key={index} onClick={() => navigate(page.path)}>
                            <ListItemText primary={page.name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* Top Bar */}
                <AppBar position="static" sx={{ mb: 2 }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Task Management System
                        </Typography>

                        {/* Global Search */}
                        <SearchContainer>
                            <SearchIcon />
                            <InputBase
                                placeholder="Search..."
                                sx={{ marginLeft: 1, flex: 1 }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </SearchContainer>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default Dashboard;
