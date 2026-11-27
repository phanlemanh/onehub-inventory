---
version: alpha
name: "onehub-inventory"
description: "The design system of onehub-inventory, written from the design ledgers at 867017b0a4d5. Do not change it here: change a ledger, then write it again with make design-exports."
colors:
  accent: "#ebf2ff"
  accent-foreground: "#171717"
  background: "#ffffff"
  border: "#e5e5e5"
  card: "#ffffff"
  card-foreground: "#0a0a0a"
  chart-1: "#0246ff"
  chart-2: "#02d8ff"
  chart-3: "#ffba72"
  chart-4: "#f56883"
  chart-5: "#38f1d1"
  destructive: "#e7000b"
  destructive-foreground: "#9f0712"
  foreground: "#0a0a0a"
  info: "#0246ff"
  info-foreground: "#193cb8"
  input: "#e5e5e5"
  invert: "#171717"
  invert-foreground: "#fafafa"
  muted: "#f5f5f5"
  muted-foreground: "#525252"
  popover: "#ffffff"
  popover-foreground: "#0a0a0a"
  primary: "#0246ff"
  primary-foreground: "#ffffff"
  ring: "#0246ff"
  secondary: "#f5f5f5"
  secondary-foreground: "#171717"
  sidebar: "#fafafa"
  sidebar-accent: "#ebf2ff"
  sidebar-accent-foreground: "#171717"
  sidebar-border: "#e5e5e5"
  sidebar-foreground: "#0a0a0a"
  sidebar-primary: "#0246ff"
  sidebar-primary-foreground: "#ffffff"
  sidebar-ring: "#0246ff"
  success: "#00a63e"
  success-foreground: "#016630"
  warning: "#fe9a00"
  warning-foreground: "#973c00"
  dark:
    accent: "#262626"
    accent-foreground: "#fafafa"
    background: "#0a0a0a"
    border: "#ffffff1a"
    card: "#171717"
    card-foreground: "#fafafa"
    chart-1: "#0246ff"
    chart-2: "#02d8ff"
    chart-3: "#ffba72"
    chart-4: "#f56883"
    chart-5: "#38f1d1"
    destructive: "#ff6467"
    destructive-foreground: "#e7000b"
    foreground: "#fafafa"
    info: "#a684ff"
    info-foreground: "#7f22fe"
    input: "#ffffff26"
    invert: "#3f3f46"
    invert-foreground: "#fafafa"
    muted: "#262626"
    muted-foreground: "#a1a1a1"
    popover: "#171717"
    popover-foreground: "#fafafa"
    primary: "#6a9cff"
    primary-foreground: "#0a0a0a"
    ring: "#6a9cff"
    secondary: "#262626"
    secondary-foreground: "#fafafa"
    sidebar: "#171717"
    sidebar-accent: "#262626"
    sidebar-accent-foreground: "#fafafa"
    sidebar-border: "#ffffff1a"
    sidebar-foreground: "#fafafa"
    sidebar-primary: "#6a9cff"
    sidebar-primary-foreground: "#0a0a0a"
    sidebar-ring: "#6a9cff"
    success: "#00bc7d"
    success-foreground: "#009966"
    warning: "#f0b100"
    warning-foreground: "#d08700"
typography:
  xs:
    fontFamily: "Inter"
    fontSize: 12px
  sm:
    fontFamily: "Inter"
    fontSize: 14px
  base:
    fontFamily: "Inter"
    fontSize: 16px
  lg:
    fontFamily: "Inter"
    fontSize: 18px
  xl:
    fontFamily: "Inter"
    fontSize: 20px
  2xl:
    fontFamily: "Inter"
    fontSize: 24px
  3xl:
    fontFamily: "Inter"
    fontSize: 30px
  4xl:
    fontFamily: "Inter"
    fontSize: 36px
  5xl:
    fontFamily: "Inter"
    fontSize: 48px
rounded:
  base: 10px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 18px
  3xl: 22px
  4xl: 26px
spacing:
  unit: "4px"
---

## Overview

The design system of onehub-inventory, as its design ledgers hold it at 867017b0a4d5. Product type: not decided; conformance level: not decided.

## Colors

Each role is written light at the top and dark under `dark`. A role that follows another is written as a reference to it, so a change to the one reaches the other.

## Typography

Running text is set in Inter, headings in Inter. The scale is standard.

## Layout

Every distance is a multiple of the spacing unit, 4px.

## Shapes

The base corner radius is 10px; the other steps derive from it.

## Do's and Don'ts

- Do take every colour, size and corner from these tokens.
- Don't write a value these tokens do not hold: ask the owner of the ledgers for a decision.
