import React, { useState } from 'react';
import { 
  Settings, 
  History, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  Save, 
  AlertCircle,
  Activity,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Percent,
  Tag,
  Plus,
  Box,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for the UI
const INITIAL_SETTINGS = {
  autoCompleteDays: 7,
  creditPercentage: 5,
  isEnabled: true,
  walletType: 'TeraWallet',
};

const MOCK_LOGS = [
  { id: 1, orderId: '#9842', user: 'john_doe', amount: '$12.50', percentage: '5%', status: 'Completed', date: '2023-10-24 14:20' },
  { id: 2, orderId: '#9839', user: 'sarah_smith', amount: '$45.00', percentage: 'Override: $45', status: 'Completed', date: '2023-10-24 11:05' },
  { id: 3, orderId: '#9835', user: 'mike_brown', amount: '$15.00', percentage: '5%', status: 'Completed', date: '2023-10-23 16:45' },
  { id: 4, orderId: '#9831', user: 'alex_green', amount: '$6.40', percentage: '5%', status: 'Completed', date: '2023-10-23 09:12' },
];

const PRODUCT_OVERRIDES = [
  { id: 101, name: 'Premium Coffee Beans', override: 'Fixed $5.00', type: 'Fixed' },
  { id: 105, name: 'Luxury Espresso Machine', override: '15%', type: 'Percentage' },
];

function App() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully', {
        description: 'The automation plugin will now use these new parameters.',
      });
    }, 1000);
  };

  const handleDownload = () => {
    window.open('/download.php', '_blank');
    toast.info('Plugin download started...', {
      description: 'Your browser will prompt you to save the .zip file.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <PackageCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">WP Order Automator</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Automation & Wallet Credits</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 px-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Active System
            </Badge>
            <Button variant="default" size="sm" onClick={handleDownload} className="bg-slate-900 text-white hover:bg-slate-800 gap-2">
              <Download className="w-4 h-4" /> Download Plugin (.zip)
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-white border border-slate-200 h-11 p-1">
              <TabsTrigger value="dashboard" className="gap-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Activity className="w-4 h-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Settings className="w-4 h-4" /> Global Settings
              </TabsTrigger>
              <TabsTrigger value="overrides" className="gap-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Tag className="w-4 h-4" /> Product Overrides
              </TabsTrigger>
              <TabsTrigger value="logs" className="gap-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <History className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    {isSaving ? <span className="flex items-center gap-2"><Clock className="w-4 h-4 animate-spin" /> Saving...</span> : <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <TabsContent value="dashboard" className="space-y-8 mt-0 focus-visible:outline-none">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Auto-Completed Today', value: '24', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Wallet Credits Issued', value: '$240.00', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pending Completion', value: '156', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <Card key={i} className="border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-colors`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-1 text-slate-900 tracking-tight">{stat.value}</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                  <CardDescription>Real-time engine performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Scheduler Health</span>
                      <span className="text-blue-600 font-semibold italic text-xs">100% OK</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <ShieldCheck className="text-green-600 w-5 h-5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">WooCommerce Hook</p>
                        <p className="text-xs text-slate-500">Integration active and verified</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <Wallet className="text-purple-600 w-5 h-5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">TeraWallet API</p>
                        <p className="text-xs text-slate-500">Listening for order completions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent Automation</CardTitle>
                    <CardDescription>Last 4 orders processed by system</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('logs')} className="text-slate-600">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {MOCK_LOGS.map((log) => (
                      <div key={log.id} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100 hover:bg-slate-50 transition-colors px-2 rounded-md group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {log.orderId.replace('#', '')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{log.user}</p>
                            <p className="text-xs text-slate-500">{log.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">+{log.amount}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{log.percentage}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 font-semibold text-[11px]">
                            Auto-Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0 focus-visible:outline-none max-w-3xl mx-auto w-full">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle>Global Configuration</CardTitle>
                <CardDescription>These settings apply to all products unless an override is specified.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" /> Auto-Complete Threshold
                    </Label>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 font-bold border-blue-100">Recommended: 3-7 Days</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input type="number" value={settings.autoCompleteDays} onChange={(e) => setSettings({...settings, autoCompleteDays: parseInt(e.target.value)})} className="h-12 text-lg font-semibold bg-white border-slate-200 focus:ring-blue-500 rounded-xl" />
                    <span className="text-slate-600 font-bold">Days after purchase</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-green-600" /> Default Reward Percentage
                  </Label>
                  <div className="relative">
                    <Input type="number" min="0" max="100" value={settings.creditPercentage} onChange={(e) => setSettings({...settings, creditPercentage: parseInt(e.target.value)})} className="pr-10 h-12 text-lg font-semibold bg-white border-slate-200 focus:ring-blue-500 rounded-xl" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">%</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                      <Activity className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="font-bold">System Status</p>
                        <p className="text-xs text-slate-400">Master switch for automation engine</p>
                      </div>
                    </div>
                    <div onClick={() => setSettings({...settings, isEnabled: !settings.isEnabled})} className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${settings.isEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
                      <motion.div animate={{ x: settings.isEnabled ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overrides" className="mt-0 focus-visible:outline-none">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Specific Rules</CardTitle>
                    <CardDescription>Custom wallet credit amounts for specific products.</CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Add Product Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 bg-blue-50/50 border-b border-blue-100 text-blue-800 text-sm flex gap-3 items-center">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  <p>You can also set these rules directly on the <strong>Edit Product</strong> page under the "Wallet Credit" tab in the product data panel.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rule Type</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Override Value</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PRODUCT_OVERRIDES.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Box className="w-5 h-5 text-slate-400" />
                              <span className="font-bold text-slate-700">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={item.type === 'Fixed' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-purple-50 text-purple-700 border-purple-200'}>
                              {item.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">{item.override}</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600 cursor-pointer hover:underline">Edit Product</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-0 focus-visible:outline-none">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div><CardTitle>Automation History</CardTitle><CardDescription>Log of all processed orders.</CardDescription></div>
                  <div className="flex items-center gap-2"><Button variant="outline" size="sm">Export CSV</Button></div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credit Issued</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_LOGS.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600">{log.orderId}</td>
                        <td className="px-6 py-4 font-medium">{log.user}</td>
                        <td className="px-6 py-4 font-bold text-green-600">{log.amount} <span className="text-[10px] text-slate-400 font-normal">({log.percentage})</span></td>
                        <td className="px-6 py-4 text-sm text-slate-500">{log.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Integration Code Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h5 className="font-bold text-lg text-slate-800">WordPress Deployment</h5>
            <p className="text-slate-500 text-sm leading-relaxed">
              To deploy this plugin, use the <strong>Download</strong> button in the header. It will package the PHP logic and the compiled React assets into a standard WordPress-ready .zip file.
            </p>
            <div className="flex gap-4">
              <Badge className="bg-slate-200 text-slate-700 px-3 py-1 font-mono text-[10px]">React 19 Frontend</Badge>
              <Badge className="bg-slate-200 text-slate-700 px-3 py-1 font-mono text-[10px]">PHP 8.0+ Ready</Badge>
            </div>
          </div>
          <div className="bg-slate-900 rounded-xl p-6 font-mono text-xs text-blue-300 overflow-hidden relative shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <span className="text-slate-400">download.php</span>
              <span className="text-green-400">Bundle Script</span>
            </div>
            <p className="text-slate-400 mb-2">// How it works:</p>
            <code className="text-slate-300">
              The download script uses PHP's ZipArchive to bundle: <br/>
              - wp-auto-wallet.php (Logic) <br/>
              - dist/ (Compiled Frontend) <br/>
              - src/ (Source Code) <br/>
              Then streams the archive to your browser.
            </code>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;