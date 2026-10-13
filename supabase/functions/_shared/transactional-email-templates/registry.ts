import type { ComponentType } from 'npm:react@18.3.1'
import { template as contactNotification } from './contact-notification.tsx'
import { template as contactAcknowledgment } from './contact-acknowledgment.tsx'
import { template as orderReceipt } from './order-receipt.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-notification': contactNotification,
  'contact-acknowledgment': contactAcknowledgment,
  'order-receipt': orderReceipt,
}
