import { IntegrationAdapter } from './base-adapter';

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  type: 'erp' | 'accounting' | 'banking' | 'government';
  author: string;
  entryPoint: string;
  configSchema: Record<string, any>;
}

export class PluginManager {
  private plugins: Map<string, { manifest: PluginManifest; adapter: IntegrationAdapter }> = new Map();

  registerPlugin(manifest: PluginManifest, adapter: IntegrationAdapter) {
    this.plugins.set(manifest.name, { manifest, adapter });
    console.log(`Plugin registered: ${manifest.name} v${manifest.version}`);
  }

  unregisterPlugin(name: string) {
    this.plugins.delete(name);
    console.log(`Plugin unregistered: ${name}`);
  }

  getPlugin(name: string) {
    return this.plugins.get(name);
  }

  listPlugins() {
    return Array.from(this.plugins.entries()).map(([name, { manifest, adapter }]) => ({
      name,
      version: manifest.version,
      type: manifest.type,
      status: adapter.status,
      description: manifest.description,
    }));
  }

  async connectAll() {
    const results = await Promise.allSettled(
      Array.from(this.plugins.values()).map(({ adapter }) => adapter.connect())
    );
    return results.map((r, i) => ({
      plugin: Array.from(this.plugins.keys())[i],
      connected: r.status === 'fulfilled' && r.value,
    }));
  }

  async syncAll(data: any) {
    const results = await Promise.allSettled(
      Array.from(this.plugins.values()).map(({ adapter }) => adapter.sync(data))
    );
    return results.map((r, i) => ({
      plugin: Array.from(this.plugins.keys())[i],
      success: r.status === 'fulfilled',
      result: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason : null,
    }));
  }

  async syncByType(type: string, data: any) {
    const filtered = Array.from(this.plugins.entries()).filter(([_, { manifest }]) => manifest.type === type);
    const results = await Promise.allSettled(
      filtered.map(([_, { adapter }]) => adapter.sync(data))
    );
    return results.map((r, i) => ({
      plugin: filtered[i][0],
      success: r.status === 'fulfilled',
      result: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason : null,
    }));
  }
}

export const pluginManager = new PluginManager();
