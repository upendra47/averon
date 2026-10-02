"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { DataService } from "@/lib/data-service";
import { UserRole, AuditLog } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  History,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function ManageAdminsPage() {
  const { user, role } = useAuth();

  const [roles, setRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const isDeveloper = role === "developer";

  const loadData = async () => {
    try {
      const allRoles = await DataService.getUserRoles();
      setRoles(allRoles);
      const logs = await DataService.getAuditLogs();
      setAuditLogs(logs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeAdminCount = roles.filter((r) => r.role === "admin" && !r.revoked_at).length;
  const atAdminCap = activeAdminCount >= 3;

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const result = await DataService.grantUserRole("", newEmail.trim(), "admin");
    if (!result.success) {
      setStatusMsg(`❌ Error: ${result.error || "Failed to grant role."}`);
    } else {
      setStatusMsg(`Admin role successfully granted to ${newEmail.trim()}`);
      setNewEmail("");
      loadData();
    }
    setTimeout(() => setStatusMsg(""), 5000);
  };

  const handleRevoke = async (roleId: string, email?: string) => {
    if (confirm(`Revoke admin privileges for ${email || "this user"} immediately?`)) {
      const result = await DataService.revokeUserRole(roleId);
      if (!result.success) {
        setStatusMsg(`❌ Error: ${result.error || "Failed to revoke role."}`);
      } else {
        setStatusMsg(`Admin role revoked for ${email || "user"}. Access cancelled.`);
        loadData();
      }
      setTimeout(() => setStatusMsg(""), 5000);
    }
  };

  const handleReactivate = async (userId: string, email: string) => {
    const result = await DataService.grantUserRole(userId, email, "admin");
    if (!result.success) {
      setStatusMsg(`❌ Error: ${result.error || "Failed to restore role."}`);
    } else {
      setStatusMsg(`Admin privileges restored for ${email}`);
      loadData();
    }
    setTimeout(() => setStatusMsg(""), 5000);
  };

  if (!isDeveloper) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-brand-fg">Developer Only Area</h2>
        <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
          The Manage Admins console and role grant/revoke matrix can only be accessed by accounts with the <span className="font-bold text-black uppercase">DEVELOPER</span> role. Admins cannot promote or protect other accounts.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/admin"
            className="border border-brand-border px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Return to Admin Desk
          </Link>
          <Link
            href="/auth/login"
            className="bg-brand-cta text-brand-ctaFg px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider"
          >
            Switch to Developer Role
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pb-16">
      {/* §8.2 Persistent High-Contrast Developer Mode Banner */}
      <div className="bg-black border-b-2 border-brand-accent py-3 px-4 sm:px-8 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.2em]">
                DEVELOPER MODE ACTIVE
              </span>
              <span className="text-neutral-500">|</span>
              <span className="text-xs text-neutral-300 font-mono">
                Actor: {user?.email || "dev@averonrealty.com"} (Developer Console)
              </span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400">
            RLS Enforcement: Active (revoked_at IS NULL gate)
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-brand-muted hover:text-black mb-2 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Desk</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-fg">
              Manage Administrators & Role Governance
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Grant or revoke Admin capabilities with instant soft-revocation and continuous audit trail.
            </p>
          </div>

          <button
            onClick={loadData}
            className="border border-brand-border hover:border-black px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 text-brand-fg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh State</span>
          </button>
        </div>

        {/* Action Status Toast */}
        {statusMsg && (
          <div className={`p-4 border text-xs rounded-lg flex items-center gap-2 font-medium ${statusMsg.startsWith("❌") ? "bg-red-50 border-red-200 text-red-800" : "bg-green-50 border-green-200 text-green-800 animate-fadeIn"}`}>
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${statusMsg.startsWith("❌") ? "text-red-600" : "text-green-600"}`} />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Grant Admin Form Card */}
        <div className="bg-white border border-brand-border rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-accent" />
              <div>
                <h2 className="text-sm font-bold text-brand-fg uppercase tracking-wider">
                  Grant New Admin Role
                </h2>
                <p className="text-xs text-brand-muted">
                  Assign property creation, editing, and inquiry management access to a verified email.
                </p>
              </div>
            </div>
            {/* Active Admins counter */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-semibold ${atAdminCap ? "bg-red-50 border-red-200 text-red-700" : "bg-neutral-50 border-brand-border text-brand-fg"}`}>
              Active Admins: {activeAdminCount} / 3
              {atAdminCap && <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-red-600">Cap Reached</span>}
            </div>
          </div>

          {atAdminCap && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
              The maximum of 3 active admins has been reached. Revoke an existing admin role before granting a new one.
            </div>
          )}

          <form onSubmit={handleGrant} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <input
              type="email"
              required
              placeholder="Enter user email address (e.g. broker@averonrealty.com)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={atAdminCap}
              className="flex-1 px-3.5 py-2 text-xs bg-neutral-50 border border-brand-border rounded focus:bg-white focus:border-brand-accent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={atAdminCap}
              className="bg-brand-cta text-brand-ctaFg hover:bg-black transition-colors px-6 py-2 rounded text-xs font-bold uppercase tracking-wider shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-cta"
            >
              Grant Admin Role
            </button>
          </form>
        </div>

        {/* Current Roles Matrix Table */}
        <div className="bg-white border border-brand-border rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 bg-neutral-50 border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-fg">
                Active & Revoked Roles Matrix
              </h3>
            </div>
            <span className="text-[11px] text-brand-muted font-mono">
              Total Recorded: {roles.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-border bg-neutral-50/50 text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                  <th className="py-3 px-4">User / Email</th>
                  <th className="py-3 px-4">Role Assigned</th>
                  <th className="py-3 px-4">Granted At</th>
                  <th className="py-3 px-4">Access Status</th>
                  <th className="py-3 px-4 text-right">Revocation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {roles.map((r) => {
                  const isRevoked = !!r.revoked_at;
                  const isDevRole = r.role === "developer";

                  return (
                    <tr key={r.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-brand-fg">
                        <div className="flex items-center gap-2">
                          <span>{r.user_email || r.user_id}</span>
                          {isDevRole && (
                            <span className="text-[9px] bg-brand-accent/20 text-yellow-900 border border-brand-accent/40 px-1.5 py-0.2 rounded font-bold uppercase">
                              Immune
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            r.role === "developer"
                              ? "bg-black text-brand-accent"
                              : r.role === "admin"
                              ? "bg-neutral-800 text-white"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {r.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-brand-muted font-mono text-[11px]">
                        {new Date(r.granted_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        {isRevoked ? (
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase rounded border border-red-200">
                              Revoked
                            </span>
                            <span className="block text-[10px] text-neutral-400 font-mono">
                              at {new Date(r.revoked_at!).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded border border-green-200">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isDevRole ? (
                          <span className="text-[11px] text-neutral-400 italic">
                            Protected Developer Role
                          </span>
                        ) : isRevoked ? (
                          <button
                            onClick={() => handleReactivate(r.user_id, r.user_email || "")}
                            className="px-3 py-1 bg-white border border-brand-border hover:border-black text-brand-fg rounded text-[11px] font-semibold"
                          >
                            Restore Admin Access
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevoke(r.id, r.user_email)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            Revoke Role
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4 & 3.1: Immutable Audit Log Viewer */}
        <div className="bg-white border border-brand-border rounded-lg shadow-xs overflow-hidden space-y-3">
          <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-accent" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                System Audit Log (§4 Immutable Record)
              </h3>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              Actor & Target Enforced
            </span>
          </div>

          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-border text-[10px] uppercase font-bold text-brand-muted">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target Table</th>
                  <th className="py-2.5 px-3">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/70">
                    <td className="py-2.5 px-3 text-neutral-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-brand-fg font-semibold">
                      {log.actor_email || log.actor_id}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-black font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600">
                      {log.target_table}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700 max-w-sm truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
