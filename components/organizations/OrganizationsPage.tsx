"use client";

import { useEffect, useState } from "react";
import { Organization, orgApi } from "@/utils/api";
import OrgHeader from "./OrgHeader";
import OrgStats from "./OrgStats";
import OrgTable from "./OrgTable";
import OrgCreateModal from "./OrgCreateModal";


export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

const fetchOrgs = async () => {
  try {
    setLoading(true);
    const res = await orgApi.getMyOrganizations();
    const mapped = (Array.isArray(res) ? res : []).map((o: any) => ({
      ...o,
      // Prisma returns 'orgId'. We map it to 'id' for the frontend state.
      id: o.orgId, 
      memberCount: o._count?.users ?? 0,
    }));
    setOrgs(mapped);
  } catch {
    setError("Failed to load organizations.");
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id: number) => { // Use 'id' as the param name
  if (!id) return;
  if (!confirm("Are you sure?")) return;

  try {
    await orgApi.deleteOrganization(id);
    await fetchOrgs();
  } catch (err: any) {
    setError(err?.message || "Failed to delete organization.");
  }
};

  useEffect(() => { fetchOrgs(); }, []);

  const handleCreate = async () => {
    if (!newOrgName.trim()) {
      setCreateError("Organization name is required.");
      return;
    }
    try {
      setCreating(true);
      setCreateError("");
      await orgApi.createOrganization(newOrgName.trim());
      setNewOrgName("");
      setShowModal(false);
      await fetchOrgs();
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create organization.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <OrgHeader onNew={() => { setShowModal(true); setCreateError(""); }} />
      <OrgStats orgs={orgs} loading={loading} />
     <OrgTable
  orgs={orgs}
  loading={loading}
  error={error}
  search={search}
  onSearchChange={setSearch}
  onDelete={handleDelete}
/>
      <OrgCreateModal
        show={showModal}
        orgName={newOrgName}
        creating={creating}
        error={createError}
        onChange={setNewOrgName}
        onCreate={handleCreate}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}