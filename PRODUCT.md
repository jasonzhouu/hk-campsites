# Product

<!-- impeccable:product-schema 1 -->

> Provenance: inferred from docs/spec.md, docs/plan.md, the shipped code and the live site (https://hk-campsites.vercel.app). The init interview was skipped (non-interactive session); every fact below is repository-derived, not user-confirmed.

## Platform

web

## Users

- Primary: people in Hong Kong planning a camping trip, reading mostly on a phone, before departure or on the way. Job: compare the 41 AFCD designated campsites quickly and pick one that fits (access, water, capacity, scenery, crowd level).
- Beginners want easy transport, taps and toilets. Experienced hikers want remote, quiet, scenic sites and care about seasonal water. Families and groups want larger sites near roads and need to know about booking (e.g. Tsin Kam / 荃錦).
- Reads Traditional Chinese (zh-HK); English place names are a secondary cross-reference to official AFCD material.

## Product Purpose

An unofficial, Traditional Chinese guide that organises the 41 country-park campsites designated by the Agriculture, Fisheries and Conservation Department (AFCD) into a comparable catalogue: intro, country park, water source, tent capacity, coordinates, transport directions, editorial ratings, and links to official pages. Success: a visitor can shortlist a campsite in a minute and is sent to official sources for anything authoritative.

## Positioning

A single, mobile-first comparison of all 41 AFCD campsites with transparent editorial ratings (facilities, scenery, quietness, transport, plus a weighted composite) and a keyless OpenStreetMap overview. Ratings are explicitly editorial opinion, not user reviews, and the site is not affiliated with AFCD or LCSD.

## Operating Context

- Used before a trip and in the field on a phone (variable light, patchy signal), and at a desktop when planning.
- Data is a typed content module (`src/data/campsites.ts`), no database. 41 campsites, ids and slugs unique, Tsin Kam (id 24) requires booking.
- Deployed on Vercel from `main` (Next.js App Router, React, TypeScript, Tailwind, shadcn).

## Capabilities and Constraints

- Pages: `/` list with filters (region, country park, booking-only) and sort (composite default, facilities, scenery, quietness, transport, name); `/campsites/[slug]` detail; `/map` interactive Leaflet + OpenStreetMap with markers and grouped list; `/about` sources, rating method, camping rules, disclaimer. OG/Twitter images exist for default and per-campsite.
- Rating formula: composite = facilities 25% + scenery 30% + quietness 20% + transport 25%, rounded to 2 dp; quietness = 6 - crowding so every dimension is higher-is-better.
- No paid map APIs; no live occupancy; no online booking; no user accounts or reviews; no full English UI in v1.
- All UI copy stays Traditional Chinese (Hong Kong), `lang="zh-HK"`.
- Footer and about page must carry the source credits and the non-official disclaimer.

## Brand Commitments

Name: 香港郊野營地指南 (HK Country Park Campsites). Voice: plain, practical, candid about uncertainty ("待補充" for missing facts). No binding visual commitments were stated.

## Evidence on Hand

- Real AFCD-derived data for all 41 campsites (`src/data/campsites.ts`, `docs/data/`).
- Editorial ratings authored by the site; no testimonials, user counts or press. Do not fabricate any.
- No photographs of campsites exist in the repository; do not imply imagery that is not there.

## Product Principles

1. Honest about authority: always distinguish AFCD facts from editorial opinion, and route safety-critical questions to official sources.
2. Scores are never color-only: every rating is also a number with an accessible label.
3. Phone first: the key facts (access, water, capacity, booking) are scannable at 360px in direct sunlight.
4. Local and legible: Traditional Chinese is the primary reading language, not a translation layer over an English template.
5. Free and keyless: nothing that requires paid APIs or tracking.

## Accessibility & Inclusion

WCAG AA contrast; visible labels on all filters; keyboard operable; touch targets at least 40x40px; ratings carry text and aria-labels; external links announce new-tab behavior; test widths 360, 390, 768, 1280.
