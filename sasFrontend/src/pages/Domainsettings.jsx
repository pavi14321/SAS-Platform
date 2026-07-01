import { useState, useEffect, useCallback } from "react";
import {
  FaGlobe,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaCopy,
  FaSpinner,
  FaShieldAlt,
  FaLock,
  FaPlus,
  FaTrash,
  FaChevronRight,
  FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../utils/api";

const REGISTRARS = [
  { name: "GoDaddy", url: "https://godaddy.com", logo: "GD" },
  { name: "Namecheap", url: "https://namecheap.com", logo: "NC" },
  { name: "Cloudflare", url: "https://cloudflare.com", logo: "CF" },
  { name: "Google Domains", url: "https://domains.google", logo: "GG" },
];

const STATUS = { idle: "idle", checking: "checking", active: "active", error: "error" };

export default function DomainSettings() {
  const [tab, setTab] = useState("overview"); // overview | connect | buy
  const [customDomain, setCustomDomain] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(STATUS.idle);
  const [verifyError, setVerifyError] = useState("");
  const [connectedDomains, setConnectedDomains] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [dnsRecords, setDnsRecords] = useState([]);
  const [freeSubdomain, setFreeSubdomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // domain id currently being verified/removed

  // ── initial load: store subdomain, DNS records, connected domains ──
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [storeRes, dnsRes, domainsRes] = await Promise.all([
        api.get("/store"),
        api.get("/domains/dns-records"),
        api.get("/domains"),
      ]);
      setFreeSubdomain(`${storeRes.data.subdomain}.yoursaas.com`);
      setDnsRecords(dnsRes.data);
      setConnectedDomains(domainsRes.data.filter((d) => d.type === "custom"));
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load domain settings."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── real-time-ish verification: silently re-check any pending domain
  // every 15s so the badge flips to "active" without the user clicking
  // anything. Stops automatically once nothing is pending. ──
  const pendingIds = connectedDomains.filter((d) => d.status !== "active").map((d) => d.id);
  const pendingKey = pendingIds.join(",");

  useEffect(() => {
    if (!pendingIds.length) return;

    const interval = setInterval(async () => {
      for (const id of pendingIds) {
        try {
          const { data } = await api.post(`/domains/${id}/verify`);
          setConnectedDomains((prev) => prev.map((d) => (d.id === id ? data : d)));
          if (data.dns_ok) toast.success(`${data.domain} is now verified!`);
        } catch {
          // silent — this is a background poll, don't spam error toasts
        }
      }
    }, 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey]);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isValidDomain = (d) =>
    /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63})*\.[A-Za-z]{2,}$/.test(
      d.replace(/^https?:\/\//, "").replace(/\/$/, "")
    );

  const handleVerify = async () => {
    const cleaned = customDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!isValidDomain(cleaned)) {
      setVerifyError("Enter a valid domain like yourbusiness.com or www.yourbusiness.com");
      return;
    }
    setVerifyError("");
    setVerifyStatus(STATUS.checking);

    try {
      const { data } = await api.post("/domains/connect", { domain: cleaned });

      if (data.dns_error) {
        setVerifyStatus(STATUS.error);
        setVerifyError(data.message);
        // still record it in the list — backend already saved it as "error"
        setConnectedDomains((prev) => [...prev.filter((d) => d.domain !== cleaned), data]);
        return;
      }

      setConnectedDomains((prev) => [...prev.filter((d) => d.domain !== cleaned), data]);
      setVerifyStatus(STATUS.active);
      setCustomDomain("");
      toast.success(data.message || "Domain connected successfully!");
      setTab("overview");
    } catch (err) {
      setVerifyStatus(STATUS.error);
      setVerifyError(getErrorMessage(err, "Couldn't connect domain. Please try again."));
    }
  };

  const handleRecheck = async (id) => {
    setBusyId(id);
    try {
      const { data } = await api.post(`/domains/${id}/verify`);
      setConnectedDomains((prev) => prev.map((d) => (d.id === id ? data : d)));
      toast[data.dns_ok ? "success" : "error"](
        data.dns_ok ? "DNS verified — domain is active" : "DNS records still not found"
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't re-check DNS."));
    } finally {
      setBusyId(null);
    }
  };

  const removeDomain = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/domains/${id}`);
      setConnectedDomains((prev) => prev.filter((d) => d.id !== id));
      toast.success("Domain removed");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't remove domain."));
    } finally {
      setBusyId(null);
    }
  };

  const setPrimary = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/domains/${id}/primary`);
      setConnectedDomains((prev) =>
        prev.map((d) => ({ ...d, is_primary: d.id === id }))
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't set primary domain."));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center text-gray-400 gap-2">
        <FaSpinner className="animate-spin" /> Loading domain settings…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
          <span>Settings</span>
          <FaChevronRight size={10} />
          <span className="text-gray-700 font-medium">Domains</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Manage where your store is accessible on the web.
        </p>
      </div>

      {/* Free subdomain card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 mt-0.5">
            <FaGlobe size={15} className="text-green-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">{freeSubdomain}</p>
              <span className="bg-green-100 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                Free
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">
              Your default store address — always active and free.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <FaCheckCircle className="text-green-500" size={14} />
          <span className="text-xs text-green-600 font-medium">Active</span>
          <a
            href={`https://${freeSubdomain}`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 text-gray-400 hover:text-gray-700"
          >
            <FaExternalLinkAlt size={12} />
          </a>
        </div>
      </div>

      {/* Custom domains list */}
      {connectedDomains.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 mb-6 overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 text-sm">Custom domains</h2>
          </div>
          {connectedDomains.map((d) => (
            <div
              key={d.id}
              className="px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaLock
                  size={12}
                  className={d.ssl_active ? "text-green-500 shrink-0" : "text-gray-300 shrink-0"}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">{d.domain}</span>
                    {d.is_primary && (
                      <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                    {d.status === "active" ? (
                      <span className="flex items-center gap-1 text-[11px] text-green-600">
                        <FaShieldAlt size={9} /> SSL active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-amber-600">
                        <FaTimesCircle size={9} /> DNS pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {d.status === "active"
                      ? "Connected · DNS verified"
                      : "Waiting on DNS records · checking automatically every 15s"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {d.status !== "active" && (
                  <button
                    onClick={() => handleRecheck(d.id)}
                    disabled={busyId === d.id}
                    className="text-xs text-gray-600 hover:text-gray-800 font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {busyId === d.id ? "Checking…" : "Re-check DNS"}
                  </button>
                )}
                {!d.is_primary && d.status === "active" && (
                  <button
                    onClick={() => setPrimary(d.id)}
                    disabled={busyId === d.id}
                    className="text-xs text-green-600 hover:text-green-700 font-medium border border-green-200 rounded-lg px-3 py-1.5 hover:bg-green-50 transition disabled:opacity-50"
                  >
                    Set primary
                  </button>
                )}
                <button
                  onClick={() => removeDomain(d.id)}
                  disabled={busyId === d.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => { setTab("connect"); setVerifyStatus(STATUS.idle); setVerifyError(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            tab === "connect"
              ? "bg-[#071311] text-white border-transparent"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }`}
        >
          <FaGlobe size={13} /> Connect existing domain
        </button>
        <button
          onClick={() => setTab("buy")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
            tab === "buy"
              ? "bg-[#071311] text-white border-transparent"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
          }`}
        >
          <FaPlus size={12} /> Buy a new domain
        </button>
      </div>

      {/* ── Connect existing domain panel ────────────────────────── */}
      {tab === "connect" && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">Connect your domain</h2>
            <p className="text-gray-500 text-sm mt-1">
              Already own a domain? Point it here in 3 steps.
            </p>
          </div>

          {/* Step 1 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#071311] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm mb-3">
                  Enter your domain
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => {
                      setCustomDomain(e.target.value);
                      setVerifyStatus(STATUS.idle);
                      setVerifyError("");
                    }}
                    placeholder="yourbusiness.com"
                    className={`flex-1 border rounded-xl px-4 py-3 text-sm outline-none transition ${
                      verifyStatus === STATUS.error
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-green-600"
                    }`}
                  />
                </div>
                {verifyError && (
                  <p className="text-red-500 text-xs mt-2 flex items-start gap-1.5">
                    <FaTimesCircle size={11} className="mt-0.5 shrink-0" />
                    {verifyError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#071311] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm mb-1">
                  Add these DNS records at your registrar
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  Log in to wherever you bought your domain (GoDaddy, Namecheap, Cloudflare, etc.) and add the following records:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                        <th className="px-4 py-3 text-left font-semibold">Type</th>
                        <th className="px-4 py-3 text-left font-semibold">Name</th>
                        <th className="px-4 py-3 text-left font-semibold">Value</th>
                        <th className="px-4 py-3 text-left font-semibold">TTL</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dnsRecords.map((rec, i) => (
                        <tr key={i} className="font-mono">
                          <td className="px-4 py-3">
                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-sans">
                              {rec.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 text-xs">{rec.name}</td>
                          <td className="px-4 py-3 text-gray-700 text-xs break-all">{rec.value}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{rec.ttl}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => copy(rec.value, `rec-${i}`)}
                              className="text-gray-400 hover:text-gray-700 transition"
                            >
                              {copiedKey === `rec-${i}` ? (
                                <FaCheckCircle size={13} className="text-green-500" />
                              ) : (
                                <FaCopy size={13} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex gap-2 text-xs text-amber-700">
                  <FaInfoCircle size={12} className="mt-0.5 shrink-0" />
                  DNS changes can take up to 48 hours to propagate worldwide, though most update within minutes.
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#071311] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm mb-3">
                  Verify and connect
                </p>
                <button
                  onClick={handleVerify}
                  disabled={verifyStatus === STATUS.checking || !customDomain}
                  className="inline-flex items-center gap-2 bg-[#071311] hover:bg-gray-900 disabled:opacity-50 text-white font-semibold text-sm px-5 py-3 rounded-xl transition"
                >
                  {verifyStatus === STATUS.checking ? (
                    <>
                      <FaSpinner size={13} className="animate-spin" />
                      Checking DNS…
                    </>
                  ) : (
                    <>
                      <FaGlobe size={13} />
                      Verify & connect domain
                    </>
                  )}
                </button>
                {verifyStatus === STATUS.active && (
                  <p className="text-green-600 text-sm mt-3 flex items-center gap-1.5 font-medium">
                    <FaCheckCircle size={13} /> Domain connected! SSL is being provisioned automatically.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Buy a new domain panel ─────────────────────────────────── */}
      {tab === "buy" && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-base">Buy a new domain</h2>
            <p className="text-gray-500 text-sm mt-1">
              Search for and purchase a domain, then connect it here.
            </p>
          </div>

          <div className="p-6 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Search for a domain at a registrar
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {REGISTRARS.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center text-xs font-black text-gray-600 group-hover:text-green-700 transition">
                    {r.logo}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center">
                    {r.name}
                  </span>
                  <FaExternalLinkAlt size={9} className="text-gray-400 group-hover:text-green-600" />
                </a>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50/50">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <FaInfoCircle size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-800 mb-1">How it works</p>
                <ol className="space-y-1 text-xs text-gray-500 list-decimal list-inside">
                  <li>Buy your domain from any registrar above (typically ₹800–₹1,500/year).</li>
                  <li>Come back here and use <strong className="text-gray-700">Connect existing domain</strong>.</li>
                  <li>Follow the DNS instructions — we'll auto-provision your SSL certificate.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview empty state */}
      {tab === "overview" && connectedDomains.length === 0 && (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FaGlobe size={22} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-700">No custom domains yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Your store is running on <span className="font-mono text-gray-600">{freeSubdomain}</span>
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setTab("connect")}
              className="bg-[#071311] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-900 transition"
            >
              Connect a domain
            </button>
            <button
              onClick={() => setTab("buy")}
              className="border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition"
            >
              Buy a domain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}