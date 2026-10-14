import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { SITE_URL, box, brand, button, container, h1, main, muted, text } from './styles.ts'

interface Item { title: string; quantity: number; unit_price_kes: number; is_digital: boolean }
interface Props { name?: string; orderRef?: string; receipt?: string; items?: Item[]; total?: number; hasDigital?: boolean; hasPhysical?: boolean; accessUrl?: string }

const kes = (n: number) => `KES ${Number(n || 0).toLocaleString('en-KE')}`

const Email = ({ name, orderRef, receipt, items = [], total = 0, hasDigital, hasPhysical, accessUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Payment received — your order is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Ombachi Enock · Publications</Text>
        <Heading style={h1}>{name ? `Thank you, ${name}.` : 'Thank you for your order.'}</Heading>
        <Text style={text}>Your M-PESA payment was received and your order is confirmed.</Text>
        <Section style={box}>
          {orderRef && <Text style={muted}>Order {orderRef}{receipt ? ` · M-PESA ${receipt}` : ''}</Text>}
          {items.map((i, idx) => (
            <Text key={idx} style={text}>{i.title} × {i.quantity} — {kes(i.unit_price_kes * i.quantity)}</Text>
          ))}
          <Text style={{ ...text, fontWeight: 'bold', margin: 0 }}>Total: {kes(total)}</Text>
        </Section>
        {hasDigital !== false && (
          <>
            <Text style={text}>Read online or download your copy any time using your personal access link:</Text>
            <Button href={accessUrl || SITE_URL} style={button}>Access Your Publication</Button>
            <Text style={muted}>Keep this email — the button above is your permanent access link. No account or password needed.</Text>
          </>
        )}
        {hasPhysical && <Text style={text}>Your printed copy is being prepared. I will update you once it ships.</Text>}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your order is confirmed',
  displayName: 'Order receipt',
  previewData: { name: 'Jane', orderRef: 'A1B2C3D4', receipt: 'SGH7XK2', items: [{ title: 'Decentralised Diagnostics', quantity: 1, unit_price_kes: 1200, is_digital: true }], total: 1200, hasDigital: true },
} satisfies TemplateEntry
