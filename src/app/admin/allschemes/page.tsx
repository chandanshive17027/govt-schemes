"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Scheme {
  id: string;
  name: string;
  ministry?: string;
  state?: string;
  tags?: string[];
}

const AllSchemesPage = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [ministryFilter, setMinistryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [occupationFilter, setOccupationFilter] = useState("");
  const [casteFilter, setCasteFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // edit dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Scheme>>({});

  const fetchSchemes = async () => {
    const params = new URLSearchParams({
      search,
      page: page.toString(),
      limit: limit.toString(),
      state: stateFilter,
      ministry: ministryFilter,
      gender: genderFilter,
      occupation: occupationFilter,
      caste: casteFilter,
    });

    try {
      const res = await fetch(`/api/schemes/list?${params.toString()}`);
      const data = await res.json();
      setSchemes(data.schemes);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch schemes whenever page changes
  useEffect(() => {
    fetchSchemes();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Apply filters function
  const applyFilters = () => {
    setPage(1); // reset page to 1
    fetchSchemes();
  };

  // Edit scheme
  const handleEditClick = (scheme: Scheme) => {
    setFormData(scheme);
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    if (!formData.id) return;

    try {
      await fetch(`/api/schemes/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsDialogOpen(false);
      fetchSchemes();
    } catch (err) {
      console.error("Error updating scheme:", err);
    }
  };

  const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this scheme?")) return;

  try {
    const res = await fetch(`/api/schemes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete");
    }
    setSchemes((prev) => prev.filter((s) => s.id !== id));
  } catch (err: any) {
    console.error("Error deleting scheme:", err.message);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Schemes</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Filters */}
        <Card className="w-full lg:w-64 flex-shrink-0 max-h-max">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              placeholder="State"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            />
            <Input
              placeholder="Ministry"
              value={ministryFilter}
              onChange={(e) => setMinistryFilter(e.target.value)}
            />
            <Input
              placeholder="Gender"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            />
            <Input
              placeholder="Occupation"
              value={occupationFilter}
              onChange={(e) => setOccupationFilter(e.target.value)}
            />
            <Input
              placeholder="Caste"
              value={casteFilter}
              onChange={(e) => setCasteFilter(e.target.value)}
            />
            <Button onClick={applyFilters} className="mt-2">
              Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Right: Schemes + Pagination */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            {schemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="border hover:shadow-lg transition"
              >
                <CardHeader className="">
                  <CardTitle className="text-sm">{scheme.name}</CardTitle>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEditClick(scheme)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit Scheme"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(scheme.id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete Scheme"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-gray-600 space-y-1">
                  <div>
                    {scheme.ministry && <p>Ministry: {scheme.ministry}</p>}
                    {scheme.state && <p>State: {scheme.state}</p>}
                    {scheme.tags && scheme.tags.length > 0 && (
                      <p>Tags: {scheme.tags.join(", ")}</p>
                    )}
                  </div>
                  
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination centered */}
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>

                {pageNumbers.map((num, idx) => {
                  if (
                    num === 1 ||
                    num === totalPages ||
                    (num >= page - 1 && num <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          href="#"
                          isActive={num === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(num);
                          }}
                        >
                          {num}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (num === page - 2 && page > 3) ||
                    (num === page + 2 && page < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={idx}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Scheme</DialogTitle>
            <DialogDescription>
              Update scheme details below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Ministry</label>
              <Input
                name="ministry"
                value={formData.ministry || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">State</label>
              <Input
                name="state"
                value={formData.state || ""}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllSchemesPage;
