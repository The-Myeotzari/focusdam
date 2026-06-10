---
name: 집중이담
colors:
  surface: '#faf9fc'
  surface-dim: '#dadadc'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f6'
  surface-container: '#eeedf0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#42474d'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f3'
  outline: '#72777e'
  outline-variant: '#c2c7ce'
  surface-tint: '#3f627f'
  primary: '#3c5f7c'
  on-primary: '#ffffff'
  primary-container: '#557896'
  on-primary-container: '#fcfcff'
  inverse-primary: '#a7caec'
  secondary: '#645785'
  on-secondary: '#ffffff'
  secondary-container: '#d7c7fb'
  on-secondary-container: '#5d517e'
  tertiary: '#785526'
  on-tertiary: '#ffffff'
  tertiary-container: '#946d3b'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#a7caec'
  on-primary-fixed: '#001e31'
  on-primary-fixed-variant: '#254a66'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cebff3'
  on-secondary-fixed: '#20143d'
  on-secondary-fixed-variant: '#4c406b'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#edbe85'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#604012'
  background: '#faf9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.4'
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.5'
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 20px
  gutter: 12px
---

## Brand & Style
The brand personality is rooted in the philosophy of "Small Starts" (작게 시작하기). It is designed to be supportive, non-judgmental, and restorative, acting as a calm companion for personal growth and focus. The target audience seeks a mindful balance in their digital lives, moving away from high-stress productivity toward sustainable habits.

The design style is **Corporate Modern with a Soft Aesthetic**. It blends the reliability and structure of modern SaaS with the warmth of a lifestyle app. By utilizing generous whitespace, a soft color palette, and high-readability typography, the UI evokes an emotional response of clarity, safety, and encouragement.

## Colors
This design system uses a muted, semantic-heavy palette to provide clear feedback without inducing anxiety.

- **Primary:** A muted warm blue used for the "happy path" — main actions, active states, and focus guidance.
- **Surface:** The background is a warm off-white, reducing eye strain compared to pure white.
- **Semantic Accents:** Used for specific app modules. Success (Mint) for recovery and completion; Caution (Amber) for spending or attention; Insight (Violet) for reports and "Plus" features; Emotion (Rose) for safety and mood tracking.
- **Typography:** Contrast is strictly maintained. Primary text uses a deep neutral grey for maximum legibility, while secondary text uses a softer grey for metadata and hints.

## Typography
The typography system prioritizes readability and a rhythmic flow. **Hanken Grotesk** provides a clean, contemporary feel for Latin characters and numerals, paired with a high-quality, clear Korean Sans-Serif to ensure a seamless bilingual experience.

- **Scale:** Use `Display-L` for hero moments like timer countdowns or welcome headers. `Title` levels are for section headers and card titles. `Body` levels are optimized for long-form reading and instructions with a generous 1.6x line height to prevent visual clutter.
- **Hierarchy:** Weight is used sparingly but intentionally to guide the eye. Use 600 weight for titles to establish a clear anchor for each screen module.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a focus on generous internal margins to maintain a "breathable" feel. 

- **Mobile:** Use a 4-column grid with 20px side margins and 12px gutters.
- **Desktop/Tablet:** Center-aligned fixed width container (max 600px for mobile-first modules) to keep focus centralized.
- **Rhythm:** All spacing should be multiples of 4px. Use `lg` (24px) for vertical spacing between content blocks and `xl` (32px) for separation between distinct functional modules (e.g., separating the Timer from the Task List).

## Elevation & Depth
This design system uses **Tonal Layers** supplemented by subtle ambient shadows to create a soft, physical presence.

- **Level 0 (Base):** The #FAF9FC background.
- **Level 1 (Cards):** Pure white surfaces (#FFFFFF) with a very soft, diffused shadow (Offset: 0, 4px; Blur: 12px; Color: rgba(0, 0, 0, 0.04)). This is used for all main content cards.
- **Level 2 (Floating/Modals):** A slightly more defined shadow (Blur: 20px; Opacity: 0.08) used for bottom sheets and active selection overlays.
- **Backdrop:** Use a high-quality background blur (20px) for the Bottom Navigation bar to create a sense of depth and continuity with the content scrolling behind it.

## Shapes
The shape language is friendly and approachable, avoiding sharp edges entirely to align with the "Supportive" UX tone.

- **Primary Containers:** Cards and major sections use `rounded-xl` (24px) or `rounded-xxl` (32px) depending on size. 32px is reserved for large hero cards on the Home and Report screens.
- **Interactive Elements:** Buttons and input fields use a pill-shaped (fully rounded) approach to signify touch-friendliness and modern aesthetic.
- **Selection States:** Radio buttons and checkboxes are encased in rounded-lg containers to create large, comfortable tap targets.

## Components
Consistent implementation of components ensures a cohesive experience across Onboarding and Reports.

- **Buttons:** 
  - **Primary:** Pill-shaped, 56px height, Primary Blue background with white text.
  - **Secondary:** 48px height, outlined or soft blue background, used for less critical actions.
- **Cards:** White background, 24px-32px corner radius. Metrics within cards should use `Display-L` for the numbers to emphasize progress.
- **Input Fields:** Pill-shaped with a 1px border (#E0E0E0) that shifts to Primary Blue on focus.
- **Timer Ring:** A minimalist, thick-stroke circular progress bar. The stroke should be 12px wide with rounded caps, using the Primary color for active time and a light grey for the track.
- **Bottom Navigation:** A fixed bar with a frosted glass effect. Icons are paired with `Label-S` text. Active states use a subtle vertical shift or a primary-colored dot indicator.
- **Selection Rows:** Full-width containers (minimum 56px height) with internal padding, allowing users to tap anywhere on the row to select a radio or checkbox option.
- **Progress Bars:** Thick (8px-12px) horizontal bars with fully rounded ends, used in Reports to show habit consistency.