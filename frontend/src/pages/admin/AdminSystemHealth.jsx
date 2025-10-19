import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Server, 
  Database, 
  Shield,
  Wifi,
  HardDrive,
  Monitor,
  RefreshCw
} from 'lucide-react';

const AdminSystemHealth = () => {
  const [systemStatus, setSystemStatus] = useState({
    server: { status: 'healthy', response: '45ms', uptime: '99.9%' },
    database: { status: 'healthy', connections: '12/100', latency: '2ms' },
    storage: { status: 'warning', used: '78%', available: '2.1TB' },
    api: { status: 'healthy', requests: '1.2M', errors: '0.1%' },
    security: { status: 'healthy', threats: '0', lastScan: '2 hours ago' },
    network: { status: 'healthy', bandwidth: '850 Mbps', packet_loss: '0.01%' },
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // In real app, this would fetch actual system metrics
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const systemComponents = [
    {
      id: 'server',
      label: 'Server',
      icon: Server,
      metrics: [
        { label: 'Response Time', value: systemStatus.server.response },
        { label: 'Uptime', value: systemStatus.server.uptime },
      ]
    },
    {
      id: 'database',
      label: 'Database',
      icon: Database,
      metrics: [
        { label: 'Connections', value: systemStatus.database.connections },
        { label: 'Latency', value: systemStatus.database.latency },
      ]
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: HardDrive,
      metrics: [
        { label: 'Used Space', value: systemStatus.storage.used },
        { label: 'Available', value: systemStatus.storage.available },
      ]
    },
    {
      id: 'api',
      label: 'API Services',
      icon: Monitor,
      metrics: [
        { label: 'Requests/Day', value: systemStatus.api.requests },
        { label: 'Error Rate', value: systemStatus.api.errors },
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      metrics: [
        { label: 'Threats Blocked', value: systemStatus.security.threats },
        { label: 'Last Scan', value: systemStatus.security.lastScan },
      ]
    },
    {
      id: 'network',
      label: 'Network',
      icon: Wifi,
      metrics: [
        { label: 'Bandwidth', value: systemStatus.network.bandwidth },
        { label: 'Packet Loss', value: systemStatus.network.packet_loss },
      ]
    },
  ];

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In real app, this would trigger a system health check
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">Monitor system performance and status</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Last Update */}
      <div className="text-sm text-gray-500">
        Last updated: {lastUpdate.toLocaleString()}
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemComponents.map((component) => {
          const Icon = component.icon;
          const status = systemStatus[component.id]?.status || 'unknown';
          
          return (
            <div key={component.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{component.label}</h3>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  <span className="capitalize">{status}</span>
                </div>
              </div>

              <div className="space-y-2">
                {component.metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{metric.label}:</span>
                    <span className="font-medium text-gray-900">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-800">Storage Warning</h4>
            <p className="text-sm text-yellow-700">
              Storage is at 78% capacity. Consider cleaning up old files or expanding storage.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Clear Cache
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Run Backup
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
            Security Scan
          </button>
          <Link
            to="/admin/settings"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-center"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemHealth;
