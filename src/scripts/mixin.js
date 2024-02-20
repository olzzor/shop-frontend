import {breakpoints} from "@/scripts/variables";

export const isMobile = () => window.innerWidth <= breakpoints.tablet;
export const isTablet = () => window.innerWidth > breakpoints.tablet && window.innerWidth <= breakpoints.desktop;
export const isDesktop = () => window.innerWidth > breakpoints.desktop;
