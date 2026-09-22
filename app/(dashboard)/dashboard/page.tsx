"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import CreateOrgModal from "@/components/organization/CreateOrgModal";
import JoinOrgModal from "@/components/organization/JoinOrgModal";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SearchBar from "@/components/dashboard/SearchBar";
import ActionCards from "@/components/dashboard/ActionCards";
import OrganizationGrid from "@/components/dashboard/OrganizationGrid";

interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  treasury: number;
  members: number;
  owner: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const fetchOrganizations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/organizations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data = await res.json();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <CreateOrgModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          fetchOrganizations();
        }}
      />

      <JoinOrgModal
        open={joinOpen}
        onClose={() => {
          setJoinOpen(false);
          fetchOrganizations();
        }}
      />

      <div className="space-y-8">
        <DashboardHeader />

        <SearchBar value={search} onChange={setSearch} />

        <ActionCards
          onCreate={() => setCreateOpen(true)}
          onJoin={() => setJoinOpen(true)}
        />

        <OrganizationGrid
          loading={loading}
          organizations={filteredOrganizations}
        />
      </div>
    </>
  );
}