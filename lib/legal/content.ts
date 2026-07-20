import { includesEu, includesUs, legalConfig, type LegalConfig } from "@/lib/legal/config";
import { site } from "@/lib/site";

type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

const config = legalConfig;

export function privacyPolicy(input: LegalConfig = config): LegalDocument {
  const sections: LegalSection[] = [
    {
      id: "data-we-collect",
      heading: "Information we collect",
      paragraphs: ["We collect the following categories of information:"],
      list: input.dataCollected,
    },
    {
      id: "how-we-use",
      heading: "How we use your information",
      paragraphs: [
        `We use your information to operate ${site.name}, provide the features you request, keep the service secure, comply with our legal obligations, and communicate with you about the service.`,
      ],
    },
    {
      id: "sharing",
      heading: "How we share your information",
      paragraphs: [
        input.sellsData
          ? "We may share personal information with third parties as described in this policy and in our cookie policy."
          : "We do not sell your personal information. We share it only with the service providers listed below, and only as needed to operate the service.",
        "Our current service providers are:",
      ],
      list: input.subprocessors.map((p) => `${p.name} — ${p.purpose}`),
    },
    {
      id: "retention",
      heading: "How long we keep your information",
      paragraphs: [
        "We keep personal information only for as long as needed to provide the service and meet our legal obligations, after which we delete or anonymize it.",
      ],
    },
    {
      id: "security",
      heading: "How we protect your information",
      paragraphs: [
        "We apply technical and organizational safeguards, including encryption in transit, validated inputs, and least-privilege access. No method of transmission is perfectly secure, but we work to protect your information.",
      ],
    },
  ];

  if (includesEu(input)) {
    sections.push({
      id: "gdpr-rights",
      heading: "Your rights in the European Economic Area and the United Kingdom",
      paragraphs: [
        "If you are in the EEA or the UK, the GDPR gives you the following rights over your personal data:",
      ],
      list: [
        "Access a copy of the data we hold about you",
        "Correct data that is inaccurate or incomplete",
        "Erase your data where there is no lawful reason to keep it",
        "Restrict or object to certain processing",
        "Port your data to another provider",
        "Withdraw consent at any time, and lodge a complaint with a supervisory authority",
      ],
    });
  }

  if (includesUs(input)) {
    sections.push({
      id: "ccpa-rights",
      heading: "Your rights in the United States",
      paragraphs: [
        "If you are a California resident, the CCPA and CPRA give you the right to know what personal information we collect, to request its deletion, to correct it, and to opt out of its sale or sharing.",
        input.sellsData
          ? "To opt out, use the “Do Not Sell or Share My Personal Information” control in our cookie policy."
          : "We do not sell or share your personal information as those terms are defined by California law.",
      ],
    });
  }

  sections.push({
    id: "contact",
    heading: "Contact us",
    paragraphs: [
      `${input.legalEntity} is the controller of your personal data. You can reach us about privacy at ${input.contactEmail} or by mail at ${input.address}.`,
    ],
  });

  return {
    title: "Privacy Policy",
    effectiveDate: input.effectiveDate,
    intro: `This Privacy Policy explains how ${input.legalEntity} ("we") collects, uses, and protects your personal information when you use ${site.name}.`,
    sections,
  };
}

export function termsOfService(input: LegalConfig = config): LegalDocument {
  return {
    title: "Terms of Service",
    effectiveDate: input.effectiveDate,
    intro: `These Terms of Service govern your use of ${site.name}, operated by ${input.legalEntity}. By using the service you agree to these terms.`,
    sections: [
      {
        id: "use",
        heading: "Using the service",
        paragraphs: [
          "You may use the service only in compliance with these terms and all applicable laws. You are responsible for any activity that happens under your account.",
        ],
      },
      {
        id: "accounts",
        heading: "Accounts",
        paragraphs: [
          "If the service offers accounts, you must provide accurate information and keep your credentials secure. You are responsible for activity on your account.",
        ],
      },
      {
        id: "acceptable-use",
        heading: "Acceptable use",
        paragraphs: ["You agree not to:"],
        list: [
          "Break the law or infringe the rights of others",
          "Attempt to breach security or disrupt the service",
          "Reverse engineer or misuse the service",
          "Upload malicious code or unlawful content",
        ],
      },
      {
        id: "intellectual-property",
        heading: "Intellectual property",
        paragraphs: [
          "The service and its content are owned by us or our licensors and are protected by law. You keep ownership of content you submit and grant us the license needed to operate the service.",
        ],
      },
      {
        id: "disclaimer",
        heading: "Disclaimer and limitation of liability",
        paragraphs: [
          'The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the service.',
        ],
      },
      {
        id: "termination",
        heading: "Termination",
        paragraphs: [
          "We may suspend or terminate access if you violate these terms. You may stop using the service at any time.",
        ],
      },
      {
        id: "governing-law",
        heading: "Governing law",
        paragraphs: [
          `These terms are governed by the laws of ${input.governingLaw}, without regard to conflict of law rules.`,
        ],
      },
      {
        id: "contact",
        heading: "Contact us",
        paragraphs: [`Questions about these terms can be sent to ${input.contactEmail}.`],
      },
    ],
  };
}

export function cookiePolicy(input: LegalConfig = config): LegalDocument {
  return {
    title: "Cookie Policy",
    effectiveDate: input.effectiveDate,
    intro: `This Cookie Policy explains how ${site.name} uses cookies and similar technologies, and how you can control them.`,
    sections: [
      {
        id: "what-are-cookies",
        heading: "What are cookies",
        paragraphs: [
          "Cookies are small text files stored on your device. We use them to run the site, remember your preferences, and, with your consent, to measure usage and marketing.",
        ],
      },
      {
        id: "your-choices",
        heading: "Managing your choices",
        paragraphs: [
          "When you first visit, a banner lets you accept all cookies, reject all non-essential cookies, or choose per category. You can change your choice at any time from the controls on this page.",
        ],
      },
    ],
  };
}
