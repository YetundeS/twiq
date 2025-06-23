'use client';

import { useMediaQuery } from 'usehooks-ts';
import { AppSidebarDesktop } from './appSidebarDesktop';
import { AppSidebarMobile } from './appSidebarMobile';



export const starterModels = ["LinkedIn Personal", "Headlines", "Storyteller"].map(m => m.toLowerCase());
export const proModels = ["LinkedIn Your Business", "Captions", "Video Scripts", "Carousel"].map(m => m.toLowerCase());

export const hasAccess = (plan, title) => {
  if (!plan || !title) return false;

  const normalizedPlan = plan.toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedPlan === "none") return false;
  if (normalizedPlan === "starter") return starterModels.includes(normalizedTitle);
  if (normalizedPlan === "pro") return (
    starterModels.includes(normalizedTitle) || proModels.includes(normalizedTitle)
  );
  if (normalizedPlan === "enterprise") return true;

  return false;
};


export function AppSidebar() {
  const isDesktop = useMediaQuery('(min-width: 768px)', { initializeWithValue: false });

  return isDesktop ? <AppSidebarDesktop /> : <AppSidebarMobile />;
}
