"use client";

import { useEffect, useState } from "react";
import { Organization, orgApi } from "@/utils/api";
import OrgHeader from "./OrgHeader";
import OrgStats from "./OrgStats";
import OrgTable from "./OrgTable";
import OrgCreateModal from "./OrgCreateModal";
import OrgChatPage from "./OrgChatPage";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [activeChat, setActiveChat] = useState<Organization | null>(null);

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await orgApi.getMyOrganizations();
      const mapped = (Array.isArray(res) ? res : []).map((o: any) => ({
        ...o,
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

  const handleDelete = async (id: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this organization?")) return;
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

  // ── Chat view — no wrapper div, OrgChatPage owns its own height via calc ──
  if (activeChat) {
    const resolvedOrgId = activeChat.orgId ?? activeChat.id;
    if (!resolvedOrgId) {
      return null;
    }

    return (
      <OrgChatPage
        orgId={resolvedOrgId}
        orgName={activeChat.orgName}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  // ── Organizations list ──
  // ── Organizations list ──
return (
  <div className="min-h-screen w-full flex flex-col bg-[var(--color-background-tertiary)]">
    <OrgHeader onNew={() => { setShowModal(true); setCreateError(""); }} />
    <div className="flex flex-col flex-1 px-8 py-6 gap-6">
      <OrgStats orgs={orgs} loading={loading} />
      <OrgTable
        orgs={orgs}
        loading={loading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onDelete={handleDelete}
        onViewChat={(org) => setActiveChat(org)}
      />
    </div>
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