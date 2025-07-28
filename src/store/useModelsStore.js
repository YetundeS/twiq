import { create } from "zustand";

const sampleChat = [
  {
    sender: "user",
    content: "Can you summarize the marketing meeting from yesterday?",
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:00Z"),
  },
  {
    sender: "assistant",
    content: `Here’s a summary of the **Marketing Meeting – May 24**:

- **Main Topics Discussed**:
  - Q3 campaign launch
  - Social media budget allocation
  - Influencer partnerships

Would you like a breakdown of any specific section?`,
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:05Z"),
  },
  {
    sender: "user",
    content: "Yes, especially the part about influencers.",
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:12Z"),
  },
  {
    sender: "assistant",
    content: `### Influencer Strategy Highlights:

- **Budget**: $5,000 allocated
- **Platform Focus**: Instagram & YouTube
- **Deliverable**: 3 sponsored posts + 1 review video
- **Assigned to**: _Sarah Johnson_
- **Deadline**: **May 29**

Do you want to view the assigned task?`,
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:18Z"),
  },
  {
    sender: "user",
    content: "Who assigned the task to Sarah?",
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:25Z"),
  },
  {
    sender: "assistant",
    content: `_Jason Miller_ assigned the task during the **Action Items** section of the meeting.`,
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:30Z"),
  },
  {
    sender: "user",
    content: "Any deadlines mentioned?",
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:36Z"),
  },
  {
    sender: "assistant",
    content: `Yes — the deadline for influencer outreach is **Thursday, May 29**.`,
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:41Z"),
  },
  {
    sender: "user",
    content: "What were Jason's key points in the meeting?",
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:47Z"),
  },
  {
    sender: "assistant",
    content: `Jason emphasized the following:

- 📈 _Faster iteration on ad creatives_
- 🎯 _Testing TikTok ad formats_
- 📊 _Weekly KPIs for influencer engagement_

Would you like to turn this into a task list?`,
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:52Z"),
  },
  {
    sender: "user",
    content: "Okay, export this as a meeting recap, please.",
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:00:59Z"),
  },
  {
    sender: "assistant",
    content: `📄 **Meeting Recap: Marketing Stand-up – May 24**

**Summary:**
The team discussed Q3 strategies, budget planning, and influencer outreach. Tasks were distributed and timelines were agreed upon.

**Decisions Made:**
- Move forward with mid-tier influencers.
- Prioritize TikTok & Instagram for campaigns.
- Weekly check-ins for ad creative performance.

**Assigned Tasks:**
- [x] Sarah – Reach out to influencers
- [ ] Jason – Prepare KPI report by Friday
- [ ] Emily – Draft Q3 creative storyboard

You can [download the transcript](#) or [view tasks in the dashboard](#).`,
    sessionID: "session_001",
    created_at: new Date("2025-05-25T09:01:08Z"),
  }
];



const useModelsStore = create((set) => ({
  activeSessionID: null,
  activeChatMessages: [],
  messagesHasMore: false,
  messagesPage: 1,
  
  updateActiveSessionID: (newSessionID) => set({ activeSessionID: newSessionID }),
  
  updateActiveChatMessages: (newChatMessage) => set((state) => ({ 
    activeChatMessages: [...state?.activeChatMessages, newChatMessage]
  })),
  
  setActiveChatMessages: (fetchDBMessages, prepend = false) => set((state) => ({
    activeChatMessages: prepend 
      ? [...fetchDBMessages, ...state.activeChatMessages] // Prepend for loading older messages
      : [...fetchDBMessages] // Replace for initial load
  })),
  
  setMessagesHasMore: (hasMore) => set({ messagesHasMore: hasMore }),
  setMessagesPage: (page) => set({ messagesPage: page }),
  
  // Reset pagination state when switching sessions
  resetMessagesPagination: () => set({ 
    messagesHasMore: false, 
    messagesPage: 1 
  }),
}));

export default useModelsStore;
