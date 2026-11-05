import {
  BookOpen,
  BookText,
  Calculator,
  CalendarDays,
  ChartColumn,
  CirclePlus,
  ClipboardList,
  FileText,
  Gamepad2,
  GraduationCap,
  LayoutDashboard,
  Map,
  Megaphone,
  MessagesSquare,
  Newspaper,
  Presentation,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { ProjectType } from '@/tokens/types';

export interface ProjectTypeOption {
  id: ProjectType;
  label: string;
  hint?: string;
  icon: LucideIcon;
}

export const PROJECT_TYPE_GROUPS: { title: string; options: ProjectTypeOption[] }[] = [
  {
    title: 'Websites',
    options: [
      { id: 'marketing', label: 'Marketing / landing page', icon: Megaphone },
      { id: 'portfolio', label: 'Portfolio / personal site', icon: User },
      { id: 'editorial', label: 'Blog / editorial / publication', icon: Newspaper },
      { id: 'docs', label: 'Docs / knowledge base', icon: BookOpen },
      { id: 'ecommerce', label: 'E-commerce / storefront', icon: ShoppingBag },
      { id: 'event', label: 'Event / conference site', icon: CalendarDays },
    ],
  },
  {
    title: 'Apps & tools',
    options: [
      { id: 'app', label: 'Web app / SaaS product', icon: LayoutDashboard },
      { id: 'internal', label: 'Internal tool / admin panel', icon: Wrench },
      { id: 'chat', label: 'AI chat / assistant interface', icon: MessagesSquare },
      { id: 'form', label: 'Form / survey / questionnaire', icon: ClipboardList },
      { id: 'calculator', label: 'Calculator / estimator', icon: Calculator },
      { id: 'mobile', label: 'Mobile-first web app', icon: Smartphone },
    ],
  },
  {
    title: 'Data & research',
    options: [
      { id: 'dashboard', label: 'Data dashboard', icon: ChartColumn },
      {
        id: 'simulator',
        label: 'Simulator / scenario model',
        hint: 'Sliders, inputs and live outputs',
        icon: SlidersHorizontal,
      },
      { id: 'map', label: 'Map-based tool / geospatial explorer', icon: Map },
      { id: 'datastory', label: 'Interactive data story / scrollytelling report', icon: BookText },
      { id: 'report', label: 'Research report / policy brief', icon: FileText },
      { id: 'explainer', label: 'Educational explainer / interactive lesson', icon: GraduationCap },
    ],
  },
  {
    title: 'Other',
    options: [
      { id: 'game', label: 'Game / playful interactive', icon: Gamepad2 },
      { id: 'presentation', label: 'Presentation-style microsite', icon: Presentation },
      { id: 'other', label: 'Something else', icon: CirclePlus },
    ],
  },
];
