import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { box, brand, container, h1, main, muted, text } from './styles.ts'

interface Props { name?: string; email?: string; subject?: string; message?: string }

const Email = ({ name, email, subject, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New message from {name ?? 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Ombachi Enock · Website</Text>
        <Heading style={h1}>New contact message</Heading>
        <Section style={box}>
          <Text style={text}><strong>Name:</strong> {name ?? '—'}</Text>
          <Text style={text}><strong>Email:</strong> {email ?? '—'}</Text>
          <Text style={text}><strong>Subject:</strong> {subject || '—'}</Text>
        </Section>
        <Text style={{ ...text, whiteSpace: 'pre-wrap' }}>{message ?? ''}</Text>
        <Text style={muted}>Hit Reply to answer the visitor directly.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Website message: ${d.subject || `from ${d.name ?? 'a visitor'}`}`,
  displayName: 'Contact notification (to owner)',
  to: 'contact@ombachienock.me.ke',
  previewData: { name: 'Jane Doe', email: 'jane@example.com', subject: 'Speaking invitation', message: 'Hello Enock, we would love to have you speak.' },
} satisfies TemplateEntry
