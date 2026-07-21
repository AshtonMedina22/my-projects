const defaultSections = {
  1: `Hi Joe

Section 1: Welcome to Our Lovely Company!

Welcome to the team! This training manual will help you get oriented and become productive in your new role. Please review each section carefully and don't hesitate to reach out to your supervisor or HR if you have questions.

Company Mission:
We strive to deliver innovative solutions that make our customers' lives easier while maintaining the highest standards of quality and service.

Core Values:
- Customer Focus: Every decision should benefit our customers
- Innovation: We embrace new ideas and continuous improvement
- Integrity: We act ethically and transparently in all situations
- Collaboration: We work together to achieve common goals

Your First Week:
1. Complete this training manual (Sections 1-3)
2. Meet with your direct supervisor to discuss role expectations
3. Attend the new employee orientation session
4. Set up your workspace and IT accounts
5. Schedule introductory meetings with key team members

Remember, everyone here wants you to succeed. Take advantage of the knowledge and experience around you!`,
  2: `Section 2: IT Setup and Security

Your technology setup is crucial for productivity and security. Please follow these steps carefully and contact IT Support if you encounter any issues.

Computer Setup:
1. Log in using your temporary credentials (provided by IT)
2. Update your password immediately (must be 12+ characters with mixed case, numbers, and symbols)
3. Install required software from the company portal
4. Configure your email and calendar settings

Security Guidelines:
- Never share your login credentials with anyone
- Lock your computer whenever you step away (Windows: Win+L, Mac: Cmd+Ctrl+Q)
- Report suspicious emails to IT immediately - when in doubt, don't click!
- Use the company VPN when working remotely
- Keep your software updated with automatic updates enabled

Common Applications:
- Email: Microsoft Outlook (training available)
- Messaging: Microsoft Teams for chat and video calls
- File Storage: SharePoint for shared documents
- Time Tracking: CompanyTime system for project hours

Getting Help:
For technical issues, submit a ticket at support@company.com or call ext. 4357 (HELP). Include detailed descriptions of the problem and any error messages you see.`,
};

const contacts = {
  "Sarah Chen": "HR Director - Employee relations, benefits, and policy questions. Office: Building A, Floor 3. Email: sarah.chen@company.com",
  "IT Support": "Technical support team for computer issues, software installation, and network problems. Help desk hours: 8AM-6PM. Ticket system: support@company.com",
  "Mike Rodriguez": "Facilities Manager - Building access, maintenance requests, and office supplies. Office: Building B, Floor 1. Phone: ext. 1234",
  "Dr. Lisa Park": "Safety Officer - Emergency procedures, workplace safety training, and incident reporting. Office: Building A, Floor 2. Emergency: ext. 911",
  "Finance Team": "Payroll, expense reports, and budget questions. Office hours: 9AM-5PM. Contact: finance@company.com",
  Reception: "Main reception desk for visitor management, package delivery, and general inquiries. Front desk: Building A lobby. Phone: ext. 0000",
  "Training Coordinator": "Employee development programs, skill training, and certification tracking. Contact: training@company.com",
  Security: "Building security, badge access, and after-hours entry. 24/7 coverage. Emergency contact: security@company.com",
};

function sectionNumberFromText(text) {
  const match = text.match(/section[_\s-]*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function findContact(text) {
  const lower = text.toLowerCase();
  return Object.keys(contacts).find((name) => lower.includes(name.toLowerCase()));
}

function extractQuotedText(text) {
  const single = text.match(/'([^']+)'/);
  const double = text.match(/"([^"]+)"/);
  return single?.[1] || double?.[1] || null;
}

function buildSection(sectionNumber, prompt) {
  const quoted = extractQuotedText(prompt);
  if (quoted) {
    return quoted;
  }

  const contactName = findContact(prompt);
  if (contactName) {
    return `Section ${sectionNumber}: ${contactName} Reference

${contactName} should be referenced when employees need support related to this topic.

Verified Contact Details:
${contacts[contactName]}

Employee Guidance:
- Use this contact only for role-appropriate questions.
- Include enough detail when requesting help.
- Escalate urgent issues through the appropriate emergency or support channel.`;
  }

  return `Section ${sectionNumber}: New Training Section

Purpose:
This section provides concise employee guidance for the requested topic.

Employee Instructions:
1. Review the relevant policy or workflow before taking action.
2. Contact the responsible department when additional clarification is needed.
3. Document any completed steps or unresolved issues.

Support:
Use the company directory to identify the correct support owner for this topic.`;
}

function runLocalTool(prompt, incomingSections) {
  const sections = { ...defaultSections, ...(incomingSections || {}) };
  const lower = prompt.toLowerCase();
  const sectionNumber = sectionNumberFromText(prompt);
  const contactName = findContact(prompt);

  if (lower.includes("delete") && sectionNumber) {
    const existed = Boolean(sections[sectionNumber]);
    delete sections[sectionNumber];
    return {
      reply: existed
        ? `Section ${sectionNumber} was removed from this browser session's manual draft.`
        : `Section ${sectionNumber} was not found in this browser session's manual draft.`,
      sections,
      toolCall: {
        function_name: "delete_section",
        function_args: { section_number: sectionNumber },
        result: {
          status: existed ? "success" : "error",
          message: existed ? `Training section ${sectionNumber} deleted successfully` : `Training section ${sectionNumber} not found`,
        },
      },
    };
  }

  if ((lower.includes("write") || lower.includes("create") || lower.includes("revise") || lower.includes("update")) && sectionNumber) {
    const content = buildSection(sectionNumber, prompt);
    sections[sectionNumber] = content;
    return {
      reply: `Section ${sectionNumber} has been saved in this browser session. Review it in the Manual Preview panel.`,
      sections,
      toolCall: {
        function_name: "write_section",
        function_args: { section_number: sectionNumber, content },
        result: {
          status: "success",
          message: `Training section ${sectionNumber} saved successfully`,
          filename: `section_${sectionNumber}.txt`,
          length: content.length,
        },
      },
    };
  }

  if (sectionNumber) {
    const content = sections[sectionNumber];
    return {
      reply: content
        ? `Section ${sectionNumber} is available. Summary: ${content.split("\n").filter(Boolean).slice(0, 3).join(" ")}`
        : `Section ${sectionNumber} is not available in this manual draft.`,
      sections,
      toolCall: {
        function_name: "read_section",
        function_args: { section_number: sectionNumber },
        result: content
          ? { status: "success", section_number: sectionNumber, content, length: content.length }
          : { status: "error", message: `Training section ${sectionNumber} not found` },
      },
    };
  }

  if (contactName) {
    return {
      reply: `${contactName}: ${contacts[contactName]}`,
      sections,
      toolCall: {
        function_name: "lookup_contact",
        function_args: { contact_name: contactName },
        result: { status: "success", contact: contactName, description: contacts[contactName] },
      },
    };
  }

  return {
    reply:
      "I can read, write, revise, delete, and summarize handbook sections in this Vercel-native demo. Try: 'Read section 1', 'Look up Sarah Chen', or 'Write section 3 about badge access.'",
    sections,
    toolCall: null,
  };
}

async function runOpenAI(messages, sections) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const toolResult = runLocalTool(messages[messages.length - 1].content || "", sections);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are a training manual assistant. Use the supplied tool result to answer concisely. Explain what changed or what was found.",
        },
        ...messages,
        {
          role: "system",
          content: `Tool result: ${JSON.stringify(toolResult.toolCall || { result: "No tool was needed." })}`,
        },
      ],
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return {
    ...toolResult,
    reply: data.choices?.[0]?.message?.content || toolResult.reply,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { messages = [], sections = {} } = req.body || {};
    const prompt = messages[messages.length - 1]?.content || "";
    const openAIResult = await runOpenAI(messages, sections);
    const result = openAIResult || runLocalTool(prompt, sections);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Unexpected server error" });
  }
};
