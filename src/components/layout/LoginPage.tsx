import { useAuth } from '@/auth/useAuth';
import { useAuthReinit } from '@/auth/AuthProvider';
import { useAppStore } from '@/store/useAppStore';
import { saveAuthConfig, hasValidAuthConfig } from '@/auth/msalConfig';
import { Brain, Shield, BarChart3, Zap, FlaskConical, Settings, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function LoginPage() {
  const { login } = useAuth();
  const { reinitialize } = useAuthReinit();
  const setDemoMode = useAppStore((s) => s.setDemoMode);
  const [showSetup, setShowSetup] = useState(false);
  const [clientId, setClientId] = useState('');
  const [tenantId, setTenantId] = useState('common');
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  const hasConfig = hasValidAuthConfig();

  const handleSignIn = async () => {
    if (hasConfig) {
      try {
        await login();
      } catch {
        setError('Sign-in was cancelled or failed. Try again.');
      }
    } else {
      setShowSetup(true);
    }
  };

  const handleConnect = async () => {
    if (!clientId.trim()) {
      setError('Please enter your Application (Client) ID');
      return;
    }
    setError('');
    setConnecting(true);

    try {
      saveAuthConfig({ clientId: clientId.trim(), tenantId: tenantId.trim() || 'common' });
      await reinitialize(clientId.trim(), tenantId.trim() || 'common');
      await login();
    } catch (err) {
      setError('Connection failed. Please verify your Client ID and try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--muted))]">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[hsl(var(--primary))] text-white mb-4">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2 justify-center">
            Azure AI Capacity
            <span className="text-xs font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
              Beta
            </span>
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] text-lg">
            Monitor and manage your Azure AI quotas, deployments, and usage in one dashboard.
          </p>
        </div>

        <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] p-6 shadow-lg">
          <div className="space-y-4 mb-6">
            <Feature icon={<BarChart3 className="w-5 h-5" />} text="Real-time quota utilization gauges and charts" />
            <Feature icon={<Zap className="w-5 h-5" />} text="Track deployments across all subscriptions" />
            <Feature icon={<Shield className="w-5 h-5" />} text="Best practices with Microsoft Learn links" />
          </div>

          <div className="space-y-3">
            {/* Sign In / Connect Button */}
            <button
              onClick={handleSignIn}
              className="w-full py-3 px-4 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
              </svg>
              Sign in with Microsoft
            </button>

            {/* Azure Setup Panel */}
            {showSetup && (
              <div className="bg-[hsl(var(--muted)/0.5)] border border-[hsl(var(--border))] rounded-xl p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[hsl(var(--primary))]" />
                    Connect to Azure
                  </h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    To access your Azure AI quotas, you need an Entra ID app registration. This is a one-time setup.
                  </p>
                </div>

                {/* Quick Start Steps */}
                <div className="bg-[hsl(var(--card))] rounded-lg p-3 text-xs space-y-2">
                  <p className="font-semibold text-[hsl(var(--foreground))]">Quick Setup (2 minutes):</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[hsl(var(--muted-foreground))]">
                    <li>
                      <a
                        href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/CreateApplicationBlade/quickStartType~/null/isMSAApp~/false"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(var(--primary))] hover:underline inline-flex items-center gap-0.5"
                      >
                        Register a new app in Azure Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>Set <strong>Redirect URI</strong> to: <code className="bg-[hsl(var(--muted))] px-1 rounded text-[hsl(var(--foreground))]">{window.location.origin}</code> (SPA type)</li>
                    <li>Under <strong>API permissions</strong>, add: <code className="bg-[hsl(var(--muted))] px-1 rounded text-[hsl(var(--foreground))]">Azure Service Management → user_impersonation</code></li>
                    <li>Copy the <strong>Application (client) ID</strong> and paste below</li>
                  </ol>
                </div>

                {/* Client ID Input */}
                <div>
                  <label className="block text-xs font-medium text-[hsl(var(--foreground))] mb-1">
                    Application (Client) ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12345678-abcd-efgh-ijkl-1234567890ab"
                    value={clientId}
                    onChange={e => { setClientId(e.target.value); setError(''); }}
                    className="w-full px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] font-mono"
                  />
                </div>

                {/* Tenant ID (Optional) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setTenantId(t => t === 'common' ? '' : 'common')}
                    className="text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] flex items-center gap-1"
                  >
                    {tenantId === 'common' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                    Tenant ID (optional — defaults to any Microsoft account)
                  </button>
                  {tenantId !== 'common' && (
                    <input
                      type="text"
                      placeholder="e.g. contoso.onmicrosoft.com or tenant GUID"
                      value={tenantId}
                      onChange={e => setTenantId(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] font-mono"
                    />
                  )}
                </div>

                {error && (
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                )}

                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[hsl(var(--primary))] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {connecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect & Sign In'
                  )}
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[hsl(var(--border))]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[hsl(var(--card))] px-2 text-[hsl(var(--muted-foreground))]">or</span>
              </div>
            </div>

            {/* Demo Mode */}
            <button
              onClick={() => setDemoMode(true)}
              className="w-full py-3 px-4 rounded-lg border-2 border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-400 font-medium hover:bg-purple-500/10 transition-colors flex items-center justify-center gap-2"
            >
              <FlaskConical className="w-5 h-5" />
              Explore Demo
            </button>
          </div>

          <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mt-4">
            No Azure account needed for the demo — explore with sample data
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[hsl(var(--foreground))]">
      <div className="text-[hsl(var(--primary))]">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
