import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Filter, 
  Search, 
  Calendar,
  Coins,
  TrendingUp,
  Eye,
  MoreVertical,
  Download
} from 'lucide-react';
import { Network } from '../types';
import { networks } from '../data/networks';

interface DeployedToken {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  network: Network;
  deploymentDate: string;
  totalSupply: string;
  maxSupply: string;
  decimals: number;
  transactionHash: string;
  features: string[];
  status: 'active' | 'paused' | 'verified';
  holders: number;
  transfers: number;
}

export const DeployedTokens: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'supply'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'verified'>('all');
  const [copied, setCopied] = useState<string | null>(null);

  // Mock deployed tokens data
  const [deployedTokens] = useState<DeployedToken[]>([
    {
      id: '1',
      name: 'My Awesome Token',
      symbol: 'MAT',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      network: networks.find(n => n.id === 'ethereum')!,
      deploymentDate: '2024-01-15T10:30:00Z',
      totalSupply: '1000000',
      maxSupply: '10000000',
      decimals: 18,
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      features: ['Burnable', 'Mintable', 'Transfer Fees'],
      status: 'verified',
      holders: 1250,
      transfers: 5420
    },
    {
      id: '2',
      name: 'Test Token',
      symbol: 'TEST',
      contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
      network: networks.find(n => n.id === 'estar-testnet')!,
      deploymentDate: '2024-01-14T15:45:00Z',
      totalSupply: '500000',
      maxSupply: '500000',
      decimals: 18,
      transactionHash: '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef123456',
      features: ['Burnable', 'Holder Redistribution'],
      status: 'active',
      holders: 45,
      transfers: 128
    },
    {
      id: '3',
      name: 'Community Coin',
      symbol: 'COMM',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      network: networks.find(n => n.id === 'bsc')!,
      deploymentDate: '2024-01-13T09:15:00Z',
      totalSupply: '2000000',
      maxSupply: '5000000',
      decimals: 18,
      transactionHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
      features: ['Mintable', 'Transfer Fees', 'Vesting'],
      status: 'verified',
      holders: 890,
      transfers: 3240
    }
  ]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredTokens = deployedTokens.filter(token => {
    const matchesNetwork = !selectedNetwork || token.network.id === selectedNetwork.id;
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.contractAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || token.status === filterStatus;
    
    return matchesNetwork && matchesSearch && matchesStatus;
  });

  const sortedTokens = [...filteredTokens].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.deploymentDate).getTime() - new Date(a.deploymentDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'supply':
        return parseInt(b.totalSupply) - parseInt(a.totalSupply);
      default:
        return 0;
    }
  });

  const getNetworkStats = () => {
    const stats = networks.map(network => ({
      network,
      count: deployedTokens.filter(token => token.network.id === network.id).length,
      totalSupply: deployedTokens
        .filter(token => token.network.id === network.id)
        .reduce((sum, token) => sum + parseInt(token.totalSupply), 0)
    }));
    return stats.filter(stat => stat.count > 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-500/20';
      case 'active': return 'text-blue-400 bg-blue-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getNetworkIcon = (networkId: string) => {
    const icons: Record<string, string> = {
      'ethereum': '🔷',
      'bsc': '🟡',
      'polygon': '🟣',
      'arbitrum': '🔵',
      'fantom': '🌟',
      'avalanche': '🔺',
      'estar-testnet': '⚡'
    };
    return icons[networkId] || '🌐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Deployed Tokens</h1>
          <p className="text-gray-300">Manage and monitor your deployed token contracts</p>
        </div>

        {/* Network Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{deployedTokens.length}</div>
                <div className="text-sm text-gray-300">Total Tokens</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {deployedTokens.reduce((sum, token) => sum + token.holders, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Total Holders</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {deployedTokens.reduce((sum, token) => sum + token.transfers, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Total Transfers</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3">
              <Eye className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {deployedTokens.filter(t => t.status === 'verified').length}
                </div>
                <div className="text-sm text-gray-300">Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Selection */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Filter by Network</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            <button
              onClick={() => setSelectedNetwork(null)}
              className={`p-3 rounded-lg border transition-all ${
                !selectedNetwork
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                  : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">🌐</div>
                <div className="text-xs font-medium">All Networks</div>
                <div className="text-xs opacity-75">{deployedTokens.length} tokens</div>
              </div>
            </button>
            
            {getNetworkStats().map(({ network, count }) => (
              <button
                key={network.id}
                onClick={() => setSelectedNetwork(network)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedNetwork?.id === network.id
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{getNetworkIcon(network.id)}</div>
                  <div className="text-xs font-medium">{network.name}</div>
                  <div className="text-xs opacity-75">{count} tokens</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="verified">Verified</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="supply">Sort by Supply</option>
              </select>
              
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tokens List */}
        <div className="space-y-4">
          {sortedTokens.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
              <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Tokens Found</h3>
              <p className="text-gray-300">
                {selectedNetwork 
                  ? `No tokens deployed on ${selectedNetwork.name}`
                  : 'No tokens match your search criteria'
                }
              </p>
            </div>
          ) : (
            sortedTokens.map((token) => (
              <div key={token.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{getNetworkIcon(token.network.id)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{token.name}</h3>
                        <span className="text-gray-400">({token.symbol})</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token.status)}`}>
                          {token.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-300">Network</div>
                          <div className="text-white font-medium">{token.network.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">Total Supply</div>
                          <div className="text-white font-medium">{parseInt(token.totalSupply).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">Holders</div>
                          <div className="text-white font-medium">{token.holders.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-300">Deployed</div>
                          <div className="text-white font-medium">
                            {new Date(token.deploymentDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-300">Contract:</span>
                        <code className="text-sm text-white font-mono bg-white/10 px-2 py-1 rounded">
                          {token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-8)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(token.contractAddress, `address-${token.id}`)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copied === `address-${token.id}` && (
                          <span className="text-green-400 text-sm">Copied!</span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {token.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <a
                      href={`${token.network.explorerUrl}/token/${token.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};