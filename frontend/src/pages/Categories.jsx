import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", type: "" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get("http://localhost:5000/api/categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error("Error fetching categories:", err.message));
    };

    const handleSaveCategory = () => {
        axios.post("http://localhost:5000/api/categories", newCategory)
            .then(() => {
                fetchCategories();
                setOpenDialog(false);
                setNewCategory({ name: "", type: "" });
            })
            .catch(err => console.error("Error adding category:", err.message));
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            axios.delete(`http://localhost:5000/api/categories/${id}`)
                .then(fetchCategories)
                .catch(err => console.error("Error deleting category:", err.message));
        }
    };

    return (
        <Container>
            <h2>Manage Categories</h2>

            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                + Add Category
            </Button>

            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map(category => (
                            <TableRow key={category._id}>
                                <TableCell>{category._id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.type}</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDeleteCategory(category._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Category Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                <Select
                    fullWidth
                    value={newCategory.type}
                    onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                    style={{ marginBottom: 10 }}
                >
                    <MenuItem value="Client">Client</MenuItem>
                    <MenuItem value="Plan">Plan</MenuItem>
                    <MenuItem value="Group">Group</MenuItem>
                    <MenuItem value="Team">Team</MenuItem>
                    <MenuItem value="Service">Service</MenuItem>
                    <MenuItem value="Password">Password</MenuItem>
                </Select>

                <TextField
                    label="Category Name"
                    fullWidth
                    required
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveCategory} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Categories;
