'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  AIProviderSummary,
  AIRoutingConfig,
  AIUsageStats,
  ProviderHealthItem,
  ProviderModelInfo,
} from '@/types';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Layers,
  Loader2,
  Lock,
  RefreshCw,
  Save,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  X,
  Zap,
} from 'lucide-react';

export default function ApiKeysSettingsPage() {
  // Main Data States
  const [providers, setProviders] = useState<AIProviderSummary[]>([]);
  const [routingConfig, setRoutingConfig] = useState<AIRoutingConfig | null>(null);
  const [healthItems, setHealthItems] = useState<ProviderHealthItem[]>([]);
  const [usageStats, setUsageStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal / Drawer State
  const [activeModalProvider, setActiveModalProvider] = useState<AIProviderSummary | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedFallbackModel, setSelectedFallbackModel] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [timeoutSecs, setTimeoutSecs] = useState(30);
  const [providerEnabled, setProviderEnabled] = useState(true);
  const [discoveredModels, setDiscoveredModels] = useState<ProviderModelInfo[]>([]);

  // Testing & Action States
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latency_ms?: number;
    message: string;
  } | null>(null);
  const [savingProvider, setSavingProvider] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [routingSaving, setRoutingSaving] = useState(false);
  const [routingSuccessMsg, setRoutingSuccessMsg] = useState('');
  const [refreshingHealth, setRefreshingHealth] = useState(false);

  // Load All Provider Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [provRes, routeRes, healthRes, usageRes] = await Promise.allSettled([
        api.getProviders(),
        api.getAIRouting(),
        api.getProvidersHealth(),
        api.getProvidersUsage(),
      ]);

      if (provRes.status === 'fulfilled' && provRes.value.success && provRes.value.data) {
        setProviders(provRes.value.data);
      }
      if (routeRes.status === 'fulfilled' && routeRes.value.success && routeRes.value.data) {
        setRoutingConfig(routeRes.value.data);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value.success && healthRes.value.data) {
        setHealthItems(healthRes.value.data);
      }
      if (usageRes.status === 'fulfilled' && usageRes.value.success && usageRes.value.data) {
        setUsageStats(usageRes.value.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Modal for a Provider
  const handleOpenConnectModal = async (provider: AIProviderSummary) => {
    setActiveModalProvider(provider);
    setApiKeyInput('');
    setShowKeyText(false);
    setSelectedModel(provider.default_model);
    setSelectedFallbackModel(provider.fallback_model || '');
    setCustomBaseUrl(provider.base_url || '');
    setTemperature(provider.temperature || 0.7);
    setMaxTokens(provider.max_tokens || 2048);
    setTimeoutSecs(provider.timeout || 30);
    setProviderEnabled(provider.enabled ?? true);
    setTestResult(null);
    setSaveSuccessMsg('');

    // Fetch models list
    try {
      const res = await api.getProviderModels(provider.provider);
      if (res.success && res.data) {
        setDiscoveredModels(res.data);
      } else {
        setDiscoveredModels(
          provider.supported_models.map((m) => ({ id: m, name: m }))
        );
      }
    } catch {
      setDiscoveredModels(
        provider.supported_models.map((m) => ({ id: m, name: m }))
      );
    }
  };

  // Test Provider Live Connection
  const handleTestConnection = async () => {
    if (!activeModalProvider) return;
    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await api.testProviderConnection(activeModalProvider.provider, {
        api_key: apiKeyInput.trim() || undefined,
        model: selectedModel || activeModalProvider.default_model,
        base_url: customBaseUrl.trim() || undefined,
      });

      if (res.success && res.data) {
        setTestResult({
          success: res.data.success,
          latency_ms: res.data.latency_ms,
          message: res.data.message,
        });
        if (res.data.models_discovered && res.data.models_discovered.length > 0) {
          setDiscoveredModels(
            res.data.models_discovered.map((m) => ({ id: m, name: m }))
          );
        }
      } else {
        setTestResult({
          success: false,
          message: res.error?.message || 'Connection test failed. Check API key and quota.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error occurred during connection test.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Save Provider Credentials & Configuration
  const handleSaveProvider = async () => {
    if (!activeModalProvider) return;
    setSavingProvider(true);
    setSaveSuccessMsg('');

    try {
      if (apiKeyInput.trim()) {
        const res = await api.connectProvider(activeModalProvider.provider, {
          api_key: apiKeyInput.trim(),
          default_model: selectedModel || undefined,
          fallback_model: selectedFallbackModel || undefined,
          base_url: customBaseUrl.trim() || undefined,
          temperature,
          max_tokens: maxTokens,
          timeout: timeoutSecs,
          enabled: providerEnabled,
        });

        if (res.success) {
          setSaveSuccessMsg('✓ Provider credentials encrypted & saved securely.');
          await loadData();
          setTimeout(() => setActiveModalProvider(null), 1200);
        }
      } else {
        const res = await api.updateProvider(activeModalProvider.provider, {
          default_model: selectedModel || undefined,
          fallback_model: selectedFallbackModel || undefined,
          base_url: customBaseUrl.trim() || undefined,
          temperature,
          max_tokens: maxTokens,
          timeout: timeoutSecs,
          enabled: providerEnabled,
        });

        if (res.success) {
          setSaveSuccessMsg('✓ Configuration updated successfully.');
          await loadData();
          setTimeout(() => setActiveModalProvider(null), 1200);
        }
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to save provider configuration.',
      });
    } finally {
      setSavingProvider(false);
    }
  };

  // Disconnect Provider
  const handleDeleteProvider = async () => {
    if (!activeModalProvider) return;
    if (!confirm(`Are you sure you want to disconnect ${activeModalProvider.name}? Stored keys will be deleted.`)) return;

    try {
      await api.deleteProvider(activeModalProvider.provider);
      setActiveModalProvider(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh Live Health Checks
  const handleRefreshHealth = async () => {
    setRefreshingHealth(true);
    try {
      const res = await api.getProvidersHealth();
      if (res.success && res.data) {
        setHealthItems(res.data);
      }
    } finally {
      setRefreshingHealth(false);
    }
  };

  // Save Workload Routing Updates
  const handleSaveRouting = async () => {
    if (!routingConfig) return;
    setRoutingSaving(true);
    setRoutingSuccessMsg('');

    try {
      const mappings: Record<string, { provider: string; model_name: string; temperature: number; max_tokens: number }> = {};
      routingConfig.workloads.forEach((w) => {
        mappings[w.workload] = {
          provider: w.provider,
          model_name: w.model_name,
          temperature: w.temperature,
          max_tokens: w.max_tokens,
        };
      });

      const res = await api.updateAIRouting({
        primary_provider: routingConfig.primary_provider,
        primary_model: routingConfig.primary_model,
        fallback_provider: routingConfig.fallback_provider,
        fallback_model: routingConfig.fallback_model,
        workload_mappings: mappings,
      });

      if (res.success && res.data) {
        setRoutingConfig(res.data);
        setRoutingSuccessMsg('✓ AI Workload routing rules applied successfully.');
        setTimeout(() => setRoutingSuccessMsg(''), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRoutingSaving(false);
    }
  };

  // Update local workload row
  const handleWorkloadChange = (
    workloadKey: string,
    field: 'provider' | 'model_name' | 'temperature' | 'max_tokens',
    value: any
  ) => {
    if (!routingConfig) return;
    const updated = routingConfig.workloads.map((w) => {
      if (w.workload === workloadKey) {
        return { ...w, [field]: value };
      }
      return w;
    });
    setRoutingConfig({ ...routingConfig, workloads: updated });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans antialiased pb-24">
      {/* 1. Top Editorial Header */}
      <header className="border-b border-stone-300/80 bg-[#FAF8F5]/90 sticky top-0 z-30 backdrop-blur-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-stone-900 uppercase">
              AI-SENIOR-X
            </span>
            <span className="text-stone-400 font-mono text-xs">/</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-600 hidden sm:inline">
              AI LEARNING INTELLIGENCE PLATFORM
            </span>
            <span className="text-stone-400 font-mono text-xs hidden sm:inline">/</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
              SETTINGS · API CONFIGURATION
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-2 py-0.5 border border-stone-300 rounded bg-stone-100 text-stone-700 font-bold">
              API CONFIGURATION
            </span>
            <span className="text-stone-500">1 / 04</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-16">
        {/* 2. Hero Section: Developer Field Kit */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-stone-300 pb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100 border border-amber-300/80 rounded text-[10px] font-mono font-bold tracking-wider text-amber-900 uppercase">
              <Terminal size={12} className="text-amber-800" />
              <span>DEVELOPER FIELD KIT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-stone-950 tracking-tight leading-[1.08]">
              Connect your{' '}
              <span className="text-[#0052FF] italic font-serif">AI models.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed font-sans pt-1">
              Connect the model providers that power AI-SENIOR-X. Configure credentials securely
              and choose which provider should handle tutoring, reasoning, embeddings and other
              AI workloads.
            </p>
          </div>

          {/* Minimal Geometric AI Illustration */}
          <div className="lg:col-span-4 flex justify-end">
            <div className="w-full max-w-[280px] p-5 bg-white border border-stone-300 rounded-lg shadow-sm font-mono text-xs text-stone-600 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-200 pb-2">
                <span>ROUTER ARCHITECTURE</span>
                <span className="text-[#0052FF]">SYS_ONLINE</span>
              </div>
              <div className="text-[11px] space-y-1 text-stone-700">
                <div className="text-stone-900 font-bold">AI Request ↓</div>
                <div className="pl-3 text-stone-500">├─ AI Provider Router</div>
                <div className="pl-6 text-stone-500">├─ Workload Classifier</div>
                <div className="pl-9 text-stone-900 font-semibold text-[#0052FF]">
                  └─ Target Model Adapter
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400">
                <span>ENCRYPTED AT REST</span>
                <ShieldCheck size={14} className="text-emerald-600" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Section 01: AI / LLM Providers Directory */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-900 text-stone-100 rounded">
                01
              </span>
              <h2 className="text-lg font-mono uppercase font-bold tracking-wider text-stone-900">
                AI / LLM PROVIDERS
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-stone-500 uppercase tracking-wider">
              {providers.length || 4} PROVIDERS
            </span>
          </div>

          {/* Editorial Provider Rows */}
          <div className="divide-y divide-stone-300 border-b border-stone-300">
            {providers.map((p, idx) => {
              const rowNum = `01.${idx + 1}`;
              const isConnected = p.status === 'connected';

              return (
                <div
                  key={p.provider}
                  className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-stone-100/60 transition-colors px-3 rounded-lg"
                >
                  {/* Number & Info */}
                  <div className="md:col-span-6 space-y-1.5">
                    <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
                      <span className="font-bold text-stone-800">{rowNum}</span>
                      <span>·</span>
                      <span className="uppercase tracking-wider font-semibold text-[#0052FF]">
                        {p.tagline}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-stone-950">
                      {p.name}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed max-w-md">
                      {p.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2 text-[11px] font-mono text-stone-500">
                      <a
                        href={p.docs_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#0052FF] underline decoration-stone-300 hover:decoration-[#0052FF]"
                      >
                        <span>DOCUMENTATION</span>
                        <ArrowUpRight size={11} />
                      </a>
                      <a
                        href={p.get_key_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[#0052FF] underline decoration-stone-300 hover:decoration-[#0052FF]"
                      >
                        <span>GET API KEY</span>
                        <ArrowUpRight size={11} />
                      </a>
                    </div>
                  </div>

                  {/* Status & Masked Key */}
                  <div className="md:col-span-3 space-y-2 font-mono text-xs">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider text-stone-400">
                        STATUS
                      </div>
                      {isConnected ? (
                        <div className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300/80">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          <span>CONNECTED</span>
                        </div>
                      ) : p.status === 'error' ? (
                        <div className="inline-flex items-center gap-1.5 font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-300/80">
                          <span className="w-2 h-2 rounded-full bg-rose-600" />
                          <span>ERROR / INVALID</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 font-bold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded border border-stone-300">
                          <span className="w-2 h-2 rounded-full bg-stone-400" />
                          <span>NOT CONNECTED</span>
                        </div>
                      )}
                    </div>

                    {p.masked_key && (
                      <div className="pt-1">
                        <div className="text-[10px] uppercase tracking-wider text-stone-400">
                          STORED KEY
                        </div>
                        <div className="font-mono text-xs text-stone-800 bg-white px-2 py-1 border border-stone-200 rounded inline-block">
                          {p.masked_key}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="md:col-span-3 flex md:justify-end items-center self-center">
                    <button
                      onClick={() => handleOpenConnectModal(p)}
                      className={`w-full md:w-auto px-4 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
                        isConnected
                          ? 'bg-white hover:bg-stone-50 text-stone-900 border-stone-400 hover:border-stone-900'
                          : 'bg-[#0052FF] hover:bg-[#0042D0] text-white border-[#0052FF]'
                      }`}
                    >
                      {isConnected ? '[ CONFIGURE ]' : '[ CONNECT API KEY ]'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Section 02: Provider Health & Latency */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-900 text-stone-100 rounded">
                02
              </span>
              <h2 className="text-lg font-mono uppercase font-bold tracking-wider text-stone-900">
                PROVIDER HEALTH
              </h2>
            </div>
            <button
              onClick={handleRefreshHealth}
              disabled={refreshingHealth}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-300 rounded font-mono text-xs text-stone-700 hover:text-stone-900 hover:border-stone-400 transition-all"
            >
              <RefreshCw size={12} className={refreshingHealth ? 'animate-spin' : ''} />
              <span>PING HEALTH</span>
            </button>
          </div>

          <div className="bg-white border border-stone-300 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-300 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Active Model</th>
                  <th className="py-3 px-4 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {healthItems.map((item) => (
                  <tr key={item.provider} className="hover:bg-stone-50/80">
                    <td className="py-3 px-4 font-bold text-stone-950 flex items-center gap-2">
                      <Server size={14} className="text-[#0052FF]" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'connected' ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>CONNECTED</span>
                        </span>
                      ) : item.status === 'error' ? (
                        <span className="text-rose-600 font-bold">ERROR</span>
                      ) : (
                        <span className="text-stone-400">NOT CONFIGURED</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600 truncate max-w-xs">
                      {item.model}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {item.latency_ms !== null && item.latency_ms !== undefined ? (
                        <span className="text-stone-900 font-semibold">
                          {item.latency_ms}ms
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Section 03: Default & Workload Routing */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-900 text-stone-100 rounded">
                03
              </span>
              <h2 className="text-lg font-mono uppercase font-bold tracking-wider text-stone-900">
                DEFAULT & WORKLOAD ROUTING
              </h2>
            </div>

            <button
              onClick={handleSaveRouting}
              disabled={routingSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0052FF] hover:bg-[#0042D0] text-white rounded font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              {routingSaving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Save size={13} />
              )}
              <span>SAVE ROUTING</span>
            </button>
          </div>

          {routingSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs font-mono text-emerald-800 font-semibold">
              {routingSuccessMsg}
            </div>
          )}

          {/* Global Primary & Fallback Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-stone-300 p-6 rounded-lg shadow-sm">
            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-stone-700">
                Primary AI Provider & Model
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={routingConfig?.primary_provider || 'gemini'}
                  onChange={(e) =>
                    setRoutingConfig(
                      routingConfig
                        ? { ...routingConfig, primary_provider: e.target.value }
                        : null
                    )
                  }
                  className="bg-stone-50 border border-stone-300 rounded p-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#0052FF]"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="groq">Groq</option>
                  <option value="nvidia_nim">NVIDIA NIM</option>
                </select>

                <input
                  type="text"
                  value={routingConfig?.primary_model || 'gemini-1.5-pro'}
                  onChange={(e) =>
                    setRoutingConfig(
                      routingConfig
                        ? { ...routingConfig, primary_model: e.target.value }
                        : null
                    )
                  }
                  placeholder="Primary Model"
                  className="bg-stone-50 border border-stone-300 rounded p-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#0052FF]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-stone-700">
                Fallback Provider & Model
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={routingConfig?.fallback_provider || 'openrouter'}
                  onChange={(e) =>
                    setRoutingConfig(
                      routingConfig
                        ? { ...routingConfig, fallback_provider: e.target.value }
                        : null
                    )
                  }
                  className="bg-stone-50 border border-stone-300 rounded p-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#0052FF]"
                >
                  <option value="openrouter">OpenRouter</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq</option>
                  <option value="nvidia_nim">NVIDIA NIM</option>
                </select>

                <input
                  type="text"
                  value={routingConfig?.fallback_model || 'anthropic/claude-3.5-sonnet'}
                  onChange={(e) =>
                    setRoutingConfig(
                      routingConfig
                        ? { ...routingConfig, fallback_model: e.target.value }
                        : null
                    )
                  }
                  placeholder="Fallback Model"
                  className="bg-stone-50 border border-stone-300 rounded p-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#0052FF]"
                />
              </div>
            </div>
          </div>

          {/* 10 Workloads Granular Routing */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600">
              Granular AI Workload Mapping (10 Core Workloads)
            </h3>

            <div className="bg-white border border-stone-300 rounded-lg overflow-hidden shadow-sm divide-y divide-stone-200 font-mono text-xs">
              {routingConfig?.workloads.map((w) => (
                <div
                  key={w.workload}
                  className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-stone-50/80"
                >
                  <div className="md:col-span-5 space-y-0.5">
                    <div className="font-bold text-stone-950 font-mono">
                      {w.workload_label}
                    </div>
                    <div className="text-[11px] text-stone-500 leading-snug">
                      {w.description}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <select
                      value={w.provider}
                      onChange={(e) =>
                        handleWorkloadChange(w.workload, 'provider', e.target.value)
                      }
                      className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs font-mono text-stone-900"
                    >
                      <option value="gemini">Google Gemini</option>
                      <option value="openrouter">OpenRouter</option>
                      <option value="groq">Groq</option>
                      <option value="nvidia_nim">NVIDIA NIM</option>
                    </select>
                  </div>

                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={w.model_name}
                      onChange={(e) =>
                        handleWorkloadChange(w.workload, 'model_name', e.target.value)
                      }
                      placeholder="Model identifier"
                      className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs font-mono text-stone-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Section 04: Usage & Metrics */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-900 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-900 text-stone-100 rounded">
                04
              </span>
              <h2 className="text-lg font-mono uppercase font-bold tracking-wider text-stone-900">
                USAGE & METRICS
              </h2>
            </div>
            <span className="font-mono text-xs text-stone-500 uppercase tracking-wider">
              REAL BACKEND TELEMETRY
            </span>
          </div>

          {usageStats && usageStats.is_available ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-white border border-stone-300 rounded-lg shadow-sm space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  REQUESTS TODAY
                </div>
                <div className="text-2xl font-serif font-bold text-stone-950">
                  {usageStats.total_requests_today}
                </div>
              </div>

              <div className="p-5 bg-white border border-stone-300 rounded-lg shadow-sm space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  TOKENS USED
                </div>
                <div className="text-2xl font-serif font-bold text-stone-950">
                  {usageStats.tokens_used_today.toLocaleString()}
                </div>
              </div>

              <div className="p-5 bg-white border border-stone-300 rounded-lg shadow-sm space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  ESTIMATED COST
                </div>
                <div className="text-2xl font-serif font-bold text-stone-950">
                  ${usageStats.estimated_cost_usd.toFixed(3)}
                </div>
              </div>

              <div className="p-5 bg-white border border-stone-300 rounded-lg shadow-sm space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                  AVG LATENCY
                </div>
                <div className="text-2xl font-serif font-bold text-[#0052FF]">
                  {usageStats.average_latency_ms}ms
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-stone-300 rounded-lg text-center font-mono text-xs text-stone-500 uppercase tracking-wider">
              USAGE DATA NOT AVAILABLE
            </div>
          )}
        </section>
      </main>

      {/* 7. Connect / Configure Provider Modal Drawer */}
      {activeModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#FAF8F5] border border-stone-400 rounded-xl shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-300 bg-white flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#0052FF] font-bold">
                  PROVIDER CREDENTIALS & WORKFLOW
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-950">
                  Configure {activeModalProvider.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalProvider(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-mono text-xs">
              {/* API Key Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-stone-800">
                    API Key
                  </label>
                  {activeModalProvider.masked_key && !apiKeyInput && (
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Stored: {activeModalProvider.masked_key}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showKeyText ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={
                      activeModalProvider.masked_key
                        ? 'Leave blank to keep existing key, or paste new key'
                        : 'sk-...'
                    }
                    className="w-full bg-white border border-stone-300 rounded p-2.5 pr-10 text-xs font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#0052FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showKeyText ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 font-sans">
                  Keys are encrypted server-side with AES/Fernet. Never exposed in client code.
                </p>
              </div>

              {/* Model Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-stone-800">
                    Default Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded p-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#0052FF]"
                  >
                    {discoveredModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                    {!discoveredModels.some((m) => m.id === selectedModel) && selectedModel && (
                      <option value={selectedModel}>{selectedModel}</option>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-stone-800">
                    Fallback Model (Optional)
                  </label>
                  <input
                    type="text"
                    value={selectedFallbackModel}
                    onChange={(e) => setSelectedFallbackModel(e.target.value)}
                    placeholder="e.g. gpt-4o-mini"
                    className="w-full bg-white border border-stone-300 rounded p-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-[#0052FF]"
                  />
                </div>
              </div>

              {/* Advanced Parameters */}
              <div className="p-4 bg-white border border-stone-200 rounded-lg space-y-3">
                <div className="font-bold uppercase tracking-wider text-stone-700 text-[11px] border-b border-stone-100 pb-1">
                  Parameters & Endpoints
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-stone-600">Base URL Override (Optional)</label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://api.provider.com/v1"
                    className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-stone-500">Temperature</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 0.7)}
                      className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500">Max Tokens</label>
                    <input
                      type="number"
                      step="128"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2048)}
                      className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-stone-500">Timeout (s)</label>
                    <input
                      type="number"
                      value={timeoutSecs}
                      onChange={(e) => setTimeoutSecs(parseInt(e.target.value) || 30)}
                      className="w-full bg-stone-50 border border-stone-300 rounded p-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-3 rounded border font-mono text-xs ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {testResult.success ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>✓ CONNECTION VERIFIED ({testResult.latency_ms}ms)</span>
                      </>
                    ) : (
                      <span>× CONNECTION FAILED</span>
                    )}
                  </div>
                  <div className="text-[11px] pt-1">{testResult.message}</div>
                </div>
              )}

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded font-mono text-xs font-bold">
                  {saveSuccessMsg}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-300 bg-stone-100/80 flex items-center justify-between">
              {activeModalProvider.configured ? (
                <button
                  onClick={handleDeleteProvider}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono text-rose-700 hover:text-rose-900 border border-rose-300 hover:bg-rose-50 rounded transition-all"
                >
                  <Trash2 size={12} />
                  <span>DISCONNECT</span>
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded font-bold uppercase tracking-wider text-stone-800 transition-all shadow-sm flex items-center gap-1.5"
                >
                  {testingConnection ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} className="text-amber-600" />}
                  <span>TEST CONNECTION</span>
                </button>

                <button
                  onClick={handleSaveProvider}
                  disabled={savingProvider}
                  className="px-4 py-2 bg-[#0052FF] hover:bg-[#0042D0] text-white rounded font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
                >
                  {savingProvider ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>SAVE PROVIDER</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
