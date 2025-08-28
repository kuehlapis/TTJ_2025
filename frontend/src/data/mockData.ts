export const mockAnalysisData = {
  ui_layout: {
    pages: ["Home", "Report", "History"],
    report_tabs: ["Overview", "Consistency", "Exceptions", "Satisfaction", "Efficiency", "Artifacts"],
    artifact_count_total: 4
  },
  overview: {
    summary: "TikTok mobile interface shows strong visual hierarchy and engagement elements. Minor consistency issues detected in button spacing.",
    scores: {
      consistency: 87,
      satisfaction: 92,
      efficiency_health: 78
    },
    top_issues: [
      "Inconsistent button padding in action bar",
      "Color contrast below WCAG AA in some text elements",
      "Loading state optimization needed"
    ]
  },
  consistency: {
    score: 87,
    mismatches: [
      {
        kind: "spacing",
        detail: "Button padding inconsistent between like/share actions",
        dom_selector: ".action-buttons",
        screenshot_region: "bottom-right",
        evidence: {
          dom_text: "padding: 12px",
          visual_text: "apparent 8px padding"
        }
      },
      {
        kind: "typography",
        detail: "Username font weight differs from design system",
        dom_selector: ".username",
        screenshot_region: "top-center",
        evidence: {
          dom_text: "font-weight: 400",
          visual_text: "appears bold (600+)"
        }
      }
    ]
  },
  exceptions: {
    detected: true,
    types: ["loading_state", "overlay"],
    details: [
      {
        kind: "loading_state",
        selector: ".video-container",
        severity: "medium",
        suggestion: "Add skeleton loading animation for better UX during content load"
      },
      {
        kind: "overlay",
        selector: ".modal-overlay",
        severity: "low", 
        suggestion: "Ensure proper focus management when modals appear"
      }
    ]
  },
  satisfaction: {
    score: 92,
    rubric: {
      cta_visibility: 95,
      hierarchy: 90,
      readability: 88,
      friction: 85,
      ergonomics: 94
    },
    comments: "Excellent thumb-friendly design with clear visual hierarchy. Minor improvements needed for text contrast."
  },
  efficiency: {
    total_ms: 3420,
    breakdown_ms: {
      crawl: 850,
      markdown: 320,
      preproc: 180,
      model_consistency: 1200,
      model_feedback: 870,
    },
    cache: {
      hit_rate: 0.73,
      suggestions: ["Enable screenshot caching", "Optimize DOM extraction"]
    },
    suggestions: [
      "Implement viewport cropping to reduce image analysis time",
      "Cache DOM extractions for similar page structures",
      "Use lightweight model for initial screening",
      "Batch analyze similar UI patterns"
    ]
  },
  feedback: {
    issues: [
      {
        type: "accessibility",
        selector: ".like-button",
        severity: "medium", 
        fix: "Increase color contrast ratio to meet WCAG AA standards"
      },
      {
        type: "consistency",
        selector: ".action-bar",
        severity: "low",
        fix: "Apply consistent 12px padding to all action buttons"
      },
      {
        type: "performance",
        region: "video-feed",
        severity: "medium",
        fix: "Implement lazy loading for off-screen video thumbnails"
      }
    ]
  },
  recovery_steps: [
    "Navigate to Settings > Accessibility",
    "Enable high contrast mode",
    "Return to main feed",
    "Verify button visibility improvements"
  ],
  artifacts_view: {
    screenshot_url: "src/assets/tiktok-mockup.jpg",
    markdown_excerpt: "# TikTok Mobile Interface\n\n## Navigation\n- Home feed active\n- Search icon visible\n- Profile access available\n\n## Content\n- Video thumbnails in grid\n- User profiles with verification badges\n- Engagement metrics (likes, comments)\n\n## Actions\n- Like, comment, share buttons\n- Follow/unfollow toggles\n- Video play controls",
    metadata_excerpt: {
      title: "TikTok - Make Your Day",
      links: ["https://tiktok.com/profile", "https://tiktok.com/search"],
      dom_elements: {
        h1: "For You",
        ctas: ["Follow", "Like", "Share", "Comment"],
        prices: []
      }
    }
  },
  test_results: {
    test_cases: [
      {
        id: "UAT001",
        test_name: "User Journey - Content Discovery",
        description: "User can easily browse and discover new content on the For You page",
        expected_result: "Users can scroll through videos smoothly and interact with content within 3 seconds",
        actual_result: "Content loads instantly, users engage within 2.1 seconds average",
        status: "pass",
        severity: "high",
        selector: ".video-feed",
        user_story: "As a user, I want to quickly find engaging content so that I stay on the platform longer"
      },
      {
        id: "UAT002", 
        test_name: "Accessibility - Visual Impairment Support",
        description: "Users with visual impairments can navigate and use core features",
        expected_result: "All buttons and CTAs meet WCAG AA contrast standards (4.5:1 minimum)",
        actual_result: "Like button contrast is 3.2:1, below accessibility threshold",
        status: "fail",
        severity: "high",
        selector: ".like-button",
        user_story: "As a visually impaired user, I need sufficient contrast to see and use interface elements"
      },
      {
        id: "UAT003",
        test_name: "Mobile Usability - Touch Targets",
        description: "All interactive elements are easily tappable on mobile devices",
        expected_result: "Touch targets are minimum 44px as per iOS/Android guidelines",
        actual_result: "All touch targets meet 44px minimum requirement",
        status: "pass",
        severity: "medium",
        selector: ".action-buttons",
        user_story: "As a mobile user, I need buttons large enough to tap accurately without errors"
      },
      {
        id: "UAT004",
        test_name: "Content Loading Experience",
        description: "Users understand when content is loading and system provides feedback",
        expected_result: "Loading states visible within 200ms, with clear progress indication",
        actual_result: "No loading indicators shown, users see blank screen during load",
        status: "fail",
        severity: "medium",
        selector: ".video-container",
        user_story: "As a user, I want to know the app is working when content is loading"
      },
      {
        id: "UAT005",
        test_name: "Social Interaction Flow",
        description: "Users can like, share, and follow other users without confusion",
        expected_result: "All social actions provide immediate visual feedback and work consistently",
        actual_result: "Follow button provides clear feedback, engagement actions work smoothly",
        status: "pass",
        severity: "high",
        selector: ".social-actions",
        user_story: "As a user, I want my social interactions to feel responsive and rewarding"
      },
      {
        id: "UAT006",
        test_name: "Navigation Clarity",
        description: "Users can easily understand where they are and how to navigate",
        expected_result: "Current page clearly indicated, navigation paths are intuitive",
        actual_result: "Home tab highlighted, navigation flow is clear and predictable",
        status: "pass",
        severity: "medium",
        selector: ".navigation-tabs",
        user_story: "As a user, I want to always know where I am in the app and how to get elsewhere"
      },
      {
        id: "UAT007",
        test_name: "Error Recovery - Network Issues",
        description: "Users can recover gracefully when network connectivity is poor",
        expected_result: "Clear error messages with retry options when content fails to load",
        actual_result: "Error handling needs improvement, users left confused during failures",
        status: "fail",
        severity: "medium",
        selector: ".error-boundary",
        user_story: "As a user, I need clear guidance when something goes wrong"
      },
      {
        id: "UAT008",
        test_name: "Content Consumption Flow",
        description: "Users can consume video content without friction or barriers",
        expected_result: "Videos auto-play, controls are intuitive, seamless browsing experience",
        actual_result: "Auto-play works correctly, video controls are responsive and intuitive",
        status: "pass",
        severity: "high",
        selector: ".video-player",
        user_story: "As a user, I want to watch videos effortlessly without technical distractions"
      }
    ],
    summary: {
      total_tests: 8,
      passed: 5,
      failed: 3,
      pass_rate: 63,
      critical_failures: 1,
      uat_phase: "Sprint 3 - User Acceptance Testing",
      test_environment: "Production-like staging with real user scenarios"
    }
  },
  run_data: {
    run_id: "run_2024_001",
    url: "https://tiktok.com/foryou", 
    device: "iPhone 14 Pro",
    timestamp: "2024-01-15T10:30:00Z"
  }
};