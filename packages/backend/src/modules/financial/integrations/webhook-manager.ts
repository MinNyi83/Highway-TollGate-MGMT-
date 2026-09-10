import crypto from 'crypto';
import { hqPrisma } from '../../../config/database';

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  maxRetries: number;
  retryDelay: number;
}

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  source: string;
}

export class WebhookManager {
  private webhooks: Map<string, WebhookConfig> = new Map();

  constructor() {
    this.loadWebhooks();
  }

  private async loadWebhooks() {
    try {
      const configs = await hqPrisma.webhookConfig.findMany({ where: { active: true } });
      configs.forEach(c => {
        this.webhooks.set(c.id, {
          url: c.url,
          secret: c.secret,
          events: c.events as string[],
          active: c.active,
          maxRetries: c.maxRetries || 3,
          retryDelay: c.retryDelay || 5000,
        });
      });
    } catch {}
  }

  async registerWebhook(id: string, config: WebhookConfig) {
    this.webhooks.set(id, config);
    try {
      await hqPrisma.webhookConfig.upsert({
        where: { id },
        create: { id, ...config },
        update: config,
      });
    } catch {}
  }

  async unregisterWebhook(id: string) {
    this.webhooks.delete(id);
    try {
      await hqPrisma.webhookConfig.delete({ where: { id } });
    } catch {}
  }

  async triggerWebhook(event: string, data: any) {
    const payload: WebhookPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      source: 'tollgate-rfid',
    };

    const relevantWebhooks = Array.from(this.webhooks.entries()).filter(([_, config]) =>
      config.active && config.events.includes(event)
    );

    const results = await Promise.allSettled(
      relevantWebhooks.map(([id, config]) => this.sendWebhook(id, config, payload))
    );

    return results.map((r, i) => ({
      webhookId: relevantWebhooks[i][0],
      success: r.status === 'fulfilled' && r.value,
    }));
  }

  private async sendWebhook(id: string, config: WebhookConfig, payload: WebhookPayload): Promise<boolean> {
    let attempts = 0;
    while (attempts < config.maxRetries) {
      try {
        const signature = this.generateSignature(JSON.stringify(payload), config.secret);

        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Webhook-Event': payload.event,
            'X-Webhook-Source': payload.source,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          await this.logWebhook(id, payload.event, 'sent', payload);
          return true;
        }
      } catch (error) {
        attempts++;
        if (attempts < config.maxRetries) {
          await new Promise(r => setTimeout(r, config.retryDelay));
        }
      }
    }

    await this.logWebhook(id, payload.event, 'failed', payload);
    return false;
  }

  private generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  private async logWebhook(webhookId: string, event: string, status: string, payload: any) {
    try {
      await hqPrisma.webhookLog.create({
        data: {
          webhookId,
          event,
          status,
          payload,
          timestamp: new Date(),
        },
      });
    } catch {}
  }

  async getWebhookLogs(webhookId?: string) {
    try {
      const where = webhookId ? { webhookId } : {};
      return await hqPrisma.webhookLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
    } catch {
      return [];
    }
  }
}

export const webhookManager = new WebhookManager();
