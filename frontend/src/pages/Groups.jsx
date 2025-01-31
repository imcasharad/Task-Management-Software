import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, TextField, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [groupCategories, setGroupCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: "", category: "" });
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Groups
    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = () => {
        axios.get("http://localhost:5000/api/groups")
            .then((res) => {
                console.log("Groups fetched:", res.data);
                setGroups(res.data);
            })
            .catch((err) => console.error("Error fetching groups:", err.message));
    };

    // Fetch Group Categories
    useEffect(() => {
        axios.get("http://localhost:5000/api/categories")
            .then((res) => {
                const filteredCategories = res.data.filter(cat => cat.type === "Group");
                setGroupCategories(filteredCategories);
            })
            .catch((err) => console.error("Error fetching categories:", err.message));
    }, []);

    // Handle Add Group
    const handleAddGroup = () => {
        axios.post("http://localhost:5000/api/groups", newGroup)
            .then(() => {
                fetchGroups();
                setOpenDialog(false);
                setNewGroup({ name: "", category: "" });
            })
            .catch((err) => console.error("Error adding group:", err.message));
    };

    return (
        <Container>
            <h2>Groups</h2>

            {/* Search Bar */}
            <TextField
                label="Search Groups"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 10 }}
            />

            {/* Add Group Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                style={{ marginBottom: "10px" }}
            >
                + Add Group
            </Button>

            {/* Groups Table */}
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Group ID</TableCell>
                            <TableCell>Group Name</TableCell>
                            <TableCell>Group Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No groups found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            groups
                                .filter((group) =>
                                    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (group.category && group.category.toLowerCase().includes(searchQuery.toLowerCase()))
                                )
                                .map((group) => (
                                    <TableRow key={group._id}>
                                        <TableCell>{group._id}</TableCell>
                                        <TableCell>{group.name}</TableCell>
                                        <TableCell>{group.category || "N/A"}</TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>


                </Table>
            </TableContainer>

            {/* Add Group Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Group Name"
                        fullWidth
                        required
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                        style={{ marginBottom: 10 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Group Category (Optional)</InputLabel>
                        <Select
                            value={newGroup.category}
                            onChange={(e) => setNewGroup({ ...newGroup, category: e.target.value })}
                            displayEmpty
                        >
                            <MenuItem value="">No Category</MenuItem>
                            {groupCategories.map((cat) => (
                                <MenuItem key={cat._id} value={cat.name}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddGroup} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Groups;
