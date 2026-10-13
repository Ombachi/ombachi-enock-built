import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { brand, container, h1, main, muted, text } from './styles.ts'

interface Props { name?: string; subject?: string }

const Email = ({ name, subject }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks — your message reached me</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Ombachi Enock</Text>
        <Heading style={h1}>{name ? `Thank you, ${name}.` : 'Thank you.'}</Heading>
        <Text style={text}>
          Your message{subject ? ` about “${subject}”` : ''} has reached me. I read every message personally and will reply as soon as I can.
        </Text>
        <Text style={text}>— Ombachi Enock</Text>
        <Text style={muted}>You received this because you used the contact form on my website.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Thanks for reaching out',
  displayName: 'Contact acknowledgment (to visitor)',
  previewData: { name: 'Jane', subject: 'Speaking invitation' },
} satisfies TemplateEntry
