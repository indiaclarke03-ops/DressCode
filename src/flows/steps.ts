export type FlowMode = 'fresh' | 'restyle';

export interface FlowStep {
  id: string;
  /** Short label for the stepper. */
  label: string;
  title: string;
  description: string;
  /** Where the live preview shows on this step, if at all. */
  preview?: 'side';
  /** The step moves on from its own button, so the flow hides Continue. */
  ownsNext?: boolean;
}

const projectStep: FlowStep = {
  id: 'project',
  label: 'Project',
  title: 'What are you building?',
  description: 'Pick the closest match. It sets your preview and the questions that follow.',
};

const designSteps: FlowStep[] = [
  {
    id: 'this-or-that',
    label: 'This or that',
    title: 'This or that',
    description: "Eight quick rounds. Pick the one you prefer, then move on when you're sure.",
    preview: 'side',
    ownsNext: true,
  },
  {
    id: 'colour',
    label: 'Colour',
    title: 'Choose your colour',
    description: 'Pick one main colour and a background tone. The full palette follows from them.',
    preview: 'side',
  },
  {
    id: 'typography',
    label: 'Type',
    title: 'Choose your typography',
    description: 'Each pairing is set in real fonts, so you can judge it as it will appear.',
    preview: 'side',
  },
  {
    id: 'details',
    label: 'Details',
    title: 'A few project details',
    description: 'Only the questions that matter for what you are building.',
    preview: 'side',
  },
  {
    id: 'avoid',
    label: 'Avoid',
    title: 'What should your agent avoid?',
    description: 'The usual signs of AI-generated UI. All on by default, and yours to change.',
    preview: 'side',
  },
  {
    id: 'review',
    label: 'Review',
    title: 'Review and export',
    description: 'Your brief, ready to hand to your agent.',
  },
];

const restyleOnlySteps: FlowStep[] = [
  {
    id: 'current',
    label: 'Current',
    title: 'About your current project',
    description: 'Tell us what you have. Paste your styles if you want a head start.',
  },
  {
    id: 'keep',
    label: 'Keep',
    title: 'What should stay the same?',
    description: 'We never change what your app does. Choose what else to protect.',
  },
  {
    id: 'size',
    label: 'Scope',
    title: 'How big a change?',
    description: 'From a full redesign to one page at a time.',
  },
];

export const FLOWS: Record<FlowMode, { name: string; steps: FlowStep[] }> = {
  fresh: { name: 'Start fresh', steps: [projectStep, ...designSteps] },
  restyle: { name: 'Restyle existing', steps: [...restyleOnlySteps, ...designSteps] },
};

export function stepPath(mode: FlowMode, stepId: string): string {
  return `/${mode}/${stepId}`;
}

export function firstStepPath(mode: FlowMode): string {
  const first = FLOWS[mode].steps[0];
  if (!first) throw new Error(`Flow "${mode}" has no steps`);
  return stepPath(mode, first.id);
}
