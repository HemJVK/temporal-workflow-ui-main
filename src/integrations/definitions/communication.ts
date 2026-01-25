import type { IntegrationSchema } from "../types";

export const communicationIntegrations: IntegrationSchema[] = [
  {
    type: "send_sms_twilio",
    label: "Twilio-SMS",
    category: "communication",
    icon: "MessageSquare",
    description: "SMS",
    inputs: [
      { key: "to", label: "To Number", type: "text" },
      { key: "body", label: "Message Body", type: "textarea" },
    ],
  },
  {
    type: "make_voice_call_twilio",
    label: "Twilio-Voice",
    category: "communication",
    icon: "MessageSquare",
    description: "Voice Call",
    inputs: [
      { key: "to", label: "To Number", type: "text" },
      { key: "body", label: "Message Body", type: "textarea" },
    ],
  },
  {
    type: "send_email_sendgrid",
    label: "SendGrid",
    category: "communication",
    icon: "Mail",
    description: "Transactional Email",
    inputs: [
      { key: "to", label: "To Email", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
];
